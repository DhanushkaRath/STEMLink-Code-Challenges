import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedItems: [],
};

export const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState,
  reducers: {
    addToSavedItems: (state, action) => {
      const item = action.payload;
      const existingIndex = state.savedItems.findIndex(
        (savedItem) => savedItem._id === item._id
      );
      
      if (existingIndex >= 0) {
        // If item exists, remove it (toggle off)
        state.savedItems.splice(existingIndex, 1);
      } else {
        // If item doesn't exist, add it (toggle on)
        state.savedItems.push(item);
      }
    },
    clearSavedItems: (state) => {
      state.savedItems = [];
    },
  },
});

// Export actions
export const { addToSavedItems, clearSavedItems } = savedItemsSlice.actions;

// Export reducer
export default savedItemsSlice.reducer; 