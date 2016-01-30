from django.conf.urls import patterns, url

from banking import views
from banking.api import user as api_user

urlpatterns = [
    #paged routing
    url(r'^$', views.default),
    url(r'^auth/', views.auth),
    url(r'^client/', views.client),
    url(r'^admin/', views.admin),
    url(r'^error/', views.error),
    
    #api calls
<<<<<<< HEAD
    url(r'^api/auth/', api_user.auth.as_view(), name='auth'),
    url(r'^api/user/', api_user.user.as_view(), name='user'),
    url(r'^api/users/', api_user.user_list, name='user-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
=======
    url(r'^api/test/', api.TestView.as_view(), name='test-view'),
    url(r'^api/auth/', api.AuthView.as_view(), name='auth-view'),
]
>>>>>>> 9369f4918d4c663e733a5dd1da2574c500ffb079
