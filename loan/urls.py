from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail
)

borrower_patterns = ([
    path('', BorrowerList.as_view()),
    path('<uuid:pk>/', BorrowerDetail.as_view())
], 'borrower')

urlpatterns = [
    path('', LoanList.as_view()),
    path('<uuid:pk>/', LoanDetail.as_view()),
    path('borrower/', include(borrower_patterns)),
]