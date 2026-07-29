import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api";

export type UserRole = "donor" | "hospital";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodType: string | null;
  hospitalName: string | null;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  bloodType?: string;
  hospitalName?: string;
}

interface ProfileUpdate {
  name?: string;
  bloodType?: string;
  hospitalName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ user: User }>("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<{ user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const data = await apiFetch<{ user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: ProfileUpdate) => {
    const data = await apiFetch<{ user: User }>("/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile }}
    >
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

export { ApiError };
