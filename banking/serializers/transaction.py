from rest_framework import serializers
from banking.models import Transaction


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        read_only = True
