import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthShell from "@/components/AuthShell";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session || event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    const t = setTimeout(() => setReady(true), 1500);
    return () => { subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
    if (password !== confirm) return toast({ title: "Passwords don't match", variant: "destructive" });
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Password updated" });
    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle={ready ? "Choose a strong password you haven't used before." : "Validating reset link…"}
      footer={<Link to="/login" className="text-foreground underline underline-offset-4">Back to sign in</Link>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type={show ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-xl" required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="confirm" type={show ? "text" : "password"} placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-10 h-11 rounded-xl" required />
          </div>
        </div>
        <Button type="submit" className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={loading || !ready}>
          {loading ? "Updating…" : (<span className="inline-flex items-center gap-2">Update password <ArrowRight className="h-4 w-4" /></span>)}
        </Button>
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
