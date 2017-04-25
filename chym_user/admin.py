from django.contrib import admin

from chym_user.models import Profile, InterestedUser, TestDevice, Payment, Payout, VrEvent

admin.site.register([
    Profile,
    InterestedUser,
    TestDevice,
    Payment,
    Payout,
    VrEvent,
])
