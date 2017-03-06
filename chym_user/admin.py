from django.contrib import admin

from chym_user.models import Profile, InterestedUser, TestDevice

admin.site.register(Profile)
admin.site.register(InterestedUser)
admin.site.register(TestDevice)
