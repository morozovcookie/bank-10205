from django.conf.urls import patterns, include, url
from django.contrib import admin

from banking import views
from banking.api import user

from rest_framework.authtoken import views as TViews

urlpatterns = patterns('',
    #paged routing
    #url(r'^', views.auth),
    
    #api calls
    url(r'^api/auth/', user.AuthView.as_view(), name='auth-view'),
    url(r'^api/api-token-auth/', TViews.obtain_auth_token),
    url(r'^api/test/', user.UserAuth.as_view(), name='test-view'),
)
