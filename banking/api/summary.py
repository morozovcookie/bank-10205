from rest_framework import views
from rest_framework.response import Response

from banking.models import Event, Participation, Account

from banking.serializers.user import AccountSerializer
from banking.serializers.event import EventFullSerializer


class Summary(views.APIView):
    def get(self, req, format=None):
        """ Return summary data for admin index """
        accounts = AccountSerializer(Account.objects.all(), many=True)
        events = EventFullSerializer(Event.objects.all(), many=True)
        return Response({'users': accounts.data, 'events': events.data})
