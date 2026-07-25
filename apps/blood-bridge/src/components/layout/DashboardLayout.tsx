import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Droplet, LayoutDashboard, LogOut, Package, User, BellRing, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  // Close the mobile drawer automatically on route change.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location]);

  if (!user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center text-muted-foreground text-sm">
        Redirecting to login…
      </div>
    );
  }

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/requests", label: "Requests", icon: BellRing },
    { href: "/dashboard/donations", label: "Donations", icon: Droplet },
    ...(user.role === "hospital" ? [{ href: "/dashboard/inventory", label: "Inventory", icon: Package }] : []),
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b bg-card">
        <Link href="/" className="flex items-center gap-1.5">
          <Logo size={32} />
          <span className="font-serif font-semibold text-lg tracking-tight">Blood Bridge</span>
        </Link>
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-mobile-nav"
          className="p-2 -mr-2 text-foreground"
        >
          {mobileNavOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileNavOpen && (
        <div id="dashboard-mobile-nav" className="md:hidden border-b bg-card px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-border my-2" />
          <div className="px-4 py-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log Out
          </button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 border-r bg-card flex-shrink-0 flex-col">
        <div className="h-20 flex items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Logo size={40} className="transition-transform group-hover:scale-105" />
            <span className="font-serif font-semibold text-xl tracking-tight">Blood Bridge</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-secondary text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <button 
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
