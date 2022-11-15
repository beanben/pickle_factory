
from django.urls import path, include
from .views import (
    FirmList,
    FirmDetail,
    RegisterAPIView,
    TokenObtainPairView,
    ForgotAPIView,
    ResetAPIView,
    UserAPIView,
    UserUpdateAPIView
    )
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

firm_patterns = ([
    path('', FirmList.as_view()),
    path('<int:pk>/', FirmDetail.as_view()),
], 'firm')

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('firm/', include(firm_patterns)),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('forgot/', ForgotAPIView.as_view(), name='forgot'),
    path('reset/', ResetAPIView.as_view(), name='reset'),
    path('user/', UserAPIView.as_view(), name='user_detail'),
     path('user/<int:pk>/', UserUpdateAPIView.as_view(), name='user_update'),
]