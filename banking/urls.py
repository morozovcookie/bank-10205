from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^client/index.html$', views.client_index, name='c_index'),
    url(r'^client/authentication.html$', views.client_auth, name='c_auth'),
    url(r'^admin/index.html$', views.admin_index, name='a_index'),
    url(r'^admin/authentication.html$', views.admin_auth, name='a_auth'),
    url(r'^admin/admin.html$', views.admin, name='admin'),
    url(r'^admin/eventlist/$', views.elist, name='elist'),

]
