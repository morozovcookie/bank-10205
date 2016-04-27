from django.conf.urls import url

from .views import TransactionListView

urlpatterns = [
    url(r'^$', TransactionListView.as_view(), name='api-transactions'),
]
