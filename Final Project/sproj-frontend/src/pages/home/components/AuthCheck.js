import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

function AuthCheck() {
  const { getToken } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      console.log("Authentication Token:", token);
    };
    checkAuth();
  }, []);

  return null; // This component doesn't render anything
}

export default AuthCheck;
