from rest_framework.decorators import permission_classes
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer

from chym_user.models import Profile
from chym_user.serializers import UserProfileSerializer


@permission_classes((IsAuthenticated,))
class ProfileView(ListCreateAPIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = UserProfileSerializer

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)
