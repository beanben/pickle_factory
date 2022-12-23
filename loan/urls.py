from django.urls import path
from .views import (
    LoanList,
    LoanDetail,
)

urlpatterns = [
    path('', LoanList.as_view()),
    path('<int:pk>/', LoanDetail.as_view())
]