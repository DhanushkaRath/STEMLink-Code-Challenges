import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
// import { clear } from "console";

const initialState = {
  value: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const foundItem = state.value.find(
        (item) => item.product._id === product._id
      );

      // Check if product is out of stock
      if (product.inventory <= 0) {
        toast.error("This item is out of stock");
        return;
      }

      // Check if adding one more would exceed available inventory
      if (foundItem && foundItem.quantity >= product.inventory) {
        toast.error("Not enough items in stock");
        return;
      }

      if (foundItem) {
        foundItem.quantity += 1;
        toast.success("Added to cart");
      } else {
        state.value.push({ product: action.payload, quantity: 1 });
        toast.success("Added to cart");
      }
    },
    clearCart: (state) => {
      state.value = [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const foundItem = state.value.find(
        (item) => item.product._id === productId
      );

      if (foundItem) {
        const product = foundItem.product;
        if (quantity > product.inventory) {
          toast.error("Not enough items in stock");
          return;
        }
        foundItem.quantity = quantity;
      }
    },
  },
});

export const { addToCart, clearCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
