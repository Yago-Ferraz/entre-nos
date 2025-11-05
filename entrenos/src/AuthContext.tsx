import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_PUBLIC, API_AUTH } from "./services/api";
import { User } from "./types/user";


interface AuthContextType {
  user: User;
  setUser: (user: User) => void; // adiciona aqui
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  // Tenta carregar usuário/token ao iniciar o app
  useEffect(() => {
    (async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    })();
  }, []);

  // Login: chama API, guarda token e usuário
  const login = async (email: string, password: string) => {
    try {
      const response = await API_PUBLIC.post("/auth/jwt/create/", { email, password });
      const token = response.data.access;

      // Busca dados do usuário
      const userProfile = await API_AUTH.get("/auth/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const loggedUser = {
        ...userProfile.data,
        token,
      };

      setUser(loggedUser);
      await AsyncStorage.setItem("@user", JSON.stringify(loggedUser));
    } catch (err) {
      console.error("Erro ao logar:", err);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  return (
    <AuthContext.Provider value={{ user,setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
