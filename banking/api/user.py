from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ParseError
from rest_framework import status

from django.contrib.auth.models import User

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

class UserAuth(APIView):
    def get(self, request, format=None):
        return Response({
            'detail': 'GET Response'
        })
        
    def post(self, request, format=None):
        try:
            data = request.DATA
        except ParseError as error:
            return Response(
                'Invalid JSON - {0}'.format(error.detail),
                status=status.HTTP_400_BAD_REQUEST
            )
        if 'user' not in data or 'password' not in data:
            return Response(
                'Wrong credentials',
                status=status.HTTP_401_UNAUTHORIZED
            )
        user = User.objects.first()
        if not user:
            return Response(
                'No default user, please create one',
                status=status.HTTP_404_NOT_FOUND
            )
        token = Token.objects.get_or_create(user=user)
        return Response({
            'detail': 'POST answer',
            'token': token[0].key
        })

'''
from django.contrib.auth import login, logout
from django.contrib.auth.models import User

from django.http import Http404

class UserAuth(APIView):
    authentication_classes = (
        QuietBasicAuthentication,
    )
    
    def post(self, request, *args, **kwargs):
        login(request, request.user)
        return Response(UserSerializer(request.user).data)
        
    def delete(self, request, *args, **kwargs):
        logout(request)
        return Response({})
'''