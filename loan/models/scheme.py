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

    @property
    def gross_value(self):
        return sum([asset_class.value for asset_class in self.asset_classes.all()])   

class AssetClass(TimestampedModel, AuthorTrackerModel):
    TYPE_CHOICES =[
        ("BTS", "Residential - Build to Sell"),
        ("BTL", "Residential - Build to Let"),
        ("H", "Hotel"),
        ("C", "Commercial"),
        ("O", "Office"),
        ("S", "Shopping Centre"),
        ("PBSA", "Student Accommodation")
    ]
    asset_class_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name="asset_classes")

    @property
    def value(self):
        return sum([unit.value for unit in self.units.all()])

class Unit(TimestampedModel, AuthorTrackerModel):
    TYPE_CHOICES={
        ("unit", "unit"),
        ("room", "room"),
    }

    AREA_TYPE_CHOICES =[
        ("NIA", "Net Internal Area"),
        ("NSA", "Net Salable Area"),
        ("GIA", "Gross Internal Area"),
    ]
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units")
    unit_type = models.CharField(max_length=100, choices=TYPE_CHOICES, default="unit")
    description = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=1)
    beds = models.PositiveIntegerField(blank=True, null=True)
    area = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True)
    value = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    
    def __str__(self):
        description = self.description if self.description != "total" else f"{self.unit_type}"
        return f"{self.quantity} {description} - {self.asset_class}"



