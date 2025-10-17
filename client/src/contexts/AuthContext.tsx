import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  email: string;
  name: string;
  gender: string;
  imanScore: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string, gender: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      const data = await response.json();
      setUser(data.user);
      return data.user; // Return user data for immediate use
    } catch (error: any) {
      // Parse error response
      const errorMessage = error.message || 'Login failed';
      throw new Error(errorMessage.includes('401:') ? 'Invalid credentials' : errorMessage);
    }
  };

  const register = async (email: string, name: string, password: string, gender: string) => {
    try {
      const response = await apiRequest('POST', '/api/auth/register', { email, name, password, gender });
      const data = await response.json();
      setUser(data.user);
      return data.user; // Return user data for immediate use
    } catch (error: any) {
      // Parse error response
      const errorMessage = error.message || 'Registration failed';
      throw new Error(errorMessage.includes('400:') ? 'User already exists or invalid data' : errorMessage);
    }
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
      setUser(null);
    } catch (error) {
      // Even if logout fails on server, clear local state
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};