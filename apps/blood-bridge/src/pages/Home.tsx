import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useRequests } from "@/lib/store/requests-store";
import { bloodTypeCompatibility } from "@/lib/blood-type-data";
import { Button } from "@/components/ui/button";
import { MapPin, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 1. Hero with live request ticker
function Hero() {
  const { requests } = useRequests();
  const [tickerActive, setTickerActive] = useState(true);
  const [visibleRequestIndex, setVisibleRequestIndex] = useState(0);

  useEffect(() => {
    if (!tickerActive || requests.length === 0) return;
    const interval = setInterval(() => {
      setVisibleRequestIndex((prev) => (prev + 1) % requests.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tickerActive, requests.length]);

  const req = requests[visibleRequestIndex % Math.max(requests.length, 1)];

  return (
    <section className="relative pt-24 pb-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1] mb-8">
              Turn intent into <br />
              <span className="text-primary italic">immediate action.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              When life depends on minutes, Blood Bridge connects available donors with critical hospital needs in real time. No waiting. Just action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                  Respond to a Need
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-border hover:bg-muted">
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div 
              className="bg-card border rounded-2xl p-6 shadow-xl relative"
              onMouseEnter={() => setTickerActive(false)}
              onMouseLeave={() => setTickerActive(true)}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Live Request Ticker</h3>
                {tickerActive ? (
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Paused</span>
                )}
              </div>

              {!req ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No active requests right now. Check back soon.
                </p>
              ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className={cn(
                          "px-2 py-0.5",
                          req.urgency === "Critical" && "bg-destructive text-destructive-foreground",
                          req.urgency === "Urgent" && "bg-warning text-warning-foreground",
                          req.urgency === "Routine" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {req.urgency}
                      </Badge>
                      <span className="text-2xl font-bold font-serif">{req.bloodType}</span>
                    </div>
                    <h4 className="font-medium text-lg">{req.hospitalName}</h4>
                    <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
                      <MapPin className="h-3.5 w-3.5" />
                      {req.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold font-serif">{req.units}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Units</p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Link href="/register">
                    <Button className="w-full">
                      I Can Donate Now
                    </Button>
                  </Link>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 2. 27-Minute Window
function StorytellingSection() {
  return (
    <section className="py-24 bg-card border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">The 27-Minute Window</h2>
        <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
          <p>
            In trauma situations, the golden hour is critical. But for severe hemorrhages, doctors often operate within a tighter window. When massive transfusion protocols are activated, hospitals need specific blood types within minutes, not hours.
          </p>
          <p>
            Traditional blood bank restocks happen daily or weekly. Blood Bridge operates in real-time, matching willing donors within a 5-mile radius the moment a critical threshold is crossed. We don't build databases—we build lifelines.
          </p>
        </div>
      </div>
    </section>
  );
}

// 3. Stats section
function Stats() {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20 text-center">
          <div className="pt-8 md:pt-0">
            <p className="text-5xl md:text-6xl font-serif font-bold mb-4">12m</p>
            <p className="text-primary-foreground/80 font-medium">Average matching time</p>
          </div>
          <div className="pt-8 md:pt-0">
            <p className="text-5xl md:text-6xl font-serif font-bold mb-4">4,821</p>
            <p className="text-primary-foreground/80 font-medium">Critical units fulfilled this month</p>
          </div>
          <div className="pt-8 md:pt-0">
            <p className="text-5xl md:text-6xl font-serif font-bold mb-4">98%</p>
            <p className="text-primary-foreground/80 font-medium">Response rate for emergency alerts</p>
          </div>
        </div>
        <p className="text-center text-xs text-primary-foreground/60 mt-10">
          Example figures for this preview build — will reflect real platform activity once connected to production data.
        </p>
      </div>
    </section>
  );
}

// 4. How Matching Works
function HowItWorks() {
  return (
    <section className="py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-serif font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Seamless coordination from the moment a need arises.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-border z-0" />
          
          {[
            { step: "01", title: "Hospital Signals Need", desc: "A critical threshold is crossed. The hospital posts a request specifying blood type and urgency." },
            { step: "02", title: "Platform Routes Alert", desc: "Our system instantly identifies eligible, nearby donors with the exact matching blood type." },
            { step: "03", title: "Donor Responds", desc: "A donor accepts the request, giving the hospital immediate confirmation that help is on the way." }
          ].map((item, i) => (
            <div key={i} className="relative z-10 bg-background pt-4 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary text-primary font-bold text-xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                {item.step}
              </div>
              <h3 className="text-xl font-bold font-serif mb-4">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed px-4">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 5. Trust — editorial layout, not a generic icon-card grid
function TrustSection() {
  const points = [
    { title: "Real-time coordination", desc: "No polling, no delays — every request and response syncs across the platform the instant it happens." },
    { title: "Secure by design", desc: "Health data handled under HIPAA-aligned infrastructure, with access scoped strictly to what a role needs to see." },
    { title: "Precision matching", desc: "A full compatibility matrix runs behind every alert, so donors only ever see requests they can actually fulfill." },
  ];
  return (
    <section className="py-24 md:py-32 bg-card border-y">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">
              More than software.<br /><span className="text-primary italic">A lifeline.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Every design decision here is weighed against one question: does this help someone act faster, with less doubt, at the moment it matters most.
            </p>
          </div>
          <div className="divide-y divide-border">
            {points.map((p, i) => (
              <div key={p.title} className="flex gap-8 py-8 first:pt-0 last:pb-0">
                <span className="font-serif text-3xl text-primary/40 flex-shrink-0 w-10">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 6. Blood Type Compatibility Grid — real, functional content, not decoration.
// Sourced from the same data as the full compatibility guide at /blood-types
// so the two never drift out of sync.
function CompatibilityGrid() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4">Blood type compatibility</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            O-negative can give to anyone. AB-positive can receive from anyone. The platform checks this automatically — here's the full picture.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodTypeCompatibility.map((info) => (
            <div key={info.type} className="border rounded-2xl p-5 bg-card">
              <div className="font-serif text-3xl font-bold text-primary mb-4">{info.type}</div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide text-xs mb-1.5">Can give to</p>
                  <p className="leading-relaxed">{info.givesTo.join(", ")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground uppercase tracking-wide text-xs mb-1.5">Can receive from</p>
                  <p className="leading-relaxed">{info.receivesFrom.join(", ")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/blood-types" className="text-sm font-medium text-primary hover:underline">
            View the full compatibility guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StorytellingSection />
        <Stats />
        <HowItWorks />
        <TrustSection />
        <CompatibilityGrid />

        <section className="py-32 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Ready to be the difference?</h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join thousands of donors and hospitals connected on Blood Bridge. Register today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-primary w-full sm:w-auto h-14 px-10 text-lg rounded-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
