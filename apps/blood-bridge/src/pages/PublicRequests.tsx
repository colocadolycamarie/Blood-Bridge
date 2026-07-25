import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRequests } from "@/lib/store/requests-store";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

function urgencyLabel(u: string) {
  if (u === "Critical") return "Critical — immediate attention needed";
  if (u === "Urgent") return "Urgent — needed soon";
  return "Routine — no immediate urgency";
}

export default function PublicRequests() {
  const { requests } = useRequests();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Live requests</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.1] mb-6">
              Every active request, <span className="italic text-primary">right now.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              This is the same live feed hospitals and donors see inside the platform. Sign in to respond directly, get matched, and get directions.
            </p>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            {requests.length === 0 && (
              <EmptyState
                variant="panel"
                title="No active requests right now"
                description="Check back soon, or sign up to get notified the moment one is posted."
                className="mb-4"
              />
            )}
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-6 p-6 border rounded-2xl bg-card hover-elevate"
                >
                  <div className="flex items-center gap-6 min-w-0">
                    <span className="font-serif text-3xl font-bold text-primary flex-shrink-0">{req.bloodType}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge
                          aria-label={urgencyLabel(req.urgency)}
                          className={cn(
                            "px-2 py-0.5",
                            req.urgency === "Critical" && "bg-destructive text-destructive-foreground",
                            req.urgency === "Urgent" && "bg-warning text-warning-foreground",
                            req.urgency === "Routine" && "bg-muted text-muted-foreground"
                          )}
                        >
                          {req.urgency}
                        </Badge>
                        <h3 className="font-medium truncate">{req.hospital}</h3>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                        {req.location} &middot; {req.distance} away &middot; {req.units} units needed
                      </p>
                    </div>
                  </div>
                  <Link href="/register" className="flex-shrink-0">
                    <Button className="rounded-full min-h-11 min-w-11">Respond</Button>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 border rounded-2xl bg-card text-center">
              <p className="text-muted-foreground mb-4">Want to see and respond to requests as they come in?</p>
              <Link href="/register">
                <Button size="lg" className="h-12 px-8 rounded-full">Create a free account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
