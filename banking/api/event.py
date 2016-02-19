from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import views, status, generics
from rest_framework.response import Response

from banking.models import Event
from banking.serializers.event import *


def get_event(pk):
    try:
        e = Event.objects.get(pk=pk)
        return e
    except Event.DoesNotExist:
        raise Http404


def get_participation(e, pk):
    """Return participation dict.
    keys:
        account -- account object
        rate -- participation parts
    """
    acc = get_object_or_404(Account, pk=pk)
    tmp = e.get_participants()
    participation = None
    for p in tmp:
        if p['account'] == acc:
            participation = p
            break
    # getting 404
    if not participation:
        raise Http404
    return participation


class EventListView(generics.ListCreateAPIView):
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    def post(self, request):
        self.serializer_class = EventPostSerializer
        return super(EventListView, self).post(request)


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    def put(self, request, pk):
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).put(request, pk)

    def patch(self, request, pk):
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).patch(request, pk)


class ParticipantListView(views.APIView):
    def get(self, req, event_pk, format=None):
        e = get_event(event_pk)
        ps = ParticipationSerializer(e.get_participants(), many=True,
                                     context={'request': req})
        return Response(ps.data)

    def post(self, req, event_pk, format=None):
        """
        Expect array, like: [{"rate": 1, "account": 1}, ...]. Account contains
        pk.
        """
        ser = ParticipationPostSerializer(data=req.data,
                                          context={'request': req}, many=True)
        if ser.is_valid():
            newbies = {}
            for p in ser.validated_data:
                newbies.update({p['account']: p['rate']})
            print(newbies)
            e = get_event(event_pk)
            e.add_participants(newbies)
            return Response(ParticipationSerializer(e.get_participants()).data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantDetail(views.APIView):
    def get(self, req, event_pk, pk):
        e = get_event(event_pk)
        p = get_participation(e, pk)

        return Response(
            ParticipationSerializer(p, context={'request': req}).data
        )

    def delete(self, req, event_pk, pk):
        e = get_event(event_pk)
        p = get_participation(e, pk)
        e.remove_participants([p['account']])
        return Response(status=status.HTTP_204_NO_CONTENT)