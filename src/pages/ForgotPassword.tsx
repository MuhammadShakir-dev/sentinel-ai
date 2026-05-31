import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    toast({ title: "Check your inbox", description: "We sent you a password reset link." });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 radial-glow pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="w-full max-w-md relative">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">
            Cyber<span className="text-primary">Shield</span>
          </span>
        </Link>

        <Card className="border-border/60 bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-display">Reset your password</CardTitle>
            <CardDescription>
              {sent ? "Email sent. Follow the link to set a new password." : "Enter your email and we'll send you a reset link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@cybershield.ai" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Send reset link <ArrowRight className="h-4 w-4" /></span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                If an account exists for <span className="text-foreground font-medium">{email}</span>, you'll receive an email shortly.
              </div>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/login" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
