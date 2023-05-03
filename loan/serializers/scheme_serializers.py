from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import serializers
from loan.models import scheme_models, loan_models
from loan.serializers import loan_serializers
from rest_framework.serializers import ValidationError
import pdb
from django.utils.text import camel_case_to_spaces, slugify

class SchemeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    loan = loan_serializers.LoanSerializer(required=False, allow_null=True)

    class Meta:
        model = scheme_models.Scheme
        fields = [
            'id',
            'loan',
            'name', 
            'street_name', 
            'postcode', 
            'city', 
            'country', 
            'opening_date',
            'system',
            'is_built']

    def update_validated_data(self, validated_data):
        loan_id = validated_data.pop("loan")["id"]
        loan = loan_models.Loan.objects.get(id=loan_id)
        validated_data.update({"loan": loan})

    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)

class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    scheme = SchemeSerializer(required=False, allow_null=True)

    class Meta:
        model = scheme_models.AssetClass
        fields = [
            'id', 
            'use',
            'scheme', 
            'investment_strategy']

    def update_validated_data(self, validated_data):
        scheme_id = validated_data.pop("scheme")["id"]
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})
    
    
    def create(self, validated_data):
        self.update_validated_data(validated_data)
        
        # Create an instance of the appropriate model class
        instance = self.Meta.model.objects.create(**validated_data)
        return instance
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)

class HotelSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Hotel
        fields = AssetClassSerializer.Meta.fields 

class ResidentialSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Residential
        fields = AssetClassSerializer.Meta.fields

class CommercialSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Commercial
        fields = AssetClassSerializer.Meta.fields

class StudentAccommodationSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.StudentAccommodation
        fields = AssetClassSerializer.Meta.fields

class OfficeSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Office
        fields = AssetClassSerializer.Meta.fields 

class ShoppingCentreSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.ShoppingCentre
        fields = AssetClassSerializer.Meta.fields

class BulkUpdateOrCreateSerializer(serializers.ListSerializer):
    def update_or_create(self, instances, validated_data):
        instances_mapping = {instance.id: instance for instance in instances}

        updated_instances = []
        created_instances = []

        for el in validated_data:
            el_id = el.get('id', None)
            if el_id in instances_mapping:
                instance = instances_mapping.get(el_id)
                updated_instance = self.child.update(instance, el)
                updated_instances.append(updated_instance)
            else:
                created_instance = self.child.create(el)
                created_instances.append(created_instance)

        return updated_instances + created_instances

class UnitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    asset_class = AssetClassSerializer(required=False, allow_null=True)
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
            'area_system']
        list_serializer_class = BulkUpdateOrCreateSerializer
    
    def update_validated_data(self, validated_data):
        asset_class_id = validated_data.pop("asset_class")["_id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})

    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
    
    def get_area_system(self, obj):
        scheme = obj.asset_class.scheme
        return scheme.system.lower()
    
class LeaseUnitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    unit = UnitSerializer(required=False, allow_null=True)

    class Meta:
        model = scheme_models.Lease
        fields = [
            'id', 
            'unit',
            'tenant', 
            'lease_type', 
            'rent_target_amount',
            'rent_target_frequency',
            'rent_achieved_amount',
            'rent_achieved_frequency',
            'start_date',
            'duration_value',
            'duration_unit',
            ] 
    
    def update_validated_data(self, validated_data):
        unit_id = validated_data.pop("unit")["_id"]
        unit = scheme_models.Unit.objects.get(id=unit_id)
        validated_data.update({"unit": unit})
    
    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
    
class SaleUnitSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    unit = UnitSerializer(required=False, allow_null=True)

    class Meta:
        fields = [
            'id', 
            'unit',
            'buyer', 
            'status', 
            'status_date',
            'price_target',
            'price_achieved'
            ]
    
    def update_validated_data(self, validated_data):
        unit_id = validated_data.pop("unit")["_id"]
        unit = scheme_models.Unit.objects.get(id=unit_id)
        validated_data.update({"unit": unit})
    
    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
        
