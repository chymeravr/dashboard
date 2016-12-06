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
        fields = ('id', 'bid', 'totalBudget', 'dailyBudget')


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
    campaignType = serializers.PrimaryKeyRelatedField(queryset=CampaignType.objects.all())
    adgroups = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Campaign
        fields = ('user', 'id', 'name', 'campaignType', 'totalBudget',
                  'dailyBudget', 'startDate', 'endDate',
                  'status', 'adgroups')
        order_by = (('created_on'),)

class AdgroupSerializer(serializers.ModelSerializer):
    campaign = CampaignSerializer()
    name = models.CharField(max_length=100)
    budget = BudgetSerializer()
    targeting = TargetingSerializer()

    class Meta:
        model = Adgroup
        fields = ['id', 'campaign', 'name', 'budget',
                  'targeting']
        order_by = (('created_on'),)



class AdSerializer(serializers.ModelSerializer):
    adgroup = AdgroupSerializer()
    creative_url = models.URLField(max_length=300)

    class Meta:
        model = Ad
        fields = ['id', 'adgroup', 'creative_url', ]
        order_by = (('created_on'),)

