import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How quickly do donors get notified of a new request?",
    a: "As soon as a hospital posts a request, it appears immediately in the live feed and on nearby compatible donors' dashboards — there's no batching or delay built into the notification path.",
  },
  {
    q: "How do you decide which donors see a given request?",
    a: "Every alert is filtered through the ABO/Rh compatibility matrix first, so a donor is only ever shown requests they're actually eligible to fulfill, then ranked by distance from the requesting facility.",
  },
  {
    q: "Is responding to a request a binding commitment?",
    a: "Responding requires an explicit confirmation step where you're shown the hospital, location, and distance before you confirm — it's designed to prevent accidental taps, but once confirmed the hospital is notified that you're on your way.",
  },
  {
    q: "Can I change or cancel a response after confirming?",
    a: "Yes — contact the hospital directly using the details shown in your confirmation, since they've already been notified and may be planning around your response.",
  },
  {
    q: "Do hospitals see my personal information before I respond?",
    a: "No. Hospitals see an aggregate count of nearby eligible donors, not individual identities, until a donor chooses to respond to a specific request.",
  },
  {
    q: "Is there a cost to join as a donor?",
    a: "No — donor accounts are free. See the pricing page for how hospital and blood-bank facility accounts are structured.",
  },
  {
    q: "What happens to my data if I stop using Blood Bridge?",
    a: "You can request account deletion from your profile at any time; see our privacy policy for what's retained for legal/audit purposes versus what's removed immediately.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">FAQ</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              Common <span className="italic text-primary">questions</span>, answered.
            </h1>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="border rounded-2xl bg-card divide-y overflow-hidden">
              {FAQS.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div key={item.q}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-muted/40 transition-colors"
                    >
                      <span className="font-medium text-lg">{item.q}</span>
                      <ChevronDown
                        className={cn("h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform", isOpen && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div id={`faq-panel-${i}`} className="px-6 pb-6 text-muted-foreground leading-relaxed">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
