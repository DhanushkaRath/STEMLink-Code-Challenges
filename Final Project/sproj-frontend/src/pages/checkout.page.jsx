import { Button } from "@/components/ui/button";
import { useCreateOrderMutation } from "@/lib/api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ShippingAddressForm from "@/components/ShippingAddressForm";

function CheckoutPage() {
  const cart = useSelector((state) => state.cart.value);
  const navigate = useNavigate();
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleProceedToPayment = (shippingData) => {
    // Navigate to payment page with shipping address data
    navigate("/shop/payment", {
      state: { shippingAddress: shippingData }
    });
  };
  
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Checkout</h2>
      
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="divide-y">
          {cart.map((item) => (
            <div key={item._id} className="py-4 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-600">${item.price} each</p>
              </div>
            </div>
          ))}
          
          <div className="py-4">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
        <div className="mt-2">
          <ShippingAddressForm onSubmit={handleProceedToPayment} cart={cart}/>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;