from django.test import TestCase

from .models import Event, User, Transaction, Transfer


class UserBalanceTest(TestCase):
    def setUp(self):
        User.objects.create(username="P1", rate=1)

    def test_transfer_sould_up_balance(self):
        p1 = User.objects.get(username="P1")

        Transfer.objects.create(user=p1, debit=100)
        Transfer.objects.create(user=p1, debit=300)
        Transfer.objects.create(user=p1, debit=400)

        self.assertEqual(p1.balance(), 800)
