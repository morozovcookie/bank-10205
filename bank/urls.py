from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from banking import views
from banking.api import user as api

from rest_framework.authtoken import views as AuthViews

urlpatterns = patterns('',
    #paged routing
    url(r'^index/', views.auth),
    
    #api calls
    url(r'^api/test/', api.TestView.as_view(), name='test-view'),
    url(r'^api/auth/', api.AuthView.as_view(), name='auth-view'),
    url(r'^api/token-auth/', AuthViews.obtain_auth_token),
)

urlpatterns = format_suffix_patterns(urlpatterns)