<<<<<<< HEAD
from django.shortcuts import render, render_to_response

from rest_framework.authtoken.models import Token
from rest_framework.exceptions import ParseError
from rest_framework import status
=======
from django.shortcuts import render

from rest_framework.exceptions import ParseError
>>>>>>> dev

from django.contrib.auth.models import User

from banking.serializers.user import UserSerializer

<<<<<<< HEAD
def default(request):
    content = render(request, 'banking/redirect.html').content
    return render(request, 'banking/index.html', dict(body=content))  
    
def auth(request):
    content = render(request, 'banking/auth.html').content
    title = 'Bank::Authentication'
    return render(request, 'banking/index.html', dict(body=content, title=title))   
    
def client(request):
    content = render(request, 'banking/client/index.html').content
    title = 'Bank::Client Application'
    return render(request, 'banking/index.html', dict(body=content, title=title))
    
=======

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


>>>>>>> dev
def admin(request):
    content = render(request, 'banking/admin/index.html').content
    title = 'Bank::Admin'
    return render(request, 'banking/index.html', dict(body=content, title=title))
<<<<<<< HEAD
    
=======

>>>>>>> dev
def events(request):
    content = render(request, 'banking/events.html').content
    body = render(request, 'banking/admin/index.html', dict(content=content)).content
    title = 'Bank::Events'
    return render(request, 'banking/index.html', dict(body=body, title=title))
<<<<<<< HEAD
    
=======

>>>>>>> dev
def users(request):
    content = render(request, 'banking/users.html').content
    body = render(request, 'banking/admin/index.html', dict(content=content)).content
    title = 'Bank::Users'
    return render(request, 'banking/index.html', dict(body=body, title=title))
<<<<<<< HEAD
    
def error(request):
    content = render(request, 'banking/error.html').content
    title = 'Bank::Error'
    return render(request, 'banking/index.html', dict(body=content, title=title))
    
def has_permisions(request):
    key = request.META.get('HTTP_AUTHORIZATION')   
    if key is None: 
=======

def error(request):
    content = render(request, 'banking/error.html').content
    title = 'Bank::Error'
    return render(request, 'banking/index.html', dict(body=content,
                                                      title=title))


def has_permisions(request):
    key = request.META.get('HTTP_AUTHORIZATION')
    if key is None:
>>>>>>> dev
        raise ParseError
    key = key.split()[1]
    user = User.objects.get(auth_token=key)
    if user and UserSerializer(user).data['is_superuser']:
        return True
<<<<<<< HEAD
    return False
=======
    return False
>>>>>>> dev
