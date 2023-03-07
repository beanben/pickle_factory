from django.contrib import admin
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import (
    Scheme, 
    Hotel, 
    Residential, 
    Retail, 
    StudentAccommodation, 
    Office, 
    ShoppingCentre,
    AssetClass,
    Unit)

class LoanAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'author_firm',
        'slug',
        'created_at')

class BorrowerAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'author_firm',
        'slug',
        'created_at')

class SchemeAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'author_firm',
        'slug',
        'created_at')
    
class HotelAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')

class ResidentialAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')
    
class RetailAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')
    
class StudentAccommodationAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')
    
class OfficeAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')
    
class ShoppingCentreAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'id',
        'author_firm',
        'created_at',
        'scheme')

class UnitAdmin(admin.ModelAdmin):
    list_display = (
        'asset_class',
        'identifier',
        'description',
        'beds',
        'area_size',
        )

class AssetClassAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'use',
        'scheme',
        )

admin.site.register(Loan, LoanAdmin)
admin.site.register(Borrower, BorrowerAdmin)
admin.site.register(Scheme, SchemeAdmin)
admin.site.register(AssetClass, AssetClassAdmin)
admin.site.register(Hotel, HotelAdmin)
admin.site.register(Residential, ResidentialAdmin)
admin.site.register(Retail, RetailAdmin)
admin.site.register(StudentAccommodation, StudentAccommodationAdmin)
admin.site.register(Office, OfficeAdmin)
admin.site.register(ShoppingCentre, ShoppingCentreAdmin)
admin.site.register(Unit, UnitAdmin)
