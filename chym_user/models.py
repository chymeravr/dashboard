from __future__ import unicode_literals

import uuid

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models

from publisher.models import BaseModel

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
    def __str__(self):
        return '%s : %s' % (str(self.user.username), str(self.email))

    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    email = models.EmailField(blank=False, null=False, unique=True, db_index=True)
    currency = models.CharField(choices=CURRENCY, default=USD, max_length=20)
    advertising_funds = models.IntegerField(default=0)
    advertising_burn = models.FloatField(default=0)
    publisher_earnings = models.FloatField(default=0)
    publisher_payout = models.IntegerField(default=0)
    activation_code = models.UUIDField(default=uuid.uuid4, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class InterestedUser(models.Model):
    def __str__(self):
        return '%s' % (str(self.user.username))

    email = models.CharField(max_length=100, primary_key=True)
    status = models.CharField(choices=STATUS, default=SIGNED_UP, max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TestDevice(models.Model):
    def __str__(self):
        return '%s : %s' % (str(self.user), str(self.deviceId))

    deviceId = models.CharField(max_length=100)
    user = models.ForeignKey(User)
    status = models.BooleanField(default=True)


class Payment(BaseModel):
    user = models.ForeignKey(User)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.IntegerField(validators=[MinValueValidator(0)])


class Payout(BaseModel):
    user = models.ForeignKey(User)
    transaction_id = models.CharField(max_length=100, unique=True)
    amount = models.IntegerField(validators=[MinValueValidator(0)])
