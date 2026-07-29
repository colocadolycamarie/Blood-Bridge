import { Link, useLocation } from "wouter";
import { useAuth, type UserRole } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, User } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BLOOD_TYPES } from "@/lib/blood-type-data";
import { ApiError } from "@/lib/api";

export default function Register() {
  const { register } = useAuth();
  const [, setLocation] = useLocation();

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    if (!name || !email || !password) {
      setError("Please fill in all basic information.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (role === "donor" && !bloodType) {
      setError("Please select your blood type.");
      return;
    }
    if (role === "hospital" && !hospitalName) {
      setError("Please provide your hospital name.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await register({
        name,
        email,
        password,
        role,
        bloodType: role === "donor" ? bloodType : undefined,
        hospitalName: role === "hospital" ? hospitalName : undefined,
      });
      setLocation("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          {step === 1 ? (
            <div className="space-y-8">
              <div className="text-center max-w-lg mx-auto">
                <h1 className="text-4xl font-serif font-bold mb-4">Join Blood Bridge</h1>
                <p className="text-muted-foreground text-lg">I want to...</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => handleRoleSelect("donor")}
                  className="group flex flex-col items-center text-center p-10 border rounded-2xl bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="h-16 w-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <User className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-3">Donate Blood</h3>
                  <p className="text-muted-foreground">Receive alerts when your specific blood type is needed urgently nearby.</p>
                </button>

                <button
                  onClick={() => handleRoleSelect("hospital")}
                  className="group flex flex-col items-center text-center p-10 border rounded-2xl bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="h-16 w-16 bg-secondary text-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-3">Manage Needs</h3>
                  <p className="text-muted-foreground">Post critical requests and manage blood inventory for a medical facility.</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-card border rounded-2xl p-8 shadow-sm">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-serif font-bold">
                  {role === "donor" ? "Donor Registration" : "Hospital Registration"}
                </h2>
                <p className="text-muted-foreground mt-1">Complete your profile to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md" role="alert">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} className="h-11" autoComplete="name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-11" autoComplete="email" />
                </div>

                {role === "donor" && (
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={bloodType} onValueChange={setBloodType}>
                      <SelectTrigger id="bloodType" className="h-11">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {role === "hospital" && (
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital / Facility Name</Label>
                    <Input id="hospitalName" value={hospitalName} onChange={e => setHospitalName(e.target.value)} className="h-11" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput id="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} className="h-11" autoComplete="new-password" />
                  <p className="text-xs text-muted-foreground">At least 8 characters.</p>
                </div>

                <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={submitting}>
                  {submitting ? "Creating account…" : "Create Account"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
