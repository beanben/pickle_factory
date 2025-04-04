from django.shortcuts import get_object_or_404
from django.db.models import Sum
from rest_framework import serializers
from loan.models import scheme_models, loan_models
from loan.serializers import loan_serializers
from rest_framework.serializers import ValidationError
import pdb
from django.utils.text import camel_case_to_spaces, slugify
from loan.fields import CamelToSnakeCaseCharField, AngularDateField
# from core.mixins import ChoiceFieldSerializerMixin

class SchemeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    loan_id = serializers.IntegerField()

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
            'system',
            'is_built']

    def update_validated_data(self, validated_data):
        # loan_id = validated_data.pop("loan")["id"]
        
        loan_id = validated_data.pop("loan_id")
        loan = loan_models.Loan.objects.get(id=loan_id)
        validated_data.update({"loan": loan})

    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)

class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    scheme_id = serializers.IntegerField()
    investment_strategy = CamelToSnakeCaseCharField()
    use = CamelToSnakeCaseCharField()
    has_beds = serializers.SerializerMethodField()

    class Meta:
        model = scheme_models.AssetClass
        fields = [
            'id', 
            'use',
            'scheme_id', 
            'investment_strategy',
            'has_beds']

    def update_validated_data(self, validated_data):
        # scheme_id = validated_data.pop("scheme")["id"]
        scheme_id = validated_data.pop("scheme_id")
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
    
    def get_has_beds(self, obj):
        return obj.has_beds

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

class ParkingSerializer(AssetClassSerializer):
    class Meta:
        model = scheme_models.Parking
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
    id = serializers.IntegerField(required=False, allow_null=True)
    asset_class_id = serializers.IntegerField()
    area_type = serializers.SerializerMethodField()
    area_system = serializers.SerializerMethodField()
    
    class Meta:
        model = scheme_models.Unit
        fields = [
            'id',
            'asset_class_id',
            'identifier',
            'description',
            'beds',
            'area_size',
            'area_type',
            'area_system']
        list_serializer_class = BulkUpdateOrCreateSerializer
    
    def update_validated_data(self, validated_data):
        asset_class_id = validated_data.pop("asset_class_id")
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})

    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
    
    
    def get_area_system(self, obj):
        return obj.asset_class.scheme.get_system_display()

    def get_area_type(self, obj):
        return obj.area_type

    
class LeaseSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    unit_id = serializers.IntegerField()
    tenant = serializers.CharField(required=False, allow_blank=True)
    rent_target = serializers.DecimalField(max_digits=20, decimal_places=2, required=False, allow_null=True)
    rent_frequency = CamelToSnakeCaseCharField(required=False, allow_null=True)
    rent_achieved = serializers.DecimalField(max_digits=20, decimal_places=2, required=False, allow_null=True)
    start_date = AngularDateField(required=False, allow_null=True)
    end_date = AngularDateField(required=False, allow_null=True)
    lease_type = CamelToSnakeCaseCharField(required=False, allow_null=True)
    has_lease_type = serializers.SerializerMethodField()

    class Meta:
        model = scheme_models.Lease
        fields = [
            'id', 
            'unit_id',
            'lease_type', 
            'rent_target',
            'rent_frequency',
            'rent_achieved',
            'start_date',
            'end_date',
            'tenant',
            ]
    
    def update_validated_data(self, validated_data):
        # unit_id = validated_data.pop("unit")["id"]
        unit_id = validated_data.pop("unit_id")
        unit = scheme_models.Unit.objects.get(id=unit_id)
        validated_data.update({"unit": unit})
    
    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
    
    def has_lease_type(self, obj):
        return obj.has_lease_type

    def get_rent_frequency_display(self, instance):
        return instance.get_rent_frequency_display()
    
class SaleSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    unit_id = serializers.IntegerField()
    status = CamelToSnakeCaseCharField(required=False, allow_null=True)
    status_date = AngularDateField(required=False, allow_null=True)
    price_target = serializers.DecimalField(max_digits=20, decimal_places=2, required=False, allow_null=True)
    price_achieved = serializers.DecimalField(max_digits=20, decimal_places=2, required=False, allow_null=True)
    buyer = serializers.CharField(required=False, allow_blank=True)
    ownership_type = CamelToSnakeCaseCharField(required=False, allow_null=True)
    

    class Meta:
        model = scheme_models.Sale
        fields = [
            'id', 
            'unit_id', 
            'ownership_type',
            'price_target',
            'price_achieved',
            'status', 
            'status_date',
            'buyer',
            ]
    
    def validate_buyer(self, value):
        # If the value is None, return an empty string instead
        if value is None:
            return ""
        return value
    
    def update_validated_data(self, validated_data):
        # unit_id = validated_data.pop("unit")["id"]
        unit_id = validated_data.pop("unit_id")
        unit = scheme_models.Unit.objects.get(id=unit_id)
        validated_data.update({"unit": unit})
    
    def create(self, validated_data):
        self.update_validated_data(validated_data)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        self.update_validated_data(validated_data)
        return super().update(instance, validated_data)
        
class UnitAndSaleSerializer(serializers.Serializer):
    unit = UnitSerializer(required=False, allow_null=True)
    sale = SaleSerializer(required=False, allow_null=True)

class UnitAndLeaseSerializer(serializers.Serializer):
    unit = UnitSerializer(required=False, allow_null=True)
    lease = LeaseSerializer(required=False, allow_null=True)
