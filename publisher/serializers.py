from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from publisher.models import App, AppStore, Placement


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


class AppStoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppStore
        fields = ('id', 'name')


class PlacementSerializer(serializers.ModelSerializer):
    app = UserFilteredPKRelatedField(queryset=App.objects)

    class Meta:
        model = Placement
        fields = ['id', 'name', 'app',
                  'requests', 'impressions', 'clicks', 'earnings']
        read_only_fields = ('requests', 'impressions', 'clicks', 'earnings')
        order_by = (('created_on'),)


class AppSerializer(serializers.ModelSerializer):
    placements = PlacementSerializer(many=True, read_only=True)
    appStore = PrimaryKeyRelatedField(queryset=AppStore.objects.all())
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = App
        fields = ('id', 'user', 'name', 'url', 'appStore', 'approved', 'placements',
                  'requests', 'impressions', 'clicks', 'earnings')
        read_only_fields = ('requests', 'impressions', 'clicks', 'earnings')
        order_by = (('created_on'),)
