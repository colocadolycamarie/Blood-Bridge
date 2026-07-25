import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Droplet, Clock, Users, HeartPulse } from "lucide-react";

const STATS = [
  { icon: Droplet, value: "—", label: "Units matched to date", note: "Populates once request/response data starts flowing from the connected backend." },
  { icon: Clock, value: "—", label: "Median time to first response", note: "Calculated from request-posted to donor-confirmed timestamps." },
  { icon: Users, value: "—", label: "Active donors on the platform", note: "Counted from confirmed, non-deleted donor accounts." },
  { icon: HeartPulse, value: "—", label: "Participating facilities", note: "Hospitals and blood banks with at least one posted request." },
];

export default function Impact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Impact</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              The numbers <span className="italic text-primary">that matter</span> here.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              This build isn't yet connected to a live backend, so the figures below are placeholders showing what will populate once real request and response data exists — not invented numbers.
            </p>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STATS.map((stat) => (
                <div key={stat.label} className="border rounded-2xl p-8 bg-card">
                  <div className="bg-primary/10 text-primary p-3 rounded-full inline-flex mb-6">
                    <stat.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="text-4xl font-serif font-bold mb-2">{stat.value}</div>
                  <p className="font-medium mb-2">{stat.label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.note}</p>
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
