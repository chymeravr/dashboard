from django.shortcuts import render


def home(request):
    c = {}
    return render(request, 'dashboard/home.html', c)


def sitemap(request):
    c = {}
    return render(request, 'dashboard/sitemap.html', c)
