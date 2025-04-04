import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./pages/home/components/Hero";
import SignInPage from "./lib/pages/sign-in.page";
import SignUpPage from "./lib/pages/sign-up.page";
import Navigation from "./components/Navigation";
import Products from "./pages/home/components/Products";
import { SavedItemsProvider } from "./lib/features/SavedItemsContext";
import { ClerkProvider, RedirectToSignIn } from '@clerk/clerk-react';
import ShopPage from "./pages/shop.page";
import Heart from "./Heart";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // Make sure this is imported

function App() {
  const name = "Dhanushka";
  const cartCount = 2;

  
  const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_Z2xhZC1qYXliaXJkLTQzLmNsZXJrLmFjY291bnRzLmRldiQ';

  return (
    <ClerkProvider frontendApi={clerkFrontendApi}>
      <Router>
        <SavedItemsProvider>
          <div>
            <Navigation name={name} cartCount={cartCount} />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Products />
                  <Heart />
                </>
              } />
              {/* Protect the /shop route */}
              <Route 
                path="/shop" 
                element={
                  <ProtectedRoute>
                    <ShopPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
            </Routes>
          </div>
        </SavedItemsProvider>
      </Router>
    </ClerkProvider>
  );
}

export default App;
