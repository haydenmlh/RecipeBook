from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='users', on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=12, null=True, blank=True)
    avatar = models.ImageField(upload_to='profile_avatars/', null=True, blank=True)
