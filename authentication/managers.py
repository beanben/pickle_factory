from django.contrib.auth.models import BaseUserManager
from .models.firm import Firm
import pdb

class UserManager(BaseUserManager):

    def _create_user(self, email, password, firm, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        if (extra_fields.get('is_superuser') is not True) and (not firm):
            raise ValueError('Users must be working for a firm') 

        email = self.normalize_email(email)

        # "firm" field in parametres is the firm id but the method needs firm instance
        if extra_fields.get('is_superuser') is not True:
            firm_id = firm
            firm = Firm.objects.get(id=firm_id)

        user = self.model(email=email, firm=firm, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, firm, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, firm, **extra_fields)


    # def create_superuser(self, email, password, **extra_fields):
    #     extra_fields.setdefault('is_superuser', True)

    #     if extra_fields.get('is_superuser') is not True:
    #         raise ValueError('Superuser must have is_superuser=True.')

    #     return self._create_user(email, password, firm=None, **extra_fields)

    def create_superuser(self, email, password):
        return self._create_user(email, password, firm=None, is_superuser=True)