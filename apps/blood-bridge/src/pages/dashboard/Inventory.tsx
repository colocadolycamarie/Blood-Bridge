import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockInventory } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

const INVENTORY_STORAGE_KEY = "blood-bridge-inventory";

type InventoryItem = (typeof mockInventory)[number];

function loadInventory(): InventoryItem[] {
  try {
    const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as InventoryItem[];
  } catch {
    // Corrupted storage — fall back to seed data.
  }
  return mockInventory;
}

export default function Inventory() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [inventory, setInventory] = useState(loadInventory);
  const [savingFor, setSavingFor] = useState<string | null>(null);

  // Guard for role — hospitals only. Runs as an effect, not during render,
  // so we don't trigger a navigation while React is still committing.
  useEffect(() => {
    if (user && user.role !== "hospital") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  if (user && user.role !== "hospital") {
    return null;
  }

  const handleUpdate = (bloodType: string, delta: number) => {
    setSavingFor(bloodType);
    
    // Optimistic UI update
    setInventory(prev => prev.map(item => {
      if (item.bloodType === bloodType) {
        const newUnits = Math.max(0, item.units + delta);
        let newStatus = "Healthy";
        if (newUnits < 5) newStatus = "Critical";
        else if (newUnits < 10) newStatus = "Low";
        
        return { ...item, units: newUnits, status: newStatus };
      }
      return item;
    }));

    // Mock API delay
    setTimeout(() => {
      setSavingFor(null);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Blood Inventory</h1>
        <p className="text-muted-foreground">Manage your current stock levels. Updates are saved automatically.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => (
          <Card key={item.bloodType} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl font-serif font-bold">{item.bloodType}</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                item.status === "Healthy" ? "bg-success/10 text-success" :
                item.status === "Low" ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              )}>
                {item.status}
              </div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold tracking-tighter mb-1">{item.units}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Units Available</div>
            </div>
            
            <div className="flex items-center justify-between gap-3 bg-muted p-1 rounded-lg">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleUpdate(item.bloodType, -1)}
                disabled={savingFor === item.bloodType || item.units === 0}
                className="h-8 w-8 hover:bg-background rounded-md"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xs font-medium text-muted-foreground">
                {savingFor === item.bloodType ? "Saving..." : "Update"}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleUpdate(item.bloodType, 1)}
                disabled={savingFor === item.bloodType}
                className="h-8 w-8 hover:bg-background rounded-md"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
