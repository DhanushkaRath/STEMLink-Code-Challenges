import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { addToSavedItems } from "@/lib/features/savedItems/savedItemsSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function WishlistPage() {
  const savedItems = useSelector((state) => state.savedItems.savedItems);
  const dispatch = useDispatch();

  const handleRemoveFromWishlist = (product) => {
    dispatch(addToSavedItems(product)); // Toggle will remove since it's already saved
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success("Added to cart");
  };

  if (savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Save items you like by clicking the heart icon on products</p>
          <Link to="/shop">
            <Button>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedItems.map((product) => (
          <Card key={product._id} className="overflow-hidden">
            <Link to={`/shop/${product._id}`} className="block">
              <div className="h-64 bg-card rounded-t-lg p-4 relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain" 
                />
              </div>
            </Link>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Link to={`/shop/${product._id}`} className="block">
                  <h2 className="text-xl font-semibold hover:text-primary transition-colors">
                    {product.name}
                  </h2>
                </Link>
                <span className="text-lg font-medium">${product.price}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Package className="h-4 w-4" />
                <span>{product.inventory} in stock</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inventory <= 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleRemoveFromWishlist(product)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage; 