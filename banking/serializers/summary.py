
from rest_framework import serializers


class DebtSerializer(serializers.Serializer):
    """ Return user debts row. Use events, of some user
    """
    event =
    pass


class UserRowSerializer(serializers.Serializer):
    """
    Gets map {account: banking.models.Account, debts: DebtSerializer} and do
    that work.
    """
    id = serializers.IntegerField(source='account.id')
    username = serializers.CharField(source='account.user.username')
    balance = serializers.IntegerField(source='account.balance')
    debts = DebtSerializer(source='debts', many=True)


class SummarySerializer(serializers.Serializer):
    users = serializers.AccountSerializer(source='users', many=True)
    events = serializers.EventSerializer(source='events', many=True)
