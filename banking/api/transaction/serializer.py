from rest_framework import serializers


class TransactionReadViewSerializer(serializers.Serializer):
    """ ReadOnly serializer for frontend views."""
    def to_representation(self, obj):
        return {
            "id": obj.id,
            "type": obj.type_view(),
            "date": obj.date,
            "summ": float(obj.debit - obj.credit),
            "account": obj.participation.account.user.username,
            "event": obj.participation.event.name,
            "parts": obj.participation.parts,
        }
