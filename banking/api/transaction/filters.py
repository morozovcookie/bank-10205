import django_filters
from rest_framework import filters

from banking.models import Transaction, Event, Account


class TransactionFilter(filters.FilterSet):
    participants = django_filters.ModelMultipleChoiceFilter(
        name='participation__account',
        queryset=Account.objects.all())
    event = django_filters.ModelChoiceFilter(name='participation__event',
                                             queryset=Event.objects.all())
    parts = django_filters.NumberFilter(name='participation__parts')
    type = django_filters.MultipleChoiceFilter(name='TYPES')

    class Meta:
        model = Transaction
        queryset = Transaction.objects.all()
        fields = ['date', 'credit', 'debit', 'type', 'participants', 'event',
                  'parts', 'parent']
