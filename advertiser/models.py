from __future__ import unicode_literals

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

IMG_360 = 'IMG_360'
VIDEO_360 = 'VIDEO_360'

FORMATS = (
    (IMG_360, IMG_360),
    (VIDEO_360, VIDEO_360)
)

CPM = 'CPM'

PRICING = (
    (CPM, CPM),
)

GEAR_VR = 'GEAR_VR'
DAYDREAM = 'DAYDREAM'

HMD = (
    (GEAR_VR, GEAR_VR),
    (DAYDREAM, DAYDREAM)
)

ANDROID = 'ANDROID'
OS = (
    (ANDROID, ANDROID),
)


class Campaign(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    type = models.CharField(choices=FORMATS, max_length=20)
    total_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    daily_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.BooleanField(default=False)


class Budget(models.Model):
    bid = models.FloatField(validators=[MinValueValidator(0.0)])
    total_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    daily_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    pricing = models.CharField(choices=PRICING, default=CPM, max_length=20)


class Device(models.Model):
    ram = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    os = models.CharField(choices=OS, default=ANDROID, max_length=20)


class Targeting(models.Model):
    hmd = models.CharField(choices=HMD, default=GEAR_VR, max_length=20)
    device = models.ForeignKey(Device)


class AdGroup(models.Model):
    campaign = models.ForeignKey(Campaign)
    name = models.CharField(max_length=100)
    budget = models.OneToOneField(Budget, on_delete=models.CASCADE)
    targeting = models.OneToOneField(Targeting, null=True)
