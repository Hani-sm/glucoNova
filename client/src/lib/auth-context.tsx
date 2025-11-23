import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setAuthToken, removeAuthToken, setCurrentUser, removeCurrentUser, getCurrentUser, getAuthToken } from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  isApproved: boolean;
}

interface SkipAuthUser {
  id: string;
  name: string;
  role: 'patient' | 'doctor';
  isSkipAuth: true;
}

interface AuthContextType {
  user: User | SkipAuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  setSkipAuthUser: (role: 'patient' | 'doctor') => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | SkipAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthProvider: Initializing auth...');
      
      // Check for skip auth first
      const skipAuth = localStorage.getItem('skipAuth');
      const userRole = localStorage.getItem('userRole');
      
      if (skipAuth === 'true' && userRole) {
        console.log('AuthProvider: Skip auth detected, setting temporary user');
        const tempUser: SkipAuthUser = {
          id: `skip-auth-${Date.now()}`,
          name: 'Guest User',
          role: userRole as 'patient' | 'doctor',
          isSkipAuth: true
        };
        setUser(tempUser);
        setLoading(false);
        return;
      }
      
      const token = getAuthToken();
      
      if (token) {
        try {
          console.log('AuthProvider: Found token, fetching user info...');
          const response = await api.getMe();
          console.log('AuthProvider: User fetched successfully', response);
          setUser(response);
          setCurrentUser(response);
        } catch (error) {
          console.error('AuthProvider: Failed to fetch user, clearing token', error);
          removeAuthToken();
          removeCurrentUser();
          setUser(null);
        }
      } else {
        console.log('AuthProvider: No token found, user is logged out');
      }
      
      console.log('AuthProvider: Auth initialization complete');
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
    localStorage.removeItem('skipAuth');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const setSkipAuthUser = (role: 'patient' | 'doctor') => {
    const tempUser: SkipAuthUser = {
      id: `skip-auth-${Date.now()}`,
      name: 'Guest User',
      role,
      isSkipAuth: true
    };
    setUser(tempUser);
    localStorage.setItem('skipAuth', 'true');
    localStorage.setItem('userRole', role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setSkipAuthUser, isAuthenticated: !!user }}>
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
