from rest_framework import serializers
from .models import Loan

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    
    class Meta:
        model = Loan
        fields = ['id', 'name']