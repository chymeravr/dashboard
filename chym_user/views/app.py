from django.shortcuts import render


def login(request):
    c = {}
    return render(request, 'login.html', c)


