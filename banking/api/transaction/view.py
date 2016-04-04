from rest_framework import generics, filters

from banking.models import Transaction
from banking.serializers.transaction import TransactionSerializer

from .filter import TransactionFilter


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TransactionFilter
