from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel
from .borrower import Borrower

class Loan(TimestampedModel, AuthorTrackerModel):
    name = models.CharField(max_length=255)
    borrower = models.ForeignKey(Borrower, on_delete=models.SET_NULL, blank=True, null=True, related_name='loans')

    def __str__(self):
        return self.name

    
