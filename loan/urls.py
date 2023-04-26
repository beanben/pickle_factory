from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    BorrowerList,
    BorrowerDetail,
    SchemeList,
    SchemeDetail,
    UnitList,
    UnitDetail,
    UnitsBulkUpdateDestroy,
    UnitsBulkUpdateCreate,
    asset_class_uses,
    system_types,
    AssetClassList,
    AssetClassDetail,
    SaleStatusChoicesView
)

unit_patterns = ([
    path('', UnitList.as_view()),
    path('bulk_update_delete/', UnitsBulkUpdateDestroy.as_view()),
    path('bulk_update_create/', UnitsBulkUpdateCreate.as_view()),
    path('<int:pk>/', UnitDetail.as_view()),
    path('sale_status_choices/', SaleStatusChoicesView.as_view()),
], 'unit')

scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
    path('asset_class_uses/', asset_class_uses),
    path('system_types/', system_types),
], 'scheme')

borrower_patterns = ([
    path('', BorrowerList.as_view()),
    path('<slug:slug>/', BorrowerDetail.as_view()),
], 'borrower')

loan_patterns = ([
    path('', LoanList.as_view()),
    path('<slug:slug>/', LoanDetail.as_view()),
], 'loan')

asset_class_patterns = ([
    path('', AssetClassList.as_view()),
    path('<int:pk>/', AssetClassDetail.as_view()),
], 'asset_class')

urlpatterns = [
    path('loan/', include(loan_patterns)),
    path('borrower/', include(borrower_patterns)),
    path('scheme/', include(scheme_patterns)),
    path('unit/', include(unit_patterns)),
    path('asset_class/', include(asset_class_patterns)),
]