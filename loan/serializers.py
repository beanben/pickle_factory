from rest_framework import serializers
from .models import Loan
from rest_framework.serializers import ValidationError

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, default='new loan')
    
    class Meta:
        model = Loan
        fields = ['id', 'name']

    def validate_name(self, name):
        # unique loan name per firm
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name__iexact=name, author_firm=author_firm)
        if qs.exists():
            # raise ValidationError("Loan's name must be unique")
            data = {
                'status': 'error',
                'message': 'Loan name must be unique'
                }
            raise ValidationError(data, code=400)

        return name

    # def validate(self, attr):
    #     # unique loan name per firm
    #     author_firm = self.context.get("author_firm")
    #     qs = Loan.objects.filter(name=attr['name'], author_firm=author_firm)
    #     if qs.exists():
    #         raise ValidationError("Loan's name must be unique")

    #     return attr