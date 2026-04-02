"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  role: "admin" | "cliente";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: "demo-user",
  name: "Cliente Demo",
  email: "cliente@demo.com",
  isAdmin: true,
  role: "admin",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [isLoading] = useState(false);

  const login = async (email: string, _password: string) => {
    setUser({
      id: "demo-user",
      name: email.split("@")[0] || "Cliente Demo",
      email,
      isAdmin: true,
      role: "admin",
    });
  };

  const register = async (name: string, email: string, _password: string) => {
    setUser({
      id: "demo-user",
      name,
      email,
      isAdmin: true,
      role: "admin",
    });
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      isLoading,
      isAdmin: user?.isAdmin || false,
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
