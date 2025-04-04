import { ShoppingCart, Heart, Search, Plus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { SignedIn, SignedOut, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import CartDropdown from "@/components/CartDropdown";
import { Button } from "@/components/ui/button";


function Navigation(props) {
  const cart = useSelector((state) => state.cart.value);
  const savedItems = useSelector((state) => state.savedItems.savedItems);
  const [query, setQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  // Use both useAuth and useUser hooks
  const { isLoaded: isAuthLoaded, userId } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  
  // Wait for both auth and user to load
  const isFullyLoaded = isAuthLoaded && isUserLoaded;
  
  // More explicit admin check
  const userRole = user?.publicMetadata?.role;
  const isAdmin = userRole === 'admin';
  
  useEffect(() => {
    if (isFullyLoaded) {
      console.log('Auth State:', {
        isAuthLoaded,
        isUserLoaded,
        userId,
        email: user?.primaryEmailAddress?.emailAddress,
        role: userRole,
        isAdmin,
        metadata: user?.publicMetadata
      });
    }
  }, [isFullyLoaded, user, userId, userRole, isAdmin]);

  const getCartQuantity = () => {
    let count = 0;
    cart.forEach((item) => {
      count += item.quantity;
    });
    return count;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-b from-white to-gray-50 z-50 border-b border-gray-200 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between py-4 px-8 max-w-7xl mx-auto">
          <div className="flex gap-x-8 items-center">
            <a className="font-semibold text-3xl text-primary" href="/">
              Mebius
            </a>
            <div className="flex items-center gap-6">
              <a href="/" className="hover:text-primary transition-colors font-medium">Home</a>
              <a href="/shop" className="hover:text-primary transition-colors font-medium">Shop</a>
            </div>
          </div>

          {/* Search Bar - Only shown on home page */}
          {isHomePage && (
            <form onSubmit={handleSearch} className="relative max-w-md w-full hidden md:block">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="flex items-center gap-6">
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <ShoppingCart />
                {getCartQuantity() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartQuantity()}
                  </span>
                )}
              </button>
              <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>

            {/* Wishlist Link */}
            <Link 
              to="/shop/wishlist" 
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Heart className={savedItems.length > 0 ? "fill-red-500 stroke-red-500" : ""} />
              <span className="hidden md:inline">Wishlist</span>
              {savedItems.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {savedItems.length}
                </span>
              )}
            </Link>

            <SignedOut>
              <div className="flex items-center gap-4">
                <Link to="/sign-in" className="text-primary hover:text-primary/80 transition-colors">
                  Sign In
                </Link>
                <Link to="/sign-up" className="text-primary hover:text-primary/80 transition-colors">
                  Sign Up
                </Link>
              </div>
            </SignedOut>

            <SignedIn>
              <UserButton />
              {isFullyLoaded && isAdmin && (
                <Link to="/admin/products/create">
                  <Button className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
              )}
              <Link to="/shop/orders" className="hover:text-primary transition-colors font-medium">
                Orders
              </Link>
              <Link to="/account" className="hover:text-primary transition-colors font-medium">
                Account
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-[72px]"></div>
    </>
  );
}

export default Navigation;