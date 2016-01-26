from django.conf.urls import patterns, url

from banking import views
from banking.api import user as api

urlpatterns = [
    #paged routing
    url(r'^index/', views.auth),
    
    #api calls
    url(r'^api/test/', api.TestView.as_view(), name='test-view'),
    url(r'^api/auth/', api.AuthView.as_view(), name='auth-view'),
]