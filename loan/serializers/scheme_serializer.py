from django.shortcuts import get_object_or_404
from rest_framework import serializers
from loan.models.loan import Loan
from loan.models.scheme import (
    Scheme, AssetClass, Unit, Hotel, Residential, Retail,
    StudentAccommodation, Office, ShoppingCentre, Unit)
import pdb

class AssetClassUnitSerializer(serializers.Serializer):
    id = serializers.IntegerField() #otherwise not displayed as it is a readonly field by default

    class Meta:
        fields = ['id', 'scheme_id']

class UnitSerializer(serializers.ModelSerializer):
    asset_class = AssetClassUnitSerializer()
    identifier = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
    beds = serializers.IntegerField(required=False, allow_null= True)
    
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
            'area_type']


    def create(self, validated_data):
        use_map = {
            'Hotel': Hotel,
            'Residential': Residential,
            'Retail': Retail,
            'Office': Office,
            'Shopping Centre': ShoppingCentre,
            'Student Accommodation': StudentAccommodation
        }
        
        # pdb.set_trace()
        
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})
        
        # asset_class = validated_data["asset_class"]

        if "identifier" not in validated_data:
            units_per_asset_class = len(Unit.objects.filter(asset_class=asset_class))
            validated_data["identifier"] = f"{units_per_asset_class + 1}"
        
        # pdb.set_trace()
        return Unit.objects.create(**validated_data)
    
class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False) #otherwise not displayed as it is a readonly field by default
    scheme_id = serializers.IntegerField()

    class Meta:
        model = AssetClass
        fields = ['id', 'scheme_id']
        # depth = 1

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

    # def get_asset_classes(self, obj):
    #     asset_classes = AssetClass.objects.filter(scheme=obj)
    #     return AssetClassSerializer(asset_classes, many=True).data

    def get_asset_classes(self, obj):
        qs = Scheme.objects.get_asset_classes(obj) #uses the custom manager
        return AssetClassSerializer(qs, many=True).data


class HotelSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)

    class Meta:
        model = Hotel
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        hotel = Hotel.objects.create(**validated_data)
        return hotel

class ResidentialSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)

    class Meta:
        model = Residential
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})
        
        residential = Residential.objects.create(**validated_data)
        return residential

class RetailSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)
    description = serializers.CharField(required=False)

    class Meta:
        model = Retail
        fields = AssetClassSerializer.Meta.fields + ['description', 'use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        retail = Retail.objects.create(**validated_data)
        return retail

class OfficeSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)

    class Meta:
        model = Office
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        office = Office.objects.create(**validated_data)
        return office

class ShoppingCentreSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)

    class Meta:
        model = ShoppingCentre
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        shopping_centre = ShoppingCentre.objects.create(**validated_data)
        return shopping_centre

class StudentAccommodationSerializer(AssetClassSerializer):
    use = serializers.CharField(read_only=True)

    class Meta:
        model = StudentAccommodation
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        student_accommodation = StudentAccommodation.objects.create(**validated_data)
        return student_accommodation