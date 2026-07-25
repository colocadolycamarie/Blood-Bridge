import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Donor",
    price: "Free",
    period: "always",
    desc: "For individuals who want to donate when it matters.",
    features: [
      "Compatibility-matched alerts",
      "Guided response & confirmation flow",
      "Personal donation history",
      "Unlimited responses",
    ],
    cta: "Sign up free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Hospital",
    price: "Contact us",
    period: "per facility",
    desc: "For a single hospital or clinic managing its own requests.",
    features: [
      "Unlimited request posting",
      "Live inventory management",
      "Donor response tracking",
      "Priority support",
    ],
    cta: "Talk to sales",
    href: "/contact",
    highlighted: true,
  },
  {
    name: "Network",
    price: "Contact us",
    period: "per network",
    desc: "For blood banks and multi-facility hospital networks.",
    features: [
      "Everything in Hospital",
      "Cross-facility inventory view",
      "Audit trail & compliance exports",
      "Dedicated account manager",
    ],
    cta: "Talk to sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Pricing</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              Free for donors. <span className="italic text-primary">Simple</span> for hospitals.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Donating shouldn't cost anything. Facility pricing depends on scale, so every hospital and network plan starts with a conversation, not a paywall.
            </p>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    "rounded-2xl border p-8 flex flex-col",
                    tier.highlighted ? "bg-card border-primary shadow-md md:-translate-y-2" : "bg-card"
                  )}
                >
                  {tier.highlighted && (
                    <span className="self-start mb-4 text-xs font-medium uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                      Most common
                    </span>
                  )}
                  <h2 className="text-2xl font-serif font-bold mb-1">{tier.name}</h2>
                  <p className="text-muted-foreground text-sm mb-6">{tier.desc}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm ml-1">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={tier.href}>
                    <Button className="w-full" variant={tier.highlighted ? "default" : "outline"}>
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
