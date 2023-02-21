from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail,
    SchemeList,
    SchemeDetail,
    # AssetClassList,
    # AssetClassDetail,
    # UnitList,
    # UnitDetail,
    asset_classes_choices
)

unit_patterns = ([
    # path('', UnitList.as_view()),
    # path('<int:pk>/', UnitDetail.as_view()),
    # path('asset_class_choices/', asset_class_choices)
], 'unit')

# asset_class_patterns = ([
#     path('', AssetClassList.as_view()),
#     path('<int:pk>/', AssetClassDetail.as_view()),
# ], 'asset_class')

scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
    # path('<int:pk>/asset-class/', include(asset_class_patterns)),
    # path('<int:pk>/unit/', include(unit_patterns)),
    path('asset_class_choices/', asset_classes_choices)
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
    # path('asset-class/', include(asset_class_patterns)),
    path('unit/', include(unit_patterns)),
]