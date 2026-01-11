import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services';
import { tokenManager } from '../../lib/axios';
import { User } from '../../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = tokenManager.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to load user:', error);
      tokenManager.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    tokenManager.setToken(response.token);
    await loadUser();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.removeToken();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
