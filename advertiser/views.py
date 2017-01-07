# Create your views here.
from rest_framework import filters
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer

from advertiser.models import Campaign, Adgroup, Targeting, Ad
from advertiser.permissions import IsOwner
from advertiser.serializers import CampaignSerializer, AdgroupUpdateSerializer, TargetingSerializer, \
    AdgroupDetailSerializer, AdSerializer


@permission_classes((IsAuthenticated, IsOwner))
class CampaignView(generics.ListCreateAPIView):
    serializer_class = CampaignSerializer
    renderer_classes = (JSONRenderer,)
    filter_backends = (filters.OrderingFilter,)
    ordering_fields = ('modified_date', 'created_date')
    ordering = ('-modified_date',)

    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@permission_classes((IsAuthenticated, IsOwner))
class CampaignDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = CampaignSerializer
    renderer_classes = (JSONRenderer,)

    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)


class AdgroupView(generics.ListCreateAPIView):
    serializer_class = AdgroupUpdateSerializer
    renderer_classes = (JSONRenderer,)
    ordering_fields = ('modified_date', 'created_date')
    ordering = ('-modified_date',)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Adgroup.objects.filter(campaign__user=self.request.user)


class AdgroupDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AdgroupUpdateSerializer
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Adgroup.objects.filter(campaign__user=self.request.user)


class AdgroupReadOnlyDetailView(generics.RetrieveAPIView):
    serializer_class = AdgroupDetailSerializer
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Adgroup.objects.filter(campaign__user=self.request.user)


class TargetingView(generics.ListCreateAPIView):
    serializer_class = TargetingSerializer
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Targeting.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TargetingDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = TargetingSerializer
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Targeting.objects.filter(user=self.request.user)


@permission_classes((IsAuthenticated,))
class AdUploadView(generics.ListCreateAPIView):
    serializer_class = AdSerializer
    ordering_fields = ('modified_date', 'created_date')
    ordering = ('-modified_date',)

    def get_queryset(self):
        return Ad.objects.filter(adgroup__campaign__user=self.request.user)


@permission_classes((IsAuthenticated,))
class AdDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AdSerializer

    def get_queryset(self):
        return Ad.objects.filter(adgroup__campaign__user=self.request.user)
