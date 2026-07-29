import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import type { Urgency } from "@/lib/blood-type-data";

export interface BloodRequest {
  id: string;
  hospitalName: string;
  location: string;
  bloodType: string;
  units: number;
  urgency: Urgency;
  status: "open" | "fulfilled";
  createdAt: string;
}

interface NewRequestInput {
  location: string;
  bloodType: string;
  units: number;
  urgency: Urgency;
}

interface RequestsContextType {
  requests: BloodRequest[];
  isLoading: boolean;
  refresh: () => Promise<void>;
  addRequest: (input: NewRequestInput) => Promise<BloodRequest>;
  fulfillRequest: (id: string) => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await apiFetch<{ requests: BloodRequest[] }>("/requests");
    setRequests(data.requests);
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const addRequest = useCallback(async (input: NewRequestInput) => {
    const data = await apiFetch<{ request: BloodRequest }>("/requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setRequests((prev) => [data.request, ...prev]);
    return data.request;
  }, []);

  const fulfillRequest = useCallback(async (id: string) => {
    await apiFetch(`/requests/${id}/fulfill`, { method: "POST" });
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <RequestsContext.Provider value={{ requests, isLoading, refresh, addRequest, fulfillRequest }}>
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
