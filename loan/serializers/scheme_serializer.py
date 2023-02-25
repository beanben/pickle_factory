from rest_framework import serializers
from loan.models.loan import Loan
from loan.models.scheme import (
    Scheme, AssetClass, Unit, Hotel, Residential, Retail,
    StudentAccommodation, Office, ShoppingCentre, Unit, Bed)

    
class AssetClassSerializer(serializers.ModelSerializer):
    scheme_id = serializers.IntegerField()

    class Meta:
        model = AssetClass
        fields = ['id', 'scheme_id']
        depth = 1

    def create(self, validated_data):
        scheme_id = validated_data.pop("scheme_id")
        scheme = Scheme.objects.get(id=scheme_id)

        validated_data.update({"scheme": scheme})
        asset_class = AssetClass.objects.create(**validated_data)
        return asset_class

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
        asset_classes = obj.asset_classes.all()
        serializer = AssetClassSerializer(asset_classes, many=True)
        return serializer.data


class UnitSerializer(serializers.ModelSerializer):
    asset_class_id = serializers.IntegerField()

    class Meta:
        model = Unit
        fields = [
            'id',
            'asset_class_id',
            'identifier',
            'description',
            'quantity',
            'area_size',
            'area_type']


    def create(self, validated_data):
        asset_class_id = validated_data.pop("asset_class_id")
        asset_class = AssetClass.objects.get(id=asset_class_id)

        validated_data.update({"asset_class": asset_class})
        unit = Unit.objects.create(**validated_data)
        return unit

class BedSerializer(serializers.ModelSerializer):
    unit_id = serializers.IntegerField()

    class Meta:
        model = Bed
        fields = [
            'id',
            'unit_id',
            'description',
            'width',
            'length',
            'height',
            'dimensions_type']
        depth = 1

    def create(self, validated_data):
        unit_id = validated_data.pop("unit_id")
        unit = Unit.objects.get(id=unit_id)

        validated_data.update({"unit": unit})
        bed = Bed.objects.create(**validated_data)
        return bed


class HotelSerializer(AssetClassSerializer):
    class Meta:
        model = Hotel
        fields = AssetClassSerializer.Meta.fields

class ResidentialSerializer(AssetClassSerializer):
    class Meta:
        model = Residential
        fields = AssetClassSerializer.Meta.fields

class RetailSerializer(AssetClassSerializer):
    class Meta:
        model = Retail
        fields = AssetClassSerializer.Meta.fields

class OfficeSerializer(AssetClassSerializer):
    class Meta:
        model = Office
        fields = AssetClassSerializer.Meta.fields

class ShoppingCentreSerializer(AssetClassSerializer):
    class Meta:
        model = ShoppingCentre
        fields = AssetClassSerializer.Meta.fields

class StudentAccommodationSerializer(AssetClassSerializer):
    class Meta:
        model = StudentAccommodation
        fields = AssetClassSerializer.Meta.fields