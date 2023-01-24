from django.contrib import admin
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import Scheme

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

admin.site.register(Loan, LoanAdmin)
admin.site.register(Borrower, BorrowerAdmin)
admin.site.register(Scheme, SchemeAdmin)
