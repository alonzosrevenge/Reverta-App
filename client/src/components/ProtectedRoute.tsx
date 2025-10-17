import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Temporary bypass for development/testing
  const BYPASS_AUTH = true;

  useEffect(() => {
    if (!loading && !isAuthenticated && !BYPASS_AUTH) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading && !BYPASS_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && !BYPASS_AUTH) {
    return null;
  }

  return <>{children}</>;
};