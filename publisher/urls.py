from django.conf.urls import url

from publisher.views import AppView, AppDetailView, PlacementView, PlacementDetailView

uuid_regex = "[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}"
urlpatterns = [
    url(r'^apps/?$', view=AppView.as_view()),
    url(r'^apps/(?P<pk>%s)/?$' % uuid_regex, view=AppDetailView.as_view()),
    url(r'^placements/?$', view=PlacementView.as_view()),
    url(r'^placements/(?P<pk>%s)/?$' % uuid_regex, view=PlacementDetailView.as_view()),
]
