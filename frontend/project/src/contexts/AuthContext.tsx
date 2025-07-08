import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null
  });

  useEffect(() => {
    // Check for stored user and token on mount
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('access_token');

      if (storedUser && token) {
        try {
          // Verify token is still valid by making a request to /auth/me
          const user = await api.getCurrentUser();
          setState({ user, isLoading: false, error: null });
        } catch (error) {
          // Token is invalid, clear stored data
          localStorage.removeItem('user');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setState({ user: null, isLoading: false, error: null });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const user = await api.login(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      setState({ user, isLoading: false, error: null });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await api.logout();
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState({ user: null, isLoading: false, error: null });
    } catch (error) {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState({ user: null, isLoading: false, error: null });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};