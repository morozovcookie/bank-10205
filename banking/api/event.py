from rest_framework.views import APIView
from rest_framework.response import Response

# from rest_framework.authtoken.models import Token
# from rest_framework.exceptions import ParseError
# from rest_framework import status

from banking.models import Event

# from banking.views import has_permisions
from banking.serializers.event import EventSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

# from django.http import JsonResponse, HttpResponse


class event(APIView):
    authentication_classes = (
        TokenAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
    )

    def get(self, request, format=None):
        pass

    def post(self, request, format=None):
        pass


class event_list(APIView):
    authentication_classes = (
        TokenAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
    )

    def get(self, request, format=None):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(
            serializer.data
        )
