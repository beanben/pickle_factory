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
    StudentAccommodationSerializer,
    AssetClassSerializer)

from core.mixins import AuthorQuerySetMixin
from rest_framework import status
from django.http import JsonResponse
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
import pdb

def asset_classes_choices(request):
    subclasses = AssetClass.__subclasses__()
    asset_classes_choices = [subclass.__name__ for subclass in subclasses]
    return JsonResponse(asset_classes_choices, safe=False)

def unit_area_types(request):
    unit_area_types = dict((x, y) for x, y in Unit.AREA_TYPE_CHOICES)
    return JsonResponse(unit_area_types)

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

    def get_queryset(self):
        return self.queryset.prefetch_related('borrower')

    def update(self, request, *args, **kwargs):
        # pdb.set_trace()
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'loan updated',
            'response': response.data
        })

    # def retrieve(self, request, *args, **kwargs):
    #     # pdb.set_trace()
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
        
    #     return Response(serializer.data)

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

    def get_queryset(self):
        return self.queryset.prefetch_related('loans')

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

    def get_queryset(self):
        return self.queryset.prefetch_related('loan')

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

    def get_queryset(self):
        return self.queryset.prefetch_related('loan')

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

    def get_queryset(self):
        return self.queryset.prefetch_related('asset_class')

    def get_serializer(self, *args, **kwargs):
        if isinstance(kwargs.get("data", {}), list):
            kwargs["many"] = True
        return super().get_serializer(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({
                'status': "success",
                'message': "unit created",
                'response': serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)

        else:
            return Response({
                'status': "error",
                'message': "unit not created",
                'response': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class UnitDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('asset_class')

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


# class HotelList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = Hotel.objects.all()
#     serializer_class = HotelSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "hotel created",
#             'response': response.data
#         })

# class HotelDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = Hotel.objects.all()
#     serializer_class = HotelSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "hotel updated",
#             'response': response.data
#         })

# class ResidentialList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = Residential.objects.all()
#     serializer_class = ResidentialSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "residential asset class created",
#             'response': response.data
#         })

# class ResidentialDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = Residential.objects.all()
#     serializer_class = ResidentialSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "residential asset class updated",
#             'response': response.data
#         })
    

# class RetailList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = Retail.objects.all()
#     serializer_class = RetailSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "retail created",
#             'response': response.data
#         })

# class RetailDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = Retail.objects.all()
#     serializer_class = RetailSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "retail updated",
#             'response': response.data
#         })
    
# class StudentAccommodationList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = StudentAccommodation.objects.all()
#     serializer_class = StudentAccommodationSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "student accommodation created",
#             'response': response.data
#         })

# class StudentAccommodationDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = StudentAccommodation.objects.all()
#     serializer_class = StudentAccommodationSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "student accommodation updated",
#             'response': response.data
#         })
    
# class OfficeList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = Office.objects.all()
#     serializer_class = OfficeSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "office created",
#             'response': response.data
#         })

# class OfficeDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = Office.objects.all()
#     serializer_class = OfficeSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "office updated",
#             'response': response.data
#         })
    
# class ShoppingCentreList(AuthorQuerySetMixin, generics.ListCreateAPIView):
#     queryset = ShoppingCentre.objects.all()
#     serializer_class = ShoppingCentreSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def create(self, request, *args, **kwargs):
#         response = super().create(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "shopping centre created",
#             'response': response.data
#         })

# class ShoppingCentreDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
#     queryset = ShoppingCentre.objects.all()
#     serializer_class = ShoppingCentreSerializer

#     def get_queryset(self):
#         return self.queryset.prefetch_related('scheme')

#     def update(self, request, *args, **kwargs):
#         response = super().update(request, *args, **kwargs)
#         return Response({
#             'status': "success",
#             'message': "shopping centre  updated",
#             'response': response.data
#         })

class AssetClassList(AuthorQuerySetMixin, generics.CreateAPIView):
    serializer_class_map = {
        'Hotel': HotelSerializer,
        'Residential': ResidentialSerializer,
        'Retail': RetailSerializer,
        'Office': OfficeSerializer,
        'Shopping Centre': ShoppingCentreSerializer,
        'Student Accommodation': StudentAccommodationSerializer
    }

    def get_serializer_class(self):
        # pdb.set_trace()
        asset_class = self.request.data['asset_class_type']
        return self.serializer_class_map[asset_class]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data["asset_class"])
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({
            'status': "success",
            'message': "asset class created",
            'response': serializer.data
        }, status=status.HTTP_201_CREATED, headers=headers)


class AssetClassDetail(AuthorQuerySetMixin, generics.DestroyAPIView):
    queryset = AssetClass.objects.all()
    serializer_class = AssetClassSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('scheme')


    
    


    
