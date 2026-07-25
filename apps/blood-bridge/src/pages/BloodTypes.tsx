import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { bloodTypeCompatibility } from "@/lib/mock-data";
import { Droplet } from "lucide-react";

export default function BloodTypes() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Reference</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-8">
              Blood type <span className="italic text-primary">compatibility guide</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              This is the same compatibility matrix that powers alert matching on the platform — a donor is only shown a request they're actually eligible to fulfill.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bloodTypeCompatibility.map((entry) => (
                <div key={entry.type} className="border rounded-2xl p-6 bg-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-xl font-bold flex-shrink-0">
                      {entry.type}
                    </div>
                    <div>
                      <h2 className="font-bold text-lg leading-tight">Type {entry.type}</h2>
                      {entry.type === "O-" && (
                        <p className="text-xs text-primary font-medium">Universal donor</p>
                      )}
                      {entry.type === "AB+" && (
                        <p className="text-xs text-primary font-medium">Universal recipient</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1.5">Can donate to</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.givesTo.map((t) => (
                          <span key={t} className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground font-medium text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1.5">Can receive from</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.receivesFrom.map((t) => (
                          <span key={t} className="px-2 py-1 rounded-md bg-muted text-foreground font-medium text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 border rounded-2xl bg-card flex gap-4 items-start">
              <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                <Droplet className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This chart covers standard ABO/Rh compatibility for general reference. Actual eligibility to donate or receive blood is always determined by a qualified medical professional at the time of donation or transfusion — this page isn't a substitute for that screening.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
