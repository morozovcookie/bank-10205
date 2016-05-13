# -*- coding: utf-8 -*-

from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient


class AuthenticationTest(TestCase):
    def setUp(self):
        self.factory = APIClient()

        # fixtures

        self.reg_data = {
            'username': 'TestUser',
            'password': 'raw',
            'first_name': 'Test',
            'last_name': 'User',
            'is_superuser': False,
        }
        self.username = 'Registred'
        self.password = 'password'
        # we need registered user in tests
        self.register({
            'username': self.username,
            'password': self.password,
            'first_name': 'Test',
            'last_name': 'User',
            'is_superuser': False,
        })

    def register(self, udata):
        """Register user and return response."""
        response = self.factory.post('/api/users/', udata)
        return response

    def register_test(self):
        response = self.register(self.reg_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=response.content.decode('utf-8'))

    def wrong_credentials_test(self):
        response = self.factory.post('/api/auth/', {'username': 'SomeName',
                                                    'password': 'raw'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST,
                         msg=response.content.decode('utf-8'))

    def auth_created_user_test(self):
        response = self.factory.post('/api/auth/',
                                     {'username': self.username,
                                      'password': self.password})

        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=response.content.decode('utf-8'))

    def auth_response_test(self):
        pass
        response = self.factory.post('/api/auth/',
                                     {'username': self.username,
                                      'password': self.password})

        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=response.content.decode('utf-8'))
