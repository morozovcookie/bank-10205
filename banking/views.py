from django.shortcuts import render
from rest_framework.exceptions import ParseError
from django.contrib.auth.models import User
from banking.serializers.user import UserSerializer

def default(request):
    content = render(request, 'banking/redirect.html').content
    return render(request, 'banking/index.html', dict(body=content))


def auth(request):
    content = render(request, 'banking/auth.html').content
    title = 'Bank::Authentication'
    return render(request, 'banking/index.html', dict(body=content,
                                                      title=title))


def client(request):
    content = render(request, 'banking/client/index.html').content
    title = 'Bank::Client Application'
    return render(request, 'banking/index.html', dict(body=content,
                                                      title=title))

def admin(request):
    content = render(request, 'banking/admin/index.html').content
    title = 'Bank::Admin'
    return render(request, 'banking/index.html', dict(body=content, title=title))

def events(request):
    content = render(request, 'banking/events.html').content
    body = render(request, 'banking/admin/index.html', dict(content=content)).content
    title = 'Bank::Events'
    return render(request, 'banking/index.html', dict(body=body, title=title))

def users(request):
    content = render(request, 'banking/users.html').content
    body = render(request, 'banking/admin/index.html', dict(content=content)).content
    title = 'Bank::Users'
    return render(request, 'banking/index.html', dict(body=body, title=title))

def error(request):
    content = render(request, 'banking/error.html').content
    title = 'Bank::Error'
    return render(request, 'banking/index.html', dict(body=content,
                                                      title=title))

def has_permisions(request):
    key = request.META.get('HTTP_AUTHORIZATION')
    if key is None:
        raise ParseError
    key = key.split()[1]
    user = User.objects.get(auth_token=key)
    if user and UserSerializer(user).data['is_superuser']:
        return True
    return False
