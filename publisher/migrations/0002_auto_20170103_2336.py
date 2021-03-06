# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-01-03 23:36
from __future__ import unicode_literals

from django.db import migrations


def load_app_stores(apps, schema_editor):
    # We get the model from the versioned app registry;
    # if we directly import it, it'll be the wrong version
    db_alias = schema_editor.connection.alias

    AppStore = apps.get_model("publisher", "AppStore")
    AppStore.objects.using(db_alias).bulk_create([
        AppStore(id=1, name="Google Play Store"),
        AppStore(id=2, name="Oculus"),
    ])

class Migration(migrations.Migration):

    dependencies = [
        ('publisher', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_app_stores)
    ]
