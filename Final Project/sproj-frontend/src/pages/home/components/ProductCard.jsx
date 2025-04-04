import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart/cartSlice";
import { Heart, HeartIcon, Package, ShoppingCart } from "lucide-react";

import { addToSavedItems } from "@/lib/features/savedItems/savedItemsSlice";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function ProductCard(props) {
  // const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const savedItems = useSelector((state) => state.savedItems.savedItems);
  const isSaved = savedItems.some((item) => item._id === props._id);
  
  // Ensure inventory is a number and has a default value of 5
  const inventory = Number(props.inventory) || 5;
  console.log(`Product ${props.name} inventory:`, inventory);
  
  const isOutOfStock = inventory <= 0;
  const isLowStock = inventory > 0 && inventory <= 3;

  const handleToggleSave = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    dispatch(
      addToSavedItems({
        _id: props._id,
        name: props.name,
        price: props.price,
        image: props.image,
        description: props.description,
        inventory: inventory
      })
    );
    toast.success(isSaved ? "Removed from wishlist" : "Added to wishlist");
  };
  

  const handleClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the add to cart button
    if (isOutOfStock) {
      return;
    }
    dispatch(
      addToCart({
        _id: props._id,
        name: props.name,
        price: props.price,
        image: props.image,
        description: props.description,
        inventory: inventory
      })
    );
    toast.success("Added to cart");
  };


  return (
    <Card>
      <Link to={`/shop/${props._id}`} className="block">
        <div className="h-80 bg-card rounded-lg p-4 relative">
          <img src={props.image} className="block" />
          {isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge variant="warning" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}
          <button  
            onClick={handleToggleSave} 
            className="absolute top-2 right-2 p-2 rounded-full bg-white hover:bg-gray-100 transition-all shadow-sm z-10"
          >
            <Heart 
              className={`h-5 w-5 ${isSaved ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
            />
          </button>
        </div>
        <div className="flex px-4 mt-4 items-center justify-between">
          <h2 className="text-2xl font-semibold">{props.name}</h2>
          <span className="block text-lg font-medium">${props.price}</span>
        </div>
        <div className="px-4 mt-2">
          <p className="text-sm">{props.description}</p>
        </div>
        <div className="px-4 mt-2 flex items-center gap-2 text-sm text-gray-600">
          <Package className="h-4 w-4" />
          <span>{inventory} in stock</span>
        </div>
        <div className="mt-1 p-4">
          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleClick}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? "Out of Stock" : "Add To Cart"}
          </Button>
        </div>
      </Link>
    </Card>
  );
}

export default ProductCard;