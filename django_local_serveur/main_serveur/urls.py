from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('register-device/', views.register_device, name='register_device'),
    path('chirpstack-webhook/', views.chirpstack_webhook, name='chirpstack_webhook'),
    path('list-device-data/<str:dev_eui>/', views.list_device_data, name='list_device_data'),
    path('devices/', views.list_devices, name='list_devices'),
]
