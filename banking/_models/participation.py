# -*- coding: utf-8 -*-

from django.db import models

from .account import Account
from .event import Event


class Participation(models.Model):
    account = models.ForeignKey(Account)
    parts = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)

    def __str__(self):
        return str(self.account) + " -> " + str(self.event)
