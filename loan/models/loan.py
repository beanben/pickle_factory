from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel

class Loan(TimestampedModel, AuthorTrackerModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name
