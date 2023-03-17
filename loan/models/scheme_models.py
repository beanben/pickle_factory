import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel, TimestampedModelReverse
from loan.models import loan_models
from loan.managers import SchemeManager, AssetClassManager

class Scheme(TimestampedModel, AuthorTrackerModel):
    SYSTEM_CHOICES =[
        ("SQFT", "imperial (sqft)"),
        ("SQM", "metric (sqm)")
    ]

    loan = models.ForeignKey(loan_models.Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name="schemes")
    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    opening_date = models.DateField(blank=True, null=True)
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")

    def __str__(self):
        return self.name

    objects = SchemeManager()

class AssetClass(TimestampedModel, AuthorTrackerModel):
    use = models.CharField(max_length=40)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='asset_classes')

    class Meta:
        verbose_name_plural = "Asset Classes" #for the admin panel

    def __str__(self):
        return self.use
    
    objects = AssetClassManager()

   
class Hotel(AssetClass):
    pass
    
    
class Residential(AssetClass): 
    pass

class Retail(AssetClass):
    pass


class StudentAccommodation(AssetClass): 
    pass

class Office(AssetClass): 
    pass

class ShoppingCentre(AssetClass): 
    pass

class Unit(TimestampedModelReverse, AuthorTrackerModel):
    LABEL_CHOICES =[
        ("unit", "unit"),
        ("room", "room")
    ]
    AREA_TYPE_CHOICES =[
        ("NIA", "Net Internal Area"),
        ("GIA", "Gross Internal Area"),
    ]
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units") 
    label = models.CharField(max_length=10, choices=LABEL_CHOICES, blank=True)
    identifier = models.CharField(verbose_name="unit number", default="1", max_length=10)
    description = models.CharField(max_length=100, blank=True , default="")
    beds = models.IntegerField(blank=True, null=True)
    area_size = models.DecimalField(max_digits=20, decimal_places=4, default=0.0000)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True)

    def __str__(self):
        # display the unit identified for a given asset class
        return self.identifier


    def save(self, *args, **kwargs):
        # define description field as number of beds , if beds is not null
        if self.beds:
            self.description = f"{self.beds}-bed"

        elif (self.asset_class.use == 'retail' or self.asset_class.use == 'office') and not self.description:
            self.description = self.asset_class.use

        # define identifier field as the unit number, for a given asset class
        if not self.identifier:
            self.identifier = self.asset_class.units.count() + 1

        super().save(*args, **kwargs)

# class Category(TimestampedModel, AuthorTrackerModel):
#     description = models.CharField(max_length=100, blank=True , default="")
#     quantity = models.IntegerField(blank=True, null=True)
#     unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="categories")
