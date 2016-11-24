from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from chym_user.views.api import ProfileView
from chym_user.views.app import login

"""
chym_user module stores the user profile and authentication methods
"""
urlpatterns = [
    url(r'^login', login),
    url(r'^api/login', obtain_jwt_token),
    url(r'^api/view_profile', ProfileView.as_view()),
]
