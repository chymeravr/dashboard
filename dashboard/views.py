from django.shortcuts import render

def sitemap(request):
    c = {}
    return render(request, 'dashboard/sitemap.html', c)
