import { Link } from "wouter";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="bg-card border-t py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 mb-6 group inline-flex">
              <Logo size={36} className="transition-transform group-hover:scale-105" />
              <span className="font-serif font-semibold text-xl tracking-tight">Blood Bridge</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A life-saving coordination platform turning critical needs into immediate action.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-6 font-serif text-lg">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</Link></li>
              <li><Link href="/blood-types" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compatibility Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 font-serif text-lg">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 font-serif text-lg">Emergency Contact</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>For immediate medical emergencies, please call your local emergency services.</p>
              <p className="font-medium text-foreground mt-4">Support Line: 1-800-555-0142</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blood Bridge. All rights reserved.
          </p>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Get in touch
          </Link>
        </div>
      </div>
    </footer>
  );
}
