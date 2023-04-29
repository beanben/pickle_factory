from rest_framework import serializers
from rest_framework.serializers import ValidationError
from loan.models.loan_models import Loan
from loan.models.borrower_models import Borrower
from loan.serializers import borrower_serializers


class LoanSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    borrower = borrower_serializers.BorrowerSerializer(required=False, allow_null=True) 

    class Meta:
        model = Loan
        fields = ['id', 'name', 'borrower']

    def create(self, validated_data):
        # loan name unique per author firm
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name__iexact=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            data = {
                'status': 'error',
                'message': 'Loan name must be unique'
                }
            raise ValidationError(data, code=400)

        loan = Loan.objects.create(**validated_data)
        return loan


    def update(self, instance, validated_data):
        # unique loan name per author firm
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name__iexact=validated_data['name'], author_firm=author_firm).exclude(id=instance.id)

        if qs.exists():
            data = {
                'status': 'error',
                'message': 'Loan name already taken'
                }
            raise ValidationError(data, code=400) 
        else:
            instance.name = validated_data["name"]
        
        try:
            if validated_data["borrower"]:
                borrower = Borrower.objects.get(id=validated_data["borrower"]["id"])
                instance.borrower = borrower
        except KeyError:
            instance.borrower = None
        
        instance.save()
        return instance