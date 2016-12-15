from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class UserProfileSerializer(ModelSerializer):
    currency = serializers.CharField(source='profile.currency')
    advertising_budget = serializers.FloatField(source='profile.advertising_budget')
    publisher_earnings = serializers.FloatField(source='profile.publisher_earnings')

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'advertising_budget',
            'publisher_earnings',
            'currency'
        )

        read_only_fields = ('created_at', 'updated_at',)
