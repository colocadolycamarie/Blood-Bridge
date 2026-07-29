import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { useRequests } from "@/lib/store/requests-store";
import { useDonations } from "@/lib/store/donations-store";
import { Activity, BellRing, Droplet, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { EmptyState } from "@/components/EmptyState";

export default function Overview() {
  const { user } = useAuth();
  const { requests } = useRequests();
  const { donations } = useDonations();
  const criticalCount = requests.filter(r => r.urgency === "Critical").length;
  const totalUnitsRequested = requests.reduce((sum, r) => sum + r.units, 0);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Here is your activity overview for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{requests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Nearby active needs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Needs</CardTitle>
            <BellRing className="h-4 w-4 text-destructive" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive">Require immediate attention</p>
          </CardContent>
        </Card>

        {user?.role === "donor" ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Contributions</CardTitle>
              <Droplet className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{donations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Donations logged</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Demand</CardTitle>
              <Package className="h-4 w-4 text-primary" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalUnitsRequested}</div>
              <p className="text-xs text-muted-foreground mt-1">Units requested, all active</p>
            </CardContent>
          </Card>
        )}
      </div>

      <h2 className="text-xl font-serif font-bold mb-4">Recent Activity Feed</h2>
      {requests.length === 0 ? (
        <EmptyState title="No activity yet" description="New requests will show up here." />
      ) : (
      <Card>
        <div className="divide-y">
          {requests.slice(0, 3).map((req) => (
            <div key={req.id} className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex gap-4 items-start">
                <div className={`p-2 rounded-full ${req.urgency === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                  <BellRing className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-medium">{req.hospitalName} needs {req.bloodType}</p>
                  <p className="text-sm text-muted-foreground">{req.location} • Posted {new Date(req.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
              <Link href="/dashboard/requests" className="text-sm font-medium text-primary hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </Card>
      )}
    </DashboardLayout>
  );
}
