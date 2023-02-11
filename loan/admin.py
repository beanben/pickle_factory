from django.contrib import admin
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import Scheme, Unit

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

class UnitAdmin(admin.ModelAdmin):
    list_display = (
        '__str__',
        'asset_class',
        'description',
        'unit_type',
        'quantity',
        'author_firm')

admin.site.register(Loan, LoanAdmin)
admin.site.register(Borrower, BorrowerAdmin)
admin.site.register(Scheme, SchemeAdmin)
admin.site.register(Unit, UnitAdmin)
