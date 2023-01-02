from django.contrib import admin
from .models.loan import Loan

class LoanAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'author_firm',
        'created_at')

admin.site.register(Loan, LoanAdmin)
