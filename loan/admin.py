from django.contrib import admin
from .models import Loan

class LoanAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'author_firm')

admin.site.register(Loan, LoanAdmin)
