import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { User, Mail, Building2, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BLOOD_TYPES } from "@/lib/blood-type-data";
import { ApiError } from "@/lib/api";

function fieldsFromUser(user: ReturnType<typeof useAuth>["user"]) {
  return {
    name: user?.name || "",
    bloodType: user?.bloodType || "",
    hospitalName: user?.hospitalName || "",
  };
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(fieldsFromUser(user));
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);

  const startEditing = () => {
    setFormData(fieldsFromUser(user));
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setFormData(fieldsFromUser(user));
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string } = {};
    if (!formData.name.trim()) nextErrors.name = "Name is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Could not save your changes.";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information.</p>
          </div>
          <Button variant="outline" onClick={isEditing ? cancelEditing : startEditing}>
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {user?.role === "hospital" ? <Building2 className="h-10 w-10" /> : <User className="h-10 w-10" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{formData.name}</h2>
                  <p className="text-muted-foreground capitalize">{user?.role} Account</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="profile-name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "profile-name-error" : undefined}
                    />
                  </div>
                  {errors.name && <p id="profile-name-error" className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="profile-email"
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="pl-10 pr-10"
                    />
                    <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>

                {user?.role === "donor" && (
                  <div className="space-y-2">
                    <Label htmlFor="profile-bloodtype">Blood Type</Label>
                    <Select
                      value={formData.bloodType}
                      onValueChange={(v) => setFormData({...formData, bloodType: v})}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="profile-bloodtype">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_TYPES.map((bt) => (
                          <SelectItem key={bt} value={bt}>{bt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {user?.role === "hospital" && (
                  <div className="space-y-2">
                    <Label htmlFor="profile-hospital">Facility Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="profile-hospital"
                        disabled={!isEditing}
                        value={formData.hospitalName}
                        onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="pt-4 border-t mt-8 flex justify-end">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
