from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
import json
from django.contrib.auth import authenticate, login
from .models import Device, DeviceData
import csv
from django.http import HttpResponse


""" super admin
username : urphoran
mail : urphoran@admin.com
password : urphoran 
username : Ananias
password : test.12345

aballoyannick@gmail.com
"""

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        email = body.get('email')
        password = body.get('password')
        first_name = body.get('first_name', '')
        last_name = body.get('last_name', '')

        if User.objects.filter(username=email).exists():
            return JsonResponse({'error': 'Email already registered'}, status=400)

        user = User.objects.create_user(
            username=email, email=email, password=password, first_name=first_name, last_name=last_name
        )

        return JsonResponse({'message': 'Registration successful', 'user_id': user.id})

    return JsonResponse({'error': 'POST method required'}, status=400)




@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        email = body.get('email')
        password = body.get('password')

        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return JsonResponse({'message': 'Login successful', 'user_id': user.id, 'first_name': user.first_name})

        return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return JsonResponse({'error': 'POST method required'}, status=400)




@csrf_exempt
def register_device(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user_id = body.get('user_id')
        dev_eui = body.get('dev_eui').lower()  # Convert to lowercase
        name = body.get('name')

        if Device.objects.filter(dev_eui=dev_eui).exists():
            return JsonResponse({'error': 'Device already registered'}, status=400)

        user = User.objects.get(id=user_id)
        device = Device.objects.create(user=user, dev_eui=dev_eui, name=name)

        return JsonResponse({'message': 'Device registered successfully', 'device_id': device.id})

    return JsonResponse({'error': 'POST method required'}, status=400)



@csrf_exempt
def chirpstack_webhook(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            #print(body)
            dev_eui = body.get('deviceInfo', {}).get('devEui')  # Extract devEUI
            print(dev_eui)
            data = body.get('object')  # Extract payload data
            print(data)

            # Find the device associated with the devEUI
            device = Device.objects.get(dev_eui=dev_eui)

            # Save the data in DeviceData
            DeviceData.objects.create(device=device, data=data)

            return JsonResponse({'message': 'Data saved successfully'})

        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'POST method required'}, status=400)


@csrf_exempt
def list_device_data(request, dev_eui):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)

        try:
            # Check if the device belongs to the given user
            device = Device.objects.get(dev_eui=dev_eui, user_id=user_id)

            # Fetch the last 10 entries in reverse order
            data_entries = device.data.all().order_by('-received_at')[:9].values('received_at', 'data')

            # Re-index entries from 1 to 10
            data_entries = [{'id': idx + 1, 'received_at': entry['received_at'], 'data': entry['data']}
                            for idx, entry in enumerate(data_entries)]

            return JsonResponse(data_entries, safe=False)

        except Device.DoesNotExist:
            return JsonResponse({'error': 'Device not found or unauthorized access'}, status=404)

    return JsonResponse({'error': 'GET method required'}, status=400)


@csrf_exempt
def list_devices(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
        
        devices = Device.objects.filter(user_id=user_id).values('name', 'dev_eui')
        return JsonResponse(list(devices), safe=False)

    return JsonResponse({'error': 'GET method required'}, status=400)

@csrf_exempt
def export_device_data(request, dev_eui):
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'User ID is required'}, status=400)

    try:
        # Validate device ownership
        device = Device.objects.get(dev_eui=dev_eui, user_id=user_id)

        # Retrieve all data entries for the device
        data_entries = device.data.all().values('received_at', 'data')

        # Create CSV response
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{device.name}_data.csv"'

        writer = csv.writer(response)
        writer.writerow(['Received At', 'Data'])  # CSV headers
        for entry in data_entries:
            writer.writerow([entry['received_at'], json.dumps(entry['data'])])  # Write data rows

        return response

    except Device.DoesNotExist:
        return JsonResponse({'error': 'Device not found or unauthorized access'}, status=404)
