import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, removeAuthToken, setCurrentUser, removeCurrentUser, getCurrentUser, getAuthToken } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  isApproved: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const savedUser = getCurrentUser();
      
      if (token && savedUser) {
        try {
          const response = await api.getMe();
          setUser(response);
          setCurrentUser(response);
        } catch (error) {
          removeAuthToken();
          removeCurrentUser();
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    setAuthToken(response.token);
    setUser(response.user);
    setCurrentUser(response.user);
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    const response = await api.register({ name, email, password, role });
    setAuthToken(response.token);
    setUser(response.user);
    setCurrentUser(response.user);
  };

  const logout = () => {
    removeAuthToken();
    removeCurrentUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
