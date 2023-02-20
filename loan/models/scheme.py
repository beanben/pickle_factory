import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel
from .loan import Loan
# from loan.managers import SchemeManager

class Scheme(TimestampedModel, AuthorTrackerModel):
    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name="schemes")
    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    opening_date = models.DateField(blank=True, null=True)

    # objects = SchemeManager()

    def __str__(self):
        return self.name


class AssetClass(TimestampedModel, AuthorTrackerModel):
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name="asset_classes")
    
    @property
    def category(self):
        return self.__class__.__name__
        

class Hotel(AssetClass):
    pass
    
class Residential(AssetClass): 
    pass

class Retail(AssetClass):
    description = models.CharField(max_length=100, blank=True, default="") #could be cafe or restaurant or...

    def __str__(self):
        return self.description

class StudentAccommodation(AssetClass): 
    pass

class Office(AssetClass): 
    pass

class ShoppingCentre(AssetClass): 
    pass

class Unit(TimestampedModel, AuthorTrackerModel):
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units")
    identifier = models.CharField(default="1", max_length=10)
    description = models.CharField(max_length=100, blank=True , default="")

    def __str__(self):
        self.identifier

class Area(models.Model):
    SYSTEM_CHOICES =[
        ("SQFT", "imperial (sqft)"),
        ("SQM", "metric (sqm)")
    ]
    TYPE_CHOICES =[
        ("NIA", "Net Internal Area"),
        ("NSA", "Net Salable Area"),
        ("GIA", "Gross Internal Area"),
    ]
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="area_definitions", blank=True, null=True)
    size = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    type = models.CharField(max_length=3, choices=TYPE_CHOICES, blank=True)
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")


class Bed(TimestampedModel, AuthorTrackerModel):
    MEASURE_CHOICES=[
        ("CM", "centimetres"),
        ("IN", "inches"),
    ]
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="beds", blank=True, null=True)
    description = models.CharField(max_length=100, blank=True , default="")
    width = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    length = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    measure = models.CharField(max_length=3, choices=MEASURE_CHOICES, blank=True)

    def __str__(self):
        return self.description

