from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token

from chym_user.views import ProfileView, preview_register, TestDeviceView, RegisterView, ActivateView, PaymentView, \
    PayoutView, charge

"""
chym_user module stores the user profile and authentication methods
"""
activation_code_regex = "[a-zA-Z0-9]*"

urlpatterns = [
    url(r'^api/login/?$', obtain_jwt_token),
    url(r'^api/view_profile/?$', ProfileView.as_view()),
    url(r'^api/signup/?$', RegisterView.as_view()),
    url(r'^api/activate/(?P<activation_code>%s)/?$' % activation_code_regex, view=ActivateView.as_view()),
    url(r'^api/testDevices/?$', TestDeviceView.as_view()),
    url(r'^api/testDevices/(?P<pk>[0-9]+)/?$', view=TestDeviceView.as_view()),
    url(r'^api/preview_register/?$', preview_register),
    url(r'^api/payments/?$', PaymentView.as_view()),
    url(r'^api/payouts/?$', PayoutView.as_view()),
    url(r'^api/charge/?$', charge),
    url(r'^api/advertiser/', include('advertiser.urls')),
    url(r'^api/publisher/', include('publisher.urls'))
]
