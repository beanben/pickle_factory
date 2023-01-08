from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail,
    BuildingList,
    BuildingDetail
)

building_patterns = ([
    path('', BuildingList.as_view()),
    path('<uuid:pk>/', BuildingDetail.as_view()),
], 'building')

borrower_patterns = ([
    path('', BorrowerList.as_view()),
    path('<uuid:pk>/', BorrowerDetail.as_view()),
], 'borrower')

loan_patterns = ([
    path('', LoanList.as_view()),
    path('<uuid:pk>/', LoanDetail.as_view()),
], 'loan')

urlpatterns = [
    path('loan/', include(loan_patterns)),
    path('borrower/', include(borrower_patterns)),
    path('borrower/<uuid:pk>/building', include(building_patterns)),
]