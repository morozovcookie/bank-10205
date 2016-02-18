<<<<<<< HEAD
from rest_framework import serializers
from banking.entities.event import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        field = ('name', 'date', 'price')
=======
from rest_framework import serializers
from banking.models import Event, Account


class EventPostSerializer(serializers.ModelSerializer):
    """ Used for display event in POST, and PUT requests """
    author = serializers.PrimaryKeyRelatedField(required=True, many=False,
                                                queryset=Account.objects.all())

    def create(self, validated_data):
        """Create event from income data"""
        e = Event(**validated_data)
        e.save()
        return e

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private')


class ParticipationSerializer(serializers.Serializer):
    rate = serializers.IntegerField()
    account = serializers.HyperlinkedRelatedField(
        read_only=True, many=False, view_name='user-detail')


class EventFullSerializer(serializers.ModelSerializer):
    """ Extended with participants list."""
    participants = ParticipationSerializer(many=True,
                                           source='get_participants',
                                           read_only=True)
    author = serializers.StringRelatedField()

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private',
                  'participants')


class ParticipationPostSerializer(serializers.Serializer):
    rate = serializers.IntegerField()
    account = serializers.PrimaryKeyRelatedField(required=True, many=False,
                                                 queryset=Account.objects.all())
>>>>>>> dev
