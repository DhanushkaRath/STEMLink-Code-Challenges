import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { updateQuantity } from "@/lib/features/cartSlice";
import { Minus, Plus } from "lucide-react";

function CartPage() {
  const cart = useSelector((state) => state.cart.value);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const dispatch = useDispatch();

  const handleCheckout = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    navigate("/shop/checkout");
  };

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (!cart || cart.length === 0) {
    return (
      <main className="px-8 py-6">
        <h2 className="text-4xl font-bold">My Cart</h2>
        <p className="mt-4">Your cart is empty</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Continue Shopping
        </Button>
      </main>
    );
  }

  return (
    <main className="px-8">
      <h2 className="text-4xl font-bold">My Cart</h2>
      <div className="mt-4 grid grid-cols-2 w-1/2 gap-x-4">
        {cart.map((item, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-4">
              <img
                src={item.product.image || "/placeholder.svg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground">
                  ${item.product.price}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.product._id, item.quantity, 1)}
                    disabled={item.quantity >= item.product.inventory}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground ml-2">
                    {item.product.inventory} in stock
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4 w-1/2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium">Total:</span>
          <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
        </div>
        <Button onClick={handleCheckout} className="w-full">
          Proceed to Checkout
        </Button>
      </div>
    </main>
  );
}

export default CartPage;