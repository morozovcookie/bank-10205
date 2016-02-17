from django.http import Http404

from rest_framework import views
from rest_framework.response import Response
from rest_framework import status

from banking.models import Event
from banking.serializers.event import\
    EventSerializer, EventFullSerializer, ParticipationSerializer
# from banking.serializers.user import AccountSerializer


class EventView(views.APIView):
    def get(self, req, format=None):
        events = Event.objects.all()
        ser = EventSerializer(events, many=True, context={'request': req})
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
        ser = EventFullSerializer(e, context={'request': req})
        return Response(ser.data)

    def put(self, req, pk, format=None):
        e = self.get_object(pk)
        # TODO: FIX expecting name & price, when put only author
        ser = EventSerializer(e, data=req.data, context={'request': req})
        if ser.is_valid():
            ser.save()
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, req, pk, format=None):
        e = self.get_object(pk)
        e.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ParticipantsView(views.APIView):
    def get_event(self, pk):
        try:
            e = Event.objects.get(pk=pk)
            return e
        except Event.DoesNotExist:
            raise Http404

    def get(self, req, event_pk, format=None):
        e = self.get_event(event_pk)
        ps = ParticipationSerializer(e.get_participants(), many=True,
                                     context={'request': req})
        return Response(ps.data)

    def post(self, req, event_pk, format=None):
        print(req.data)
        ser = ParticipationSerializer(data=req.data, context={'request': req})
        if ser.is_valid():
            return Response(ser.data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
