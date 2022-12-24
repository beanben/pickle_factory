from rest_framework import serializers
from .models import Loan
from django.forms import ValidationError

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, default='new loan')
    
    class Meta:
        model = Loan
        fields = ['id', 'name']

    def validate_name(self, name):
        # unique loan name per firm
        author_firm = self.context.get("author_firm")
        qs = Loan.objects.filter(name=name, author_firm=author_firm)
        if qs.exists():
            raise ValidationError("Loan's name must be unique")

        return name

    # def validate(self, attr):
    #     # unique loan name per firm
    #     author_firm = self.context.get("author_firm")
    #     qs = Loan.objects.filter(name=attr['name'], author_firm=author_firm)
    #     if qs.exists():
    #         raise ValidationError("Loan's name must be unique")

    #     return attr