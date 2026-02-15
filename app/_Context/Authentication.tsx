"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
interface AuthContextType {
  isLogin: decodeTokenType | undefined;
  logout: () => void;
}
interface decodeTokenType {
  role: string;
  _id:string
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLogin, setIsLogin] = useState<decodeTokenType | undefined>(undefined);
  const router=useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodeToken = jwtDecode<decodeTokenType>(token);
        setIsLogin(decodeToken);
      } catch (error) {
        console.log("Invalid token");
      }
    } else {
      setIsLogin(undefined);
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("token");
    setIsLogin(undefined);
    router.push("/Auth/Login")

  };

  return (
    <AuthContext.Provider value={{ isLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}