from rest_framework import serializers
from rest_framework.serializers import ValidationError
from loan.models.loan_models import Loan
from loan.models.borrower_models import Borrower
from loan.serializers import borrower_serializers
from django.shortcuts import get_object_or_404


class LoanSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    borrower_id = serializers.IntegerField(required=False, allow_null=True) 

    class Meta:
        model = Loan
        fields = ['id', 'name', 'borrower_id']

    def update_validated_data(self, validated_data):
        borrower_id = validated_data.pop("borrower_id", None)
        if borrower_id is not None:
            borrower = Borrower.objects.get(id=borrower_id)
            validated_data.update({"borrower": borrower})
       

    def create(self, validated_data):
        self.update_validated_data(validated_data)

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
        self.update_validated_data(validated_data)

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