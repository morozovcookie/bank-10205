from django.test import TestCase

from .models import Event, User, Transaction, Transfer


class UserBalanceTest(TestCase):
    def setUp(self):
        User.objects.create(username="P1", rate=1)
        a = User.objects.create(username="Author", rate=0)
        Event.objects.create(name="test", price=1000, author=a)

    def test_transfer_sould_up_balance(self):
        p1 = User.objects.get(username="P1")

        Transfer.objects.create(user=p1, debit=100)
        Transfer.objects.create(user=p1, debit=300)
        Transfer.objects.create(user=p1, debit=400)

        self.assertEqual(p1.balance(), 800)

    def test_transactions_change_balance(self):
        """ When user have transfers and transactions, money should have to be
        summed."""
        p1 = User.objects.get(username="P1")
        e = Event.objects.get(name="test")
        #########################################
        Transfer.objects.create(user=p1, debit=100)
        Transfer.objects.create(user=p1, debit=300)
        Transfer.objects.create(user=p1, debit=400)
        Transaction.objects.create(user=p1, event=e, credit=200)
        Transaction.objects.create(user=p1, event=e, debit=300)
        #########################################
        self.assertEqual(p1.balance(), 900)


class EventParticipationTest(TestCase):
    def setUp(self):
        a = User.objects.create(username="Author", rate=0)
        Event.objects.create(name="Target", price=3000, author=a)

        p1 = User.objects.create(username="P1", rate=1)
        p2 = User.objects.create(username="P2", rate=1)
        p3 = User.objects.create(username="P3", rate=0.5)
        p4 = User.objects.create(username="P4", rate=0.5)
        users = [p1, p2, p3, p4]

        for u in users:
            Transfer.objects.create(user=u, debit=3000)

    def test_single_participation(self):
        """ When user participate in event(1part), his balance should
        decreace."""
        e = Event.objects.get(name="Target")
        u = User.objects.get(username="P1")
        #########################################
        e.add_participant(u)
        #########################################
        self.assertEqual(u.balance(), 0)
        self.assertEqual(e.balance(), 0)

    def test_multiple_participation(self):
        """ When user participate in event, where someone already participated.
        Should create Transactions for each participant on each new
        participation.
        Should increace balance of already participated user."""
        raise NotImplementedError

        e = Event.objects.get(name="Target")
        users = User.objects.filter(username__iregex=r'^P\d$')
        #########################################
        for u in users:
            e.add_participant(u, 1)
        #########################################
        self.assertEqual(len(Transaction.objects.filter(user=users[0]), 4))
        self.assertEqual(len(Transaction.objects.filter(user=users[1]), 3))
        self.assertEqual(len(Transaction.objects.filter(user=users[2]), 2))
        self.assertEqual(len(Transaction.objects.filter(user=users[3]), 1))

    def test_multiple_participation_with_different_parts(self):
        """ When calculating debt participation-parts value should be
        consider."""
        raise NotImplementedError
