from django.conf.urls import url

from .views import UserList, user

urlpatterns = [
    url(r'^$',                UserList.as_view(), name='api-accounts'),
    url(r'^(?P<pk>[0-9]+)/$', user.as_view(),     name='api-account-detail'),
]
