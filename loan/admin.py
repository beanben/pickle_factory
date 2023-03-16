from django.contrib import admin
from loan.models import loan_models, borrower_models, scheme_models

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
        'id',
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
        'id',
        'asset_class',
        'asset_class_scheme_name',
        'identifier',
        'description',
        'beds',
        'area_size',
        )
    
    def asset_class_scheme_name(self, obj):
        return obj.asset_class.scheme.name

    asset_class_scheme_name.short_description = 'Asset Class Scheme Name'
    

class AssetClassAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'use',
        'scheme',
        )

admin.site.register(loan_models.Loan, LoanAdmin)
admin.site.register(borrower_models.Borrower, BorrowerAdmin)
admin.site.register(scheme_models.Scheme, SchemeAdmin)
admin.site.register(scheme_models.AssetClass, AssetClassAdmin)
admin.site.register(scheme_models.Hotel, HotelAdmin)
admin.site.register(scheme_models.Residential, ResidentialAdmin)
admin.site.register(scheme_models.Retail, RetailAdmin)
admin.site.register(scheme_models.StudentAccommodation, StudentAccommodationAdmin)
admin.site.register(scheme_models.Office, OfficeAdmin)
admin.site.register(scheme_models.ShoppingCentre, ShoppingCentreAdmin)
admin.site.register(scheme_models.Unit, UnitAdmin)
