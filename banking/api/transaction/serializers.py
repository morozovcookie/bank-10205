from rest_framework import serializers
from django.core.urlresolvers import reverse


class TransactionReadViewSerializer(serializers.Serializer):
    """ ReadOnly serializer for frontend views."""
    def to_representation(self, obj):
        event = obj.participation.event
        account = obj.participation.account
        return {
            "id": str(obj.id),
            "type": obj.type_view(),
            "date": obj.date.date().isoformat(),
            "summ": str(float(obj.debit - obj.credit)),
            "account": {
                "id": str(account.id),
                "name": account.user.username,
                "link": reverse('accounts') + str(account.id),
            },
            "event": {
                "id": event.name,
                "name": event.name,
                "link": reverse('events') + str(event.id),
            },
            "parts": obj.participation.parts,
        }
