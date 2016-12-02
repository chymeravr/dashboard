# Create your views here.
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer

from advertiser.models import Campaign
from advertiser.serializers import CampaignSerializer


class CampaignView(generics.ListAPIView):
    serializer_class = CampaignSerializer
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Campaign.objects.filter(user=self.request.user)
