import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel, TimestampedModelReverse
from loan.models import loan_models
from loan.managers import SchemeManager
from loan.utils import get_months_difference
from dateutil import relativedelta


class Scheme(TimestampedModel, AuthorTrackerModel):
    SQFT = "SQFT"
    SQM = "SQM"

    SYSTEM_CHOICES =[
        (SQFT, "imperial (sqft)"),
        (SQM, "metric (sqm)")
    ]

    loan = models.ForeignKey(loan_models.Loan, on_delete=models.SET_NULL, blank=True, null=True, related_name="schemes", related_query_name="scheme")
    name = models.CharField(max_length=100)
    street_name = models.CharField(max_length=100, blank=True, default="")
    postcode = models.CharField(max_length=100, blank=True, default="")
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, blank=True , default="")
    opening_date = models.DateField(blank=True, null=True)
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default=SQFT)
    is_built = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    objects = SchemeManager()

class AssetClass(TimestampedModelReverse, AuthorTrackerModel):
    BUILD_TO_SELL = "build_to_sell"
    BUILD_TO_RENT = "build_to_rent"
    INVESTMENT_STRATEGY_CHOICES =[
        (BUILD_TO_SELL, "build to sell"),
        (BUILD_TO_RENT, "build to rent")
    ]

    HOTEL = "hotel"
    RESIDENTIAL = "residential"
    COMMERCIAL = "commercial"
    STUDENT_ACCOMMODATION = "student_accommodation"
    OFFICE = "office"
    SHOPPING_CENTRE = "shopping_centre"
    ASSET_CLASS_CHOICES =[
        (HOTEL, "hotel"),
        (RESIDENTIAL, "residential"),
        (COMMERCIAL, "commercial"),
        (STUDENT_ACCOMMODATION, "student accommodation"),
        (OFFICE, "office"),
        (SHOPPING_CENTRE, "shopping centre")
    ]

    use = models.CharField(max_length=40, choices = ASSET_CLASS_CHOICES, default=RESIDENTIAL)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='asset_classes', related_query_name="asset_class")
    investment_strategy = models.CharField(max_length=100, blank=True , choices = INVESTMENT_STRATEGY_CHOICES, default=BUILD_TO_SELL)

    def __str__(self):
        return self.use
 
class Hotel(AssetClass):
    pass
    
class Residential(AssetClass): 
   pass

class Commercial(AssetClass):
    pass

class StudentAccommodation(AssetClass): 
    pass

class Office(AssetClass): 
   pass

class ShoppingCentre(AssetClass): 
    pass

class Unit(TimestampedModelReverse, AuthorTrackerModel):
    UNIT = "unit"
    ROOM = "room"
    LABEL_CHOICES =[
        (UNIT, "unit"),
        (ROOM, "room")
    ]

    NIA = "NIA"
    GIA = "GIA"
    AREA_TYPE_CHOICES =[
        (NIA, "Net Internal Area"),
        (GIA, "Gross Internal Area"),
    ]
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units", related_query_name="unit") 
    label = models.CharField(max_length=10, choices=LABEL_CHOICES, blank=True, default=UNIT)
    identifier = models.CharField(verbose_name="unit number", default="1", max_length=10)
    description = models.CharField(max_length=100, blank=True , default="")
    beds = models.IntegerField(blank=True, null=True)
    area_size = models.DecimalField(max_digits=20, decimal_places=4, default=0.00)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True, default=NIA)
    # value = models.DecimalField(max_digits=20, decimal_places=4, default=0.00)

    def __str__(self):
        # display the unit identified for a given asset class
        return self.identifier
    
    class Meta:
        verbose_name_plural = "Units" #for the admin panel

    @property
    def area_system(self):
        if self.asset_class.scheme.system == "SQM":
            return "sqm"
        return "sqft"

# class Individual(TimestampedModel, AuthorTrackerModel):
#     first_name = models.CharField(max_length=100, blank=True , default="")
#     last_name = models.CharField(max_length=100, blank=True , default="PI")

# class Corporate(TimestampedModel, AuthorTrackerModel):
#     name = models.CharField(max_length=100, blank=True , default="")

# class Tenant(TimestampedModel, AuthorTrackerModel):
#     INDIVIDUAL = 'individual'
#     COMPANY = 'company'
#     TENANT_TYPE_CHOICES = [
#         (INDIVIDUAL, "individual"),
#         (COMPANY, "company"),
#     ]
   
