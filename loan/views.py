from rest_framework import generics
from rest_framework.response import Response
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import Scheme
from .serializers import LoanSerializer, BorrowerSerializer, SchemeSerializer, UnitSchemeSerializer
from core.mixins import AuthorQuerySetMixin
from rest_framework import status
import pdb


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
        return self.queryset.prefetch_related('loans')

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
        return self.queryset.prefetch_related('loans')

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'scheme updated',
            'response': response.data
        })

class UnitSchemeList(AuthorQuerySetMixin, generics.ListCreateAPIView):
    queryset = Scheme.objects.all()
    serializer_class = UnitSchemeSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('loans')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response({
                'status': "success",
                'message': "scheme created",
                'response': serializer.data
            }, status=status.HTTP_201_CREATED, headers=headers)

        else:
            return Response({
                'status': "error",
                'message': "scheme not created",
                'response': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

class UnitSchemeDetail(AuthorQuerySetMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Scheme.objects.all()
    serializer_class = UnitSchemeSerializer

    def get_queryset(self):
        return self.queryset.prefetch_related('loans')

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'scheme updated',
            'response': response.data
        })
    
    


    
