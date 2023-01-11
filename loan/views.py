from rest_framework import generics
from rest_framework.response import Response
from .models.loan import Loan
from .models.borrower import Borrower
from .models.scheme import Scheme
from .serializers import LoanSerializer, BorrowerSerializer, SchemeSerializer
from core.mixins import AuthorQuerySetMixin
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

    def get_queryset(self):
        return self.queryset.prefetch_related('schemes')

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

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'scheme updated',
            'response': response.data
        })
    
