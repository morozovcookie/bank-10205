from rest_framework import serializers
from banking.models import Event


class EventSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(many=False)

    class Meta:
        model = Event
        field = ('id', 'name', 'date', 'price', 'author')
