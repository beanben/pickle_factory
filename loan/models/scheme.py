import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel
from .loan import Loan

class Scheme(TimestampedModel, AuthorTrackerModel):
    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name='schemes')

    def __str__(self):
        return self.name