import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Package, Plus } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"

function RootLayout() {
    const { isSignedIn, user } = useAuth();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex items-center">
                                <span className="text-xl font-bold">E-Shop</span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {isSignedIn && (
                                <>
                                    <Link to="/shop/cart">
                                        <Button variant="ghost" size="icon">
                                            <ShoppingCart className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link to="/shop/wishlist">
                                        <Button variant="ghost" size="icon">
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link to="/shop/orders">
                                        <Button variant="ghost" size="icon">
                                            <Package className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin/products/create">
                                            <Button variant="outline" className="flex items-center gap-2">
                                                <Plus className="h-4 w-4" />
                                                Add Product
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                            {!isSignedIn && (
                                <Link to="/sign-in">
                                    <Button>Sign In</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
}

export default RootLayout;