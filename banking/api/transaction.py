from django.http import Http404

from rest_framework import generics
from rest_framework.response import Response

from banking.models import Transaction
from banking.serializers.transaction import TransactionSerializer


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    def get(self, req, event_pk=None):
        if event_pk:
            ts = Transaction.objects.filter(event=event_pk)
        else:
            ts = Transaction.objects.all()
        if len(ts) > 0:
            ser = TransactionSerializer(ts,
                                        many=True,
                                        context={'request': req})
            return Response(ser.data)
        raise Http404
