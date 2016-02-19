# -*- coding: utf-8 -*-

from django.db import models

import banking._models.account as account
Account = account.Account


# How to DRY?
class EventTemplate(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    author = models.ForeignKey(Account, related_name='template_author')
    participants = models.ManyToManyField(Account, blank=True)
    private = models.BooleanField()
