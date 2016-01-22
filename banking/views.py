from django.shortcuts import render


def index(req):
    return render(req, 'banking/index.html')


def admin_auth(req):
    return render(req, 'banking/admin/authentication.html')


def admin_index(req):
    return render(req, 'banking/admin/index.html')


def client_auth(req):
    return render(req, 'banking/client/authentication.html')


def client_index(req):
    return render(req, 'banking/client/index.html')
