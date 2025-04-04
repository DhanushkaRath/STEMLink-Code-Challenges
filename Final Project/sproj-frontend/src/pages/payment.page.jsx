import { Button } from "@/components/ui/button";
import { clearCart } from "@/lib/features/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useCreateOrderMutation, useGetOrderQuery } from "@/lib/api";
import { webhookService } from "@/lib/webhookService";
import React from 'react';

function ErrorBoundary(props) {
  const [hasError, setHasError] = useState(false);

  const handleError = (error, errorInfo) => {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return props.children;
}

function PaymentPage() {
  const cart = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const userId = useSelector((state) => state.user?.id);
  const shippingAddress = location.state?.shippingAddress;

  console.log("User ID:", userId); // Check if this logs the correct ID

  // Handle authentication and navigation checks
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate("/sign-in");
      return;
    }

    if (cart.length === 0) {
      return <Navigate to="/" />;
    }
    

    if (!location.state?.shippingAddress) {
      navigate("/shop/checkout");
      return;
    }
  }, [isLoaded, isSignedIn, cart, location.state, navigate]);

  // Monitor order status if orderId exists
  const { data: orderData } = useGetOrderQuery(
    orderId ? { orderId, token: null } : undefined,
    { skip: !orderId }
  );

  // Show loading state while auth is loading
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Don't render anything if checks fail
  if (!isSignedIn || !cart?.length || !location.state?.shippingAddress) {
    return null;
  }

  // Calculate totals - ensure numbers are used
  const subtotal = cart.reduce((acc, item) => {
    // Check if item has price directly or in product property
    const price = Number(item.price || item.product?.price || 0);
    const quantity = Number(item.quantity || 1);
    return acc + (price * quantity);
  }, 0);
  
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Define the calculateTotal function
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = Number(item.price || item.product?.price || 0);
      const quantity = Number(item.quantity || 1);
      return total + (price * quantity);
    }, 0);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      console.log("Starting payment process...");

      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }

      const orderDetails = {
        items: cart.map(item => ({
          productId: item.id || item._id || `PROD_${Date.now()}`, // Ensure we have a productId
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: calculateTotal(),
        shippingAddress: {
          line_1: shippingAddress.line_1,
          line_2: shippingAddress.line_2,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zip_code: shippingAddress.zip_code,
          phone: shippingAddress.phone
        }
      };

      console.log("Sending order details:", orderDetails); // Debug log

      const response = await fetch("http://localhost:8000/api/orders", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result = await response.json();
      console.log('Order submitted successfully:', result);
      setOrderId(result.orderId);
      toast.success("Order placed successfully!");
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Navigate to order confirmation
      navigate("/shop/complete", { state: { orderId: result.orderId } });

    } catch (error) {
      console.error('Payment process - Error:', error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Monitor order status changes
  useEffect(() => {
    if (orderId && orderData?.paymentStatus) {
      if (orderData.paymentStatus === "PAID") {
        toast.success("Payment successful!");
        navigate("/shop/complete", { state: { orderId } });
      } else if (orderData.paymentStatus === "FAILED") {
        toast.error("Payment failed. Please try again.");
      }
    }
  }, [orderId, orderData?.paymentStatus, navigate]);

  return (
    <ErrorBoundary>
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold mb-6">Review Your Order</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Order Items</h3>
          <div className="space-y-4">
            {cart.map((item, index) => {
              const price = Number(item.price || item.product?.price || 0);
              const quantity = Number(item.quantity || 1);
              const itemTotal = price * quantity;
              const name = item.name || item.product?.name;
              
              return (
                <div key={index} className="flex items-center justify-between py-4 border-b">
                  <div className="flex-1">
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${itemTotal.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      ${price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-2 text-gray-600">
              <p>{shippingAddress.line_1}</p>
              {shippingAddress.line_2 && <p>{shippingAddress.line_2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip_code}</p>
              <p>Phone: {shippingAddress.phone}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium">${subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax (10%)</p>
              <p className="font-medium">${tax.toFixed(2)}</p>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-lg font-bold">${total.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={handlePayment} 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              disabled={isCreatingOrder || isProcessing}
            >
              {isCreatingOrder || isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </Button>
          </div>

          {orderId && orderData?.paymentStatus && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Order Status: <span className="font-medium">{orderData.paymentStatus}</span>
              </p>
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
}

export default PaymentPage;