from django.db import models
import uuid
from authentication.models import User, Firm
from django.utils.text import slugify
import pdb
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# use native id unless there is a good reason
class BaseModel(models.Model):
    slug = models.SlugField(blank=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        slug = slugify(self.name)

        Klass = self.__class__
        qs = Klass.objects.filter(slug=slug).exclude(id=self.id)
        if qs.exists():
            slug = f'{slug}-{self.id}'

        self.slug = slug
        super().save(*args, **kwargs)

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        abstract = True

class AuthorTrackerModel(BaseModel):
    author = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    author_firm = models.ForeignKey(Firm, blank=True, null=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.author.email


    class Meta:
        abstract = True
