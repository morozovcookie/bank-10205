from django.test import TestCase

from .models import Event, Account, Transaction, Transfer
from django.contrib.auth.models import User


def this_func_name():
    import inspect
    # first dimension - stack funcs. 0 - current, 1 - this func caller.
    # second don't know. 3 - is func name.
    return inspect.stack()[1][3]


def print_fn_bord(fn):
    h = " RUN %s " % fn.__name__
    f = " END %s " % fn.__name__

    def wrap(*args, **kwargs):
        fn(*args, **kwargs)
    return print_borders(fn=wrap, header=h, footer=f)


def print_borders(char, count):
    def funcer(fn):
        def wrap(*args, **kwargs):
            print(char * count)
            fn(*args, **kwargs)
            print(char * count)
        return wrap
    return funcer


@print_borders('━', 80)
def print_list(l, header=None):
    """Show list with header + footer """
    if header:
        print(header)
        print('~' * len(header))
    for e in l:
        print(e)


class AccountBalanceTest(TestCase):
    def setUp(self):
        p1 = User.objects.create(username="P1")
        author = User.objects.create(username="Author")
        Account.objects.create(user=p1, rate=1)
        a = Account.objects.create(user=author, rate=0)
        Event.objects.create(name="test", price=1000, author=a)

    def test_transfer_sould_up_balance(self):
        p1 = Account.objects.get(user__username="P1")

        Transfer.objects.create(account=p1, debit=100)
        Transfer.objects.create(account=p1, debit=300)
        Transfer.objects.create(account=p1, debit=400)

        self.assertEqual(p1.balance(), 800)

    def test_transactions_change_balance(self):
        """ When user have transfers and transactions."""
        p1 = Account.objects.get(user__username="P1")
        e = Event.objects.get(name="test")
        #########################################
        Transfer.objects.create(account=p1, debit=100)
        Transfer.objects.create(account=p1, debit=300)
        Transfer.objects.create(account=p1, debit=400)
        Transaction.objects.create(account=p1, event=e, credit=200)
        Transaction.objects.create(account=p1, event=e, debit=300)
        #########################################
        self.assertEqual(p1.balance(), 900)


