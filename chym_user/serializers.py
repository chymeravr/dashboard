from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from chym_user.models import Profile


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'email'
        )

        read_only_fields = (
            'email',
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
            'advertising_budget',
            'publisher_earnings',
            'currency'
        )
        read_only_fields = ('advertising_budget', 'publisher_earnings')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        return Profile.objects.create(user=user, **validated_data)
