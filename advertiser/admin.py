from django.contrib import admin

from advertiser import models

adv_models = [
    models.Campaign,
    models.Adgroup,
    models.Device,
    models.Targeting,
    models.Budget,
    models.Pricing,
    models.Hmd,
    models.Format,
    models.Os,
    models.Ad,
]
# Register your models here.
admin.site.register(adv_models)