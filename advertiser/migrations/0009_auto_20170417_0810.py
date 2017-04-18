# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2017-04-17 08:10
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('advertiser', '0008_ad_adtype'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='targeting',
            name='hmd',
        ),
        migrations.RemoveField(
            model_name='targeting',
            name='os',
        ),
        migrations.RemoveField(
            model_name='targeting',
            name='user',
        ),
        migrations.RemoveField(
            model_name='adgroup',
            name='targeting',
        ),
        migrations.AddField(
            model_name='campaign',
            name='hmd',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='advertiser.Hmd'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='os',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='advertiser.Os'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='ram',
            field=models.IntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)]),
        ),
        migrations.DeleteModel(
            name='Targeting',
        ),
    ]