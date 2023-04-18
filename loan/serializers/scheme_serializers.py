from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import serializers
from loan.models import scheme_models, loan_models
from rest_framework.serializers import ValidationError
import pdb
from django.utils.text import camel_case_to_spaces, slugify

class AssetClassUnitSerializer(serializers.Serializer):
    id = serializers.IntegerField() #otherwise not displayed as it is a readonly field by default
    investment_strategy = serializers.CharField(required=False, allow_blank= True)

    class Meta:
        fields = ['id', 'scheme_id', 'investment_strategy', 'use']


class UnitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    asset_class = AssetClassUnitSerializer(required=False)
    identifier = serializers.CharField(required=False, allow_blank=True, default="")
    description = serializers.CharField(required=False, allow_blank= True, default="-")
    area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=4)
    beds = serializers.IntegerField(required=False, allow_null= True)
    value = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
    area_system = serializers.SerializerMethodField(required=False, allow_null=True)

    class Meta:
        model = scheme_models.Unit
        fields = [
            'id',
            'asset_class',
            'label',
            'identifier',
            'description',
            'beds',
            'area_size',
            'area_type',
            'area_system',
            'value']
        depth = 1


    def create(self, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})
        
        # Check if an identical identifier already exists for this AssetClass
        identifier = validated_data.get("identifier")
        if identifier and scheme_models.Unit.objects.filter(asset_class=asset_class, identifier=identifier).exists():
            raise serializers.ValidationError("This identifier is already in use for this AssetClass.")
        
        if validated_data["identifier"] == "":
            # pdb.set_trace()
            units_per_asset_class = len(scheme_models.Unit.objects.filter(asset_class=asset_class))
            validated_data["identifier"] = f"{units_per_asset_class + 1}"   
        
        description = self.set_description(validated_data)
        validated_data["description"] = description
        return scheme_models.Unit.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})
        return super().update(instance, validated_data)
    
    def set_description(self, unit_data):
        description = unit_data["description"]
        unit_beds = unit_data.get("beds", 0) if unit_data.get("beds") is not None else 0
        
        if unit_beds > 0 and description == "-":
            description = f"{unit_data['beds']}-bed"
        
        return description
    
    def get_area_system(self, obj):
        scheme = obj.asset_class.scheme
        return scheme.system.lower()

class UnitListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):  
        instance_hash = {index: instance for index, instance in enumerate(instances)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        return result


class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False) #otherwise not displayed as it is a readonly field by default
    scheme_id = serializers.IntegerField(required=False)
    units = serializers.SerializerMethodField(required=False, allow_null=True)
    investment_strategy = serializers.CharField(required=False, allow_blank= True)

    class Meta:
        model = scheme_models.AssetClass
        fields = [
            'id', 
            'scheme_id', 
            'use', 
            'units', 
            'investment_strategy']
        depth = 1

    def get_scheme(self, obj):
        qs = scheme_models.Scheme.objects.filter(id=obj.scheme.id)
        return SchemeSerializer(qs, many=True).data
    
    def get_units(self, obj):
        units = scheme_models.Unit.objects.filter(asset_class=obj)
        return UnitSerializer(units, many=True).data


class SchemeSerializer(serializers.ModelSerializer):
    loan_id = serializers.IntegerField()
    asset_classes = serializers.SerializerMethodField(required=False, allow_null=True)
    opening_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = scheme_models.Scheme
        fields = [
            'id',
            'loan_id',
            'name', 
            'street_name', 
            'postcode', 
            'city', 
            'country', 
            'opening_date',
            'asset_classes',
            'system',
            'is_built']
        depth = 1

    def create(self, validated_data):
        loan_id = validated_data.pop("loan_id")
        loan = loan_models.Loan.objects.get(id=loan_id)

        validated_data.update({"loan": loan})
        scheme = scheme_models.Scheme.objects.create(**validated_data)
        return scheme


    def get_asset_classes(self, obj):
        qs = scheme_models.Scheme.objects.get_asset_classes(obj) #uses the custom manager
        return AssetClassSerializer(qs, many=True).data


class HotelSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Hotel
        fields = AssetClassSerializer.Meta.fields 

    def create(self, validated_data): 
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        hotel = scheme_models.Hotel.objects.create(**validated_data)
        return hotel
    
    def validate_use(self, value):
        if value.lower() != "hotel":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class ResidentialSerializer(AssetClassSerializer):

    class Meta:
        model = scheme_models.Residential
        fields = AssetClassSerializer.Meta.fields

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        residential = scheme_models.Residential.objects.create(**validated_data)
        return residential
    
    def validate_use(self, value):
        if value.lower() != "residential":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class CommercialSerializer(AssetClassSerializer):

    class Meta:
        model = scheme_models.Commercial
        fields = AssetClassSerializer.Meta.fields

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        commercial = scheme_models.Commercial.objects.create(**validated_data)
        return commercial
    
    def validate_use(self, value):
        if value.lower() != "commercial":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class OfficeSerializer(AssetClassSerializer):

    class Meta:
        model = scheme_models.Office
        fields = AssetClassSerializer.Meta.fields 

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        office = scheme_models.Office.objects.create(**validated_data)
        return office
    
    def validate_use(self, value):
        if value.lower() != "office":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class ShoppingCentreSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.ShoppingCentre
        fields = AssetClassSerializer.Meta.fields

    def create(self, validated_data):
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        shopping_centre = scheme_models.ShoppingCentre.objects.create(**validated_data)
        return shopping_centre
    
    def validate_use(self, value):
        if value.lower() != "shopping centre":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class StudentAccommodationSerializer(AssetClassSerializer):

    class Meta:
        model = scheme_models.StudentAccommodation
        fields = AssetClassSerializer.Meta.fields

    def create(self, validated_data):
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        student_accommodation = scheme_models.StudentAccommodation.objects.create(**validated_data)
        return student_accommodation
    
    def validate_use(self, value):
        if value.lower() != "student accommodation":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value


# class SaleSerializer(serializers.ModelSerializer):
#     buyer_type = serializers.ChoiceField(choices=scheme_models.Sale.BUYER_TYPE_CHOICES)

#     class Meta:
#         model = scheme_models.Sale
#         fields = ('id', 'buyer_type')

    # def create(self, validated_data):
    #     buyer_type = validated_data["buyer_type"]
    #     if buyer_type == scheme_models.Sale.INDIVIDUAL:
    #         serializer = IndividualSaleSerializer(data=self.context["request"].data)
            