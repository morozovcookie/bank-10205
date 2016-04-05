import django_filters
from rest_framework import filters

from banking.models import Account


class AccountFilter(filters.FilterSet):
    username = django_filters.CharFilter(name='user__username')

    class Meta:
        model = Account
        queryset = Account.objects.all()
        fields = ['username']
