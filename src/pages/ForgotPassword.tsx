import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthShell from "@/components/AuthShell";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send email", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "Check your inbox" });
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle={sent ? "Email sent, follow the link to set a new password." : "Enter your email and we'll send you a reset link."}
      footer={<Link to="/login" className="inline-flex items-center gap-1 text-foreground underline underline-offset-4"><ArrowLeft className="h-3 w-3" /> Back to sign in</Link>}
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" required />
            </div>
          </div>
          <Button type="submit" className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
            {loading ? "Sending…" : (<span className="inline-flex items-center gap-2">Send reset link <ArrowRight className="h-4 w-4" /></span>)}
          </Button>
        </form>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-2">
          If an account exists for <span className="text-foreground font-medium">{email}</span>, you'll receive an email shortly.
        </div>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
