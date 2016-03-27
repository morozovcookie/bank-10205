from django.contrib.auth.models import User
from django.test import TestCase

from banking.models import Event, Account, Transaction, Transfer, Participation
from banking.operations.domain.event import get_participants,\
    add_participants, remove_participants


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


def generate_participation(ids=None):
    from random import randint

    eprice = 3000
    parts = [1, 2, 3, 4, 0.5, 1.5]

    e = Event.objects.get(name="Target")
    users = Account.objects.filter(user__username__iregex=r'^P\d$')

    # generate participation
    participation = dict()
    # random count
    if ids is None:
        ids = []
        for i in range(0, randint(1, 6)):  # random count
            ids.append(randint(0, 5))  # random accounts

    for i in ids:
        participation[users[i]] = parts[i]

    if ids is None:
        print_list(participation, "used participants")

    add_participants(e, participation)

    party_pay =\
        eprice / sum(participation.values())

    return (e, party_pay, participation,)


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
        p1 = Account.objects.get(user__username="P1")
        e = Event.objects.get(name="test")
        #########################################
        Transfer.objects.create(account=p1, debit=100)
        Transfer.objects.create(account=p1, debit=300)
        Transfer.objects.create(account=p1, debit=400)

        p = Participation(account=p1, event=e)
        p.save()
        Transaction.objects.create(participation=p, credit=200)
        Transaction.objects.create(participation=p, debit=300)
        #########################################
        self.assertEqual(p1.balance(), 900)


