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
    # HotelList,
    # HotelDetail,
    # ResidentialList,
    # ResidentialDetail,
    # RetailList,
    # RetailDetail,
    # StudentAccommodationList,
    # StudentAccommodationDetail,
    # OfficeList,
    # OfficeDetail,
    # ShoppingCentreList,
    # ShoppingCentreDetail,
    UnitList,
    UnitDetail,
    asset_classes_choices,
    unit_area_types,
    system_types,
    AssetClassList,
    AssetClassDetail
)

unit_patterns = ([
    path('', UnitList.as_view()),
    path('<int:pk>/', UnitDetail.as_view()),
    # path('asset_class_choices/', asset_class_choices)
], 'unit')

# hotel_patterns = ([
#     path('', HotelList.as_view()),
#     path('<int:pk>/', HotelDetail.as_view()),
# ], 'hotel')

# residential_patterns = ([
#     path('', ResidentialList.as_view()),
#     path('<int:pk>/', ResidentialDetail.as_view()),
# ], 'residential')

# retail_patterns = ([
#     path('', RetailList.as_view()),
#     path('<int:pk>/', RetailDetail.as_view()),
# ], 'retail')

# student_accommodation_patterns = ([
#     path('', StudentAccommodationList.as_view()),
#     path('<int:pk>/', StudentAccommodationDetail.as_view()),
# ], 'student_accommodation')

# office_patterns = ([
#     path('', OfficeList.as_view()),
#     path('<int:pk>/', OfficeDetail.as_view()),
# ], 'office')

# shopping_centre_patterns = ([
#     path('', ShoppingCentreList.as_view()),
#     path('<int:pk>/', ShoppingCentreDetail.as_view())
# ], 'shopping_centre')

scheme_patterns = ([
    path('', SchemeList.as_view()),
    path('<int:pk>/', SchemeDetail.as_view()),
    path('asset_class_choices/', asset_classes_choices),
    path('unit_area_types/', unit_area_types),
    path('system_types/', system_types)
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
    # path('hotel/', include(hotel_patterns)),
    # path('residential/', include(residential_patterns)),
    # path('retail/', include(retail_patterns)),
    # path('student_accommodation/', include(student_accommodation_patterns)),
    # path('office/', include(office_patterns)),
    # path('shopping_centre/', include(shopping_centre_patterns)),
    path('unit/', include(unit_patterns)),
    path('asset_class/', include(asset_class_patterns)),
]