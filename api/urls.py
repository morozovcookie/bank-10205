from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^admin.auth$', views.auth),
    url(r'^admin.elist$', views.elist),
]
