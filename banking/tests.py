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
        """ When user have transfers and transactions."""
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
    ubalance = 3000
    eprice = 3000
    u1_r = 1
    u2_r = 1
    u3_r = 0.5
    u4_r = 0.5
    u1_p = 1
    u2_p = 2
    u3_p = 3
    u4_p = 4
    party_pay = eprice / (u1_r + u2_r + u3_r + u4_r)

    def setUp(self):
        a = User.objects.create(username="Author")
        Event.objects.create(name="Target", price=self.eprice, author=a)

        p1 = User.objects.create(username="P1", rate=self.u1_r)
        p2 = User.objects.create(username="P2", rate=self.u2_r)
        p3 = User.objects.create(username="P3", rate=self.u3_r)
        p4 = User.objects.create(username="P4", rate=self.u4_r)
        users = [p1, p2, p3, p4]

        for u in users:
            Transfer.objects.create(user=u, debit=self.ubalance)

    def test_single_participation(self):
        """ When user participate in event(1part)."""
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
        participation. Should increace balance of already participated user."""

        e = Event.objects.get(name="Target")
        users = User.objects.filter(username__iregex=r'^P\d$')
        #########################################
        e.add_participants({
            users[0]: 1,
            users[1]: 1,
            users[2]: 1,
            users[3]: 1
        })

        print(users)
        #########################################
        self.assertEqual(len(Transaction.objects.filter(user=users[0])), 4)
        self.assertEqual(len(Transaction.objects.filter(user=users[1])), 3)
        self.assertEqual(len(Transaction.objects.filter(user=users[2])), 2)
        self.assertEqual(len(Transaction.objects.filter(user=users[3])), 1)

        self.assertEqual(users[0].balance(), self.ubalance - self.party_pay * self.u1_r)
        self.assertEqual(users[1].balance(), self.ubalance - self.party_pay * self.u2_r)
        self.assertEqual(users[2].balance(), self.ubalance - self.party_pay * self.u3_r)
        self.assertEqual(users[3].balance(), self.ubalance - self.party_pay * self.u4_r)

    def test_multiple_participation_with_different_parts(self):
        """ When calculating debt with participation-parts value."""
        e = Event.objects.get(name="Target")
        users = User.objects.filter(username__iregex=r'^P\d$')
        #########################################
        e.add_participants({
            users[0]: self.u1_p,
            users[1]: self.u2_p,
            users[2]: self.u3_p,
            users[3]: self.u4_p
        })
        #########################################
        self.assertEqual(len(Transaction.objects.filter(user=users[0])), 4)
        self.assertEqual(len(Transaction.objects.filter(user=users[1])), 3)
        self.assertEqual(len(Transaction.objects.filter(user=users[2])), 2)
        self.assertEqual(len(Transaction.objects.filter(user=users[3])), 1)

        party_pay = self.eprice / ( self.u1_p + self.u2_p + self.u3_p + self.u4_p )
        self.assertEqual(users[0].balance(), self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[1].balance(), self.ubalance - party_pay * self.u2_p * self.u2_r)
        self.assertEqual(users[2].balance(), self.ubalance - party_pay * self.u3_p * self.u3_r)
        self.assertEqual(users[3].balance(), self.ubalance - party_pay * self.u4_p * self.u4_r)
