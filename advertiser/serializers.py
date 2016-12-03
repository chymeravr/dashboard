from django.db import models
from rest_framework import serializers

from advertiser.models import Format, Os, Hmd, Campaign, Budget, Device, Targeting, Adgroup, Ad, Pricing


class FormatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Format
        fields = ('id', 'name')


class OsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Os
        fields = ('id', 'name', 'version')


class PricingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pricing
        fields = ('id', 'name')


class HmdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hmd
        fields = ('id', 'name')


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ('id', 'bid', 'total_budget', 'daily_budget')


class DeviceSerializer(serializers.ModelSerializer):
    os = OsSerializer()

    class Meta:
        model = Device
        fields = ('id', 'ram', 'os')


class TargetingSerializer(serializers.ModelSerializer):
    hmd = HmdSerializer()
    device = DeviceSerializer()

    class Meta:
        model = Targeting
        fields = ['id', 'hmd', 'device']


class CampaignSerializer(serializers.ModelSerializer):
    type = FormatSerializer()

    class Meta:
        model = Campaign
        fields = ('id', 'name', 'type', 'total_budget',
                  'daily_budget', 'start_date', 'end_date',
                  'status')


class AdgroupSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer()
    name = models.CharField(max_length=100)
    budget = BudgetSerializer()
    targeting = TargetingSerializer()

    class Meta:
        model = Adgroup
        fields = ['id', 'campaign', 'name', 'budget',
                  'targeting']


class AdSerializer(serializers.ModelSerializer):
    adgroup = AdgroupSerializer()
    creative_url = models.URLField(max_length=300)
    format = FormatSerializer()

    class Meta:
        model = Ad
        fields = ['id', 'adgroup', 'creative_url', 'format',
                  ]
