import json

from django.http import HttpResponse
from rest_framework.decorators import permission_classes
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from chym_user.models import Profile, InterestedUser, TestDevice
from chym_user.send_email import send_welcome_mail
from chym_user.serializers import UserProfileSerializer, TestDeviceSerializer


class ProfileView(APIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = UserProfileSerializer

    @permission_classes((IsAuthenticated,))
    def get(self, request):
        serializedReponse = UserProfileSerializer(Profile.objects.get(user=request.user))
        return Response(serializedReponse.data)


@permission_classes((AllowAny,))
class RegisterView(APIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = UserProfileSerializer

    @permission_classes((AllowAny,))
    def post(self, request):
        try:
            self.serializer_class.create(UserProfileSerializer(),
                                     json.loads(request.body.decode('utf-8')))
            return HttpResponse(status=201)
        except:
            return HttpResponse(status=400)



@permission_classes((IsAuthenticated,))
class TestDeviceView(ListCreateAPIView, RetrieveUpdateAPIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = TestDeviceSerializer

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return TestDevice.objects.filter(user=self.request.user)


def preview_register(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        user_email = data['user_email']

        user = InterestedUser.objects.filter(pk=user_email).exists()
        send_welcome_mail(user_email)
        if not user:
            user = InterestedUser(email=user_email)
            user.save()
            return HttpResponse(status=201, content='{}', content_type='application/json')
        # User already exists
        else:
            return HttpResponse(status=409, content='{}', content_type='application/json')
    else:
        return HttpResponse(status=402, content='{}', content_type='application/json')
