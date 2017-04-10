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

SIGNED_UP = 'SIGNED_UP'
EMAILED = 'EMAILED'
REGISTERED = 'REGISTERED'
CONVERTED = 'CONVERTED'

STATUS = (
    (SIGNED_UP, SIGNED_UP),
    (EMAILED, EMAILED),
    (REGISTERED, REGISTERED),
    (CONVERTED, CONVERTED)
)


# Create your models here.
class Profile(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(editable=False, blank=False, null=False)
    currency = models.CharField(choices=CURRENCY, default=USD, max_length=20)
    advertising_funds = models.FloatField(default=0)
    advertising_burn = models.FloatField(default=0)
    publisher_earnings = models.FloatField(default=0)
    publisher_payout = models.FloatField(default=0)
    activation_code = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterestedUser(models.Model):
    email = models.CharField(max_length=100, primary_key=True)
    status = models.CharField(choices=STATUS, default=SIGNED_UP, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TestDevice(models.Model):
    deviceId = models.CharField(max_length=100)
    user = models.ForeignKey(User)
    status = models.BooleanField(default=True)
