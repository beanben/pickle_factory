from django.shortcuts import get_object_or_404
from rest_framework import serializers
from loan.models.loan import Loan
from loan.models.scheme import (
    Scheme, AssetClass, Unit, Hotel, Residential, Retail,
    StudentAccommodation, Office, ShoppingCentre, Unit)
from rest_framework.serializers import ValidationError
import pdb

class AssetClassUnitSerializer(serializers.Serializer):
    id = serializers.IntegerField() #otherwise not displayed as it is a readonly field by default

    class Meta:
        fields = ['id', 'scheme_id']

class UnitSerializer(serializers.ModelSerializer):
    asset_class = AssetClassUnitSerializer(required=False)
    identifier = serializers.CharField(required=False, default="")
    description = serializers.CharField(required=False, allow_blank= True, default="")
    area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
    beds = serializers.IntegerField(required=False, allow_null= True)
    quantity = serializers.IntegerField(required=False, allow_null= True) #only for reporting results of the qs

    class Meta:
        model = Unit
        fields = [
            'id',
            'asset_class',
            'label',
            'identifier',
            'description',
            'beds',
            'area_size',
            'area_type',
            'quantity']


    def create(self, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})

        if "identifier" not in validated_data:
            units_per_asset_class = len(Unit.objects.filter(asset_class=asset_class))
            validated_data["identifier"] = f"{units_per_asset_class + 1}"
        
        return Unit.objects.create(**validated_data)

# class GroupAssetClassUnit(serializers.Serializer):
#     description = serializers.CharField()
#     group_quantity = serializers.IntegerField()
#     group_beds = serializers.IntegerField()
#     group_area_size = serializers.DecimalField(max_digits=20, decimal_places=2)

#     class Meta:
#         fields = [
#             'description', 
#             'group_quantity',
#             'group_beds',
#             'group_area_size']


class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False) #otherwise not displayed as it is a readonly field by default
    scheme_id = serializers.IntegerField()
    units_grouped = serializers.SerializerMethodField(required=False, allow_null=True)

    class Meta:
        model = AssetClass
        fields = ['id', 'scheme_id', 'use', 'units_grouped']

    def get_units_grouped(self, obj):
        qs = AssetClass.objects.group_units_by_description(obj)
        # pdb.set_trace()
        return UnitSerializer(qs, many=True).data

class SchemeSerializer(serializers.ModelSerializer):
    loan_id = serializers.IntegerField()
    asset_classes = serializers.SerializerMethodField(required=False, allow_null=True)
    opening_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = Scheme
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
            'system']

    def create(self, validated_data):
        loan_id = validated_data.pop("loan_id")
        loan = Loan.objects.get(id=loan_id)

        validated_data.update({"loan": loan})
        scheme = Scheme.objects.create(**validated_data)
        return scheme


    def get_asset_classes(self, obj):
        qs = Scheme.objects.get_asset_classes(obj) #uses the custom manager
        return AssetClassSerializer(qs, many=True).data


class HotelSerializer(AssetClassSerializer):
    use = serializers.CharField()

    class Meta:
        model = Hotel
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data): 
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        

        hotel = Hotel.objects.create(**validated_data)
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
    use = serializers.CharField()

    class Meta:
        model = Residential
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        residential = Residential.objects.create(**validated_data)
        return residential
    
    def validate_use(self, value):
        if value.lower() != "residential":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class RetailSerializer(AssetClassSerializer):
    use = serializers.CharField()
    description = serializers.CharField(required=False)

    class Meta:
        model = Retail
        fields = AssetClassSerializer.Meta.fields + ['description', 'use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        retail = Retail.objects.create(**validated_data)
        return retail
    
    def validate_use(self, value):
        if value.lower() != "retail":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value

class OfficeSerializer(AssetClassSerializer):
    use = serializers.CharField()

    class Meta:
        model = Office
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        office = Office.objects.create(**validated_data)
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
    use = serializers.CharField()

    class Meta:
        model = ShoppingCentre
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        shopping_centre = ShoppingCentre.objects.create(**validated_data)
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
    use = serializers.CharField()

    class Meta:
        model = StudentAccommodation
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        student_accommodation = StudentAccommodation.objects.create(**validated_data)
        return student_accommodation
    
    def validate_use(self, value):
        if value.lower() != "student accommodation":
            data = {
                'status': 'error',
                'message': 'use type not valid'
                }
            raise ValidationError(data, code=400)
        return value