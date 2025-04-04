import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  savedItems: [],
};

export const savedItemsSlice = createSlice({
  name: "savedItems",
  initialState,
  reducers: {
    addToSavedItems: (state, action) => {
      const existingIndex = state.savedItems.findIndex(
        (item) => item._id === action.payload._id
      );
      if (existingIndex >= 0) {
        // If item exists, remove it (toggle off)
        state.savedItems.splice(existingIndex, 1);
      } else {
        // If item doesn't exist, add it (toggle on)
        state.savedItems.push(action.payload);
      }
    },
    removeSavedItem: (state, action) => {
      state.savedItems = state.savedItems.filter(
        (item) => item._id !== action.payload
      );
    },
    clearSavedItems: (state) => {
      state.savedItems = [];
    },
  },
});

export const { addToSavedItems, removeSavedItem, clearSavedItems } = savedItemsSlice.actions;

export default savedItemsSlice.reducer; 