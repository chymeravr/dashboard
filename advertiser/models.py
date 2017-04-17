from __future__ import unicode_literals

import uuid

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.id)


class CampaignType(BaseModel):
    name = models.CharField(max_length=20)


class Os(BaseModel):
    name = models.CharField(max_length=20)
    version = models.IntegerField()


class Pricing(BaseModel):
    name = models.CharField(max_length=20)


class Hmd(BaseModel):
    name = models.CharField(max_length=50)


class Campaign(BaseModel):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    appName = models.CharField(max_length=150, null=True, blank=True)
    appUrl = models.CharField(max_length=500, null=True, blank=True)
    campaignType = models.ForeignKey(CampaignType)
    totalBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    dailyBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    startDate = models.DateField()
    endDate = models.DateField()
    status = models.BooleanField(default=False)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    totalBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)
    todayBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)
    hmd = models.ForeignKey(Hmd, blank=True, null=True)
    ram = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    os = models.ForeignKey(Os, null=True, blank=True)


class Adgroup(BaseModel):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    campaign = models.ForeignKey(Campaign, related_name='adgroups')
    name = models.CharField(max_length=100)
    bid = models.FloatField(validators=[MinValueValidator(0.0)])
    totalBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    dailyBudget = models.FloatField(validators=[MinValueValidator(0.0)])
    startDate = models.DateField()
    endDate = models.DateField()
    pricing = models.ForeignKey(Pricing)
    status = models.BooleanField(default=False)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    totalBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)
    todayBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)


def content_file_name(instance, filename):
    return '/'.join(['creatives', str(instance.id) + '.jpg'])


class Ad(BaseModel):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    adgroup = models.ForeignKey(Adgroup, related_name='ads')
    name = models.CharField(max_length=200)
    creative = models.ImageField(upload_to=content_file_name)
    landingPage = models.CharField(max_length=1000)
    adType = models.IntegerField(null=False, blank=False)
    status = models.BooleanField(default=False)
    impressions = models.IntegerField(default=0)
    clicks = models.IntegerField(default=0)
    totalBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)
    todayBurn = models.FloatField(validators=[MinValueValidator(0.0)], default=0)
