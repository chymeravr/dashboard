from django.conf.urls import url

from advertiser.views import CampaignView, CampaignDetailView, AdgroupView, AdgroupDetailView, TargetingView, \
    TargetingDetailView

uuid_regex = "[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}"
urlpatterns = [
    url(r'^campaigns/?$', view=CampaignView.as_view()),
    url(r'^campaigns/(?P<pk>%s)/?$' % uuid_regex, view=CampaignDetailView.as_view()),
    url(r'^adgroups/?$', view=AdgroupView.as_view()),
    url(r'^adgroups/(?P<pk>%s)/?$' % uuid_regex, view=AdgroupDetailView.as_view()),
    url(r'^targetings/?$', view=TargetingView.as_view()),
    url(r'^targetings/(?P<pk>[0-9]+)/?$', view=TargetingDetailView.as_view()),
]
