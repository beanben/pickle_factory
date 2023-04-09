import pdb
from django.db import models
from core.models import TimestampedModel, AuthorTrackerModel, TimestampedModelReverse
from loan.models import loan_models
from loan.managers import SchemeManager

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
    system = models.CharField(max_length=4, choices=SYSTEM_CHOICES, default="SQFT")
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

    use = models.CharField(max_length=40)
    scheme =  models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='asset_classes', related_query_name="asset_class")
    investment_strategy = models.CharField(max_length=100, blank=True , choices = INVESTMENT_STRATEGY_CHOICES, default="")

    class Meta:
        verbose_name_plural = "Asset Classes" #for the admin panel

    def __str__(self):
        return self.use
    
    # objects = AssetClassManager()

   
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
    NIA = "NIA"
    GIA = "GIA"

    LABEL_CHOICES =[
        (UNIT, "unit"),
        (ROOM, "room")
    ]
    AREA_TYPE_CHOICES =[
        (NIA, "Net Internal Area"),
        (GIA, "Gross Internal Area"),
    ]
    asset_class = models.ForeignKey(AssetClass, on_delete=models.CASCADE, related_name="units", related_query_name="unit") 
    # label = models.CharField(max_length=10, choices=LABEL_CHOICES, blank=True)
    identifier = models.CharField(verbose_name="unit number", default="1", max_length=10)
    description = models.CharField(max_length=100, blank=True , default="")
    beds = models.IntegerField(blank=True, null=True)
    area_size = models.DecimalField(max_digits=20, decimal_places=4, default=0.0000)
    area_type = models.CharField(max_length=3, choices=AREA_TYPE_CHOICES, blank=True)
    value = models.DecimalField(max_digits=20, decimal_places=4, default=0.00)

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

class Tenant(TimestampedModel, AuthorTrackerModel):
    PRIVATE_INDIVIDUAL = "private_individual"
    COMPANY = "company"

    TENANT_TYPE_CHOICES =[
        (PRIVATE_INDIVIDUAL, "private individual"),
        (COMPANY, "company")
    ]
    tenant_type = models.CharField(max_length=100, blank=True , choices = TENANT_TYPE_CHOICES, default="")
    name = models.CharField(max_length=100, blank=True , default="")

    def __str__(self):
        if self.tenant_type == "private_individual":
            return f'tenant {self.id}'
        return self.name
    
    class Meta:
        verbose_name_plural = "Tenants" #for the admin panel

class Lease(TimestampedModel, AuthorTrackerModel):
    OPEN_MARKET = "open_market"
    DISCOUNTED_RENTAL = "discounted_rental"

    LEASE_TYPE_CHOICES =[
        (OPEN_MARKET, "open market"),
        (DISCOUNTED_RENTAL, "discounted rental")
    ]
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="leases", related_query_name="lease")
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="leases", related_query_name="lease")
    lease_type = models.CharField(max_length=100, blank=True , choices = LEASE_TYPE_CHOICES, default="")
    rent = models.DecimalField(max_digits=20, decimal_places=4, default=0.00)
    rent_frequency = models.CharField(max_length=100, blank=True , default="")
    start_date = models.DateField(blank=True, null=True)
    length_days = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return f"{self.get_tenancy_type_display()} - {self.unit} - Tenant: {self.tenant}"
    
    class Meta:
        verbose_name_plural = "Leases" #for the admin panel
    
    @property
    def lease_end_date(self):
        return self.lease_start_date + self.lease_length_days
    
    
class Sale(TimestampedModel, AuthorTrackerModel):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name="sales", related_query_name="sale")
    status = models.CharField(max_length=100, blank=True , default="")
    price = models.DecimalField(max_digits=20, decimal_places=4, default=0.00)
    status_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f'sale of unit {self.unit}'

    class Meta:
        verbose_name_plural = "Sales" #for the admin panel
