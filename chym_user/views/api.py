from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from chym_user.serializers import UserSerializer


class ProfileView(APIView):
    renderer_classes = (JSONRenderer,)

    @permission_classes((IsAuthenticated,))
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
