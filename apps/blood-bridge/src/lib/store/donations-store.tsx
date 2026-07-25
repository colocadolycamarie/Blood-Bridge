import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockDonations } from "@/lib/mock-data";

const STORAGE_KEY = "blood-bridge-donations";

export type Donation = (typeof mockDonations)[number];

interface NewDonationInput {
  date: string;
  hospital: string;
  bloodType: string;
}

interface DonationsContextType {
  donations: Donation[];
  addDonation: (input: NewDonationInput) => Donation;
}

const DonationsContext = createContext<DonationsContextType | undefined>(undefined);

function loadInitial(): Donation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Donation[];
  } catch {
    // Corrupted storage — fall back to seed data.
  }
  return mockDonations;
}

export function DonationsProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(donations));
  }, [donations]);

  const addDonation = (input: NewDonationInput) => {
    const record: Donation = {
      id: `DON-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: "Completed",
      ...input,
    };
    setDonations((prev) => [record, ...prev]);
    return record;
  };

  return (
    <DonationsContext.Provider value={{ donations, addDonation }}>
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
