# -*- coding: utf-8 -*-


def sawn(money, user, events):
    """Split money between events."""
    from banking.models import Transaction
    raise NotImplementedError("sawn income money between user debted events")

    for e in events:
        if money == 0:
            break

        rest = e.rest()
        # if e.rest > 0, fill
        t = Transaction(user=user, event=e,
                        debit=money - (money - rest), rate=1)
        t.save()
        money -= rest

        e.save()
