from django.http import Http404
from django.shortcuts import get_object_or_404

import django_filters

from rest_framework import views, status, generics, filters
from rest_framework.response import Response

from banking.models import Event, Account
from banking.operations.domain.event import get_participants,\
    remove_participants, add_participants

from .serializers import EventFullSerializer, EventPostSerializer,\
    ParticipationSerializer, ParticipationPostSerializer


def get_event(pk):
    """ Internal helper. Get event by pk or 404. """
    try:
        e = Event.objects.get(pk=pk)
        return e
    except Event.DoesNotExist:
        raise Http404


def get_participation(e, pk):
    """ Internal helper. Get participation dict, or 404.
    keys:
        account -- account object
        rate -- participation parts
    """
    acc = get_object_or_404(Account, pk=pk)
    tmp = get_participants(e)
    participation = None
    for p in tmp:
        if p['account'] == acc:
            participation = p
            break
    # getting 404
    if not participation:
        raise Http404
    return participation


class EventFilter(filters.FilterSet):
    max_price = django_filters.NumberFilter(name="price", lookup_type='gte')
    min_price = django_filters.NumberFilter(name="price", lookup_type='lte')
    author = django_filters.CharFilter(name='author__user__username')

    class Meta:
        model = Event
        fields = ['price', 'name', 'min_price', 'max_price', 'author']


class EventListView(generics.ListCreateAPIView):
    """ Show Event with participants list.  """
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = EventFilter

    def post(self, request):
        """ Create new event. Accept event data and array of participation. """
        self.serializer_class = EventPostSerializer
        print("EventListView::post:", request.data)
        return super(EventListView, self).post(request)

    def get_serializer_class(self, *args, **kwargs):
        """ Correctly show Serializer for different requests.
        In each req-type function, firstly changes the serializer. But swagger
        use this method, to get serializer class. In default realization it's
        just return self.serializer_class(EventFullSerializer)."""
        if self.request.method == 'POST':
            return EventPostSerializer
        else:
            return EventFullSerializer


class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    """ Show concrete event data.
    Similar for EventListView, but return single instance of Event.
    """
    model = Event
    serializer_class = EventFullSerializer
    queryset = Event.objects.all()

    def put(self, request, pk):
        """ Update event fields. Get all required event fields. """
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).put(request, pk)

    def patch(self, request, pk):
        """ Update single event field. Good for single field changes. """
        self.serializer_class = EventPostSerializer
        return super(EventDetail, self).patch(request, pk)

    # just for docs
    def delete(self, req, pk):
        """ [UTESTED] Remove event.
        Delete all it's participations and transactions. """
        return super(EventDetail, self).delete(req, pk)

    def get_serializer_class(self, *args, **kwargs):
        """ Correctly show Serializer for different requests. """
        if self.request.method in ['PATCH', 'PUT']:
            return EventPostSerializer
        else:
            return EventFullSerializer


class ParticipantListView(views.APIView):
    """
    View for non model entity - 'participation-row' - account + parts.
    Each participation determine how some account participate in some event.
    """
    def get(self, req, event_pk, format=None):
        """ Return participation entity for event: account link + parts """
        e = get_event(event_pk)
        ps = ParticipationSerializer(get_participants(e), many=True,
                                     context={'request': req})
        return Response(ps.data)

    def post(self, req, event_pk, format=None):
        """ Add participant to event in context.
        Expect array, like: [{"rate": 1, "account": 1}, ...]. account is pk.
        """
        ser = ParticipationPostSerializer(data=req.data,
                                          context={'request': req}, many=True)
        if ser.is_valid():
            newbies = {}
            for p in ser.validated_data:
                newbies.update({p['account']: p['parts']})
            e = get_event(event_pk)
            add_participants(e, newbies)
            return Response(ParticipationSerializer(get_participants(e),
                                                    context={'request': req},
                                                    many=True).data)
        return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)


class ParticipantDetail(views.APIView):
    """ Single Instance view for participation entity (accout + parts). """
    def get(self, req, event_pk, pk):
        """ Show concrete participation details. """
        e = get_event(event_pk)
        p = get_participation(e, pk)

        return Response(
            ParticipationSerializer(p, context={'request': req}).data
        )

    def delete(self, req, event_pk, pk):
        """ Remove participant from event. """
        e = get_event(event_pk)
        p = get_participation(e, pk)
        remove_participants(e, [p['account']])
        return Response(status=status.HTTP_204_NO_CONTENT)
