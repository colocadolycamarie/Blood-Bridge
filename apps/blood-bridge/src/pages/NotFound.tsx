import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center px-4 max-w-md mx-auto">
          <div className="inline-flex bg-muted p-4 rounded-full mb-6 text-muted-foreground">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8">
            The page you are looking for does not exist or has been moved. In an emergency, please return to the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full">Return Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" className="w-full">Go to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
