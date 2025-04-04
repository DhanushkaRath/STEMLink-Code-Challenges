import { useUser } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Calendar, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function AccountPage() {
  const { user } = useUser();
  const savedItems = useSelector((state) => state.savedItems.savedItems);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const accountSections = [
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: ShoppingBag,
      link: "/shop/orders",
    },
    {
      title: "Wishlist",
      description: `${savedItems.length} items saved`,
      icon: Heart,
      link: "/shop/wishlist",
    },
    {
      title: "Account Settings",
      description: "Manage your account settings",
      icon: Settings,
      link: "#",
      onClick: () => user.openSettings(),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      {/* Profile Section */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            <img
              src={user.imageUrl}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">{user.fullName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.primaryEmailAddress?.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => user.openSettings()}
            >
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Account Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountSections.map((section) => (
          <Card 
            key={section.title} 
            className="p-6 hover:shadow-lg transition-shadow"
          >
            {section.onClick ? (
              <button 
                onClick={section.onClick}
                className="w-full text-left"
              >
                <AccountSectionContent {...section} />
              </button>
            ) : (
              <Link to={section.link}>
                <AccountSectionContent {...section} />
              </Link>
            )}
          </Card>
        ))}
      </div>

      {/* Danger Zone */}
      <Card className="p-6 mt-8 border-red-200">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delete Account</p>
            <p className="text-sm text-gray-600">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button 
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => user.openSettings()}
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Helper component for account sections
function AccountSectionContent({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default AccountPage; 