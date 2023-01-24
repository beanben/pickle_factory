from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail,
    SchemeList,
    SchemeDetail
)

scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
], 'scheme')

borrower_patterns = ([
    path('', BorrowerList.as_view()),
    path('<slug:slug>/', BorrowerDetail.as_view()),
], 'borrower')

loan_patterns = ([
    path('', LoanList.as_view()),
    path('<slug:slug>/', LoanDetail.as_view()),
], 'loan')

urlpatterns = [
    path('loan/', include(loan_patterns)),
    path('borrower/', include(borrower_patterns)),
    path('scheme/', include(scheme_patterns)),
]