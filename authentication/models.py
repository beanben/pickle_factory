from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
# from .managers import UserManager

class Firm(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class UserManager(BaseUserManager):
    def create_superuser(self, email, password):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email), 
            password=password, 
             is_superuser=True)

        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255, default="", blank=True)
    last_name = models.CharField(max_length=255, default="", blank=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    firm = models.ForeignKey(Firm, on_delete=models.CASCADE, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_superuser

    

class Reset(models.Model):
    email = models.CharField(max_length=255) #not unique
    token = models.CharField(max_length=255, unique=True)