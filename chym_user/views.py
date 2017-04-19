import json
from httplib import METHOD_NOT_ALLOWED

import stripe
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.decorators import permission_classes
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from chym_user.auth_utils import get_user_jwt
from chym_user.models import Profile, InterestedUser, TestDevice, Payment, Payout
from chym_user.send_email import send_welcome_mail
from chym_user.serializers import UserProfileSerializer, TestDeviceSerializer, PaymentsSerializer, PayoutsSerializer


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
            serializer = UserProfileSerializer(data=json.loads(request.body.decode('utf-8')))
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return HttpResponse(status=201, content='{}', content_type='application/json')
        except Exception, e:
            raise e


@permission_classes((AllowAny,))
class ActivateView(APIView):
    @permission_classes((AllowAny,))
    def get(self, request, activation_code):
        try:
            user = Profile.objects.get(activation_code=activation_code).user
            user.is_active = True
            user.save()
            print user
            return HttpResponse(status=200)
        except Exception, e:
            return HttpResponse(status=400, content=str(e.message))


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


@permission_classes((IsAuthenticated,))
class PaymentView(generics.ListAPIView):
    serializer_class = PaymentsSerializer
    ordering_fields = ('created_date')
    ordering = ('-created_date',)

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


@permission_classes((IsAuthenticated,))
class PayoutView(generics.ListAPIView):
    serializer_class = PayoutsSerializer
    ordering_fields = ('created_date')
    ordering = ('-created_date',)

    def get_queryset(self):
        return Payout.objects.filter(user=self.request.user)


def charge(request):
    errors = {}
    print request.user
    if request.method == 'POST' or not request.user.is_authenticated():
        try:
            if 'stripeToken' not in request.POST:
                errors['stripeToken'] = 'Field required'

            if 'amount' not in request.POST:
                errors['amount'] = 'Field required'

            if len(errors) > 0:
                return HttpResponse(content=json.dumps(errors), status=400, content_type='application/json')

            token = request.POST['stripeToken']
            amount = int(request.POST['amount'])
        except Exception, e:
            return HttpResponse(content=json.dumps({'error': str(e)}), status=400, content_type='application/json')

        try:
            stripe.Charge.create(
                amount=amount,
                currency="usd",
                description=request.user.username,
                source=token,
            )

            payment = Payment()
            payment.user = get_user_jwt(request)
            payment.amount = amount
            payment.transaction_id = token
            payment.save()

            return HttpResponse(status=200, content_type='application/json')
        except Exception, e:
            return HttpResponse(content=json.dumps({'error': str(e)}), status=400, content_type='application/json')
    else:
        return HttpResponse(status=METHOD_NOT_ALLOWED)
