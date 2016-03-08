from django.shortcuts import render
from rest_framework.exceptions import ParseError
from django.contrib.auth.models import User
from banking.serializers.user import UserSerializer


def default(request):
    content = render(request, 'banking/redirect.html').content
    return render(request, 'banking/index.html', dict(body=content))


def auth(request):
    title = 'Bank::Authentication'
    return render(request, 'banking/auth.html', dict(title=title))


def client(request):
    title = 'Bank::Client Application'
    return render(request, 'banking/client/index.html', dict(title=title))


def admin(request):
    title = 'Bank::Admin'
    return render(request, 'banking/admin/index.html', dict(title=title))


def events(request):
    title = 'Bank::Events'
    return render(request, 'banking/events.html', dict(title=title))


def users(request):
    title = 'Bank::Users'
    return render(request, 'banking/users.html', dict(title=title))


def error(request):
    title = 'Bank::Error'
    return render(request, 'banking/error.html', dict(title=title))


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
