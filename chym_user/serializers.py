from django.contrib.auth.models import User
from django.db.transaction import atomic
from rest_framework.serializers import ModelSerializer

from chym_user.models import Profile, TestDevice, Payment, Payout, VrEvent


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'password',
            'is_active'
        )

        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


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
        )
        read_only_fields = ('advertising_budget',
                            'publisher_earnings',
                            'advertising_burn',
                            'publisher_payout',)

    @atomic
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user_data[u'is_active'] = False
        user_serializer = UserSerializer(data=user_data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        return Profile.objects.create(user=user, **validated_data)


class TestDeviceSerializer(ModelSerializer):
    class Meta:
        model = TestDevice
        fields = ('id', 'deviceId', 'status')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return TestDevice.objects.create(**validated_data)


class PaymentsSerializer(ModelSerializer):
    class Meta:
        model = Payment
        fields = ('amount', 'created_date')


class PayoutsSerializer(ModelSerializer):
    class Meta:
        model = Payout
        fields = ('amount', 'created_date')


class VrEventSerializer(ModelSerializer):
    class Meta:
        model = VrEvent
        fields = ('event_name', 'description')
