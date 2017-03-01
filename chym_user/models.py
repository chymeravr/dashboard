from __future__ import unicode_literals

import uuid

from django.contrib.auth.models import User
from django.db import models

USD = 'USD'
INR = 'INR'

CURRENCY = (
    (USD, 'USD'),
    (INR, 'INR'),
)


# Create your models here.
class Profile(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    currency = models.CharField(choices=CURRENCY, default=USD, max_length=20)
    advertising_funds = models.FloatField(default=0)
    advertising_burn = models.FloatField(default=0)
    publisher_earnings = models.FloatField(default=0)
    publisher_payout = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
