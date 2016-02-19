# -*- coding: utf-8 -*-

from django.db import models

from .account import Account


class Transfer(models.Model):
    account = models.ForeignKey(Account)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    debit = models.FloatField(default=0)
    credit = models.FloatField(default=0)

    def __str__(self):
        ret = self.account.user.username + " "
        if self.debit != 0:
            ret += "INC %s" % self.debit
        else:
            ret += "OUT %s" % self.credit
        return ret
