# from django.http import Http404
# from rest_framework.response import Response
from rest_framework import generics

from rest_framework import filters
# import django_filters  # for fields

from banking.models import Transaction
from banking.serializers.transaction import TransactionSerializer


class TransactionFilter(filters.FilterSet):
    class Meta:
        model = Transaction
        fields = ['parts', 'date', 'credit', 'debit', 'type',
                  'account', 'event']


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TransactionFilter
