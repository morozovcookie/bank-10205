from django.conf.urls import url

from .views import auth

urlpatterns = [
    url(r'^api/auth/$', auth.as_view(), name='auth'),
]
