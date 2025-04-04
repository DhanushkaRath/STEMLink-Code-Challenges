import { createContext, useState, useContext } from "react";

const SavedItemsContext = createContext();

export function SavedItemsProvider({ children }) {
  const [savedItems, setSavedItems] = useState([]);

  return (
    <SavedItemsContext.Provider value={{ savedItems, setSavedItems }}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems() {
  return useContext(SavedItemsContext);
}
