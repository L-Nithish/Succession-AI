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
    try {
      const response = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const loggedUser: User = {
          id: data.userId,
          email: data.email,
          fullName: data.fullName,
          roles: data.roles
        };

        setAccessToken(data.accessToken);
        setUser(loggedUser);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Login request failed:", e);
      return false;
    }
  };

  const register = async (email: string, password: String, fullName: string, role: string): Promise<string | null> => {
    try {
      const response = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName, role })
      });

      if (response.ok) {
        return null; // Success, no error message
      } else {
        const errMsg = await response.text();
        return errMsg || "Registration failed.";
      }
    } catch (e) {
      console.error("Registration request failed:", e);
      return "Network error. Please try again.";
    }
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
