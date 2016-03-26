# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from django.contrib.auth.models import User


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

    def push_money(self, count):
        """Account push money to bank. Distribute count on debted events (older
        event filled firstly."""
        from .transfer import Transfer

        t = Transfer(account=self, direction="IN", count=count)
        t.save()

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
