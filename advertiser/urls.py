from django.conf.urls import url

from advertiser.views import CampaignView

urlpatterns = [
    url(r'^', view=CampaignView.as_view()),
]
