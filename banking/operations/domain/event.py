# -*- coding: utf-8 -*-

from django.db.models import F, Sum, Q
from banking.models import Transaction, Account, Participation


def get_participants(event):
    """Get participants of Event
    @return:  participants List of dicts, where keys: 'account', 'parts'.
    'parts' - is participation rate(parts).
    @rtype :  List
    """
    accs_rates = Transaction.objects.filter(participation__event=event)\
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
    rated_parts = 0

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


def remove_participants(event, leavers):
    # check, that leaver is participated

    leavers = is_participated(event, leavers)
    if not leavers:
        return

    for acc in leavers:
        summary = Transaction.objects.filter(participation__account=acc)\
            .aggregate(summ=Sum(F('credit')), parts=Sum(F('participation__parts')))
        summ = summary['summ']
        parts = summary['parts']
        newt = Transaction(event=event, debit=summ)
        newt.parts = parts
        newt.account = acc
        newt.type = newt.DIFF
        newt.save()
    # get transacts with accs exclude leavers
    # calc party_pay
    # create diffs for selected
    # remove all transactions on leavers
    rest_trs = Transaction.objects.filter(participation__event=event)\
        .exclude(account__in=leavers)\
        .values('account', 'account__rate', 'credit', 'parts')\
        .distinct()

    rated_parts = 0
    if rest_trs.count() != 0:
        for t in rest_trs:
            rated_parts += t['parts']

    party_pay = event.price / rated_parts

    # create for oldiers diff transactions
    if rest_trs.count() != 0:
        for t in rest_trs:
            acc = Account.objects.get(id=t['account'])
            new_price = party_pay * t['parts']
            diff = abs(t['credit'] - new_price)
            # Rest participants split leaver debt by between themselves.
            newt = Transaction(event=event, credit=abs(diff))
            newt.parts = t['parts']
            newt.account = acc
            newt.type = newt.DIFF
            newt.save()

    rm_trs = Transaction.objects.filter(participation__event=event,
                                        participation__account__in=leavers)
    rm_trs.delete()