class EventParticipationTest(TestCase):
    ubalance = 3000
    eprice = 3000
    u1_r = 1
    u2_r = 1
    u3_r = 1
    u4_r = 1
    u5_r = 0.5
    u6_r = 0.5
    u1_p = 1
    u2_p = 2
    u3_p = 3
    u4_p = 4
    u5_p = 1
    u6_p = 1.5

    def setUp(self):

        a = User.objects.create(username="Author")
        author = Account.objects.create(user=a, rate=0.0)

        Event.objects.create(name="Target", price=self.eprice, author=author)

        u1 = User.objects.create(username="P1")
        u2 = User.objects.create(username="P2")
        u3 = User.objects.create(username="P3")
        u4 = User.objects.create(username="P4")
        u5 = User.objects.create(username="P5")
        u6 = User.objects.create(username="P6")
        p1 = Account.objects.create(user=u1, rate=self.u1_r)
        p2 = Account.objects.create(user=u2, rate=self.u2_r)
        p3 = Account.objects.create(user=u3, rate=self.u3_r)
        p4 = Account.objects.create(user=u4, rate=self.u4_r)
        p5 = Account.objects.create(user=u5, rate=self.u5_r)
        p6 = Account.objects.create(user=u6, rate=self.u6_r)

        users = [p1, p2, p3, p4, p5, p6]

        for u in users:
            Transfer.objects.create(account=u, debit=self.ubalance)

    def test_single_participation(self):
        """ When user participate in event(1part)."""
        e = Event.objects.get(name="Target")
        u = Account.objects.get(user__username="P1")

        #########################################
        e.add_participants({u: 1})
        #########################################

        self.assertEqual(u.balance(), 0)
        self.assertEqual(e.rest(), 0)
        print("END test_single_participation")

    def test_multiple_participation(self):
        """ When user participate in event, where someone already participated.
        Should create Transactions for each participant on each new
        participation. Should increace balance of already participated user."""

        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        #########################################
        e.add_participants({
            users[0]: 1,
            users[1]: 1,
            users[2]: 1,
            users[3]: 1
        })

        #########################################
        self.assertEqual(len(Transaction.objects.filter(account=users[0])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[1])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[2])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[3])), 1)

        party_pay = self.eprice / (len(users) - 2)

        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_r)
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.u2_r)
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.u3_r)
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.u4_r)

    def test_multiple_participation_with_different_parts(self):
        """ When calculating debt with participation-parts value."""
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        participation = {
            users[0]: self.u1_p,
            users[1]: self.u2_p,
            users[2]: self.u3_p,
            users[3]: self.u4_p
        }

        #########################################
        e.add_participants(participation)
        #########################################

        self.assertEqual(len(Transaction.objects.filter(account=users[0])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[1])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[2])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[3])), 1)

        print(Transaction.objects.all())
        party_pay =\
            self.eprice / (self.u1_p * self.u1_r + self.u2_p * self.u2_r
                           + self.u3_p * self.u3_r + self.u4_p * self.u4_r)

        self.assertEqual(e.rest(), 0)

        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.u2_p * self.u2_r)
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.u3_p * self.u3_r)
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.u4_p * self.u4_r)

    def test_diff_parts_rates(self):
        """ Different parts counts, and user rates."""
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        participation = {
            users[0]: self.u1_p,
            users[1]: self.u2_p,
            users[4]: self.u5_p,
            users[5]: self.u6_p
        }

        #########################################
        e.add_participants(participation)
        #########################################

        self.assertEqual(len(Transaction.objects.filter(account=users[0])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[1])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[4])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[5])), 1)

        party_pay =\
            self.eprice / (self.u1_p * self.u1_r + self.u2_p * self.u2_r
                           + self.u5_p * self.u5_r + self.u6_p * self.u6_r)

        print_list(Transaction.objects.all())

        self.assertEqual(e.rest(), 0)

        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.u2_p * self.u2_r)
        self.assertEqual(users[4].balance(),
                         self.ubalance - party_pay * self.u5_p * self.u5_r)
        self.assertEqual(users[5].balance(),
                         self.ubalance - party_pay * self.u6_p * self.u6_r)

    def test_recalc_debt(self):
        """ Participation in event, where exists participants."""
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        participation = {
            users[0]: self.u1_p,
            users[1]: self.u2_p,
            users[4]: self.u5_p,
            users[5]: self.u6_p
        }
        e.add_participants(participation)

        print_list(Transaction.objects.all())

        newbies = {
            users[2]: self.u3_p,
            users[3]: self.u4_p,
        }
        u1_old_balance = users[0].balance()
        u2_old_balance = users[1].balance()

        #########################################
        e.add_participants(newbies)
        #########################################

        print_list(Transaction.objects.all())
        # newbies should have only one transact
        self.assertEqual(len(Transaction.objects.filter(account=users[2])), 1)
        self.assertEqual(len(Transaction.objects.filter(account=users[3])), 1)

        # odliers should have +1 recalc transaction
        self.assertEqual(len(Transaction.objects.filter(account=users[0])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[1])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[4])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[5])), 2)

        party_pay =\
            self.eprice / (self.u1_p * self.u1_r + self.u2_p * self.u2_r
                           + self.u3_p * self.u3_r + self.u4_p * self.u4_r
                           + self.u5_p * self.u5_r + self.u6_p * self.u6_r
                           )

        # event should be closed
        self.assertEqual(e.rest(), 0)
        self.assertLess(u1_old_balance, users[0].balance())
        self.assertLess(u2_old_balance, users[1].balance())
        # get from each participant summary only his party-pay
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.u2_p * self.u2_r)
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.u3_p * self.u3_r)
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.u4_p * self.u4_r)
        self.assertEqual(users[4].balance(),
                         self.ubalance - party_pay * self.u5_p * self.u5_r)
        self.assertEqual(users[5].balance(),
                         self.ubalance - party_pay * self.u6_p * self.u6_r)

    def test_recalc_debt_outcomers(self):
        """When some participation leave event, other split his debt."""
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        participation = {
            users[0]: self.u1_p,
            users[1]: self.u2_p,
            users[2]: self.u3_p,
            users[3]: self.u4_p,
            users[4]: self.u5_p,
            users[5]: self.u6_p,
        }
        e.add_participants(participation)

        print_list(Transaction.objects.all())

        outcomers = [
            users[4],
            users[5]
        ]
        u1_old_balance = users[0].balance()
        u2_old_balance = users[1].balance()

        #########################################
        e.remove_participants(outcomers)
        #########################################

        print_list(Transaction.objects.all())

        self.assertEqual(len(Transaction.objects.filter(account=users[0])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[1])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[2])), 2)
        self.assertEqual(len(Transaction.objects.filter(account=users[3])), 2)

        # event should be closed
        self.assertEqual(e.rest(), 0)
        self.assertGreater(u1_old_balance, users[0].balance())
        self.assertGreater(u2_old_balance, users[1].balance())

        party_pay =\
            self.eprice / (self.u1_p * self.u1_r + self.u2_p * self.u2_r
                           + self.u3_p * self.u3_r + self.u4_p * self.u4_r)
        # get from each participant summary only his party-pay
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.u2_p * self.u2_r)
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.u3_p * self.u3_r)
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.u4_p * self.u4_r)
        self.assertEqual(Transaction.objects.filter(account=users[4]).count(),
                         0)
        self.assertEqual(Transaction.objects.filter(account=users[5]).count(),
                         0)

    def test_remove_unparticipated(self):
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        participation = {
            users[0]: self.u1_p,
            users[4]: self.u5_p,
            users[3]: self.u4_p,
        }
        e.add_participants(participation)

        oldts_count = Transaction.objects.all().count()

        #########################################
        e.remove_participants([users[1], users[2]])
        #########################################

        print_list(Transaction.objects.all(), this_func_name())

        self.assertEqual(e.get_participants().count(), 3)
        self.assertEqual(e.get_participants()[0]['account'], users[0])
        # Transactions should be not changed
        self.assertEqual(oldts_count, Transaction.objects.all().count())

    def test_sway_participants(self):
        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        # Check that event in balance
        #########################################
        e.add_participants({users[0]: self.u1_p,
                            users[1]: self.u2_p,
                            users[2]: self.u3_p})
        print_list(Transaction.objects.all(), "ADDED users 1, 2, 3")
        self.assertEqual(e.rest(), 0)

        e.remove_participants([users[0], users[1]])
        print_list(Transaction.objects.all(), "REMOVE users 1, 2")
        self.assertEqual(e.rest(), 0)

        e.add_participants({users[0]: self.u1_p})
        print_list(Transaction.objects.all(), "RETURNED user 1")
        self.assertEqual(e.rest(), 0)
        #########################################

        # unparticipated, not lose money
        self.assertEqual(users[1].balance(), self.ubalance)

        # users debts only on participation list
        party_pay =\
            self.eprice / (self.u1_p * self.u1_r + self.u3_p * self.u3_r)
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.u1_p * self.u1_r)
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.u3_p * self.u3_r)
