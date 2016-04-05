from rest_framework import generics, filters

from banking.models import Transaction

from .serializers import TransactionReadViewSerializer
from .filters import TransactionFilter


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionReadViewSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = TransactionFilter
