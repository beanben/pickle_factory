from rest_framework import serializers
from loan.models.loan import Loan
from loan.models.borrower import Borrower
from rest_framework.serializers import ValidationError
from .borrower import BorrowerNestedSerializer
import pdb

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, default='new loan')
    borrower = BorrowerNestedSerializer(required=False, allow_null=True)
    
    class Meta:
        model = Loan
        fields = ['id', 'name', 'borrower']

    def create(self, validated_data):
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name__iexact=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            data = {
                'status': 'error',
                'message': 'Loan name must be unique'
                }
            raise ValidationError(data, code=400)

        loan = Loan.objects.create(**validated_data)
        loan.save()
        return loan


    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        
        if validated_data["borrower"]:
            borrower = Borrower.objects.get(id=validated_data["borrower"]["id"])
            instance.borrower = borrower
        
        instance.save()
        return instance