import { Heart, ShoppingCart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { addToSavedItems } from "@/lib/features/savedItems/savedItemsSlice";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.savedItems.savedItems);
  const isInWishlist = savedItems.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = () => {
    dispatch(addToSavedItems(product));
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Wishlist Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
      >
        <Heart 
          className={`h-5 w-5 transition-colors ${
            isInWishlist ? "fill-red-500 stroke-red-500" : "stroke-gray-600"
          }`}
        />
      </button>

      {/* Product Image and Link */}
      <Link to={`/shop/${product._id}`} className="block">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/shop/${product._id}`} className="block">
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">
            ${product.price}
          </p>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard; 