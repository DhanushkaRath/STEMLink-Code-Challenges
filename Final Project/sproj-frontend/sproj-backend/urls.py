from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.order import OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
] 