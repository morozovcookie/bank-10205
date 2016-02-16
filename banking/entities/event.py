from django.db import models
from django.contrib.auth.models import User

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
        return [t.user for t in Transaction.objects.filter(event=self).distinct()]
    
    def add_participants(self, newbies):
        rated_parts = 0
        for user, part in newbies.items():
            rated_parts += (part * user.rate)
        party_pay = self.price / rated_parts
        for user, part in newbies().items():
            t = Transaction(user=user, event=self)
            t.credit = user.rate * party_pay * partt.save()
            
    def rest(self):
        payed = Transaction.objects.filter(event=self).aggregate(balance=Sum(F('credit') - F('debit')))['balance']
        return self.price - (0 if payed is None else payed)
        
    def __str__(self):
        return self.name

class Transaction(models.Model):
    user = models.ForeignKey(User)
    rate = models.FloatField(default=1.0)
    event = models.ForeignKey(Event)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    credit = models.FloatField(verbose_name='User pay', default=0)
    debit = models.FloatField(verbose_name='User get from event', default=0)
    
    def __str__(self):
        if self.credit == 0:
            return str(self.user) + '<-' + str(self.event) + ':%.1f' % self.debit
        else:
            return str(self.user) + '->' + str(self.event) + ':%.1f' % self.credit