import { Link, useLocation } from "wouter";
import { useAuth } from "../auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";

const HIDE_EMERGENCY_BUTTON_ON = ["/login", "/register", "/contact", "/requests"];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const showEmergencyButton = !HIDE_EMERGENCY_BUTTON_ON.includes(location);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group">
          <Logo size={44} className="transition-transform group-hover:scale-105" />
          <span className="font-serif font-semibold text-2xl tracking-tight">Blood Bridge</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/requests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Requests</Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          
          <div className="h-4 w-px bg-border" />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
              <Button variant="ghost" size="icon" onClick={() => logout()} aria-label="Logout">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium px-4 py-2 hover:bg-muted rounded-full transition-colors">Log In</Link>
              <Link href="/register">
                <Button className="rounded-full px-6">Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden border-t bg-background px-4 py-6 flex flex-col gap-4">
          <Link href="/requests" className="text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Requests</Link>
          <Link href="/about" className="text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/services" className="text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Services</Link>
          <Link href="/contact" className="text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          <div className="h-px bg-border my-2" />
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="text-lg font-medium py-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left text-lg font-medium py-2 text-muted-foreground">Log Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 pt-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Log In</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Mobile Floating Emergency Button */}
      {showEmergencyButton && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Link href="/requests">
            <Button size="lg" className="rounded-full h-14 w-14 shadow-xl flex items-center justify-center p-0">
              <Phone className="h-6 w-6" aria-hidden="true" />
              <span className="sr-only">View emergency blood requests</span>
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
