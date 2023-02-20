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

# class UnitAdmin(admin.ModelAdmin):
#     list_display = (
#         '__str__',
#         'author_firm',
#         'asset_class_name',
#         'identifier',
#         'description',
#         'area',
#         'area_type',
#         )

#     def asset_class_name(self, obj):
#         return obj.asset_class.__class__.__name__

#     asset_class_name.short_description = 'Asset Class Name'

admin.site.register(Loan, LoanAdmin)
admin.site.register(Borrower, BorrowerAdmin)
admin.site.register(Scheme, SchemeAdmin)
# admin.site.register(Unit, UnitAdmin)
