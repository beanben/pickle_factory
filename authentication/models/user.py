from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from authentication.managers import UserManager
from authentication.models.firm import Firm


class User(AbstractBaseUser):
    first_name = models.CharField(max_length=255, default="", blank=True)
    last_name = models.CharField(max_length=255, default="", blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    firm = models.ForeignKey(Firm, on_delete=models.CASCADE)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['firm']

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        app_label = 'authentication' 

        
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser

class Reset(models.Model):
    email = models.CharField(max_length=255) #not unique
    token = models.CharField(max_length=255, unique=True)

