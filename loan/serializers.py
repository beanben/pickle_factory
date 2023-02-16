from rest_framework import serializers
from loan.models.borrower import Borrower
from rest_framework.serializers import ValidationError
from loan.models.loan import Loan
from loan.models.borrower import Borrower
from loan.models.scheme import Scheme, Unit
import pdb

class BorrowerSerializer(serializers.ModelSerializer):
    loans = serializers.SerializerMethodField()

    class Meta:
        model = Borrower
        fields = ['id', 'name', 'author_firm', 'loans', 'slug']
        depth = 1

    def get_loans(self, obj):
        loans = Loan.objects.filter(borrower=obj)
        return LoanSerializer(loans, many=True).data

    def create(self, validated_data):
        # unique borrower per author firm
        author_firm = self.context.get("author_firm")
        qs = Borrower.objects.filter(name=validated_data['name'], author_firm=author_firm)
        if qs.exists():
            raise ValidationError("Borrower's name must be unique")
        
        borrower = Borrower.objects.create(**validated_data)
        return borrower

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]

        instance.save()
        return instance

class UnitSerializer(serializers.ModelSerializer):
    scheme_id = serializers.IntegerField()
    # asset_class = serializers.ChoiceField(choices=Unit.ASSET_CLASS_CHOICES)
    # asset_class = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = [
            'id',
            'asset_class',
            'unit_type',
            'description',
            'quantity', 
            'beds', 
            'area',
            'area_type',
            'scheme_id']
        depth = 1

    def create(self, validated_data):
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        # pdb.set_trace()
        unit = Unit.objects.create(**validated_data)
        return unit

    # def get_asset_class(self, obj):
    #     return obj.get_asset_class_display()

class BorrowerNestedSerializer(serializers.Serializer):
    name = serializers.CharField()
    id = serializers.IntegerField()

# class UnitNestedSerializer(serializers.Serializer):
#     id = serializers.IntegerField()
#     asset_class = serializers.ChoiceField(choices=Unit.ASSET_CLASS_CHOICES, read_only=False)
#     unit_type = serializers.CharField()
#     description = serializers.CharField()
#     quantity = serializers.IntegerField()
#     beds = serializers.IntegerField()
#     area = serializers.DecimalField(max_digits = 10, decimal_places = 2)
#     area_type = serializers.CharField()

class SchemeNestedSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    street_name = serializers.CharField(allow_blank=True)
    postcode = serializers.CharField(allow_blank=True)
    city = serializers.CharField()
    country = serializers.CharField(allow_blank=True)
    currency = serializers.CharField()
    system = serializers.CharField()
    # units = UnitNestedSerializer(many=True, required=False)
    units = UnitSerializer(many=True, required=False)


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


class SchemeSerializer(serializers.ModelSerializer):
    loan_id = serializers.IntegerField()
    units = serializers.SerializerMethodField()

    class Meta:
        model = Scheme
        fields = [
            'id', 
            'name', 
            'street_name', 
            'postcode', 
            'city', 
            'country', 
            'currency', 
            'system', 
            'loan_id', 
            'units']

    def create(self, validated_data):
        loan_id = validated_data.pop("loan_id")
        loan = Loan.objects.get(id=loan_id)

        validated_data.update({"loan": loan})
        scheme = Scheme.objects.create(**validated_data)
        return scheme

    def get_units(self, obj):
        units = Unit.objects.filter(scheme=obj)
        return UnitSerializer(units, many=True).data


