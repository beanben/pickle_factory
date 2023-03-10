from rest_framework import generics
from rest_framework.response import Response
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import (
    Scheme, 
    Unit, 
    AssetClass,
    Hotel,
    Residential,
    Retail,
    StudentAccommodation,
    Office,
    ShoppingCentre,
    )
from loan.serializers.borrower_serializer import BorrowerSerializer
from loan.serializers.loan_serializer import LoanSerializer
from loan.serializers.scheme_serializer import (
    SchemeSerializer, 
    UnitSerializer, 
    HotelSerializer,
    ResidentialSerializer, 
    RetailSerializer, 
    OfficeSerializer,
    ShoppingCentreSerializer, 
    StudentAccommodationSerializer)

from core.mixins import AuthorQuerySetMixin
from rest_framework import status
from django.http import JsonResponse
import pdb

# def available_asset_classes(request, pk):
#     subclasses = AssetClass.__subclasses__()
#     asset_classes_choices = [subclass.__name__ for subclass in subclasses]

#     scheme = Scheme.objects.get(pk=pk)
#     existing_asset_classes_uses = scheme.asset_classes.values_list('use', flat=True)

#     # asset_classes = [subclass.__name__ for subclass in existing_asset_classes_uses]
#     asset_classes_uses_available = [use for use in asset_classes_choices if use not in existing_asset_classes_uses]

#     pdb.set_trace()

#     return JsonResponse(asset_classes_uses_available, safe=False)

def asset_class_uses(request):
    subclasses = AssetClass.__subclasses__()
    asset_class_uses = [subclass.__name__ for subclass in subclasses]
    return JsonResponse(asset_class_uses, safe=False)

def system_types(request):
    system_choices = [{"value":x, "display":y} for x, y in Scheme.SYSTEM_CHOICES]
    return JsonResponse(system_choices, safe=False)

class LoanList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "loan created",
            'response': response.data
        })

class LoanDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    lookup_field = 'slug'

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('borrower')

    def update(self, request, *args, **kwargs):
        # pdb.set_trace()
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'loan updated',
            'response': response.data
        })

class BorrowerList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = Borrower.objects.all()
    serializer_class = BorrowerSerializer


    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'borrower created',
            'response': response.data
        })

class BorrowerDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Borrower.objects.all()
    serializer_class = BorrowerSerializer
    lookup_field = 'slug'

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('loans')

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'borrower updated',
            'response': response.data
        })

class SchemeList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('loan')

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "scheme created",
            'response': response.data
        })

class SchemeDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Scheme.objects.all()
    serializer_class = SchemeSerializer

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('loan')

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'scheme updated',
            'response': response.data
        })
    
class UnitList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

    # def get_queryset(self):
    #     return self.queryset.prefetch_related('asset_class')

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     # pdb.set_trace()
    #     if serializer.is_valid():
    #         self.perform_create(serializer)
    #         headers = self.get_success_headers(serializer.data)
    #         return Response({
    #             'status': "success",
    #             'message': "unit created",
    #             'response': serializer.data
    #         }, status=status.HTTP_201_CREATED, headers=headers)

    #     else:
    #         return Response({
    #             'status': "error",
    #             'message': "unit not created",
    #             'response': serializer.errors
    #         }, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        # pdb.set_trace()
        response = super().create(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': "unit created",
            'response': response.data
        })

class UnitDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

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
        'hotel': HotelSerializer,
        'residential': ResidentialSerializer,
        'retail': RetailSerializer,
        'office': OfficeSerializer,
        'shopping centre': ShoppingCentreSerializer,
        'student accommodation': StudentAccommodationSerializer
    }

    def get_serializer_class(self):
        use = self.request.data.get('use').lower()
        return self.use_serialiser_map[use]

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response({
    #         'status': "success",
    #         'message': "asset class created",
    #         'response': serializer.data
    #     }, status=status.HTTP_201_CREATED, headers=headers)
    
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
        'hotel': Hotel,
        'residential': Residential,
        'retail': Retail,
        'office': Office,
        'shopping centre': ShoppingCentre,
        'student accommodation': StudentAccommodation
    }

    use_serialiser_map = {
        'hotel': HotelSerializer,
        'residential': ResidentialSerializer,
        'retail': RetailSerializer,
        'office': OfficeSerializer,
        'shopping centre': ShoppingCentreSerializer,
        'student accommodation': StudentAccommodationSerializer
    }

    def get_object(self):
        
        pk = self.kwargs[self.lookup_field]
        asset_class = AssetClass.objects.get(id=pk)
        use = asset_class.use.lower()
        use_model = self.use_model_map[use]
        return use_model.objects.filter(id=pk).first()
    
    def get_serializer_class(self):
        pk = self.kwargs[self.lookup_field]
        asset_class = AssetClass.objects.get(id=pk)
        use = asset_class.use.lower()
        return self.use_serialiser_map[use]


    
    


    
