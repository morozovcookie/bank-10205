from django.http import Http404

from rest_framework import views
from rest_framework.response import Response
from rest_framework import status

from banking.models import Event
from banking.serializers.event import EventSerializer, EventFullSerializer
# from banking.serializers.user import AccountSerializer


class EventView(views.APIView):

    def get(self, req, format=None):
        events = Event.objects.all()
        ser = EventSerializer(events, many=True)
        return Response(ser.data)

    def post(self, req, format=None):
        ser = EventSerializer(data=req.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data, status=status.HTTP_201_CREATED)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class EventDetail(views.APIView):

    def get_object(self, pk):
        try:
            return Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            raise Http404

    def get(self, req, pk, format=None):
        e = self.get_object(pk)
        ser = EventFullSerializer(e)
        return Response(ser.data)

    def put(self, req, pk, format):
        e = self.get_object(pk)
        ser = EventSerializer(e, data=req.data)
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req, pk, format=None):
        e = self.get_object(pk)
        e.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
