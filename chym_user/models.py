from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.db import models

USD = 'USD'
INR = 'INR'

STATUS = (
    (USD, 'USD'),
    (INR, 'INR'),
)


# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    currency = models.CharField(choices=STATUS, default=USD, max_length=20)
    advertising_budget = models.FloatField(default=0)
    publisher_earnings = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
