from django.contrib.auth.models import User
from django.db import transaction
from django.db.transaction import atomic
from rest_framework.serializers import ModelSerializer

from chym_user.models import Profile, TestDevice


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'password',
        )

        read_only_fields = (
            ('username',)
        )

        extra_kwargs = {
            'password': {'write_only': True},
        }


class UserProfileSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = (
            'id',
            'user',
            'email',
            'advertising_funds',
            'advertising_burn',
            'publisher_earnings',
            'publisher_payout',
            'currency',
            'active',
        )
        read_only_fields = ('advertising_budget',
                            'publisher_earnings',
                            'advertising_burn',
                            'publisher_payout',
                            'email',
                            'active')

    @atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data['is_active'] = False
        user = User.objects.create_user(**user_data)
        return Profile.objects.create(user=user, **validated_data)



class TestDeviceSerializer(ModelSerializer):
    class Meta:
        model = TestDevice
        fields = ('id', 'deviceId', 'status')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return TestDevice.objects.create(**validated_data)
