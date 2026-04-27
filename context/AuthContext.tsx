'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  sessionToken: string | null;
  masterPassword: string | null;
  isAuthenticated: boolean;
  isSetup: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [masterPassword, setMasterPassword] = useState<string | null>(null);
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already logged in
    const token = localStorage.getItem('sessionToken');
    const hash = localStorage.getItem('masterPasswordHash');
    if (token && hash) {
      setSessionToken(token);
      setMasterPassword(hash);
      setIsSetup(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    const data = await response.json();
    setSessionToken(data.sessionToken);
    setMasterPassword(data.masterPasswordHash);
    setIsSetup(true);
    localStorage.setItem('sessionToken', data.sessionToken);
    localStorage.setItem('masterPasswordHash', data.masterPasswordHash);
    localStorage.setItem('username', username);
  };

  const logout = () => {
    setSessionToken(null);
    setMasterPassword(null);
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('masterPasswordHash');
    localStorage.removeItem('username');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ sessionToken, masterPassword, isAuthenticated: !!sessionToken, isSetup, login, logout }}>
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
