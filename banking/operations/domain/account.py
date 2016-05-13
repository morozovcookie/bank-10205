from banking.models import Transfer


def push_money(account, count):
    """Account push money to bank."""
    t = Transfer(account=account, debit=count)
    t.save()
    return True


def out_money(account, count):
    """account call to get money from the bank. Make every effort that he did
    not do this(joke)."""
    if account.balance() >= count:
        Transfer.objects.create(account=account, credit=count)
        return True
    return False
