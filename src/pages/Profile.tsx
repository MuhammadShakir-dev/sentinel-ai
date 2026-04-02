import { useState, useEffect } from "react";
import { User, Mail, Shield, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem("cybershield_user");
    if (stored) {
      const user = JSON.parse(stored);
      setName(user.name);
      setEmail(user.email);
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    localStorage.setItem("cybershield_user", JSON.stringify({ name, email }));
    toast({ title: "Profile updated", description: "Your changes have been saved." });
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 glow-cyan">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Profile Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center glow-cyan">
            <span className="text-2xl font-bold text-primary">{name[0]?.toUpperCase() || "U"}</span>
          </div>
          <div>
            <p className="font-mono font-semibold text-foreground">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-muted/30 border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted/30 border-border/50" />
            </div>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="glow-cyan">
          {saving ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <><Save className="h-4 w-4 mr-1" /> Save Changes</>
          )}
        </Button>
      </div>

      {/* Security Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Security Status
        </h3>
        <div className="space-y-3">
          {[
            { label: "Account Status", value: "Active", ok: true },
            { label: "Two-Factor Auth", value: "Not Enabled", ok: false },
            { label: "Last Login", value: new Date().toLocaleDateString(), ok: true },
            { label: "Session", value: "Current", ok: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className={`text-sm font-mono flex items-center gap-1 ${item.ok ? "text-accent" : "text-warning"}`}>
                <CheckCircle className="h-3 w-3" /> {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
