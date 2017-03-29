import json

import sendgrid
from django.http import HttpResponse
from rest_framework.decorators import permission_classes
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from sendgrid import Email
from sendgrid.helpers.mail import Content, Mail, Personalization

from chym_user.models import Profile, InterestedUser, TestDevice
from chym_user.serializers import UserProfileSerializer, TestDeviceSerializer
from dashboard import settings

RECEPIENTS = map(lambda x: x + '@chymeravr.com', ['info'])

WELCOME_MESSAGE = """
Hi

Thanks for being interested in Chymera VR, the VR ad-network. I'm Smeet, CEO of the company.

I'd like to tell you more about our product. Would you be available for a call this week?

Best,\n
Smeet
"""


@permission_classes((IsAuthenticated,))
class ProfileView(ListCreateAPIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = UserProfileSerializer

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return Profile.objects.filter(user=self.request.user)


@permission_classes((IsAuthenticated,))
class TestDeviceView(ListCreateAPIView, RetrieveUpdateAPIView):
    renderer_classes = (JSONRenderer,)
    serializer_class = TestDeviceSerializer

    @permission_classes((IsAuthenticated,))
    def get_queryset(self):
        return TestDevice.objects.filter(user=self.request.user)


def send_welcome_mail(email):
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email('smeet@chymeravr.com', name="Smeet Bhatt")
    subject = "Welcome to the world of Chymera VR"
    content = Content("text/plain", WELCOME_MESSAGE)
    mail = Mail(from_email, subject, Email(email), content=content)
    personalization = Personalization()

    for recepient in RECEPIENTS:
        personalization.add_bcc(Email(recepient))

    mail.add_personalization(personalization)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)


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
        return HttpResponse(status=409, content='{}', content_type='application/json')
    else:
        return HttpResponse(status=400, content='{}', content_type='application/json')
