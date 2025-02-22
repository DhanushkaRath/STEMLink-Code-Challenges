import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

import savedItemsReducer from './features/savedItemsSlice';


import { Api } from "./api";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    savedItems: savedItemsReducer,
    [Api.reducerPath]: Api.reducer,
  },

  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(Api.middleware),

});

setupListeners(store.dispatch);

export default store;