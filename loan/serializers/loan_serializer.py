from rest_framework import serializers
from rest_framework.serializers import ValidationError
from loan.models.loan import Loan
from loan.models.borrower import Borrower
from loan.serializers.scheme_serializer import AssetClassSerializer

class BorrowerNestedSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.IntegerField()

class SchemeNestedSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    street_name = serializers.CharField(allow_blank=True)
    postcode = serializers.CharField(allow_blank=True)
    city = serializers.CharField()
    country = serializers.CharField(allow_blank=True)
    # currency = serializers.CharField()
    # system = serializers.CharField()
    # units = UnitNestedSerializer(many=True, required=False)
    opening_date = serializers.DateField(required=False, allow_null=True)
    asset_classes = AssetClassSerializer(many=True, required=False)

class LoanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=255, default='new loan')
    borrower = BorrowerNestedSerializer(required=False, allow_null=True)
    schemes = SchemeNestedSerializer(required=False, allow_null=True, many=True)
    
    class Meta:
        model = Loan
        fields = ['id', 'name', 'borrower', 'schemes', 'slug']
        depth = 1


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