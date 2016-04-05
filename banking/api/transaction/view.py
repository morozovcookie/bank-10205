from rest_framework import generics, filters

from banking.models import Transaction

from .serializer import TransactionReadViewSerializer
from .filter import TransactionFilter


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionReadViewSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TransactionFilter
