'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '@/services/auth/authService';
import userService from '@/services/user/userService';

export interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserContextType {
  user: UserData | null;
  authorities: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (updatedUser: Partial<UserData>) => void;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [authorities, setAuthorities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const auth = await authService.getAuthStatus();

      if (auth.success && auth.data?.authenticated) {
        setIsAuthenticated(true);
        setAuthorities(auth.data?.authorities || []);
        const userResp = await userService.viewProfile();
        setUser(userResp.data ?? null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed fetching user:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<UserData>) => setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));

  const refreshUser = fetchUser;

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, authorities, isLoading, isAuthenticated, updateUser, refreshUser, logout }}>{children}</UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
