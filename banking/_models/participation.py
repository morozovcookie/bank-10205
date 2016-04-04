# -*- coding: utf-8 -*-

from string import Template

from django.db import models

from .account import Account
from .event import Event


class Participation(models.Model):
    account = models.ForeignKey(Account)
    parts = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    active = models.BooleanField()

    def __str__(self):
        out = Template("[$active]$account: $event")
        active = "+" if self.active else "-"
        return out.substitute(active=active, account=self.account,
                              event=self.event)

    class Meta:
        unique_together = ('account', 'event')
