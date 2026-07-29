import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { apiFetch, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface InventoryItem {
  bloodType: string;
  units: number;
}

function statusFor(units: number) {
  if (units < 5) return "Critical";
  if (units < 10) return "Low";
  return "Healthy";
}

export default function Inventory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingFor, setSavingFor] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "hospital") {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  useEffect(() => {
    if (!user || user.role !== "hospital") return;
    apiFetch<{ inventory: InventoryItem[] }>("/inventory")
      .then((data) => setInventory(data.inventory))
      .catch(() => setInventory([]))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (user && user.role !== "hospital") {
    return null;
  }

  const handleUpdate = async (bloodType: string, delta: number) => {
    setSavingFor(bloodType);
    const previous = inventory;

    setInventory((prev) =>
      prev.map((item) => (item.bloodType === bloodType ? { ...item, units: Math.max(0, item.units + delta) } : item)),
    );

    try {
      const data = await apiFetch<{ item: InventoryItem }>(`/inventory/${bloodType}`, {
        method: "PATCH",
        body: JSON.stringify({ delta }),
      });
      setInventory((prev) => prev.map((item) => (item.bloodType === bloodType ? data.item : item)));
    } catch (err) {
      setInventory(previous);
      const message = err instanceof ApiError ? err.message : "Could not update inventory.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setSavingFor(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Blood Inventory</h1>
        <p className="text-muted-foreground">Manage your current stock levels. Updates are saved automatically.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading inventory…</p>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventory.map((item) => {
          const status = statusFor(item.units);
          return (
          <Card key={item.bloodType} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="text-4xl font-serif font-bold">{item.bloodType}</div>
              <div className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                status === "Healthy" ? "bg-success/10 text-success" :
                status === "Low" ? "bg-warning/10 text-warning" :
                "bg-destructive/10 text-destructive"
              )}>
                {status}
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
          );
        })}
      </div>
      )}
    </DashboardLayout>
  );
}
