import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDonations } from "@/lib/store/donations-store";
import { EmptyState } from "@/components/EmptyState";
import { BLOOD_TYPES } from "@/lib/blood-type-data";
import { ApiError } from "@/lib/api";

interface FormState {
  date: string;
  hospital: string;
  bloodType: string;
}

const EMPTY_FORM: FormState = { date: "", hospital: "", bloodType: "" };

export default function Donations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { donations, addDonation } = useDonations();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM, bloodType: user?.bloodType || "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.date) nextErrors.date = "Select a date.";
    if (!form.hospital.trim()) nextErrors.hospital = "Enter a hospital or facility.";
    if (!form.bloodType) nextErrors.bloodType = "Select a blood type.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await addDonation({ date: form.date, hospital: form.hospital.trim(), bloodType: form.bloodType });
      setIsOpen(false);
      setForm({ ...EMPTY_FORM, bloodType: user?.bloodType || "" });
      setErrors({});
      toast({ title: "Donation logged", description: "Added to your donation history." });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not log this donation.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Donation History</h1>
          <p className="text-muted-foreground">Track your past contributions and impact.</p>
        </div>
        <Dialog
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            if (!next) { setForm({ ...EMPTY_FORM, bloodType: user?.bloodType || "" }); setErrors({}); }
          }}
        >
          <DialogTrigger asChild>
            <Button>Log a Donation</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Past Donation</DialogTitle>
            </DialogHeader>
            <form className="space-y-4 py-4" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <Label htmlFor="donation-date">Date</Label>
                <Input
                  id="donation-date"
                  type="date"
                  value={form.date}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  aria-invalid={!!errors.date}
                />
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="donation-hospital">Hospital / Facility</Label>
                <Input
                  id="donation-hospital"
                  placeholder="E.g. Central Hospital"
                  value={form.hospital}
                  onChange={(e) => setForm((f) => ({ ...f, hospital: e.target.value }))}
                  aria-invalid={!!errors.hospital}
                />
                {errors.hospital && <p className="text-sm text-destructive">{errors.hospital}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="donation-bloodtype">Blood Type</Label>
                <Select value={form.bloodType} onValueChange={(v) => setForm((f) => ({ ...f, bloodType: v }))}>
                  <SelectTrigger id="donation-bloodtype" aria-invalid={!!errors.bloodType}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOOD_TYPES.map((bt) => (
                      <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bloodType && <p className="text-sm text-destructive">{errors.bloodType}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Saving…" : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {donations.length > 0 ? (
          donations.map((don) => (
            <Card key={don.id}>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Droplet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{don.hospitalName}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {don.donatedOn}</span>
                      <span className="px-2 py-0.5 bg-success/10 text-success rounded text-xs font-medium">{don.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif font-bold text-xl">{don.bloodType}</p>
                  <p className="text-xs text-muted-foreground uppercase">Whole Blood</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            variant="panel"
            dashed
            icon={Droplet}
            title="No donations yet"
            description="Your recorded donations will appear here."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
