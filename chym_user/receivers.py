from django.db.models import Sum
from django.db.models.signals import post_save
from django.dispatch import receiver

from chym_user.models import Payment, Profile, Payout


@receiver(post_save, sender=Payment)
def update_funds(sender, instance, **kwargs):
    user = instance.user
    profile = Profile.objects.get(user=user)
    funds = Payment.objects.filter(user=user).aggregate(Sum('amount')).get('amount__sum', 0.00)
    profile.advertising_funds = funds
    profile.save()


@receiver(post_save, sender=Payout)
def update_payouts(sender, instance, **kwargs):
    user = instance.user
    profile = Profile.objects.get(user=user)
    payouts = Payout.objects.filter(user=user).aggregate(Sum('amount')).get('amount__sum', 0.00)
    profile.publisher_payout = payouts
    profile.save()
