from django.contrib import admin

from advertiser import models

adv_models = [
    models.Campaign,
    models.Adgroup,
    models.Pricing,
    models.Hmd,
    models.CampaignType,
    models.Os,
    models.Ad,
]
# Register your models here.
admin.site.register(adv_models)
