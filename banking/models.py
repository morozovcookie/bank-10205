from django.db import models
from django.db.models import F, Sum

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth import models as a_models

from . import domain


class User(AbstractBaseUser):
    rate = models.FloatField(default=1)

    def balance(self):
        res = float(Transaction.objects.filter(user=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)
        res += float(Transfer.objects.filter(user=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)

        return res

    def push_money(self, count):
        """User push money to bank. Distribute count on debted events (older
        event filled firstly."""
        t = Transfer(user=self, direction="IN", count=count)
        t.save()
        # get events with positive balance. Substract debit from credit, 'couze
        # we need event balance. Event 'health' is credit(user fill this with
        # participation). Debit - is damage(user pay to event).
        events = [tt.event for tt in
                  Transaction.objects.filter(user=self)
                  .annotate(unpayed=F('credit') - F('debit'))
                  .filter(unpayed__gt=0)
                  .values('event')
                  .order_by('event__date').distinct()]

        domain.sawn(count, events)

    def out_money(self, count):
        """User call to get money from the bank. Make every effort that he did
        not do this(joke)."""
        if self.balance() > count:
            t = Transfer(user=self, direction="OUT", count=count)
            t.save()

    def __str__(self):
        return self.username


class Event(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True, blank=False)
    price = models.FloatField()
    author = models.ForeignKey(User)
    private = models.BooleanField(default=False)

    def from_template(self, t):
        self.name = t.name
        self.price = t.price
        self.author = t.author
        self.participants = t.participants
        self.private = t.private

    def get_participants(self):
        return [t.user for t in
                Transaction.objects.filter(event=self).distinct()]

    def add_participants(self, newbies):
        """Add participants in event. Takes dict, where keys - is user models
        and values is participation part(int)."""
        rated_parts = 0

        for user, part in newbies.items():
            rated_parts += (part * user.rate)

        print("parts count:", rated_parts)

        party_pay = self.price / rated_parts

        for user, part in newbies.items():
            t = Transaction(user=user, event=self)
            t.credit = user.rate * party_pay * part
            t.save()

    def rest(self):
        """ Return rest moneys, that not payed yet."""
        payed = Transaction.objects.filter(event=self)\
            .aggregate(balance=Sum(F('credit')-F('debit')))['balance']
        return self.price - (0 if payed is None else payed)

    def __str__(self):
        return self.name


# How to DRY?
class EventTemplate(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    author = models.ForeignKey(User, related_name='template_author')
    participants = models.ManyToManyField(User, blank=True)
    private = models.BooleanField()


class Transaction(models.Model):
    user = models.ForeignKey(User)
    rate = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(verbose_name="User pay", default=0)
    debit = models.FloatField(verbose_name="User get from event", default=0)

    def __str__(self):
        if self.credit == 0:
            return str(self.user) + "←" + str(self.event)\
                + ":%.1f" % self.debit
        else:
            return str(self.user) + "→" + str(self.event) \
                + ":%.1f" % self.credit


class Transfer(models.Model):
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    debit = models.FloatField(default=0)
    credit = models.FloatField(default=0)

    def __str__(self):
        ret = self.user.username + " "
        if self.debit != 0:
            ret += "INC %s" % self.debit
        else:
            ret += "OUT %s" % self.credit
        return ret
