# -*- coding: utf-8 -*-

from django.test import TestCase
from django.contrib.auth.models import User

from rest_framework.test import APIClient

from banking.models import Account


class PaymentTest(TestCase):
    def setUp(self):
        self.factory = APIClient()
        u1 = User.objects.create(username="Tester")
        self.account = Account.objects.create(user=u1)
        self.url = '/api/users/%d/money/' % self.account.id

    def pushing_money_test(self):
        data = {"count": 3000, "income": True}
        res = self.factory.post(self.url, data, format='json')
        self.assertEqual(res.data, {"balance": 3000})

        self.assertEqual(self.account.balance(), 3000)

    def fetching_money_test(self):
        data = {'count': 3000, 'income': True}
        self.factory.post(self.url, data, format='json')
        data = {'count': 3000, 'income': False}
        res = self.factory.post(self.url, data, format='json')
        self.assertEqual(res.data, {"balance": 0})

        self.assertEqual(self.account.balance(), 0)

    def negative_count_test(self):
        data = {'count': -200, 'income': True}
        res = self.factory.post(self.url, data, format='json')
        self.assertEqual(res.status_code, 400)

    def zero_count_test(self):
        data = {'count': 0, 'income': True}
        res = self.factory.post(self.url, data, format='json')
        self.assertEqual(res.status_code, 400)
