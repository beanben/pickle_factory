import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel
from .loan import Loan

class Scheme(TimestampedModel, AuthorTrackerModel):
    CURRENCY_CHOICES =[
        ("GBP", "GBP (£)"),
        ("EUR", "EUR (€)"),
        ("USD", "USD ($)"),
    ]
    SYSTEM_CHOICES =[
        ("SQFT", "imperial (sqft)"),
        ("SQM", "metric (sqm)")
    ]

    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name="schemes")
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default="GBP")
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")


    def __str__(self):
        return self.name

class Unit(TimestampedModel, AuthorTrackerModel):
    AREA_TYPE_CHOICES =[
        ("NIA", "Net Internal Area"),
        ("NSA", "Net Salable Area"),
        ("GIA", "Gross Internal Area"),
    ]
    ASSET_CLASS_CHOICES =[
        ("BTS", "Residential - Build to Sell"),
        ("BTL", "Residential - Build to Let"),
        ("H", "Hotel"),
        ("C", "Commercial"),
        ("O", "Office"),
        ("S", "Shopping Centre"),
        ("PBSA", "Student Accommodation")
    ]

    asset_class = models.CharField(max_length=10, choices=ASSET_CLASS_CHOICES)
    type = models.CharField(max_length=100)
    description = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    beds = models.PositiveIntegerField(blank=True, null=True)
    area = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name="units")

    def __str__(self):
        description = self.description if self.description != "total" else f"{self.type}"
        return f"{self.quantity} {description} - {self.scheme.name}"



