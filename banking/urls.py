from django.conf.urls import url, include

from banking import views
from banking.api import user as api_user
from banking.api.event import\
    EventListView, EventDetail, ParticipantListView, ParticipantDetail
from banking.api.transaction import TransactionListView

urlpatterns = [
    url(r'^auth/$', views.auth),
    url(r'^client/$', views.client),
    url(r'^admin/$', views.admin),
    url(r'^error/$', views.error),

    url(r'^events/$', views.events),
    url(r'^events/(?P<pk>[0-9]+)$', views.eventDetail),
    url(r'^users/$', views.users),
    url(r'^users/(?P<pk>[0-9]+)/$', views.userDetail),
    url(r'^$', views.default),

    # api calls
    url(r'^api/events/$', EventListView.as_view()),
    url(r'^api/events/(?P<pk>[0-9]+)/$', EventDetail.as_view()),
    url(r'^api/events/(?P<event_pk>[0-9]+)/participants/$',
        ParticipantListView.as_view()),
    url(r'^api/events/(?P<event_pk>[0-9]+)/participants/(?P<pk>[0-9]+)/$',
        ParticipantDetail.as_view()),

    url(r'^api/auth/$', api_user.auth.as_view(), name='auth'),
    url(r'^api/user/$', api_user.user.as_view(), name='user'),
    url(r'^api/users/$', api_user.user_list.as_view(), name='user-list'),
    url(r'^api/users/(?P<pk>[0-9]+)/$', api_user.user.as_view(),
        name='account-detail'),

    url(r'^api/transactions/$', TransactionListView.as_view(),
        name='transaction-list'),
    # API docs. Uncomment 'django-rest-swagger' in apps, and install package.
    # By the way, it's need more work, to become nice.
    url(r'^docs/', include('rest_framework_swagger.urls')),
]
