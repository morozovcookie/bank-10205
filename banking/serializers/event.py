from rest_framework import serializers
from banking.models import Event
# from banking.serializers.user import AccountSerializer


class EventSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(many=False)
    # participants = AccountSerializer(many=True, source='get_participants')

    class Meta:
        model = Event
        field = (
            'id', 'name', 'date', 'price', 'author',  # 'participants'
        )
