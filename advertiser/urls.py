from django.conf.urls import url

from advertiser.views import CampaignView, CampaignDetailView

urlpatterns = [
    url(r'^campaigns/?$', view=CampaignView.as_view()),
    url(r'^campaigns/(?P<pk>[0-9]+)/?$', view=CampaignDetailView.as_view())
]
