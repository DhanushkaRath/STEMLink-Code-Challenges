from rest_framework import serializers
from ..models.order import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'price', 'image_url']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'user_id', 'total_amount', 'status', 'created_at', 
                 'updated_at', 'shipping_address', 'payment_status', 'items']
        read_only_fields = ['id', 'created_at', 'updated_at'] 