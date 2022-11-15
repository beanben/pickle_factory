from django.contrib.auth.models import BaseUserManager
from .models.firm import Firm
import pdb

class UserManager(BaseUserManager):
    def email_exists(self, email):
        if self.model.objects.filter(email=email).exists():
            return True 
        return False


    def _create_user(self, email, firm, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        
        if not firm:
            raise ValueError('Users must be working for a firm') 

        email = self.normalize_email(email)

        # "firm" field in parametres is the firm id but the method needs frim instance
        firm_id = firm
        firm = Firm.objects.get(id=firm_id)

        user = self.model(email=email, firm=firm, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, firm, password, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, firm, password, **extra_fields)


    def create_superuser(self, email, firm, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, firm, password, **extra_fields)