import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";


import HomePage from "./pages/home/home.page";
import ShopPage from "./pages/shop.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import CartPage from "./pages/cart.page";
import CheckoutPage from "./pages/checkout.page";
import ProductPage from "./pages/product.page";
import WishlistPage from "./pages/wishlist.page";
import OrdersPage from "./pages/orders.page";
import AdminProductCreatePage from "./pages/admin/admin-product-create.page";


import { store } from "@/lib/store";
import { Provider } from "react-redux";
import Protected from "@/layouts/Protected";
import AdminProtected from "@/layouts/AdminProtected";


import RootLayout from "./layouts/rootLayout/root.layout";
import MainLayout from "./layouts/MainLayout";
import AccountPage from "./pages/account.page";
import PaymentPage from "./pages/payment.page";
import CompletePage from "./pages/complete.page";
import { WebhookProvider } from "@/components/WebhookProvider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import Footer from "./components/Footer";



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/shop",
        children: [
          {
            index: true,
            element: <ShopPage />,
          },
          {
            path: ":productId", // Relative path
            element: <ProductPage />,
          },
          {
            path: "wishlist",  // Relative path
            element: (
              <SignedIn>
                <WishlistPage />
              </SignedIn>
            ),
          },
          {
            path: "orders",  // Relative path
            element: (
              <SignedIn>
                <OrdersPage />
              </SignedIn>
            ),
          },
        ],
      },
      {
        path: "/account",
        element: (
          <SignedIn>
            <AccountPage />
          </SignedIn>
        ),
      },
      {
        path: "/admin/products/create",
        element: (
          <SignedIn>
            <AdminProductCreatePage />
          </SignedIn>
        ),
      },
      {
        path: "/sign-in",
        element: (
          <SignedOut>
            <SignInPage />
          </SignedOut>
        ),
      },
      {
        path: "/sign-up",
        element: (
          <SignedOut>
            <SignUpPage />
          </SignedOut>
        ),
      },
    ],
  },
]);



const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env.local file");
}

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <Provider store={store}>
      <WebhookProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<RootLayout />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop/cart" element={<CartPage />} />
              <Route path="/shop/wishlist" element={<WishlistPage />} />
              <Route path="/shop/orders" element={<OrdersPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/shop/checkout" element={<CheckoutPage />} />
              <Route path="/shop/payment" element={<PaymentPage />} />
              <Route path="/shop/complete" element={<CompletePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:productId" element={<ProductPage />} />
              
              <Route element={<AdminProtected />}>
                  <Route
                    path="/admin/products/create"
                    element={<AdminProductCreatePage />}
                  />
                  <Route path="/admin/products/create" element={<AdminProductCreatePage />} />
                </Route>
              </Route>
            </Route>
        
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Routes>
        </BrowserRouter>
      </WebhookProvider>
    </Provider>
  </ClerkProvider>
  // </StrictMode>
);