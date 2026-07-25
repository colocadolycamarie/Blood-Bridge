import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const SECTIONS = [
  {
    title: "What Blood Bridge is",
    body: "A coordination platform connecting hospital and blood-bank blood requests with nearby, compatible donors. It is not a medical provider, does not perform screening, and does not replace the clinical screening a facility performs before an actual donation.",
  },
  {
    title: "Account eligibility",
    body: "You must provide accurate information when registering, including blood type (donors) or facility affiliation (hospitals). Impersonating a facility you're not authorized to represent is prohibited.",
  },
  {
    title: "Responding to a request",
    body: "Confirming a response is a real-world commitment communicated to the requesting facility. Repeated confirmed-but-unfulfilled responses may result in account restrictions, since they directly affect a facility's planning during a shortage.",
  },
  {
    title: "Posting a request",
    body: "Facilities are responsible for the accuracy of urgency, unit counts, and location on every request they post. Requests should be closed or updated once the need is fulfilled.",
  },
  {
    title: "No medical advice",
    body: "Nothing on this platform, including the compatibility guide, constitutes medical advice. Actual donation and transfusion eligibility is always determined by qualified medical staff at the time of donation.",
  },
  {
    title: "Changes to these terms",
    body: "These terms may be updated as the platform evolves. Continued use after a change constitutes acceptance of the updated terms.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Legal</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.1] mb-6">Terms of Service</h1>
            <p className="text-muted-foreground leading-relaxed">
              This is a working draft of platform usage terms for this build. It should be reviewed by counsel before handling real donor or facility data in production.
            </p>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl divide-y divide-border">
            {SECTIONS.map((s) => (
              <div key={s.title} className="py-8 first:pt-0 last:pb-0">
                <h2 className="text-xl font-serif font-bold mb-3">{s.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
