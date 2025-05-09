import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Heart, Star, Truck, Shield, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { addToSavedItems } from "@/lib/features/savedItems/savedItemsSlice";
import { toast } from "sonner";

function ProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const savedItems = useSelector((state) => state.savedItems.savedItems);
  const isSaved = savedItems.some((item) => item._id === productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart(product));
    toast.success('Added to cart');
  };

  const handleToggleSave = () => {
    if (!product) return;
    
    dispatch(addToSavedItems(product));
    toast.success(isSaved ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
      </div>
    );
  }

  const inventory = Number(product.inventory) || 0;
  const isOutOfStock = inventory <= 0;
  const isLowStock = inventory > 0 && inventory <= 3;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/shop')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-[500px] object-contain rounded-lg bg-gray-50 p-4"
          />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-4 left-4">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" className="absolute top-4 left-4">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(128 reviews)</span>
            </div>
          </div>

          <p className="text-3xl font-semibold text-green-600">${product.price}</p>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="h-5 w-5" />
            <span>{inventory} in stock</span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

          <div className="flex gap-4">
            <Button 
              className="flex-1 h-12 text-lg" 
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleToggleSave}
              className="rounded-full h-12 w-12"
            >
              <Heart className={`h-6 w-6 ${isSaved ? "fill-red-500 stroke-red-500" : ""}`} />
            </Button>
          </div>

          {/* Shipping & Returns */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-gray-600">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-sm text-gray-600">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage; 