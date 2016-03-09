from django.shortcuts import render
from rest_framework.exceptions import ParseError
from django.contrib.auth.models import User
from banking.serializers.user import UserSerializer


def default(request):
    return render(request, 'banking/redirect.jade')


def auth(request):
    title = 'Bank::Authentication'
    return render(request, 'banking/auth.jade', dict(title=title))


def client(request):
    title = 'Bank::Client Application'
    return render(request, 'banking/client/index.jade', dict(title=title))


def admin(request):
    title = 'Bank::Admin'
    return render(request, 'banking/admin/index.jade', dict(title=title))


def events(request):
    title = 'Bank::Events'
    return render(request, 'banking/events.jade', dict(title=title))


def users(request):
    title = 'Bank::Users'
    return render(request, 'banking/users.jade', dict(title=title))


def userDetail(request, pk):
    return render(request, 'banking/user.jade')


def error(request):
    title = 'Bank::Error'
    return render(request, 'banking/error.jade', dict(title=title))


def has_permisions(request):
    """ Checks that user with token is admin.  """
    key = request.META.get('HTTP_AUTHORIZATION')
    if key is None:
        raise ParseError
    key = key.split()[1]
    user = User.objects.get(auth_token=key)
    if user and UserSerializer(user).data['is_superuser']:
        return True
    return False
