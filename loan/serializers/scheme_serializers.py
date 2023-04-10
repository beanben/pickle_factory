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

# class UnitListSerializer(serializers.ListSerializer):
#     def create(self, validated_data):
#         units_data = [self.set_unit_data(unit_data) for unit_data in validated_data]
#         units = [scheme_models.Unit(**unit_data) for unit_data in units_data]

#         # Retrieve the highest identifier value for the asset class
#         asset_class_ids = [unit.asset_class.id for unit in units]
#         for asset_class_id in asset_class_ids:
#             max_identifier = self.get_max_identifier(asset_class_id)
#             for unit in units:
#                 if unit.asset_class_id == asset_class_id:
#                     max_identifier += 1
#                     unit.identifier = max_identifier

#         return scheme_models.Unit.objects.bulk_create(units)
    
#     def set_unit_data(self, unit_data):
#         asset_class_id = unit_data.pop("asset_class")["id"]
#         asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
#         unit_data.update({"asset_class": asset_class})
#         # pdb.set_trace()
#         unit_data["description"] = self.set_description(unit_data)
#         return unit_data
    
#     def get_max_identifier(self, asset_class_id):
#         max_identifier = 0
#         existing_units = scheme_models.Unit.objects.filter(asset_class_id=asset_class_id)
#         if existing_units.exists():
#             identifiers = [unit.identifier for unit in existing_units]
#             identifier_numbers = [int(identifier) for identifier in identifiers if identifier.isdigit()]
#             max_identifier = max(identifier_numbers)
#         return max_identifier

#     def update(self, instances, validated_data):
#         unit_mapping = {unit.id: unit for unit in instances}
#         data_mapping = {item['id']: item for item in validated_data}
        
#         ret = []
#         for unit_id, data in data_mapping.items():
#             unit = unit_mapping.get(unit_id, None)
#             if unit is not None:
#                 ret.append(self.child.update(unit, data))

#         return ret
    
#     def set_description(self, unit_data):
#         description = unit_data["description"]
#         unit_beds = unit_data.get("beds", 0) if unit_data.get("beds") is not None else 0
        
#         if unit_beds > 0 and description == "-":
#             description = f"{unit_data['beds']}-bed"
        
#         return description

class UnitSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    asset_class = AssetClassUnitSerializer(required=False)
    identifier = serializers.CharField(required=False, allow_blank=True, default="")
    description = serializers.CharField(required=False, allow_blank= True, default="-")
    area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=4)
    beds = serializers.IntegerField(required=False, allow_null= True)
    value = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
    area_system = serializers.CharField(required=False, allow_blank=True, default="")

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
        # list_serializer_class = UnitListSerializer


    def create(self, validated_data):
        asset_class_id = validated_data.pop("asset_class")["id"]
        asset_class = scheme_models.AssetClass.objects.get(id=asset_class_id)
        validated_data.update({"asset_class": asset_class})

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

class UnitListSerializer(serializers.ListSerializer):

    def update(self, instances, validated_data):  
        instance_hash = {index: instance for index, instance in enumerate(instances)}

        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]

        return result

# class UnitGroupSerializer(serializers.Serializer):
#     asset_class = AssetClassUnitSerializer(required=False)
#     description = serializers.CharField(required=False, allow_blank= True, default="")
#     group_area_size = serializers.DecimalField(required=False, allow_null= True, max_digits=20, decimal_places=2)
#     beds_per_unit = serializers.IntegerField(required=False, allow_null= True)
#     group_beds = serializers.IntegerField(required=False, allow_null= True)
#     quantity = serializers.IntegerField(required=False, allow_null= True) #only for reporting results of the qs

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
    
    # def get_units_grouped(self, obj):
    #     qs = scheme_models.AssetClass.objects.group_units_by_description(obj)
    #     return UnitGroupSerializer(qs, many=True).data
    
    def get_units(self, obj):
        units = scheme_models.Unit.objects.filter(asset_class=obj)
        return UnitSerializer(units, many=True).data
    
    # def get_total_units(self, obj):
    #     return scheme_models.Unit.objects.filter(asset_class=obj).count()
    #     # return len(scheme_models.Unit.objects.filter(asset_class=obj))
    
    # def get_total_units_area_size(self, obj):
    #     return scheme_models.Unit.objects.filter(asset_class=obj).aggregate(Sum('area_size'))["area_size__sum"]
    
    # def get_total_beds(self, obj):
    #     return scheme_models.Unit.objects.filter(asset_class=obj).aggregate(Sum('beds'))["beds__sum"]

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