import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthContext";
import { useRequests } from "@/lib/store/requests-store";
import { useToast } from "@/hooks/use-toast";
import type { Urgency } from "@/lib/mock-data";
import { Plus } from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCIES: Urgency[] = ["Critical", "Urgent", "Routine"];

interface FormState {
  location: string;
  bloodType: string;
  units: string;
  urgency: Urgency | "";
}

const EMPTY_FORM: FormState = { location: "", bloodType: "", units: "", urgency: "" };

export function NewRequestDialog() {
  const { user } = useAuth();
  const { addRequest } = useRequests();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.location.trim()) next.location = "Enter a location or ward.";
    if (!form.bloodType) next.bloodType = "Select a blood type.";
    if (!form.urgency) next.urgency = "Select an urgency level.";
    const unitsNum = Number(form.units);
    if (!form.units || !Number.isFinite(unitsNum) || unitsNum < 1) {
      next.units = "Enter at least 1 unit.";
    } else if (unitsNum > 50) {
      next.units = "Enter 50 units or fewer per request.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulated network latency so the loading state is visible; in a real
    // deployment this would be an await on the api-client-react mutation.
    setTimeout(() => {
      addRequest({
        hospital: user?.hospitalName || "Your Hospital",
        location: form.location.trim(),
        bloodType: form.bloodType,
        units: Number(form.units),
        urgency: form.urgency as Urgency,
      });
      setSubmitting(false);
      setOpen(false);
      setForm(EMPTY_FORM);
      setErrors({});
      toast({
        title: "Request posted",
        description: `${form.bloodType} request is now visible to nearby donors.`,
      });
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setForm(EMPTY_FORM);
          setErrors({});
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Post New Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Post a blood request</DialogTitle>
          <DialogDescription>
            This will immediately appear in the live feed for nearby donors.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location / ward</Label>
            <Input
              id="location"
              placeholder="e.g. Emergency Dept, 3rd Floor"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <p id="location-error" className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood type</Label>
              <Select
                value={form.bloodType}
                onValueChange={(v) => setForm((f) => ({ ...f, bloodType: v }))}
              >
                <SelectTrigger id="bloodType" aria-invalid={!!errors.bloodType}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((bt) => (
                    <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodType && <p className="text-sm text-destructive">{errors.bloodType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units needed</Label>
              <Input
                id="units"
                type="number"
                min={1}
                max={50}
                placeholder="e.g. 2"
                value={form.units}
                onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))}
                aria-invalid={!!errors.units}
                aria-describedby={errors.units ? "units-error" : undefined}
              />
              {errors.units && (
                <p id="units-error" className="text-sm text-destructive">{errors.units}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              value={form.urgency}
              onValueChange={(v) => setForm((f) => ({ ...f, urgency: v as Urgency }))}
            >
              <SelectTrigger id="urgency" aria-invalid={!!errors.urgency}>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {URGENCIES.map((u) => (
                  <SelectItem key={u} value={u}>{u}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.urgency && <p className="text-sm text-destructive">{errors.urgency}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Posting…" : "Post Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
