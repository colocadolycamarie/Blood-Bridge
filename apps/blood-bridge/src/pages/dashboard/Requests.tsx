import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRequests, type BloodRequest } from "@/lib/store/requests-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewRequestDialog } from "./NewRequestDialog";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/EmptyState";
import { ApiError } from "@/lib/api";

export default function Requests() {
  const { user } = useAuth();
  const { requests, fulfillRequest } = useRequests();
  const { toast } = useToast();
  const [selectedReq, setSelectedReq] = useState<BloodRequest | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRespond = async () => {
    if (!selectedReq) return;
    setIsConfirming(true);
    try {
      await fulfillRequest(selectedReq.id);
      setIsConfirming(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedReq(null);
        toast({ title: "Thank you", description: "The hospital has been notified you're on your way." });
      }, 2000);
    } catch (err) {
      setIsConfirming(false);
      const message = err instanceof ApiError ? err.message : "Could not respond to this request.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Active Requests</h1>
          <p className="text-muted-foreground">Live feed of blood needs.</p>
        </div>
        {user?.role === "hospital" && <NewRequestDialog />}
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="No active requests right now"
          description={
            user?.role === "hospital"
              ? "When you post a request, it will show up here and in the public live feed."
              : "You're all caught up. New requests will appear here the moment they're posted."
          }
        />
      ) : (
      <div className="space-y-4">
        {requests.map((req) => (
          <Card key={req.id} className="overflow-hidden border-border transition-all hover:shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-stretch">
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2.5 py-0.5",
                        req.urgency === "Critical" && "bg-destructive text-destructive-foreground border-destructive",
                        req.urgency === "Urgent" && "bg-warning text-warning-foreground border-warning",
                        req.urgency === "Routine" && "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {req.urgency === "Critical" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1.5" aria-hidden="true" />}
                      {req.urgency}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-xl mb-1">{req.hospitalName}</h3>
                      <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        {req.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/30 p-6 flex sm:flex-col items-center sm:justify-center justify-between border-t sm:border-t-0 sm:border-l w-full sm:w-48">
                  <div className="text-center">
                    <div className="text-3xl font-serif font-bold text-foreground">{req.bloodType}</div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{req.units} Units Needed</div>
                  </div>

                  {user?.role === "donor" && (
                    <Dialog open={selectedReq?.id === req.id} onOpenChange={(open) => !open && setSelectedReq(null)}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          variant={req.urgency === "Critical" ? "destructive" : "default"}
                          onClick={() => setSelectedReq(req)}
                        >
                          Respond
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        {success ? (
                          <div className="py-12 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                              <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold mb-2">Confirmed!</h2>
                            <p className="text-muted-foreground">The hospital has been notified you are on your way.</p>
                          </div>
                        ) : (
                          <>
                            <DialogHeader>
                              <DialogTitle>Confirm Donation Response</DialogTitle>
                              <DialogDescription>
                                You are committing to fulfill this urgent request. The hospital will be notified instantly.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                              <div className="bg-muted p-4 rounded-lg">
                                <h4 className="font-medium mb-1">{req.hospitalName}</h4>
                                <p className="text-sm text-muted-foreground">{req.location}</p>
                              </div>
                              <p className="text-sm font-medium text-destructive">
                                By confirming, you pledge to travel to this location as soon as possible.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setSelectedReq(null)}>Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={handleRespond}
                                disabled={isConfirming}
                              >
                                {isConfirming ? "Confirming..." : "I'm On My Way"}
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </DashboardLayout>
  );
}
