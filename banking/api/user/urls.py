from django.conf.urls import url

from .views import UserList, user, Payment

urlpatterns = [
    url(r'^$',                UserList.as_view(), name='api-accounts'),
    url(r'^(?P<pk>[0-9]+)/$', user.as_view(),     name='api-account-detail'),
    url(r'^(?P<pk>[0-9]+)/money/$', Payment.as_view(),
        name='api-account-payment'),
]
