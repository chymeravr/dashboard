from __future__ import unicode_literals

import uuid

from django.contrib.auth.models import User
from django.db import models


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.id)


class AppStore(models.Model):
    name = models.CharField(max_length=100)


class App(BaseModel):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100)
    url = models.URLField()
    appStore = models.ForeignKey(AppStore)
    approved = models.BooleanField(default=False)


class Placement(BaseModel):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    app = models.ForeignKey(App, related_name='placements')
    name = models.CharField(max_length=100)
