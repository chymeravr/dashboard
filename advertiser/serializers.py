from django.db import models
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from advertiser.models import CampaignType, Os, Hmd, Campaign, Targeting, Adgroup, Ad, Pricing


class UserFilteredPKRelatedField(PrimaryKeyRelatedField):
    """
    This class is required to enable filtering on the available foreign keys
    Ex. an adgroup being created by user1 can only set those campaigns as foreign
    key which were created by the same user. Similarly for targeting.
    We do not need to use this field for any global foreign keys like "Pricing", handset etc.
    """

    def __init__(self, **kwargs):
        super(UserFilteredPKRelatedField, self).__init__(**kwargs)

    def get_queryset(self):
        queryset = super(UserFilteredPKRelatedField, self).get_queryset()
        return queryset.filter(user=self.context['request'].user)


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


class TargetingReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = Targeting
        fields = ['id', 'hmd', 'ram', 'os', 'name']


class TargetingSerializer(serializers.ModelSerializer):
    hmd = PrimaryKeyRelatedField(queryset=Hmd.objects.all(), allow_null=True)
    os = PrimaryKeyRelatedField(queryset=Os.objects.all(), allow_null=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Targeting
        fields = ['id', 'user', 'hmd', 'ram', 'os', 'name']


class AdSerializer(serializers.ModelSerializer):
    # adgroup = UserFilteredPKRelatedField(queryset=Adgroup.objects)

    class Meta:
        model = Ad
        fields = ['id', 'adgroup', 'creative', 'name',
                  'impressions', 'clicks', 'totalBurn', 'todayBurn', 'status']
        read_only_fields = ['impressions', 'clicks', 'totalBurn', 'todayBurn']


class AdgroupUpdateSerializer(serializers.ModelSerializer):
    pricing = PrimaryKeyRelatedField(queryset=Pricing.objects.all())
    campaign = UserFilteredPKRelatedField(queryset=Campaign.objects)
    targeting = UserFilteredPKRelatedField(queryset=Targeting.objects, many=True,
                                           allow_null=True, allow_empty=True, required=False)

    class Meta:
        model = Adgroup
        fields = ['id', 'campaign', 'name', 'dailyBudget', 'totalBudget',
                  'targeting', 'bid', 'pricing', 'startDate', 'endDate',
                  'ads', 'impressions', 'clicks', 'totalBurn', 'todayBurn', 'status']
        read_only_fields = ['impressions', 'clicks', 'totalBurn', 'todayBurn', 'ads']


class AdgroupDetailSerializer(serializers.ModelSerializer):
    name = models.CharField(max_length=100)
    pricing = PricingSerializer(read_only=True)
    campaign = UserFilteredPKRelatedField(queryset=Campaign.objects)
    targeting = TargetingReadOnlySerializer(read_only=True, many=True)
    ads = AdSerializer(many=True, read_only=True)

    class Meta:
        model = Adgroup
        fields = ['id', 'campaign', 'name', 'dailyBudget', 'totalBudget',
                  'targeting', 'bid', 'pricing', 'startDate', 'endDate',
                  'ads', 'impressions', 'clicks', 'totalBurn', 'todayBurn', 'status']
        read_only_fields = ['impressions', 'clicks', 'totalBurn', 'todayBurn']


class CampaignSerializer(serializers.ModelSerializer):
    campaignType = serializers.PrimaryKeyRelatedField(queryset=CampaignType.objects.all())
    adgroups = AdgroupUpdateSerializer(many=True, read_only=True)
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Campaign
        fields = ('user', 'id', 'name', 'campaignType', 'totalBudget',
                  'dailyBudget', 'startDate', 'endDate',
                  'status', 'adgroups', 'impressions', 'clicks', 'totalBurn', 'todayBurn', 'modified_date')
        read_only_fields = ('impressions', 'clicks', 'totalBurn', 'todayBurn', 'modified_date')
