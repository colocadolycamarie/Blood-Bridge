import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "donor" | "hospital" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bloodType?: string;
  hospitalName?: string;
}

interface LoginDetails {
  name?: string;
  bloodType?: string;
  hospitalName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, details?: LoginDetails) => void;
  logout: () => void;
  updateUser: (updates: Partial<Omit<User, "id" | "role">>) => void;
  emailExists: (email: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "blood-bridge-user";
// Local stand-in for a real user database. There is no backend connected in
// this build, so "accounts" only persist within this browser — but at least
// they persist consistently across logout/login instead of resetting every time.
const DIRECTORY_KEY = "blood-bridge-account-directory";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadDirectory(): Record<string, User> {
  try {
    const stored = localStorage.getItem(DIRECTORY_KEY);
    if (stored) return JSON.parse(stored) as Record<string, User>;
  } catch {
    // Corrupted storage — start fresh rather than crash.
  }
  return {};
}

function saveToDirectory(user: User) {
  const directory = loadDirectory();
  directory[normalizeEmail(user.email)] = user;
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify(directory));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Corrupted or outdated data — drop it rather than leave a broken session.
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const emailExists = (email: string) => {
    const directory = loadDirectory();
    return normalizeEmail(email) in directory;
  };

  const login = (email: string, role: UserRole, details?: LoginDetails) => {
    const directory = loadDirectory();
    const existing = directory[normalizeEmail(email)];

    const newUser: User = existing
      ? { ...existing } // Reuse the saved profile — same browser, same "account."
      : {
          id: Math.random().toString(36).substring(7),
          name: details?.name || email.split("@")[0],
          email,
          role,
          bloodType: role === "donor" ? (details?.bloodType || "O-") : undefined,
          hospitalName: role === "hospital" ? (details?.hospitalName || "Central General Hospital") : undefined,
        };

    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    saveToDirectory(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateUser = (updates: Partial<Omit<User, "id" | "role">>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      saveToDirectory(next);
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, emailExists }}>
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
