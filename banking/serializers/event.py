from rest_framework import serializers
from banking.models import Event, Account


class EventSerializer(serializers.ModelSerializer):
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
        many=False, view_name='user-detail', queryset=Account.objects.all())


class EventFullSerializer(EventSerializer):
    """ Extended with participants list."""
    participants = ParticipationSerializer(many=True,
                                           source='get_participants')

    class Meta(EventSerializer.Meta):
        fields = ('name', 'date', 'price', 'author', 'private', 'participants')
