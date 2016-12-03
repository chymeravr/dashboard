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
    total_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    daily_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    pricing = models.ForeignKey(Pricing)


class Device(models.Model):
    ram = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    os = models.ForeignKey(Os)


class Targeting(models.Model):
    hmd = models.ForeignKey(Hmd)
    device = models.ForeignKey(Device)


class Campaign(models.Model):
    id2 = models.UUIDField(default=uuid.uuid4, editable=False)
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    campaign_type = models.ForeignKey(CampaignType)
    total_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    daily_budget = models.FloatField(validators=[MinValueValidator(0.0)])
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.BooleanField(default=False)


class Adgroup(models.Model):
    id2 = models.UUIDField(default=uuid.uuid4, editable=False)
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(Campaign)
    name = models.CharField(max_length=100)
    budget = models.OneToOneField(Budget, on_delete=models.CASCADE)
    targeting = models.OneToOneField(Targeting, null=True)


class Ad(models.Model):
    id2 = models.UUIDField(default=uuid.uuid4, editable=False)
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    adgroup = models.ForeignKey(Adgroup)
    creative_url = models.URLField(max_length=300)