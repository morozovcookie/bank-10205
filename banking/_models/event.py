# -*- coding: utf-8 -*-

from django.db import models
from django.db.models import F, Sum
from datetime import date
from .account import Account


class Event(models.Model):
    name = models.CharField(max_length=100, unique_for_date='date')
    date = models.DateField(default=date.today, blank=False)
    price = models.FloatField()
    author = models.ForeignKey(Account)
    private = models.BooleanField(default=False)

    def rest(self):
        """ Return rest moneys, that not payed yet."""
        from banking.models import Transaction

        payed = Transaction.objects.filter(event=self)\
            .aggregate(balance=Sum(F('credit')-F('debit')))['balance']
        return self.price - (0 if payed is None else payed)

    def __str__(self):
        return self.name
