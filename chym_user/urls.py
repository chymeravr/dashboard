from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token

from chym_user.views import ProfileView, preview_register, TestDeviceView

"""
chym_user module stores the user profile and authentication methods
"""
urlpatterns = [
    url(r'^api/login/?$', obtain_jwt_token),
    url(r'^api/view_profile/?$', ProfileView.as_view()),
    url(r'^api/testDevices/?$', TestDeviceView.as_view()),
    url(r'^api/preview_register/?$', preview_register),
    url(r'^api/advertiser/', include('advertiser.urls')),
    url(r'^api/publisher/', include('publisher.urls'))
]
