import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_PUBLIC, API_AUTH } from "./services/api";
import { User } from "./types/user";

// This variable will hold the logout function from AuthProvider
let onLogoutCallback: (() => Promise<void>) | null = null;

// This function allows other modules to set the logout callback
export const setLogoutCallback = (callback: () => Promise<void>) => {
  onLogoutCallback = callback;
};

// Interface for the AuthContext
interface AuthContextType {
  user: User | null; // User can be null if not logged in
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  // Tenta carregar usuário/token ao iniciar o app e verificar a validade
  useEffect(() => {
    const loadAndVerifyUser = async () => {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token) {
          try {
            // Verify token validity
            await API_PUBLIC.post("/auth/jwt/verify/", { token: parsedUser.token });
            // If verification is successful, set the user
            setUser(parsedUser);
          } catch (error) {
            console.error("Token verification failed:", error);
            // If verification fails, log out the user
            await logout();
          }
        } else {
          // No token found in stored user, log out
          await logout();
        }
      }
    };
    loadAndVerifyUser();
  }, []); // Empty dependency array means this runs once on mount

  // Set the logout callback whenever the logout function changes
  // This ensures api.tsx always has the latest logout function
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);


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

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
