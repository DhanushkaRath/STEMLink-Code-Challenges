from django.contrib import admin
from .models.order import Order, OrderItem

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_amount', 'status', 'created_at', 'payment_status')
    list_filter = ('status', 'payment_status')
    search_fields = ('user__email', 'id')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'quantity', 'price', 'order')
    search_fields = ('product_name', 'order__id') 