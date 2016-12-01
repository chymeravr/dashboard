from django.conf.urls import url

from advertiser import views

urlpatterns = [
    url(r'^', view=views.campaign_view),
]
