import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { User, Mail, Shield, Save, CheckCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Profile as ProfileType } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, profile } = useOutletContext<{ user: AuthUser; profile: ProfileType | null }>();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) setName(profile.name);
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const initial = (name || user?.email || "U")[0].toUpperCase();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl tracking-tight font-semibold">
          Your <span className="font-serif italic font-normal">profile.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your account information.</p>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-display font-bold text-primary-foreground">
              {initial}
            </div>
            <div>
              <CardTitle className="font-display">{name || "Unnamed"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={user?.email ?? ""} disabled className="pl-10" />
            </div>
            <p className="text-xs text-muted-foreground">Email is managed through your authentication provider.</p>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={saving || !name} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <><Save className="h-4 w-4 mr-1.5" /> Save Changes</>
              )}
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Account Status", value: "Active", ok: true },
            { label: "Email Verified", value: user?.email_confirmed_at ? "Yes" : "No", ok: !!user?.email_confirmed_at },
            { label: "Created", value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-", ok: true },
            { label: "Session", value: "Current", ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className={`text-sm font-medium flex items-center gap-1.5 ${item.ok ? "text-accent" : "text-warning"}`}>
                <CheckCircle className="h-3.5 w-3.5" /> {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
