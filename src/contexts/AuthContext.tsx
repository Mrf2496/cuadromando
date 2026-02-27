'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de sesión local (Offline Deployment)
    const savedUser = localStorage.getItem('antigravity_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Modo Local: Cualquier contraseña funciona
    const mockUser: User = {
      uid: 'local-user-' + btoa(email),
      email,
      displayName: email.split('@')[0],
    };
    setUser(mockUser);
    localStorage.setItem('antigravity_session', JSON.stringify(mockUser));
    return mockUser;
  };

  const signInWithGoogle = async () => {
    const mockUser: User = {
      uid: 'google-mock-user',
      email: 'google-user@antigravity.local',
      displayName: 'Google Local User',
    };
    setUser(mockUser);
    localStorage.setItem('antigravity_session', JSON.stringify(mockUser));
    return mockUser;
  };

  const signUp = async (email: string, password: string) => {
    return signIn(email, password);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('antigravity_session');
  };

  const resetPassword = async (email: string) => {
    console.log("Reset password requested for (LOCAL MODE):", email);
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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
