from django.conf.urls import url

from .views import auth

urlpatterns = [
    url(r'^$', auth.as_view(), name='api-auth'),
]
