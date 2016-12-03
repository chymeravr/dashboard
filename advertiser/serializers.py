from django.db import models
from rest_framework import serializers

from advertiser.models import CampaignType, Os, Hmd, Campaign, Budget, Device, Targeting, Adgroup, Ad, Pricing


class CampaignTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignType
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
    campaign_type = CampaignTypeSerializer()
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Campaign
        fields = ('user', 'id', 'name', 'campaign_type', 'total_budget',
                  'daily_budget', 'start_date', 'end_date',
                  'status')

    def create(self, validated_data):
        campaign_type_data = validated_data.pop('campaign_type')
        campaign_type, created = CampaignType.objects.get_or_create(**campaign_type_data)
        return Campaign.objects.create(campaign_type=campaign_type, **validated_data)


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

    class Meta:
        model = Ad
        fields = ['id', 'adgroup', 'creative_url',]
