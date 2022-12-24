from django.db import models
import uuid
from authentication.models import User, Firm

class BaseModel(models.Model):
    id = models.UUIDField(
        primary_key=True,
        unique=True,
        editable=False,
        default=uuid.uuid4
    )

    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        abstract = True

class AuthorTrackerModel(BaseModel):
    author = models.ForeignKey(User, blank=True, null=True, on_delete=models.SET_NULL)
    author_firm = models.ForeignKey(Firm, blank=True, null=True, on_delete=models.SET_NULL)
    
    def __str__(self):
        return self.author.email


    class Meta:
        abstract = True
