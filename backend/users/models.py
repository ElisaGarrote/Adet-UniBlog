from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("writer", "Writer"),
        ("reader", "Reader"),
    )

    organization = models.CharField(max_length=150, blank=True, null=True)
    department   = models.CharField(max_length=150, blank=True, null=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    user_role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="reader")

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self):
        return self.username
