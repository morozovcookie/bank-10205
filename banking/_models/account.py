# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from django.contrib.auth.models import User

from banking.domain import sawn


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
            Transfer.objects.create(account=self, direction="OUT", count=count)

    def balance(self):
        from .transfer import Transfer
        from .transaction import Transaction

        def sum_query(field):
            return {field: Sum(F('debit') - F('credit'))}

        res = float(Transfer.objects.filter(account=self).
                    aggregate(**sum_query('sum'))['sum'] or 0)
        res += float(Transaction.objects.filter(participation__account=self).
                     aggregate(**sum_query('sum'))['sum'] or 0)
        return res

    def __str__(self):
        return self.user.__str__()
