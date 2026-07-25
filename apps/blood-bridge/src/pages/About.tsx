import { Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const PRINCIPLES = [
  {
    title: "Speed over polish",
    desc: "A hospital in a critical window doesn't need a beautiful dashboard — it needs a match in minutes. Every feature is judged against time saved, not visual flourish.",
  },
  {
    title: "Trust is the product",
    desc: "The moment our numbers disagree with reality, the platform is worthless. We treat data consistency as a life-safety requirement, not a nice-to-have.",
  },
  {
    title: "Built for the 3am case",
    desc: "Interfaces are designed for someone tired, stressed, and reading on a phone in a hallway — not for a relaxed demo on a wide monitor in daylight.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">About Blood Bridge</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              We built the layer that should have existed <span className="italic text-primary">between</span> a shortage and a solution.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Blood banks run on daily and weekly restock cycles. Emergencies don't. Blood Bridge exists to close that gap — connecting a hospital's real-time need directly to the nearest willing, eligible donor, without the delay of a manual phone tree or a database nobody checks until morning.
            </p>
          </div>
        </section>

        <section className="py-20 bg-card border-y">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-3xl font-serif font-bold mb-4">How we think about the problem</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Most health-tech platforms are designed to be looked at. This one is designed to be acted on. A donor deciding whether to drive across town at 2am doesn't need a dashboard — they need three facts: what's needed, how far, and what happens next if they say yes.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              That constraint shapes everything, from the confirmation step before a donor commits to a real-world trip, to the requirement that a hospital's posted request and the public map never show conflicting numbers.
            </p>
          </div>
        </section>

        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <h2 className="text-3xl font-serif font-bold mb-12">What we hold ourselves to</h2>
            <div className="divide-y divide-border">
              {PRINCIPLES.map((p, i) => (
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
        </section>

        <section className="py-24 bg-primary text-primary-foreground text-center">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">If you've ever waited on a blood match, you already understand why this exists.</h2>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-primary h-14 px-10 text-lg rounded-full">
                Join Blood Bridge
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
