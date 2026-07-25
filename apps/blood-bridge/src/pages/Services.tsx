import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    tag: "For hospitals & blood banks",
    title: "Emergency request routing",
    desc: "Post a critical need in seconds — blood type, units, urgency — and the platform immediately notifies every nearby compatible donor. No call lists, no waiting for a coordinator to be free.",
  },
  {
    tag: "For hospitals & blood banks",
    title: "Live inventory management",
    desc: "Track stock by blood type in real time, with the same numbers reflected on the public map so donors always see an accurate picture of local need — never a stale count.",
  },
  {
    tag: "For donors",
    title: "Compatibility-matched alerts",
    desc: "Donors only see requests they can actually fulfill. The full compatibility matrix runs behind every alert, so there's no ambiguity about whether you're eligible before you commit.",
  },
  {
    tag: "For donors",
    title: "Guided response flow",
    desc: "Respond to a request, confirm the details, and get directions — with a clear confirmation step in between so you're never one accidental tap away from a real-world commitment.",
  },
  {
    tag: "For everyone",
    title: "Donation history & records",
    desc: "Every completed donation is logged against the request it fulfilled, so donors have a running record and hospitals have an audit trail of where units came from.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Services</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              One platform, <span className="italic text-primary">two sides</span> of the same emergency.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Hospitals need a fast way to signal a shortage. Donors need a fast way to respond to one. Everything below exists to make that exchange take minutes, not hours.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl divide-y divide-border">
            {SERVICES.map((s) => (
              <div key={s.title} className="py-10 first:pt-0 last:pb-0">
                <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">{s.tag}</p>
                <h2 className="text-2xl font-serif font-bold mb-3">{s.title}</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 bg-card border-t text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-serif font-bold mb-6">Whichever side of the request you're on, it starts with an account.</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full">Get started</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full">Talk to us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
