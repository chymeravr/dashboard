from django.contrib import admin

from publisher import models

pub_models = [
    models.Placement,
    models.App,
    models.AppStore
]
# Register your models here.
admin.site.register(pub_models)
