from __future__ import unicode_literals

import uuid

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class CampaignType(models.Model):
    name = models.CharField(max_length=20)


class Os(models.Model):
    name = models.CharField(max_length=20)
    version = models.IntegerField()


class Pricing(models.Model):
    name = models.CharField(max_length=20)


class Hmd(models.Model):
    name = models.CharField(max_length=50)


class Budget(models.Model):
    bid = models.FloatField(validators=[MinValueValidator(0.0)])
    totalBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    dailyBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    pricing = models.ForeignKey(Pricing)


class Device(models.Model):
    ram = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    os = models.ForeignKey(Os)


class Targeting(models.Model):
    hmd = models.ForeignKey(Hmd)
    device = models.ForeignKey(Device)


class Campaign(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False ,primary_key=True)
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    campaignType = models.ForeignKey(CampaignType)
    totalBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    dailyBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    startDate = models.DateField()
    endDate = models.DateField()
    status = models.BooleanField(default=False)


class Adgroup(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    campaign = models.ForeignKey(Campaign, related_name='adgroups')
    name = models.CharField(max_length=100)
    budget = models.OneToOneField(Budget, on_delete=models.CASCADE)
    targeting = models.OneToOneField(Targeting, null=True)


class Ad(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    adgroup = models.ForeignKey(Adgroup)
    creativeUrl = models.URLField(max_length=300)