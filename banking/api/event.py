from rest_framework.views import APIView
from rest_framework.response import Response

# from rest_framework.authtoken.models import Token
# from rest_framework.exceptions import ParseError
# from rest_framework import status

from banking.models import Event

# from banking.views import has_permisions
from banking.serializers.event import EventSerializer
from banking.serializers.user import AccountSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, \
    IsAuthenticatedOrReadOnly

from rest_framework import viewsets

from rest_framework.decorators import detail_route
from rest_framework import renderers
# from django.http import JsonResponse, HttpResponse


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    @detail_route(renderer_classes=[renderers.JSONRenderer])
    def participants(self, req, *args, **kwargs):
        e = self.get_object()
        ser = AccountSerializer(e.get_participants(), many=True)
        return Response(ser.data)
