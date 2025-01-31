# models.py
from django.db import models
from django.contrib.auth.models import User

# Device model for tracking user devices
class Device(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='devices')  # Linked to User
    name = models.CharField(max_length=255)  # Device name
    dev_eui = models.CharField(max_length=16, unique=True)  # Unique device EUI (16 characters hexadecimal)

    def __str__(self):
        return f"{self.name} ({self.dev_eui})"


# DeviceData model for storing received data
class DeviceData(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name='data')  # Linked to Device
    received_at = models.DateTimeField(auto_now_add=True)  # Timestamp of data reception
    data = models.JSONField()  # Flexible JSON storage for sensor data

    def __str__(self):
        return f"Data for {self.device.name} at {self.received_at}"
