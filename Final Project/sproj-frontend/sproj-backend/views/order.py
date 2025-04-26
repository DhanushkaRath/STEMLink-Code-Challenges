from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from ..models.order import Order
from ..serializers.order import OrderSerializer
import logging
import jwt
from django.conf import settings

logger = logging.getLogger(__name__)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_user_id_from_token(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise AuthenticationFailed('No token provided')
        
        token = auth_header.split(' ')[1]
        try:
            # Decode the JWT token
            decoded = jwt.decode(token, options={"verify_signature": False})
            return decoded.get('sub')  # Clerk stores user ID in 'sub' claim
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

    def get_queryset(self):
        try:
            user_id = self.get_user_id_from_token(self.request)
            return Order.objects.filter(user_id=user_id)
        except Exception as e:
            logger.error(f"Error getting orders: {str(e)}")
            return Order.objects.none()

    @action(detail=False, methods=['get'])
    def user_orders(self, request):
        try:
            user_id = self.get_user_id_from_token(request)
            orders = self.get_queryset()
            serializer = self.get_serializer(orders, many=True)
            return Response(serializer.data)
        except AuthenticationFailed as e:
            logger.error(f"Authentication error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            logger.error(f"Error in user_orders: {str(e)}")
            return Response(
                {"error": str(e)},  # Return the actual error message
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 