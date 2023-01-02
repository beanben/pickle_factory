import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel

class Borrower(TimestampedModel, AuthorTrackerModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

