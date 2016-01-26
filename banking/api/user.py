from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ParseError
from rest_framework import status

from django.contrib.auth.models import User

class TestView(APIView):
    def get(self, request, format=None):
        return Response({
            'detail': "GET Response"
        })
        
    def post(self, request, format=None):
        try:
            data = request.DATA
        except ParseError as error:
            return Response(
                'Invalid JSON - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'username' not in data or 'password' not in data:
            return Response(
                'Wrong credentials',
                status=status.HTTP_401_UNAUTHORIZED
            )
        user = User.objects.get(username=data['username'])
        if not user or not user.check_password(data['password']):
            return Response(
                'No default user, please create one',
                status=status.HTTP_404_NOT_FOUND
            )
        token = Token.objects.get_or_create(user=user)
        return Response({
            'detail': 'POST answer',
            'token': token[0].key
        })
        
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class AuthView(APIView):
    authentication_classes = (
        TokenAuthentication,
    )
    permission_classes = (
        IsAuthenticated,
    )
    
    def get(self, request, format=None):
        return Response({
            'detail': 'I suppose you are authenticated'
        })