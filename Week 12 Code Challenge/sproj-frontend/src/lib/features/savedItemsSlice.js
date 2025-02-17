import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  savedItems: [],
};

const savedItemsSlice = createSlice({
  name: 'savedItems',
  initialState,
  reducers: {
    addToSavedItems: (state, action) => {
      const item = action.payload;
      const exists = state.savedItems.some((savedItem) => savedItem._id === item._id);
      
      if (exists) {
        state.savedItems = state.savedItems.filter((savedItem) => savedItem._id !== item._id);
      } else {
        state.savedItems.push(item);
      }
    },
  },
});

export const { addToSavedItems } = savedItemsSlice.actions;

export default savedItemsSlice.reducer;
