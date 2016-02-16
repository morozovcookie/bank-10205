from rest_framework import serializers
from banking.models import Event, Account
from banking.serializers.user import AccountSerializer


class EventSerializer(serializers.ModelSerializer):
    #  fix author field. Show its str representation(__str__ in account)
    #  instead pk.
    author = serializers.HyperlinkedRelatedField(
        many=False, view_name='user-detail', queryset=Account.objects.all())

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private')


class ParticipationSerializer(serializers.Serializer):
    rate = serializers.IntegerField()
    account = serializers.HyperlinkedRelatedField(
        many=False, view_name='user-detail', queryset=Account.objects.all())


class EventFullSerializer(EventSerializer):
    """ Extended with participants list."""
    participants = ParticipationSerializer(many=True,
                                           source='get_participants')

    class Meta(EventSerializer.Meta):
        fields = ('name', 'date', 'price', 'author', 'private', 'participants')
