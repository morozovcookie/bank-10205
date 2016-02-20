# -*- coding: utf-8 -*-

from django.db import models

from .account import Account
from .event import Event


class Transaction(models.Model):
    DIFF = 'DF'
    PARTICIPATE = 'IN'
    TYPES = (
        ('DF', 'diff'),
        ('IN', 'participation')
    )
    account = models.ForeignKey(Account)
    parts = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(verbose_name="account pay", default=0)
    debit = models.FloatField(verbose_name="account get from event", default=0)
    type = models.CharField(max_length=2, choices=TYPES, default=PARTICIPATE)

    def __str__(self):
        if self.credit == 0:
            return self.type + ":" + str(self.account)\
                + "←(" + str(self.parts) + ")" + str(self.event)\
                + ":%.1f" % self.debit
        else:
            return self.type + ":" + str(self.account)\
                + "→(" + str(self.parts) + ")" + str(self.event)\
                + ":%.1f" % self.credit
