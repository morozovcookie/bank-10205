from django.http import HttpResponse


def auth(req):
    return HttpResponse('{"id":1,"username":"Intey"}', content_type="application/json")


def elist(req):
    return HttpResponse('[{"id":1,"title":"Cookies", "date": "2016-10-12",\
                        "sum": 1200, "owner": "Intey" }]',
                        content_type="application/json")
# Create your views here.
