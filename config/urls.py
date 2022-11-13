from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.contrib import admin

urlpatterns = [
    # path('api/', include('api.urls')),
    path('admin/', admin.site.urls),
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html"))
]
