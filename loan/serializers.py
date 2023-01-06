from rest_framework import serializers
from loan.models.borrower import Borrower
from rest_framework.serializers import ValidationError
from loan.models.loan import Loan
from loan.models.borrower import Borrower
import pdb

class LoanNestedSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.CharField()

class BorrowerNestedSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.CharField()

class BorrowerSerializer(serializers.ModelSerializer):
    loans = LoanNestedSerializer(many=True)

    class Meta:
        model = Borrower
        fields = ['id', 'name', 'author_firm', 'loans']

    def create(self, validated_data):
        # unique borrower per author firm
        author_firm = self.context.get("author_firm")
        qs = Borrower.objects.filter(name=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            raise ValidationError("Borrower's name must be unique")
        
        borrower = Borrower.objects.create(**validated_data)
        borrower.save()
        return borrower

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.save()
        return instance

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

        try:
            if validated_data["borrower"]:
                borrower = Borrower.objects.get(id=validated_data["borrower"]["id"])
                instance.borrower = borrower
        except KeyError:
            instance.borrower = None
        
        instance.save()
        return instance


