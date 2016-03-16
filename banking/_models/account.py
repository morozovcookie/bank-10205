# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from django.contrib.auth.models import User

from banking.operations.domain.event import sawn


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

    def push_money(self, count):
        """Account push money to bank. Distribute count on debted events (older
        event filled firstly."""
        from .transfer import Transfer
        from .transaction import Transaction

        t = Transfer(account=self, direction="IN", count=count)
        t.save()
        # get events with positive balance. Substract debit from credit, 'couze
        # we need event balance. Event 'health' is credit(account fill this
        # with participation). Debit - is damage(account pay to event).
        events = [tt.event for tt in
                  Transaction.objects.filter(account=self)
                  .annotate(unpayed=F('credit') - F('debit'))
                  .filter(unpayed__gt=0)
                  .values('event')
                  .order_by('event__date').distinct()]

        sawn(count, self, events)

    def out_money(self, count):
        """account call to get money from the bank. Make every effort that he did
        not do this(joke)."""
        from .transfer import Transfer
        if self.balance() > count:
            t = Transfer(account=self, direction="OUT", count=count)
            t.save()

    def balance(self):
        from .transfer import Transfer
        from .transaction import Transaction

        res = float(Transaction.objects.filter(account=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)
        res += float(Transfer.objects.filter(account=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)

        return res

    def __str__(self):
        return self.user.__str__()
