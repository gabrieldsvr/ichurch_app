// src/contexts/AuthProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Company {
  id: string;
  name: string;
  email: string;
  status: string;
  owner_id: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  company_id: string;
  name: string;
  email: string;
  is_master: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: Company;
  // remova password do contexto por segurança
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (data: { token: string; user: User }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const STORAGE_TOKEN_KEY = "@auth_token";
  const STORAGE_USER_KEY = "@auth_user";

  useEffect(() => {
    // carregar dados do AsyncStorage ao montar o provider
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(STORAGE_USER_KEY);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do AsyncStorage", error);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (data: { token: string; user: User }) => {
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem(STORAGE_TOKEN_KEY, data.token);
    await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
    await AsyncStorage.removeItem(STORAGE_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
