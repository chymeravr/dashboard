from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

from chym_user.views.profile import view_profile

urlpatterns = [
    url(r'^login', obtain_jwt_token),
    url(r'^view_profile', view_profile),
]