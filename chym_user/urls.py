from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token

from chym_user.views import ProfileView

"""
chym_user module stores the user profile and authentication methods
"""
urlpatterns = [
    url(r'^api/login/?$', obtain_jwt_token),
    url(r'^api/view_profile/?$', ProfileView.as_view()),
    url(r'^api/advertiser/', include('advertiser.urls'))
]
