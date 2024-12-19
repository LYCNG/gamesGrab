import React, { createContext, ReactNode, useContext, useState } from "react";
import { RoleType, User } from "../types/user";

interface AuthContextType {
  user: User | null;
  login: (
    account: string,
    password: string
  ) => { success: boolean; redirectTo: string };
  logout: () => void;
  updatePoint: (newPoint: number) => void;
  error: string | null;
}

interface LoginCredentials {
  account: string;
  password: string;
  role: RoleType;
}

// 預設使用者資料
const DEFAULT_USERS: LoginCredentials[] = [
  {
    account: "admin",
    password: "admin",
    role: "admin",
  },
  {
    account: "user",
    password: "user",
    role: "user",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const login = (account: string, password: string) => {
    setError(null);

    const matchedUser = DEFAULT_USERS.find(
      (u) => u.account === account && u.password === password
    );

    if (matchedUser) {
      const userData: User = {
        userId: matchedUser.role === "admin" ? "admin-1" : "user-1",
        username: matchedUser.role === "admin" ? "Administrator" : "User",
        point: 10,
        role: matchedUser.role as RoleType,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return {
        success: true,
        redirectTo: matchedUser.role === "admin" ? "/admin" : "/game",
      };
    } else {
      setError("帳號或密碼錯誤");
      return {
        success: false,
        redirectTo: "/login",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setError(null);
  };

  const updatePoint = (newPoint: number) => {
    if (user) {
      const updatedUser = { ...user, point: newPoint };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updatePoint, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
