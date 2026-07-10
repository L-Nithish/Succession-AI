"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: String) => Promise<boolean>;
  register: (email: string, password: String, fullName: string, role: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on client mount
    const storedToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: String): Promise<boolean> => {
    // LOCAL SHOWCASE MODE: Bypass API and simulate immediate success
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const loggedUser: User = {
          id: "demo-user-id-123",
          email: email || "demo@succession.ai",
          fullName: "Premium Tester",
          roles: ["ROLE_USER", "ROLE_PREMIUM"]
        };

        setAccessToken("mock-jwt-token-12345");
        setUser(loggedUser);

        localStorage.setItem("accessToken", "mock-jwt-token-12345");
        localStorage.setItem("refreshToken", "mock-refresh-token-12345");
        localStorage.setItem("user", JSON.stringify(loggedUser));
        
        setLoading(false);
        resolve(true);
      }, 800); // simulate latency
    });
  };

  const register = async (email: string, password: String, fullName: string, role: string): Promise<string | null> => {
    // LOCAL SHOWCASE MODE: Automatically login user after registration
    return new Promise((resolve) => {
      setTimeout(() => {
        login(email, password); // just log them in
        resolve(null);
      }, 800);
    });
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
