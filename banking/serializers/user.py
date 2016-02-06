from rest_framework import serializers

from django.contrib.auth.models import User
from banking.models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('rate',)


class UserSerializer(serializers.ModelSerializer):
    acc = AccountSerializer(many=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_superuser',
                  'acc')
