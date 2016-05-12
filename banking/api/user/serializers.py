from rest_framework import serializers

from django.contrib.auth.models import User
from banking.models import Account


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_superuser')


class AccountPostSerializer(serializers.Serializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    is_superuser = serializers.BooleanField()
    password = serializers.CharField()


class AccountSerializer(serializers.ModelSerializer):
    user = UserDataSerializer(many=False)

    def create(self, validated_data):
        """Fix creation of nested User model."""
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        account = Account.objects.create(user=user, **validated_data)
        return account

    class Meta:
        model = Account
        fields = ('rate', 'user')


class UserSerializer(serializers.ModelSerializer):
    account = AccountSerializer(many=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'is_superuser',
                  'account')


class PaymentSerializer(serializers.Serializer):
    income = serializers.BooleanField()
    count = serializers.FloatField()

    def validate_count(self, count):
        if count <= 0:
            raise serializers.ValidationError("Blog post is not about Django")
        return count
