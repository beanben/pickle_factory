from rest_framework import serializers
from loan.models.loan import Loan
from rest_framework.serializers import ValidationError
from .borrower import BorrowerSerializer

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, default='new loan')
    borrower = BorrowerSerializer(required=False)
    
    class Meta:
        model = Loan
        fields = ['id', 'name', 'borrower']

    def validate_name(self, name):
        # unique loan name per firm
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name__iexact=name, author_firm=author_firm)
        if qs.exists():
            data = {
                'status': 'error',
                'message': 'Loan name must be unique'
                }
            raise ValidationError(data, code=400)

        return name