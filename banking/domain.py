
def sawn(money, events):
    """Split money between events."""
    raise NotImplementedError("sawn income money between user debted events")

    for e in events:
        if money == 0:
            break

        rest = e.rest()
        # t = Transaction(user=user, event=e,
        #                 debit=money - (money - rest), rate=1)  # if e.rest > 0, fill.
        t.save()
        money -= rest

        e.save()
