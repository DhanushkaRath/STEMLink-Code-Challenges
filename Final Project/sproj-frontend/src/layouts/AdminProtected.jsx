import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { Outlet } from "react-router";

function AdminProtected() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (user?.publicMetadata?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AdminProtected;