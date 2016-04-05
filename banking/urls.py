from django.conf.urls import url, include

from banking import views

urlpatterns = [
    url(r'^$',                       views.default,     name="index"),
    url(r'^auth/$',                  views.auth,        name="auth"),
    url(r'^client/$',                views.client,      name="client"),
    url(r'^admin/$',                 views.admin,       name="admin"),
    url(r'^error/$',                 views.error,       name="error"),

    url(r'^events/$',                views.events,      name="events"),
    url(r'^events/(?P<pk>[0-9]+)/$', views.eventDetail, name="event-detail"),
    url(r'^users/$',                 views.users,       name="users"),
    url(r'^users/(?P<pk>[0-9]+)/$',  views.userDetail,  name="users-detail"),

    # api calls
    url(r'^api/events/',             include('banking.api.event.urls')),
    url(r'^api/transactions/',       include('banking.api.transaction.urls')),
    url(r'^api/users/',              include('banking.api.user.urls')),
    url(r'^api/auth/',               include('banking.api.auth.urls')),

    # API docs. Uncomment 'django-rest-swagger' in apps, and install package.
    # By the way, it's need more work, to become nice.
    # url(r'^docs/', include('rest_framework_swagger.urls')),
]
