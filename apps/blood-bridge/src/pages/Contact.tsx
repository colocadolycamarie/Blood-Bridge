import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Fill in every field so we know how to help.");
      return;
    }
    setError("");
    setSubmitted(true);
    toast({ title: "Message sent", description: "We'll get back to you within one business day." });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-6">Contact</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.1] mb-6">
              Talk to a <span className="italic text-primary">real person.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              For account or platform questions, use the form below. If you're in the middle of an active emergency, don't wait on an email reply — use the channels on the right.
            </p>
          </div>
        </section>

        <section className="pb-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
              <div className="bg-card border rounded-2xl p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <h2 className="text-2xl font-serif font-bold mb-3">Message sent.</h2>
                    <p className="text-muted-foreground">We'll get back to you within one business day.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-3 text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
                        {error}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">How can we help?</Label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full h-12 text-lg">
                      Send message
                    </Button>
                  </form>
                )}
              </div>

              <div className="space-y-8">
                <div className="p-6 rounded-2xl border bg-secondary">
                  <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">In an emergency</p>
                  <p className="text-sm text-secondary-foreground leading-relaxed">
                    Don't wait for a reply here. Open the app and respond directly to the active request, or call the hospital listed on it.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Support line</p>
                    <p className="text-muted-foreground text-sm">1-800-555-0142</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">support@bloodbridge.example</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Support hours</p>
                    <p className="text-muted-foreground text-sm">Mon–Fri, 8am–8pm. Platform itself runs 24/7.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
