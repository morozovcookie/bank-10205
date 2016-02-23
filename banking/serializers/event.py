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
    id = serializers.IntegerField(source='account.id')
    parts = serializers.IntegerField()
    username = serializers.CharField(source='account.user.username')
    rate = serializers.IntegerField(source='account.rate')
    is_superuser = serializers.BooleanField(source='account.user.is_superuser')
    first_name = serializers.CharField(source='account.user.first_name')
    last_name = serializers.CharField(source='account.user.last_name')
    url = serializers.HyperlinkedRelatedField(source='account',
        read_only=True, many=False, view_name='account-detail')


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
