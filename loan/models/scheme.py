import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel
from .loan import Loan
from loan.managers import SchemeManager

class Scheme(TimestampedModel, AuthorTrackerModel):
    SYSTEM_CHOICES =[
        ("SQFT", "imperial (sqft)"),
        ("SQM", "metric (sqm)")
    ]

    loan = models.ForeignKey(Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name="schemes")
    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    opening_date = models.DateField(blank=True, null=True)
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")

    objects = SchemeManager()

    def __str__(self):
        return self.name


class AssetClass(TimestampedModel, AuthorTrackerModel):
    use = models.CharField(max_length=40)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE)

    class Meta:
        # abstract = True
        verbose_name_plural = "Asset Classes" #for the admin panel

    def __str__(self):
        return self.use
   
class Hotel(AssetClass):
    pass


    # @property
    # def use(self):
    #     return self.__class__.__name__
    
    
class Residential(AssetClass): 
    pass
    
    # @property
    # def use(self):
    #     return self.__class__.__name__

class Retail(AssetClass):
    description = models.CharField(max_length=100, blank=True, default="") #could be cafe or restaurant or...

    # def __str__(self):
    #     return self.description
    
    # @property
    # def use(self):
    #     return self.__class__.__name__

class StudentAccommodation(AssetClass): 
    pass

    # @property
    # def use(self):
    #     return "Student Accommodation"

class Office(AssetClass): 
    pass

    # @property
    # def use(self):
    #     return self.__class__.__name__

class ShoppingCentre(AssetClass): 
    pass

    # @property
    # def use(self):
    #     return "Shopping Centre"

class Unit(TimestampedModel, AuthorTrackerModel):
    LABEL_CHOICES =[
        ("unit", "unit"),
        ("room", "room")
    ]
    AREA_TYPE_CHOICES =[
        ("NIA", "Net Internal Area"),
        ("GIA", "Gross Internal Area"),
    ]
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units")
    # hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, null=True, blank=True , related_name="units")
    # residential = models.ForeignKey(Residential, on_delete=models.CASCADE, null=True, blank=True, related_name="units")
    # retail = models.ForeignKey(Retail, on_delete=models.CASCADE, null=True, blank=True, related_name="units")
    # student_accommodation = models.ForeignKey(StudentAccommodation, on_delete=models.CASCADE, null=True, blank=True, related_name="units")
    # office = models.ForeignKey(Office, on_delete=models.CASCADE, null=True, blank=True, related_name="units")
    # shopping_centre = models.ForeignKey(ShoppingCentre, on_delete=models.CASCADE, null=True, blank=True, related_name="units")
    
    label = models.CharField(max_length=10, choices=LABEL_CHOICES, blank=True)
    identifier = models.CharField(verbose_name="unit number", default="1", max_length=10)
    description = models.CharField(max_length=100, blank=True , default="")
    beds = models.IntegerField(blank=True, null=True)
    area_size = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True)

    def __str__(self):
        # display th eunit identified for a given asset class
        return self.identifier


    def save(self, *args, **kwargs):
        # define description field as number of beds , if beds is not null
        if self.beds:
            self.description = f"{self.beds}-bed"

        # define identifier field as the unit number, for a given asset class
        if not self.identifier:
            self.identifier = self.asset_class.units.count() + 1

        super().save(*args, **kwargs)

    # @property
    # def use(self):
    #     return self.asset_class.use
    

# class Area(models.Model):
#     SYSTEM_CHOICES =[
#         ("SQFT", "imperial (sqft)"),
#         ("SQM", "metric (sqm)")
#     ]
#     TYPE_CHOICES =[
#         ("NIA", "Net Internal Area"),
#         ("NSA", "Net Salable Area"),
#         ("GIA", "Gross Internal Area"),
#         ("GEA", "Gross External Area"),
#     ]
#     unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="area_definitions", blank=True, null=True)
#     size = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
#     type = models.CharField(max_length=3, choices=TYPE_CHOICES, blank=True)
#     system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")


# class Bed(TimestampedModel, AuthorTrackerModel):
#     MEASURE_CHOICES=[
#         ("CM", "centimetres"),
#         ("IN", "inches"),
#     ]
#     unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="beds", blank=True, null=True)
#     description = models.CharField(max_length=100, blank=True , default="")
#     width = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
#     length = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
#     height = models.DecimalField(max_digits=20, decimal_places=2, blank=True, null=True)
#     measure = models.CharField(max_length=3, choices=MEASURE_CHOICES, blank=True)

#     def __str__(self):
#         return self.description

