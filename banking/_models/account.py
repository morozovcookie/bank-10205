# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from django.contrib.auth.models import User


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

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
