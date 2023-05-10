from rest_framework import generics
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from loan.models import (borrower_models, 
                         loan_models, 
                         scheme_models)
from loan.serializers import (borrower_serializers, 
                                loan_serializers, 
                                scheme_serializers,
                                shared_serializers)
from core.mixins import AuthorQuerySetMixin
from rest_framework import status
from django.http import JsonResponse
import pdb
from django.shortcuts import get_object_or_404
from .utils import camel_to_snake, snake_to_camel


# def asset_class_uses(request):
#     subclasses = scheme_models.AssetClass.__subclasses__()
#     asset_class_uses = [subclass.__name__ for subclass in subclasses]
#     return JsonResponse(asset_class_uses, safe=False)

# def system_types(request):
#     system_choices = [{"value":x, "display":y} for x, y in scheme_models.Scheme.SYSTEM_CHOICES]
#     return JsonResponse(system_choices, safe=False)


class ChoicesView(APIView):
    def get(self, request, choice_type):
        choice_type = camel_to_snake(choice_type)

        choices_dict = {
            'system': scheme_models.Scheme.SYSTEM_CHOICES,
            'asset_class': scheme_models.AssetClass.ASSET_CLASS_CHOICES,
            'investment_strategy': scheme_models.AssetClass.INVESTMENT_STRATEGY_CHOICES,
            'sale_status': scheme_models.Sale.STATUS_CHOICES,
            'rent_frequency': scheme_models.Lease.RENT_FREQUENCY_CHOICES,
            'lease_frequency': scheme_models.Lease.LEASE_FREQUENCY_CHOICES,
            # Add more choices here if needed
        }

        # convert choice_dict keys from snake_caase to camelCase (for frontend)
        # choices_dict = {snake_to_camel(k): v for k, v in choices_dict.items()}

        if choice_type not in choices_dict:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        choices = [{'value': choice[0], 'label': choice[1]} for choice in choices_dict[choice_type]]
        serializer = shared_serializers.ChoicesSerializer(choices, many=True)
        # pdb.set_trace()
        return Response(serializer.data, status=status.HTTP_200_OK)

class LoanList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = loan_models.Loan.objects.all()
    serializer_class = loan_serializers.LoanSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "loan created",
            'response': response.data
        })

class LoanDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = loan_models.Loan.objects.all()
    serializer_class = loan_serializers.LoanSerializer
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'loan updated',
            'response': response.data
        })

class BorrowerList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = borrower_models.Borrower.objects.all()
    serializer_class = borrower_serializers.BorrowerSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'borrower created',
            'response': response.data
        })

class BorrowerDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = borrower_models.Borrower.objects.all()
    serializer_class = borrower_serializers.BorrowerSerializer
    lookup_field = 'slug'

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'borrower updated',
            'response': response.data
        })

class LoanSchemes(AuthorQuerySetMixin, generics.ListAPIView):
    queryset = scheme_models.Scheme.objects.all()
    serializer_class = scheme_serializers.SchemeSerializer

    def get_queryset(self):
        loan_id = self.kwargs['id']
        return scheme_models.Scheme.objects.filter(loan_id=loan_id)
    
class SchemeAssetClasses(AuthorQuerySetMixin, generics.ListAPIView):
    queryset = scheme_models.AssetClass.objects.all()
    serializer_class = scheme_serializers.AssetClassSerializer

    def get_serializer_class(self):
        # This method is not used in this case, but it's required to avoid errors.
        pass

    def get_queryset(self):
        scheme_id = self.kwargs['id']
        return scheme_models.AssetClass.objects.filter(scheme_id=scheme_id)
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = []

        use_serializer_map = {
            'hotel': scheme_serializers.HotelSerializer,
            'residential': scheme_serializers.ResidentialSerializer,
            'commercial': scheme_serializers.CommercialSerializer,
            'office': scheme_serializers.OfficeSerializer,
            'shopping_centre': scheme_serializers.ShoppingCentreSerializer,
            'student_accommodation': scheme_serializers.StudentAccommodationSerializer
        }


        for asset_class in queryset:
            serializer_class = use_serializer_map[asset_class.use]
            serializer = serializer_class(asset_class)
            serialized_data.append(serializer.data)

        return Response(serialized_data, status=status.HTTP_200_OK)
    
    
class SchemeList(AuthorQuerySetMixin, generics.CreateAPIView):
    queryset = scheme_models.Scheme.objects.all()
    serializer_class = scheme_serializers.SchemeSerializer
    
    def create(self, request, *args, **kwargs):
        # pdb.set_trace()
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "scheme created",
            'response': response.data
        })

class SchemeDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = scheme_models.Scheme.objects.all()
    serializer_class = scheme_serializers.SchemeSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'scheme updated',
            'response': response.data
        })
    
class UnitList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    serializer_class = scheme_serializers.UnitSerializer

    def get_queryset(self):
        asset_class_id = self.kwargs.get("asset_class_id")
        asset_class = get_object_or_404(scheme_models.AssetClass, id=asset_class_id)
        return scheme_models.Unit.objects.filter(asset_class=asset_class)
    
    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "unit created",
            'response': response.data
        })


class UnitsBulkUpdateDestroy(AuthorQuerySetMixin, generics.GenericAPIView):
    model = scheme_models.Unit
    serializer_class = scheme_serializers.UnitSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)
    
    def get_queryset(self, ids):
        return scheme_models.Unit.objects.filter(id__in=ids)

    def put(self, request, *args, **kwargs):
        return self.bulk_update(request, *args, **kwargs)
    
    def bulk_update(self, request, *args, **kwargs):
        ids = [unit["id"] for unit in request.data]
        instances = self.get_queryset(ids)

        # restrict the update to the filtered queryset
        serializer = self.get_serializer(
            instances, data=request.data, partial=False, many=True
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({
            'status': "success",
            'message': 'units bulk updated',
            'response': serializer.data
        })
    
    def perform_update(self, serializer):
        serializer.save()

    def delete(self, request, *args, **kwargs):
        return self.bulk_destory(request, *args, **kwargs)
    
    def bulk_destory(self, request, *args, **kwargs):
        ids = [unit["id"] for unit in request.data]
        instances = self.get_queryset(ids)
        self.perform_destroy(instances)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def perform_destroy(self, instances):
        instances.delete()

    
class UnitDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = scheme_models.Unit.objects.all()
    serializer_class = scheme_serializers.UnitSerializer

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('asset_class')

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'unit updated',
            'response': response.data
        })


class AssetClassList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    use_serialiser_map = {
        'hotel': scheme_serializers.HotelSerializer,
        'residential': scheme_serializers.ResidentialSerializer,
        'commercial': scheme_serializers.CommercialSerializer,
        'office': scheme_serializers.OfficeSerializer,
        'shopping_centre': scheme_serializers.ShoppingCentreSerializer,
        'student_accommodation': scheme_serializers.StudentAccommodationSerializer
    }

    def get_serializer_class(self):
        use = self.request.data.get('use')
        use = camel_to_snake(use)
        return self.use_serialiser_map[use]
    
    def post(self, request, *args, **kwargs):
        # request.data["investment_strategy"] = camel_to_snake(request.data["investment_strategy"])
        return self.create(request, *args, **kwargs)
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "asset class created",
            'response': response.data
        })


class AssetClassDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    lookup_field = 'pk'
    use_model_map = {
        'hotel': scheme_models.Hotel,
        'residential': scheme_models.Residential,
        'commercial': scheme_models.Commercial,
        'office': scheme_models.Office,
        'shopping_centre': scheme_models.ShoppingCentre,
        'student_accommodation': scheme_models.StudentAccommodation
    }

    use_serialiser_map = {
        'hotel': scheme_serializers.HotelSerializer,
        'residential': scheme_serializers.ResidentialSerializer,
        'commercial': scheme_serializers.CommercialSerializer,
        'office': scheme_serializers.OfficeSerializer,
        'shopping_centre': scheme_serializers.ShoppingCentreSerializer,
        'student_accommodation': scheme_serializers.StudentAccommodationSerializer
    }

    def get_object(self):
        pk = self.kwargs[self.lookup_field]
        asset_class = scheme_models.AssetClass.objects.get(id=pk)
        use = asset_class.use.lower()
        use_model = self.use_model_map[use]
        return use_model.objects.filter(id=pk).first()
    
    def get_serializer_class(self):
        pk = self.kwargs[self.lookup_field]
        asset_class = scheme_models.AssetClass.objects.get(id=pk)
        use = asset_class.use.lower()
        return self.use_serialiser_map[use]
    
    def put(self, request, *args, **kwargs):
        # request.data["investment_strategy"] = camel_to_snake(request.data["investment_strategy"])
        return self.update(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'asset class updated',
            'response': response.data
        })
    
# class SaleStatusChoicesView(APIView):
#     def get(self, request):
#          choices = [{'value': choice[0], 'label': choice[1]} for choice in scheme_models.Sale.STATUS_CHOICES]
#          serializer = shared_serializers.ChoicesSerializer(choices, many=True)
#          return Response(serializer.data, status=status.HTTP_200_OK)
    

