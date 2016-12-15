from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer

from publisher.models import App, Placement
from publisher.permissions import IsOwner
from publisher.serializers import AppSerializer, PlacementSerializer


@permission_classes((IsAuthenticated, IsOwner))
class AppView(generics.ListCreateAPIView):
    serializer_class = AppSerializer
    renderer_classes = (JSONRenderer,)

    def get_queryset(self):
        return App.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@permission_classes((IsAuthenticated, IsOwner))
class AppDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AppSerializer
    renderer_classes = (JSONRenderer,)

    def get_queryset(self):
        return App.objects.filter(user=self.request.user)


@permission_classes((IsAuthenticated,))
class PlacementView(generics.ListCreateAPIView):
    serializer_class = PlacementSerializer
    renderer_classes = (JSONRenderer,)

    def get_queryset(self):
        return Placement.objects.filter(app__user=self.request.user)


@permission_classes((IsAuthenticated,))
class PlacementDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = PlacementSerializer
    renderer_classes = (JSONRenderer,)

    def get_queryset(self):
        return Placement.objects.filter(app__user=self.request.user)
