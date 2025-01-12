from django.db.models.signals import post_save
from django.dispatch import receiver

from elearn.elearn_app.models import CustomToken, CustomUser

@receiver(post_save, sender=CustomUser)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        CustomToken.objects.create(user=instance)