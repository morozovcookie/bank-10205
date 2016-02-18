from rest_framework import serializers

from django.contrib.auth.models import User
from banking.models import Account


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_superuser')


class AccountSerializer(serializers.ModelSerializer):
    user = UserDataSerializer(many=False)

    class Meta:
        model = Account
        fields = ('rate', 'user')


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer(many=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_superuser',
                  'account')
