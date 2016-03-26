# -*- coding: utf-8 -*-

from django.db import models

from .participation import Participation


class Transaction(models.Model):
    DIFF = 'DF'
    PARTICIPATE = 'IN'
    INIT = 'NW'
    TYPES = (
        ('NW', 'initial'),
        ('DF', 'diff'),
        ('IN', 'participation')
    )
    participation = models.ForeignKey(Participation)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(verbose_name="account pay", default=0)
    debit = models.FloatField(verbose_name="account get from event", default=0)
    type = models.CharField(max_length=2, choices=TYPES, default=PARTICIPATE)
    parent = models.ForeignKey("self", null=True, blank=True)

    def summ(self):
        """ Return summ of debit and credit. Used for displaying """
        return round(self.debit - self.credit, 2)

    def type_view(self):
        """ Return string view of transaction type.  """
        ret = "Неизвестно"
        if self.type == 'DF':
            ret = "Перерасчет"
        elif self.type == 'IN':
            ret = 'Оплата'
        return ret

    def __str__(self):
        account = self.participation.account
        parts = self.participation.parts
        event = self.participation.event
        if self.credit == 0:
            return self.type + ":" + str(account)\
                + "←(" + str(parts) + ")" + str(event)\
                + ":%.1f" % self.debit
        else:
            return self.type + ":" + str(account)\
                + "→(" + str(parts) + ")" + str(event)\
                + ":%.1f" % self.credit
