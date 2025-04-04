import { Button } from "@/components/ui/button";
import { useGetOrderQuery } from "@/lib/api";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

function CompletePage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get orderId from either location state or URL params
  const orderId = location.state?.orderId || searchParams.get('orderId');
  const paymentStatus = location.state?.paymentStatus || searchParams.get('status');

  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthLoaded && isSignedIn) {
        try {
          const authToken = await getToken();
          console.log('Auth token received:', authToken ? 'Yes' : 'No');
          setToken(authToken);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };
    fetchToken();
  }, [isAuthLoaded, isSignedIn, getToken]);

  // Debug logs
  console.log('Auth state:', { isAuthLoaded, isSignedIn, hasToken: !!token });
  console.log('Order completion state:', { orderId, paymentStatus, hasToken: !!token });

  const { data: orderData, isLoading, error } = useGetOrderQuery(
    token && orderId ? { orderId, token } : undefined,
    { skip: !token || !orderId }
  );

  // More debug logs
  console.log('Query state:', { isLoading, hasError: !!error, hasData: !!orderData });
  if (error) console.log('Query error:', error);
  if (orderData) console.log('Query data:', orderData);

  if (!isAuthLoaded || (isSignedIn && !token)) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold">Loading...</h2>
        <p className="mt-4 text-gray-600">Initializing authentication...</p>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold text-red-600">Authentication Required</h2>
        <p className="mt-4">Please sign in to view your order.</p>
        <Button asChild className="mt-4">
          <Link to="/sign-in">Sign In</Link>
        </Button>
      </main>
    );
  }

  if (!orderId) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold text-red-600">Order Not Found</h2>
        <p className="mt-4">No order information available.</p>
        <Button asChild className="mt-4">
          <Link to="/">Return to Home</Link>
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold">Loading Order Details...</h2>
        <p className="mt-4 text-gray-600">Fetching your order information...</p>
      </main>
    );
  }

  if (error || !orderData) {
    return (
      <main className="max-w-4xl mx-auto px-8 py-6">
        <h2 className="text-4xl font-bold text-red-600">Error Loading Order</h2>
        <p className="mt-4">{error?.data?.message || "Failed to load order details"}</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
        <Button asChild className="mt-4">
          <Link to="/">Return to Home</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-8 py-6">
      <h2 className="text-4xl font-bold text-green-600">Order Successful!</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Order Details</h3>
        <div className="space-y-4">
          {orderData.items?.map((item, index) => (
            <div key={index} className="flex justify-between border-b py-2">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex justify-between">
            <p className="font-medium">Total Price:</p>
            <p className="font-bold">${orderData.total?.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-600">Order ID: {orderData._id}</p>
          <p className="text-sm text-gray-600">Status: {orderData.status}</p>
          
          {orderData.shippingAddress && (
            <div className="mt-4">
              <h4 className="font-medium">Shipping Address</h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>{orderData.shippingAddress.line_1}</p>
                {orderData.shippingAddress.line_2 && (
                  <p>{orderData.shippingAddress.line_2}</p>
                )}
                <p>
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                  {orderData.shippingAddress.zip_code}
                </p>
                <p>Phone: {orderData.shippingAddress.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    </main>
  );
}

export default CompletePage;