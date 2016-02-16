from rest_framework import serializers
from banking.models import Event
from banking.serializers.user import AccountSerializer


class EventSerializer(serializers.ModelSerializer):
    #  fix author field. Show its str representation(__str__ in account)
    #  instead pk.
    author = serializers.StringRelatedField(many=False)

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private')


class EventFullSerializer(EventSerializer):
    """ Extended with participants list."""
    participants = AccountSerializer(many=True, source='get_participants')

    class Meta(EventSerializer.Meta):
        fields = ('name', 'date', 'price', 'author', 'private', 'participants')
