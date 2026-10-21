import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, AuthSession } from '../types/admin';
import { authService } from '../services/auth';

interface AuthContextType {
  user: AdminUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthSession>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(authService.getCurrentUser());
  const [session, setSession] = useState<AuthSession | null>(authService.getSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Sync on mount and subscribe to changes
    const unsub = authService.onAuthStateChanged((newUser) => {
      setUser(newUser);
      setSession(authService.getSession());
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const sess = await authService.login(email, password);
      setUser(sess.user);
      setSession(sess);
      return sess;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
