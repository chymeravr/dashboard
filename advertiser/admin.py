from django.contrib import admin

from advertiser import models

adv_models = [models.Campaign, models.AdGroup, models.Device, models.Targeting, models.Budget]
# Register your models here.
admin.site.register(adv_models)