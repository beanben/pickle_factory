# from django.contrib.auth.base_user import BaseUserManager
# from .models import Firm

# class UserManager(BaseUserManager):

#     def _create_user(self, email, password, **extra_fields):
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_user(self, email, password, firm):
#         # "firm" field in parametres is the firm id but the method needs frim instance
#         firm_id = firm
#         firm = Firm.objects.get(id=firm_id)
#         return self._create_user(email, password, firm)

#     def create_superuser(self, email, password):
#         is_superuser = True
#         return self._create_user(email, password, is_superuser)