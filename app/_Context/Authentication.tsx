"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface decodeTokenType {
  role: string;
  _id: string;
}

interface AuthContextType {
  isLogin: decodeTokenType | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogin, setIsLogin] = useState<decodeTokenType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 👈 Check localStorage token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<decodeTokenType>(token);
        setIsLogin(decoded);
      } catch (error) {
        console.log("Invalid token");
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // 👈 Login function
  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<decodeTokenType>(token);
    setIsLogin(decoded);
  };

  // 👈 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(null);
    router.push("/Auth/Login");
  };

  return (
    <AuthContext.Provider value={{ isLogin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 👈 Custom hook to use Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
