import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back", description: "Signed in to CyberShield AI" });
    navigate("/dashboard");
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
            <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
            <CardDescription>Sign in to access your security dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@cybershield.ai" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">Create one</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
