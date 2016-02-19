# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from .account import Account


class Event(models.Model):
    name = models.CharField(max_length=100, unique_for_date='date')
    date = models.DateField(auto_now_add=True, blank=False)
    price = models.FloatField()
    author = models.ForeignKey(Account)
    private = models.BooleanField(default=False)

    def from_template(self, t):
        self.name = t.name
        self.price = t.price
        self.author = t.author
        self.participants = t.participants
        self.private = t.private

    def get_participants(self):
        """Get participants of Event
        @return:  participants List of dicts, where keys: 'account', 'rate'.
        'rate' - is participation rate(parts).
        @rtype :  List
        """
        from banking.models import Transaction

        accs_rates = Transaction.objects.filter(event=self)\
            .values('account', 'rate').distinct()
        for p in accs_rates:
            p.update({'account': Account.objects.get(id=p['account'])})
        return accs_rates

    def add_participants(self, newbies):
        """Add participants in event. Takes dict, where keys - is account models
        and values is participation part(int)."""
        from banking.models import Transaction

        rated_parts = 0
        # get already participated users.
        # select account - for distinct, and next three for data
        old_trs = Transaction.objects.filter(event=self)\
            .values('account', 'account__rate', 'credit', 'rate')\
            .distinct()

        # Don't add participant, when he is already participated
        if old_trs.filter(account__in=list(newbies)).count() != 0:
            return

        # calc old rated-parts
        if old_trs.count() != 0:
            for t in old_trs:
                rated_parts += t['rate']

        for account, part in newbies.items():
            rated_parts += part

        party_pay = self.price / rated_parts

        # create for oldiers diff transactions
        if old_trs.count() != 0:
            for t in old_trs:
                acc = Account.objects.get(id=t['account'])
                new_price = party_pay * t['rate']
                diff = abs(t['credit'] - new_price)
                # Oldiers get little part back.
                newt = Transaction(event=self, debit=diff)
                newt.rate = t['rate']
                newt.account = acc
                newt.type = newt.DIFF
                newt.save()

        # create participation transactions
        for account, part in newbies.items():
            t = Transaction(account=account, event=self)
            t.rate = part
            t.credit = party_pay * t.rate
            t.type = t.PARTICIPATE
            t.save()

    def remove_participants(self, leavers):
        # check, that leaver is participated
        from banking.models import Transaction

        leavers = self.is_participated(leavers)
        if not leavers:
            return

        # get transacts with accs exclude leavers
        # calc party_pay
        # create diffs for selected
        # remove all transactions on leavers
        rest_trs = Transaction.objects.filter(event=self)\
            .exclude(account__in=leavers)\
            .values('account', 'account__rate', 'credit', 'rate')\
            .distinct()

        rated_parts = 0
        if rest_trs.count() != 0:
            for t in rest_trs:
                rated_parts += t['rate']

        party_pay = self.price / rated_parts

        # create for oldiers diff transactions
        if rest_trs.count() != 0:
            for t in rest_trs:
                acc = Account.objects.get(id=t['account'])
                new_price = party_pay * t['rate']
                diff = abs(t['credit'] - new_price)
                # Rest participants split leaver debt by between themselves.
                newt = Transaction(event=self, credit=abs(diff))
                newt.rate = t['rate']
                newt.account = acc
                newt.type = newt.DIFF
                newt.save()

        rm_trs = Transaction.objects.filter(event=self, account__in=leavers)
        rm_trs.delete()

    def rest(self):
        from banking.models import Transaction

        """ Return rest moneys, that not payed yet."""
        payed = Transaction.objects.filter(event=self)\
            .aggregate(balance=Sum(F('credit')-F('debit')))['balance']
        return self.price - (0 if payed is None else payed)

    def is_participated(self, accounts):
        """Check which accounts participated in event.

        @param accounts:  Accounts for checks
        @type  accounts:  Collection, that can used in Q object as field__in=[]

        @return:  Collection with accounts, that participated
        @rtype :  @type accounts
        """
        from banking.models import Transaction

        out = set()
        ts = Transaction.objects.filter(account__in=accounts)
        for t in ts:
            out.add(t.account)
        return out

    def __str__(self):
        return self.name
