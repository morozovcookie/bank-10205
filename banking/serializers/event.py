from rest_framework import serializers
from banking.entities.event import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        field = ('name', 'date', 'price')
