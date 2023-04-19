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


def asset_class_uses(request):
    subclasses = scheme_models.AssetClass.__subclasses__()
    asset_class_uses = [subclass.__name__ for subclass in subclasses]
    return JsonResponse(asset_class_uses, safe=False)

def system_types(request):
    system_choices = [{"value":x, "display":y} for x, y in scheme_models.Scheme.SYSTEM_CHOICES]
    return JsonResponse(system_choices, safe=False)

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
    lookup_field = 'slug'

    def update(self, request, *args, **kwargs):
        # pdb.set_trace()
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

class SchemeList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = scheme_models.Scheme.objects.all()
    serializer_class = scheme_serializers.SchemeSerializer

    def create(self, request, *args, **kwargs):
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
    # queryset = Unit.objects.all()
    serializer_class = scheme_serializers.UnitSerializer

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        # pdb.set_trace()
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
        'shopping centre': scheme_serializers.ShoppingCentreSerializer,
        'student accommodation': scheme_serializers.StudentAccommodationSerializer
    }

    def get_serializer_class(self):
        use = self.request.data.get('use').lower()
        return self.use_serialiser_map[use]
    
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
        'shopping centre': scheme_models.ShoppingCentre,
        'student accommodation': scheme_models.StudentAccommodation
    }

    use_serialiser_map = {
        'hotel': scheme_serializers.HotelSerializer,
        'residential': scheme_serializers.ResidentialSerializer,
        'commercial': scheme_serializers.CommercialSerializer,
        'office': scheme_serializers.OfficeSerializer,
        'shopping centre': scheme_serializers.ShoppingCentreSerializer,
        'student accommodation': scheme_serializers.StudentAccommodationSerializer
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

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'asset class updated',
            'response': response.data
        })
    
class SaleStatusChoicesView(APIView):
    # serializer_class = shared_serializers.ChoicesSerializer

    # def get_queryset(self):
    #     return [{'value': choice[0], 'label': choice[1]} for choice in scheme_models.Sale.STATUS_CHOICES]

    def get(self, request):
         choices = [{'value': choice[0], 'label': choice[1]} for choice in scheme_models.Sale.STATUS_CHOICES]
         serializer = shared_serializers.ChoicesSerializer(choices, many=True)
         return Response(serializer.data, status=status.HTTP_200_OK)
  


    
