# -*- coding: utf-8 -*-

from django.db.models import Sum, Q
from banking.models import Transaction, Account, Participation


def get_participants(event):
    """Get participants of Event
    @return:  participants List of dicts, where keys: 'account', 'parts'.
    'parts' - is participation rate(parts).
    @rtype :  List
    """
    accs_rates = Participation.objects.filter(event=event)\
        .values('account', 'parts').distinct()
    for p in accs_rates:
        p.update({'account': Account.objects.get(id=p['account'])})
    return accs_rates


def is_participated(event, accounts):
    """Check which accounts participated in event.

    @param accounts:  Accounts for checks
    @type  accounts:  Collection, that can used in Q object as field__in=[]

    @return:  Collection with accounts, that participated
    @type : set of participated accounts
    """

    out = set()
    participants = Participation.objects.filter(event=event,
                                                account__in=accounts)
    for p in participants:
        out.add(p.account)
    return out


def add_participants(event, newbies):
    """Add participants in event. Takes dict, where keys - is account
    models and values is participation part(int)."""

    recalcers = Participation.objects.filter(~Q(account__in=newbies.keys()))

    # participate incomers
    for (acc, parts) in newbies.items():
        # if not already participated
        if len(Participation.objects.filter(account=acc)) == 0:
            participation = Participation(account=acc, parts=parts,
                                          event=event)
            participation.save()
            tr = Transaction(participation=participation,
                             type=Transaction.PARTICIPATE)
            tr.credit = 0
            tr.save()

    # calc party-pay,
    all_parts = Participation.objects.all().aggregate(s=Sum('parts'))['s']
    party_pay = event.price / all_parts

    # create diffs for old participants
    for participation in recalcers:
        tr = Transaction(participation=participation, type=Transaction.DIFF)
        tr.debit = party_pay * participation.parts
        tr.save(0)


def delegate_debt(participation, credit):
    """Make diff transactions for given participation(event,user) with given
    credit. This means, that we get money from user and spend it to event.

    @param participation:  Event-User link that for create transaction
    @type  participation:  Participation
    """
    t = Transaction(participation=participation, type=Transaction.DIFF)
    t.credit = credit
    t.save()


def return_money(participation, debit):
    """Make diff transactions for given participation(event,user) with given
    debit. This means, that we get money from event and return it to user.
    @param participation:  Event-User link that for create transaction
    @type  participation:  Participation
    """
    t = Transaction(participation=participation, type=Transaction.DIFF)
    t.debit = debit
    t.save()



def remove_participants(event, leavers):
    # check, that leaver is participated
    leavers = is_participated(event, leavers)
    if not leavers:
        return

    all_participants = Participation.objects.all()

    party_pay = event.price / all_participants.aggregate(p=Sum('parts'))['p']

    rest_participations = all_participants.filter(~Q(account__in=leavers))
    # yep folks, you should pay for this leavers
    for participation in rest_participations:
        delegate_debt(participation, party_pay * participation.parts)

    leaver_participations = all_participants.filter(account__in=leavers)
    # return money
    for participation in leaver_participations:
        return_money(participation, party_pay * participation.parts)

    leaver_participations.delete()
