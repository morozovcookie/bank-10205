from django.db import models
from django.db.models import F, Sum

from django.contrib.auth.models import User

from . import domain


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rate = models.FloatField(default=1)

    def balance(self):
        res = float(Transaction.objects.filter(account=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)
        res += float(Transfer.objects.filter(account=self).aggregate(
            balance=Sum(F('debit') - F('credit')))['balance'] or 0)

        return res

    def push_money(self, count):
        """Account push money to bank. Distribute count on debted events (older
        event filled firstly."""
        t = Transfer(account=self, direction="IN", count=count)
        t.save()
        # get events with positive balance. Substract debit from credit, 'couze
        # we need event balance. Event 'health' is credit(account fill this
        # with participation). Debit - is damage(account pay to event).
        events = [tt.event for tt in
                  Transaction.objects.filter(account=self)
                  .annotate(unpayed=F('credit') - F('debit'))
                  .filter(unpayed__gt=0)
                  .values('event')
                  .order_by('event__date').distinct()]

        domain.sawn(count, events)

    def out_money(self, count):
        """account call to get money from the bank. Make every effort that he did
        not do this(joke)."""
        if self.balance() > count:
            t = Transfer(account=self, direction="OUT", count=count)
            t.save()

    def __str__(self):
        return self.user.__str__() + "(" + str(self.rate) + ")"


class Event(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True, blank=False)
    price = models.FloatField()
    author = models.ForeignKey(Account)
    private = models.BooleanField(default=False)

    def from_template(self, t):
        self.name = t.name
        self.price = t.price
        self.author = t.author
        self.participants = t.participants
        self.private = t.private

    def get_participants(self):
        return [t.account for t in
                Transaction.objects.filter(event=self).distinct()]

    def add_participants(self, newbies):
        """Add participants in event. Takes dict, where keys - is account models
        and values is participation part(int)."""
        rated_parts = 0
        # get already participated users.
        # select account - for distinct, and next three for data
        old_trs = Transaction.objects.filter(event=self)\
            .values('account', 'account__rate', 'credit', 'rate')\
            .distinct()

        # calc old rated-parts
        if old_trs.count() != 0:
            for t in old_trs:
                rated_parts += t['account__rate'] * t['rate']

        for account, part in newbies.items():
            rated_parts += (part * account.rate)

        print("parts count:", rated_parts)

        party_pay = self.price / rated_parts

        # create for oldiers diff transactions
        if old_trs.count() != 0:
            for t in old_trs:
                acc = Account.objects.get(id=t['account'])
                new_price = acc.rate * party_pay * t['rate']
                diff = t['credit'] - new_price
                assert(diff != 0, "Incomer should change oldiers debt.")
                # old price > new price(diff > 0), when we have newbies.
                # old price < new price(diff < 0), when we have leavers.
                # If we have newbies, than oldiers get little part back;
                # else(when some leave event) rest participants split leaver
                # debt by between themselves.
                if diff < 0:
                    newt = Transaction(event=self, credit=diff)
                else:
                    newt = Transaction(event=self, debit=diff)

                newt.account = acc
                newt.save()

        # create participation transactions
        for account, part in newbies.items():
            t = Transaction(account=account, event=self)
            t.credit = account.rate * party_pay * part
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
    author = models.ForeignKey(Account, related_name='template_author')
    participants = models.ManyToManyField(Account, blank=True)
    private = models.BooleanField()


class Transaction(models.Model):
    account = models.ForeignKey(Account)
    rate = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(verbose_name="account pay", default=0)
    debit = models.FloatField(verbose_name="account get from event", default=0)

    def __str__(self):
        if self.credit == 0:
            return str(self.account) + "←(" + str(self.rate) + ")" + str(self.event)\
                + ":%.1f" % self.debit
        else:
            return str(self.account) + "→(" + str(self.rate) + ")" + str(self.event) \
                + ":%.1f" % self.credit


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
