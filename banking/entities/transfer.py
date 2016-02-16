from django.db import models
from django.contrib.auth.models import User

class Transfer(models.Model):
    user = models.ForeignKey(User)
    date = models.DateTimeField(auto_now_add=True, blank=False)
    debit = models.FloatField(default=0)
    credit = models.FloatField(default=0)
    
    def __str__(self):
        ret = self.user.username + ' '
        if self.debit != 0:
            ret += 'INC %s' % self.debit
        else:
            ret += 'OUT %s' % self.credit
        return ret
