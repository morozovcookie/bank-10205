from rest_framework import serializers
from banking.models import Event
from banking.serializers.user import AccountSerializer


class EventSerializer(serializers.ModelSerializer):
    #  fix author field. Show its str representation(__str__ in account)
    #  instead pk.
    author = serializers.StringRelatedField(many=False)

    class Meta:
        model = Event

class EventFullSerializer(EventSerializer):
    # append list of participants, getted from `get_participants()` method of
    # event.
    participants = AccountSerializer(many=True, source='get_participants')
