from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin

# api_patterns = ([
#     # path('auth/', include('authentication.urls')),
#     path('loan/', include('loan.urls')),
# ], 'api')

urlpatterns = [
    path('auth/', include('authentication.urls')),
    # path('api/', include(api_patterns)),
    path('api/', include('loan.urls')),
    path('admin/', admin.site.urls),
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html"))
]
