from django.conf.urls import url

from .views import\
    EventListView, EventDetail, ParticipantListView, ParticipantDetail

urlpatterns = [
    url(r'^$', EventListView.as_view()),
    url(r'^(?P<pk>[0-9]+)/$', EventDetail.as_view()),
    url(r'^(?P<event_pk>[0-9]+)/participants/$',
        ParticipantListView.as_view()),
    url(r'^(?P<event_pk>[0-9]+)/participants/(?P<pk>[0-9]+)/$',
        ParticipantDetail.as_view()),
]
