from django.conf.urls import patterns, url, include
from django.contrib import admin

from banking import views
from banking.api import user as api_user
from banking.api import event as api_event

urlpatterns = [
    # paged routing
    url(r'^$', views.default),
    url(r'^auth/', views.auth),
    url(r'^client/', views.client),
    url(r'^admin/', views.admin),
    url(r'^error/', views.error),

    url(r'^users/', views.users),
    url(r'^events/', views.events),

    #api calls
    url(r'^api/auth/', api_user.auth.as_view(), name='auth'),
    url(r'^api/user/((?P<pk>\d*)|(?P<pattern>\w*))$', api_user.user.as_view(), name='user'),
    url(r'^api/users/', api_user.user_list.as_view(), name='user-list'),

    url(r'^api/event/', api_event.event.as_view(), name='event'),
    url(r'^api/events/', api_event.event_list.as_view(), name='event-list'),
]
