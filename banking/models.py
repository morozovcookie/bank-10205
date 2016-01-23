from django.db import models
from django.contrib.auth import models as a_models


class User(models.Model):
    rate = models.FloatField(default=1)
    balance = models.FloatField(default=0)
    user = models.OneToOneField(a_models.User)

    def participate(self, event):
        event.participants.append(self)

    def __str__(self):
        return self.user.username


class Event(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    author = models.ForeignKey(User)
    private = models.BooleanField()

    def from_template(self, t):
        self.name = t.name
        self.price = t.price
        self.author = t.author
        self.participants = t.participants
        self.private = t.private

    def add_participant(self, newbie):
        self.participants.add(newbie)

    def __str__(self):
        return self.name


class Participation(models.Model):
    user = models.ForeignKey(User)
    event = models.ForeignKey(Event)
    rate = models.FloatField(default=1)

    class Meta:
        unique_together = ('user', 'event',)

    def __str__(self):
        return self.user.user.username + "->" + self.event.name


# How to DRY?
class EventTemplate(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    author = models.ForeignKey(User, related_name='template_author')
    participants = models.ManyToManyField(User, blank=True)
    private = models.BooleanField()


class Transaction(models.Model):
    user = models.ForeignKey(User)
    event = models.ForeignKey(Event)
    credit = models.FloatField(verbose_name="User pay", default=0)
    debit = models.FloatField(verbose_name="User get from event", default=0)

    def __str__(self):
        if self.credit == 0:
            return str(self.user) + "←" + str(self.event)\
                + ":%.1f" % self.debit
        else:
            return str(self.user) + "→" + str(self.event) \
                + ":%.1f" % self.credit
