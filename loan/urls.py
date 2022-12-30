from django.urls import path
from .views import (
    LoanList,
    LoanDetail,
)

urlpatterns = [
    path('', LoanList.as_view()),
    path('<uuid:pk>/', LoanDetail.as_view())
]