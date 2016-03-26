# -*- coding: utf-8 -*-


def get_participants(event):
    """Get participants of Event
    @return:  participants List of dicts, where keys: 'account', 'parts'.
    'parts' - is participation rate(parts).
    @rtype :  List
    """
    from banking.models import Transaction, Account
    accs_rates = Transaction.objects.filter(event=event)\
        .values('account', 'parts').distinct()
    for p in accs_rates:
        p.update({'account': Account.objects.get(id=p['account'])})
    return accs_rates


def add_participants(event, newbies):
    """Add participants in event. Takes dict, where keys - is account
    models and values is participation part(int)."""
    from banking.models import Transaction, Account
    rated_parts = 0
    # get already participated users.
    # select account - for distinct, and next three for data
    old_trs = Transaction.objects.filter(event=event)\
        .values('account', 'account__rate', 'credit', 'parts')\
        .distinct()

    # Don't add participant, when he is already participated
    if old_trs.filter(account__in=list(newbies)).count() != 0:
        return

    # calc old rated-parts
    if old_trs.count() != 0:
        for t in old_trs:
            rated_parts += t['parts']

    for account, part in newbies.items():
        rated_parts += part

    party_pay = event.price / rated_parts

    # create for oldiers diff transactions
    if old_trs.count() != 0:
        for t in old_trs:
            acc = Account.objects.get(id=t['account'])
            new_price = party_pay * t['parts']
            diff = abs(t['credit'] - new_price)
            # Oldiers get little part back.
            newt = Transaction(event=event, debit=diff)
            newt.parts = t['parts']
            newt.account = acc
            newt.type = newt.DIFF
            newt.save()

    # create participation transactions
    for account, part in newbies.items():
        t = Transaction(account=account, event=event)
        t.parts = part
        t.credit = party_pay * t.parts
        t.type = t.PARTICIPATE
        t.save()


def is_participated(event, accounts):
    """Check which accounts participated in event.

    @param accounts:  Accounts for checks
    @type  accounts:  Collection, that can used in Q object as field__in=[]

    @return:  Collection with accounts, that participated
    @rtype :  @type accounts
    """
    from banking.models import Transaction

    out = set()
    ts = Transaction.objects.filter(event=event, account__in=accounts)
    for t in ts:
        out.add(t.account)
    return out


def remove_participants(event, leavers):
    # check, that leaver is participated
    from banking.models import Transaction, Account
    from django.db.models import F, Sum

    leavers = is_participated(event, leavers)
    if not leavers:
        return

    for acc in leavers:
        summary = Transaction.objects.filter(account=acc)\
            .aggregate(summ=Sum(F('credit')), parts=Sum(F('parts')))
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
    rest_trs = Transaction.objects.filter(event=event)\
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

    rm_trs = Transaction.objects.filter(event=event, account__in=leavers)
    rm_trs.delete()