#     tenant_type = models.CharField(max_length=100, blank=True, choices=TENANT_TYPE_CHOICES, default=INDIVIDUAL)
#     individual = models.ForeignKey(Individual, null=True, blank=True, on_delete=models.CASCADE)
#     corporate = models.ForeignKey(Corporate, null=True, blank=True, on_delete=models.CASCADE)

#     def get_tenant(self):
#         if self.tenant_type == self.INDIVIDUAL:
#             return self.individual_tenant
#         return self.corporate_tenant
    
class Lease(TimestampedModel, AuthorTrackerModel):
    OPEN_MARKET = "open_market"
    DISCOUNTED_RENTAL = "discounted_rental"
    LEASE_TYPE_CHOICES =[
        (OPEN_MARKET, "open market"),
        (DISCOUNTED_RENTAL, "discounted rental")
    ]

    WEEKLY = "weekly"
    MONTHLY = "monthly"
    RENT_FREQUENCY_CHOICES =[
        (WEEKLY, "weekly"),
        (MONTHLY, "monthly")
    ]

    MONTHS = "months"
    WEEKS = "weeks"
    DURATION_UNIT_CHOICES =[
        (MONTHS, "month"),
        (WEEKS, "weeks")
    ]

    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="lease", related_query_name="lease")
    # tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="leases", related_query_name="lease")
    tenant = models.CharField(max_length=100, blank=True , default="")
    lease_type = models.CharField(max_length=100, blank=True , choices = LEASE_TYPE_CHOICES, default=OPEN_MARKET)
    rent_target_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    rent_target_frequency = models.CharField(max_length=100, blank=True , choices = RENT_FREQUENCY_CHOICES, default=WEEKLY)
    rent_achieved_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    rent_achieved_frequency = models.CharField(max_length=100, blank=True , choices = RENT_FREQUENCY_CHOICES, default=WEEKLY)
    start_date = models.DateField(blank=True, null=True)
    duration_value = models.IntegerField(blank=True, null=True)
    duration_unit = models.CharField(max_length=100, blank=True , choices = DURATION_UNIT_CHOICES, default=MONTHS)

    # def __str__(self):
    #     return f"{self.get_tenancy_type_display()} - {self.unit} - Tenant: {self.get_tenant()}"
    
    class Meta:
        verbose_name_plural = "Leases" #for the admin panel
    
    @property
    def end_date(self):
        if self.start_date:
            return None
        
        if self.duration_unit == self.MONTHS:
            return self.start_date + relativedelta(months=self.duration_value)
        return self.start_date + relativedelta(weeks=self.duration_value)

         

        

# class Buyer(TimestampedModel, AuthorTrackerModel):
#     INDIVIDUAL = 'individual'
#     COMPANY = 'company'
#     BUYER_TYPE_CHOICES = [
#         (INDIVIDUAL, "individual"),
#         (COMPANY, "company"),
#     ]
#     buyer_type = models.CharField(max_length=100, blank=True, choices=BUYER_TYPE_CHOICES, default=INDIVIDUAL)
#     individual = models.ForeignKey(Individual, null=True, blank=True, on_delete=models.CASCADE)
#     corporate = models.ForeignKey(Corporate, null=True, blank=True, on_delete=models.CASCADE)

#     def get_buyer(self):
#         if self.buyer_type == self.INDIVIDUAL:
#             return self.individual_buyer
#         return self.corporate_buyer

class Sale(TimestampedModel, AuthorTrackerModel):
    AVAILABLE = "available"
    UNDER_OFFER = "under_offer"
    EXCHANGED = "exchanged"
    COMPLETED = "completed"
    STATUS_CHOICES =[
        (AVAILABLE, "available"),
        (UNDER_OFFER, "under offer"),
        (EXCHANGED, "exchanged"),
        (COMPLETED, "completed")
    ]

    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="sales", related_query_name="sale")
    status = models.CharField(max_length=20, blank=True , choices= STATUS_CHOICES, default=AVAILABLE)
    status_date = models.DateField(blank=True, null=True)
    price_target = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    price_achieved = models.DecimalField(max_digits=20, decimal_places=2, default=0.00)
    buyer = models.CharField(max_length=100, blank=True , default="")

    def __str__(self):
        return f'sale of unit {self.unit}'

    class Meta:
        verbose_name_plural = "Sales" #for the admin panel

    