class EventParticipationTest(TestCase):
    ubalance = 3000
    eprice = 3000
    rates = [1, 1, 1, 1, 0.5, 0.5]
    parts = [1, 2, 3, 4, 0.5, 1.5]

    def setUp(self):
        a = User.objects.create(username="Author")
        author = Account.objects.create(user=a, rate=0.0)

        Event.objects.create(name="Target", price=self.eprice, author=author)

        u1 = User.objects.create(username="P0")
        u2 = User.objects.create(username="P1")
        u3 = User.objects.create(username="P2")
        u4 = User.objects.create(username="P3")
        u5 = User.objects.create(username="P4")
        u6 = User.objects.create(username="P5")
        p1 = Account.objects.create(user=u1)
        p2 = Account.objects.create(user=u2)
        p3 = Account.objects.create(user=u3)
        p4 = Account.objects.create(user=u4)
        p5 = Account.objects.create(user=u5)
        p6 = Account.objects.create(user=u6)

        users = [p1, p2, p3, p4, p5, p6]

        for u in users:
            Transfer.objects.create(account=u, debit=self.ubalance)

    # When user participate in event(1part).
    def test_single_participation(self):
        e, party_pay, participation = generate_participation([1])
        u = list(participation.keys())[0]

        self.assertEqual(u.balance(), 0)
        self.assertEqual(e.rest(), 0)
        print("END test_single_participation")

    # When user participate in event, where someone already participated.
    # Should create Transactions for each participant on each new
    # participation. Should increace balance of already participated user.
    def test_multiple_participation(self):

        e = Event.objects.get(name="Target")
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        #########################################
        add_participants(e, {
            users[0]: 1,
            users[1]: 1,
            users[2]: 1,
            users[3]: 1
        })

        #########################################
        party_pay = self.eprice / (len(users) - 2)

        self.assertEqual(users[0].balance(), self.ubalance - party_pay)
        self.assertEqual(users[1].balance(), self.ubalance - party_pay)
        self.assertEqual(users[2].balance(), self.ubalance - party_pay)
        self.assertEqual(users[3].balance(), self.ubalance - party_pay)

    def test_multiple_participation_with_different_parts(self):
        e, party_pay, _ = generate_participation(list(range(0, 4)))
        users = Account.objects.filter(user__username__iregex=r'^P\d$')
        print(Transaction.objects.all())

        self.assertEqual(e.rest(), 0)

        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.parts[0])
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.parts[1])
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.parts[2])
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.parts[3])

    def test_diff_parts_rates(self):
        e, party_pay, _ = generate_participation([0, 1, 4, 5])
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        print_list(Transaction.objects.all())

        self.assertEqual(e.rest(), 0)

        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.parts[0])
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.parts[1])
        self.assertEqual(users[4].balance(),
                         self.ubalance - party_pay * self.parts[4])
        self.assertEqual(users[5].balance(),
                         self.ubalance - party_pay * self.parts[5])

    # Participation in event, where exists participants.
    def test_recalc_debt(self):
        e, _, _ = generate_participation([0, 1, 4, 5])
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        print_list(Transaction.objects.all())

        newbies = {
            users[2]: self.parts[2],
            users[3]: self.parts[3],
        }
        u1_old_balance = users[0].balance()
        u2_old_balance = users[1].balance()

        #########################################
        add_participants(e, newbies)
        #########################################

        print_list(Transaction.objects.all())

        party_pay =\
            self.eprice / sum(self.parts)

        # event should be closed
        self.assertEqual(e.rest(), 0)
        self.assertLess(u1_old_balance, users[0].balance())
        self.assertLess(u2_old_balance, users[1].balance())
        # get from each participant summary only his party-pay
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.parts[0])
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.parts[1])
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.parts[2])
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.parts[3])
        self.assertEqual(users[4].balance(),
                         self.ubalance - party_pay * self.parts[4])
        self.assertEqual(users[5].balance(),
                         self.ubalance - party_pay * self.parts[5])

    # When some participation leave event, other split his debt.
    def test_recalc_debt_outcomers(self):
        e, _, participation = generate_participation(list(range(0, 6)))
        users = list(participation.keys())

        print_list(Transaction.objects.all())

        outcomers = [
            users[4],
            users[5]
        ]
        u1_old_balance = users[0].balance()
        u2_old_balance = users[1].balance()

        #########################################
        remove_participants(e, outcomers)
        #########################################

        print_list(Transaction.objects.all())

        # event should be closed
        self.assertEqual(e.rest(), 0)
        self.assertGreater(u1_old_balance, users[0].balance())
        self.assertGreater(u2_old_balance, users[1].balance())

        party_pay =\
            self.eprice / (self.parts[0] + self.parts[1]
                           + self.parts[2] + self.parts[3])
        # get from each participant summary only his party-pay
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.parts[0])
        self.assertEqual(users[1].balance(),
                         self.ubalance - party_pay * self.parts[1])
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.parts[2])
        self.assertEqual(users[3].balance(),
                         self.ubalance - party_pay * self.parts[3])

    def test_remove_unparticipated(self):
        e, _, _ = generate_participation([0, 4, 3])
        users = Account.objects.filter(user__username__iregex=r'^P\d$')

        oldts_count = Transaction.objects.all().count()

        #########################################
        remove_participants(e, [users[1], users[2]])
        #########################################

        print_list(Transaction.objects.all(), this_func_name())

        self.assertEqual(get_participants(e).count(), 3)
        self.assertEqual(get_participants(e)[0]['account'], users[0])
        # Transactions should be not changed
        self.assertEqual(oldts_count, Transaction.objects.all().count())

    def test_sway_participants(self):
        e, _, participation = generate_participation([0, 1, 2])
        print_list(Transaction.objects.all(), "ADDED users 1, 2, 3")

        users = list(participation.keys())

        #########################################
        # Check that event in balance
        self.assertEqual(e.rest(), 0)

        remove_participants(e, [users[0], users[1]])
        print_list(Transaction.objects.all(), "REMOVE users 1, 2")
        self.assertEqual(e.rest(), 0)

        add_participants(e, {users[0]: self.parts[0]})
        print_list(Transaction.objects.all(), "RETURNED user 1")
        self.assertEqual(e.rest(), 0)
        #########################################

        # unparticipated, not lose money
        self.assertEqual(users[1].balance(), self.ubalance)

        # recalc party_pay, because participants changed
        # users debts only on participation list
        party_pay =\
            self.eprice / (self.parts[0] + self.parts[2])
        self.assertEqual(users[0].balance(),
                         self.ubalance - party_pay * self.parts[0])
        self.assertEqual(users[2].balance(),
                         self.ubalance - party_pay * self.parts[2])
