import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";

export interface Donation {
  id: string;
  hospitalName: string;
  bloodType: string;
  donatedOn: string;
  status: string;
}

interface NewDonationInput {
  date: string;
  hospital: string;
  bloodType: string;
}

interface DonationsContextType {
  donations: Donation[];
  isLoading: boolean;
  addDonation: (input: NewDonationInput) => Promise<Donation>;
}

const DonationsContext = createContext<DonationsContextType | undefined>(undefined);

export function DonationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setDonations([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    apiFetch<{ donations: Donation[] }>("/donations")
      .then((data) => setDonations(data.donations))
      .catch(() => setDonations([]))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const addDonation = useCallback(async (input: NewDonationInput) => {
    const data = await apiFetch<{ donation: Donation }>("/donations", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setDonations((prev) => [data.donation, ...prev]);
    return data.donation;
  }, []);

  return (
    <DonationsContext.Provider value={{ donations, isLoading, addDonation }}>
      {children}
    </DonationsContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationsContext);
  if (context === undefined) {
    throw new Error("useDonations must be used within a DonationsProvider");
  }
  return context;
}
