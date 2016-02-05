from rest_framework import serializers
from banking.models import Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        field = ('name', 'date', 'price')
