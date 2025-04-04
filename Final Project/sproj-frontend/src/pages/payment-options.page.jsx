import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CreditCard, Lock } from "lucide-react";

// Main content component that handles the payment form
function PaymentOptionsContent({ orderId, total, orderData }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "number") {
      formattedValue = value.replace(/\s/g, "").match(/.{1,4}/g)?.join(" ") || "";
    }
    // Format expiry date
    else if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }
    // Format CVC
    else if (name === "cvc") {
      formattedValue = value.slice(0, 3);
    }

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate card details
      if (!validateCard()) {
        setIsProcessing(false);
        return;
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Navigate to completion page
      navigate("/shop/complete", { 
        state: { 
          orderId,
          paymentStatus: "PAID"
        },
        replace: true
      });
      
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const validateCard = () => {
    if (cardDetails.number.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (cardDetails.expiry.length !== 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (cardDetails.cvc.length !== 3) {
      toast.error("Please enter a valid CVC");
      return false;
    }
    if (!cardDetails.name) {
      toast.error("Please enter the cardholder name");
      return false;
    }
    return true;
  };

  return (
    <main className="max-w-md mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Payment Details</h1>
          <Lock className="text-green-600" />
        </div>

        <div className="mb-6">
          <p className="text-gray-600">Order Total:</p>
          <p className="text-2xl font-bold">${total.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <div className="relative">
              <Input
                type="text"
                name="number"
                placeholder="4242 4242 4242 4242"
                value={cardDetails.number}
                onChange={handleInputChange}
                className="pl-10"
                maxLength="19"
                required
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <Input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleInputChange}
                maxLength="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVC</label>
              <Input
                type="text"
                name="cvc"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={handleInputChange}
                maxLength="3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cardholder Name</label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <Lock className="inline-block h-4 w-4 mr-1" />
          Your payment information is secure
        </div>
      </Card>
    </main>
  );
}

// Wrapper component to handle navigation logic
function PaymentOptionsWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAndRedirect = () => {
      const { orderId, total, orderData } = location.state || {};
      
      if (!orderId || !total) {
        navigate("/shop/cart", { replace: true });
        return;
      }
      
      setIsValidating(false);
    };

    validateAndRedirect();
  }, [location.state, navigate]);

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const { orderId, total, orderData } = location.state || {};
  return <PaymentOptionsContent orderId={orderId} total={total} orderData={orderData} />;
}

export default PaymentOptionsWrapper; 