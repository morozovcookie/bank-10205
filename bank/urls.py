from django.conf.urls import patterns, url, include
from django.contrib import admin

from banking import views
from banking.api import user as api_user

urlpatterns = [
    # paged routing
    url(r'^$', views.default),
    url(r'^auth/', views.auth),
    url(r'^client/', views.client),
    url(r'^admin/', views.admin),
    url(r'^error/', views.error),

    # api calls
    url(r'^api/auth/', api_user.auth.as_view(), name='auth'),
    url(r'^api/user/', api_user.user.as_view(), name='user'),
    url(r'^api/users/', api_user.user_list, name='user-list'),

    url(r'^backdoor', include(admin.site.urls)),
]
