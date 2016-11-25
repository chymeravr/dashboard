from django.shortcuts import render


def login(request):
    c = {}
    return render(request, 'chym_user/login.html', c)


