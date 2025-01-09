import React, { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../types/user";
import { api } from "../api";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (
    account: string,
    password: string
  ) => void
  logout: () => void;
  updatePoint: (newPoint: number) => void;
  error: string | null;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}



const postLogin = async (data: {
  account: string,
  password: string
}) => {
  return await api.post('/auth/login', data);
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("local-user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [error, setError] = useState<string | null>(null);

  const login = async (account: string, password: string)=> {
    setError(null);
    try {

      const res = await postLogin({ account, password });
      const resData = await res.data;
      if (resData.status === 200) {
        const {data}= resData
        const userData = {
          userId: data.id,
          username: data.user,
          point: 10,
          role:data.role
        }
        setUser(userData);
        localStorage.setItem('local-user', JSON.stringify(userData));
        localStorage.setItem('local-token',data.token);
        enqueueSnackbar('Login Success', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center'
          },
        });
        navigate('/');
        return true;
      } 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Login failed';
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center'
        }
      });
       return false
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
