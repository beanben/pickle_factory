from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail,
    SchemeList,
    SchemeDetail,
    UnitSchemeList,
    UnitSchemeDetail
)

unit_patterns = ([
    path('', UnitSchemeList.as_view()),
    path('<int:pk>/', UnitSchemeDetail.as_view()),
], 'unit')
scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
    path('<int:pk>/unit/', include(unit_patterns)),
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