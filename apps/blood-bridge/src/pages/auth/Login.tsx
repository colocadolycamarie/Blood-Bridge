import { Link, useLocation } from "wouter";
import { useAuth, type UserRole } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, User as UserIcon, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<UserRole, null>>("donor");
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    login(email, role);
    setLocation("/dashboard");
  };

  const handleForgotPassword = () => {
    // No backend is connected in this build, so this simulates the standard
    // "don't reveal whether the account exists" reset flow rather than a dead link.
    setResetSent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex mb-2">
              <Logo size={48} />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your Blood Bridge account</p>
          </div>

          <div className="mb-6">
            <Label className="mb-2 block">Signing in as</Label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg" role="radiogroup" aria-label="Account type">
              <button
                type="button"
                role="radio"
                aria-checked={role === "donor"}
                onClick={() => setRole("donor")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors",
                  role === "donor" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <UserIcon className="h-4 w-4" aria-hidden="true" />
                Donor
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={role === "hospital"}
                onClick={() => setRole("hospital")}
                className={cn(
                  "flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors",
                  role === "hospital" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Hospital
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md" role="alert">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
              />
              {resetSent && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground pt-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  If an account exists for that email, we've sent a reset link.
                </p>
              )}
            </div>

            <Button type="submit" className="w-full h-12 text-lg">
              Log In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
