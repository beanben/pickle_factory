from django.shortcuts import get_object_or_404
from rest_framework import serializers
from loan.models import scheme_models, loan_models
# from loan.models.loan_models import Loan
# from loan.models.scheme_models import (
#     Scheme, AssetClass, Unit, Hotel, Residential, Retail,
#     StudentAccommodation, Office, ShoppingCentre, Unit)
from rest_framework.serializers import ValidationError
import pdb

class AssetClassUnitSerializer(serializers.Serializer):
    id = serializers.IntegerField() #otherwise not displayed as it is a readonly field by default

    class Meta:
        fields = ['id', 'scheme_id']

class UnitListSerializer(serializers.ListSerializer):
    def update(self, instances, validated_data):
        unit_mapping = {unit.id: unit for unit in instances}
        data_mapping = {item['id']: item for item in validated_data}
        
        ret = []
        for unit_id, data in data_mapping.items():
            unit = unit_mapping.get(unit_id, None)
            if unit is not None:
                ret.append(self.child.update(unit, data))

        return ret

class UnitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    asset_class = AssetClassUnitSerializer(required=False)
    identifier = serializers.CharField(required=False, allow_blank=True, default="")
    description = serializers.CharField(required=False, allow_blank= True, default="")
    area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=4)
    beds = serializers.IntegerField(required=False, allow_null= True)
    # quantity = serializers.IntegerField(required=False, allow_null= True) #only for reporting results of the qs


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
            'area_type']
        depth = 1
        list_serializer_class = UnitListSerializer


    def create(self, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})

        if "identifier" not in validated_data:
            units_per_asset_class = len(scheme_models.Unit.objects.filter(asset_class=asset_class))
            validated_data["identifier"] = f"{units_per_asset_class + 1}"
        
        return scheme_models.Unit.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})
        return super().update(instance, validated_data)

class UnitListSerializer(serializers.ListSerializer):
    # child = UnitSerializer()

    def update(self, instances, validated_data):  
        instance_hash = {index: instance for index, instance in enumerate(instances)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        return result

class UnitGroupSerializer(serializers.Serializer):
    asset_class = AssetClassUnitSerializer(required=False)
    description = serializers.CharField(required=False, allow_blank= True, default="")
    group_area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
    beds_per_unit = serializers.IntegerField(required=False, allow_null= True)
    group_beds = serializers.IntegerField(required=False, allow_null= True)
    quantity = serializers.IntegerField(required=False, allow_null= True) #only for reporting results of the qs



class AssetClassSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False) #otherwise not displayed as it is a readonly field by default
    scheme_id = serializers.IntegerField()
    units_grouped = serializers.SerializerMethodField(required=False, allow_null=True)
    units = serializers.SerializerMethodField(required=False, allow_null=True)

    class Meta:
        model = scheme_models.AssetClass
        fields = ['id', 'scheme_id', 'use', 'units_grouped', 'units']

    def get_units_grouped(self, obj):
        qs = scheme_models.AssetClass.objects.group_units_by_description(obj)
        return UnitGroupSerializer(qs, many=True).data
    
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
    use = serializers.CharField()

    class Meta:
        model = scheme_models.Hotel
        fields = AssetClassSerializer.Meta.fields + ['use']

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
    use = serializers.CharField()

    class Meta:
        model = scheme_models.Residential
        fields = AssetClassSerializer.Meta.fields + ['use']

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

class RetailSerializer(AssetClassSerializer):
    use = serializers.CharField()

    class Meta:
        model = scheme_models.Retail
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
        scheme_id = validated_data.pop("scheme_id")
        scheme = scheme_models.Scheme.objects.get(id=scheme_id)
        validated_data.update({"scheme": scheme})

        self.validate_use(validated_data["use"])

        retail = scheme_models.Retail.objects.create(**validated_data)
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
        model = scheme_models.Office
        fields = AssetClassSerializer.Meta.fields + ['use']

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
    use = serializers.CharField()

    class Meta:
        model = scheme_models.ShoppingCentre
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
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
    use = serializers.CharField()

    class Meta:
        model = scheme_models.StudentAccommodation
        fields = AssetClassSerializer.Meta.fields + ['use']

    def create(self, validated_data):
        # pdb.set_trace()
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