import React, { createContext, useState, useEffect } from "react";
import {
  loginApi,
  fetchUserApi,
  clearToken,
  getToken,
  UserData,
} from "@/services/auth";

interface AuthContextProps {
  user: UserData | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  signin: async () => {},
  signout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const token = await getToken();
        if (token) {
          const profile = await fetchUserApi();
          setUser(profile);
        }
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const signin = async (email: string, password: string) => {
    await loginApi(email, password);
    const profile = await fetchUserApi();
    setUser(profile);
  };

  const signout = async () => {
    await clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};