class UnitsBulkUpdateCreate(AuthorQuerySetMixin, generics.GenericAPIView):
    serializer_class = scheme_serializers.UnitSerializer

    def get_queryset(self, ids):
        return scheme_models.Unit.objects.filter(id__in=ids)
    
    def post(self, request, *args, **kwargs):
        return self.bulk_update_create(request, *args, **kwargs)
    
    def bulk_update_create(self, request, *args, **kwargs):
        ids = [unit["id"] for unit in request.data]
        instances = self.get_queryset(ids)

        serializer = self.get_serializer(instances, data=request.data, partial=False, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'status': "success",
            'message': 'units bulk updated or created',
            'response': serializer.data
        })
    
    # def bulk_update(self, request, *args, **kwargs):
    #     ids = [unit["id"] for unit in request.data]
    #     instances = scheme_models.Unit.objects.filter(id__in=ids)
    #     serializer = self.get_serializer(
    #         instances, data=request.data, partial=False, many=True
    #     )
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_update(serializer)
    #     return serializer.data
    
    # def perform_update(self, serializer):
    #     serializer.save()

    # def bulk_create(self, request, *args, **kwargs):
    #     new_units = [unit for unit in request.data if unit.get('id') is None]
    #     serializer = self.get_serializer(data=new_units, many=True)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     return serializer.data
    
    # def perform_create(self, serializer):
    #     serializer.save()


class AssetClassUnitsList(AuthorQuerySetMixin, generics.ListAPIView):
    serializer_class = scheme_serializers.UnitSerializer

    def get_queryset(self):
        asset_class_id = self.kwargs['pk']
        asset_class = get_object_or_404(scheme_models.AssetClass, id=asset_class_id)
        return scheme_models.Unit.objects.filter(asset_class=asset_class)
    
class AssetClassUnitsWithSaleAndLease(AuthorQuerySetMixin, generics.ListAPIView):
    serializer_class = scheme_serializers.UnitSerializer

    def get_queryset(self):
        asset_class_id = self.kwargs['pk']
        asset_class = get_object_or_404(scheme_models.AssetClass, id=asset_class_id)
        return scheme_models.Unit.objects.filter(asset_class=asset_class)
    
    def list(self, request, *args, **kwargs):
        units = self.get_queryset()
        sales = scheme_models.Sale.objects.filter(unit__in=units)
        leases = scheme_models.Lease.objects.filter(unit__in=units)

        units_serializer = self.get_serializer(units, many=True)
        sales_serializer = scheme_serializers.SaleUnitSerializer(sales, many=True)
        leases_serializer = scheme_serializers.LeaseUnitSerializer(leases, many=True)

        unit_sale_lease_list = []

        for unit in units_serializer.data:
            unit_sale_lease_list.append({
                'unit': unit,
                'sale': [sale for sale in sales_serializer.data if sale['unit']['id'] == unit['id']],
                'lease': [lease for lease in leases_serializer.data if lease['unit']['id'] == unit['id']]
            })

        return Response(unit_sale_lease_list, status=status.HTTP_200_OK)
    

class UnitScheduleDataBulkUpdateCreate(AuthorQuerySetMixin, generics.GenericAPIView):
        serializer_class = scheme_serializers.UnitScheduleDataSerializer
        
        serializers_map = {
            'unit': scheme_serializers.UnitSerializer,
            'sale': scheme_serializers.SaleUnitSerializer,
            'lease': scheme_serializers.LeaseUnitSerializer
        }

        model_map = {
            'unit': scheme_models.Unit,
            'sale': scheme_models.Sale,
            'lease': scheme_models.Lease
        }

        def post(self, request, *args, **kwargs):
            return self.bulk_update_create(request, *args, **kwargs)

        def create_or_update(self, data, object_type):
            id = data["id"]
            model = self.model_map[object_type]
            serializer_type = self.serializers_map[object_type]
            instance = get_object_or_404(model, id=id) if id else None
            serializer = serializer_type(instance = instance, data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return serializer.data

        def bulk_update_create(self, request, *args, **kwargs):
            units_schedule_data = []
            
            for data in request.data:
                unit_serializer_data = self.create_or_update(data["unit"], 'unit')

                data_sale = data["sale"]
                data_sale["unit"] = unit_serializer_data
                sale_serializer_data = self.create_or_update(data_sale, 'sale')

                data_lease = data["lease"]
                data_lease["unit"] = unit_serializer_data
                lease_serializer_data = self.create_or_update(data_lease, 'lease')

                unit_shedule_data = {
                    "unit": unit_serializer_data,
                    "sale": sale_serializer_data,
                    "lease": lease_serializer_data
                }
                units_schedule_data.append(unit_shedule_data)

            response_data = self.get_serializer(units_schedule_data, many=True).data
            return Response(response_data, status=status.HTTP_200_OK)

        

