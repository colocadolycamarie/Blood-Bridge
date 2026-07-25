import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { mockRequests, type Request, type Urgency } from "@/lib/mock-data";

const STORAGE_KEY = "blood-bridge-requests";

interface NewRequestInput {
  hospital: string;
  location: string;
  bloodType: string;
  units: number;
  urgency: Urgency;
}

interface RequestsContextType {
  requests: Request[];
  addRequest: (input: NewRequestInput) => Request;
  fulfillRequest: (id: string) => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

function loadInitial(): Request[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted storage — fall back to seed data.
  }
  return mockRequests;
}

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  const addRequest = (input: NewRequestInput) => {
    const newRequest: Request = {
      id: `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      distance: "0.0 miles",
      postedAt: new Date().toISOString(),
      ...input,
    };
    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const fulfillRequest = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, fulfillRequest }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error("useRequests must be used within a RequestsProvider");
  }
  return context;
}
