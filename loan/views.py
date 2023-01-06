from rest_framework import generics
from rest_framework.response import Response
from .models.loan import Loan
from .models.borrower import Borrower
from .serializers import LoanSerializer, BorrowerSerializer
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

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'loan updated',
            'response': response.data
        })

# <===== Borrower =====>
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

    # def retrieve(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = self.get_serializer(instance)
    #     pdb.set_trace()
    #     return Response(serializer.data)


    def get_queryset(self):
        # pdb.set_trace()
        return self.queryset.prefetch_related('loan_set')

    # # GET all related loans !!
    # def get_serializer_context(self):
    #     context = super().get_serializer_context()

    #     get_loans = False
    #     if 'loans' in self.request.get_full_path():
    #         get_loans = True

    #     context.update({"get_loans": get_loans})
    #     return context

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response({
            'status': "success",
            'message': 'borrower updated',
            'response': response.data
        })
