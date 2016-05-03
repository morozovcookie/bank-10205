# -*- coding: utf-8 -*-

from django.test import TestCase

from rest_framework import status
from rest_framework.test import APIClient


class AuthenticationTest(TestCase):
    def setUp(self):
        self.factory = APIClient()

    def test_register(self):
        response = self.factory.post('/api/users/',
                                     {
                                         'username': 'TestUser',
                                         'password': 'raw',
                                         'first_name': 'Test',
                                         'last_name': 'User',
                                         'is_superuser': False,
                                     })

        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=response.content)

    def test_wrong_credentials(self):
        response = self.factory.post('/api/auth/', {'username': 'SomeName',
                                                    'password': 'raw'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST,
                         msg=response.content)

    def test_auth_created_user(self):
        username = 'TestUser'
        raw_password = 'raw'
        response = self.factory.post('/api/users/',
                                     {
                                         'username': username,
                                         'password': raw_password,
                                         'first_name': 'Test',
                                         'last_name': 'User',
                                         'is_superuser': False,
                                     })

        data = response.content.decode('utf-8')

        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=data)

        response = self.factory.post('/api/auth/', {'username': username,
                                                    'password': raw_password})

        self.assertEqual(response.status_code, status.HTTP_200_OK,
                         msg=response.content.decode('utf-8'))
