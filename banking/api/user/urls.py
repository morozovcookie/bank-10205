from django.conf.urls import url

from .views import UserList, user

urlpatterns = [
    url(r'^$',                UserList.as_view(), name='accounts'),
    url(r'^(?P<pk>[0-9]+)/$', user.as_view(),     name='account-detail'),
]
