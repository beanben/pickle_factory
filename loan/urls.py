from django.urls import path, include
from .views import (
    LoanList,
    LoanDetail,
    LoanSchemes,
    BorrowerList,
    BorrowerDetail,
    SchemeList,
    SchemeDetail,
    SchemeAssetClasses,
    UnitList,
    UnitDetail,
    UnitsBulkUpdateDestroy,
    UnitsBulkUpdateCreate,
    # asset_class_uses,
    # system_types,
    AssetClassList,
    AssetClassDetail,
    AssetClassUnitsList,
    AssetClassUnitsWithSaleAndLease,
    # SaleStatusChoicesView,
    ChoicesView,
    UnitScheduleDataBulkUpdateCreate,
)

unit_patterns = ([
    path('', UnitList.as_view()),
    path('<int:asset_class_id>/', UnitList.as_view()),
    path('bulk_update_delete/', UnitsBulkUpdateDestroy.as_view()),
    path('bulk_update_create/', UnitsBulkUpdateCreate.as_view()),
    path('<int:pk>/', UnitDetail.as_view()),
    
    # path('sale_status_choices/', SaleStatusChoicesView.as_view()),
], 'unit')

scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
    path('<int:id>/asset_classes/', SchemeAssetClasses.as_view()),
    # path('asset_class_uses/', asset_class_uses),
    # path('system_types/', system_types),
], 'scheme')

borrower_patterns = ([
    path('', BorrowerList.as_view()),
    path('<slug:slug>/', BorrowerDetail.as_view()),
], 'borrower')

loan_patterns = ([
    path('', LoanList.as_view()),
    path('<int:id>/', LoanDetail.as_view()),
    path('<int:id>/schemes/', LoanSchemes.as_view()),
], 'loan')

asset_class_patterns = ([
    path('', AssetClassList.as_view()),
    path('<int:pk>/', AssetClassDetail.as_view()),
    path('<int:pk>/units/', AssetClassUnitsList.as_view()),
    path('<int:pk>/units_with_sale_and_lease/', AssetClassUnitsWithSaleAndLease.as_view()),
    path('unit_schedule_data_bulk_update_create/', UnitScheduleDataBulkUpdateCreate.as_view())
], 'asset_class')

urlpatterns = [
    path('loan/', include(loan_patterns)),
    path('borrower/', include(borrower_patterns)),
    path('scheme/', include(scheme_patterns)),
    path('unit/', include(unit_patterns)),
    path('asset_class/', include(asset_class_patterns)),
    path('choices/<str:choice_type>/', ChoicesView.as_view(), name='choices'),
]