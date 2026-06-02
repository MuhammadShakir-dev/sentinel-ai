import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthShell from "@/components/AuthShell";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { name } },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created" });
    navigate("/dashboard");
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start protecting your digital surface in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-foreground underline underline-offset-4">Sign in</Link></>}
    >
      <form onSubmit={handleSignup} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 rounded-xl" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 rounded-xl" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="password" type={show ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 rounded-xl" required minLength={6} />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full h-11 rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
          {loading ? "Creating account…" : (<span className="inline-flex items-center gap-2">Create account <ArrowRight className="h-4 w-4" /></span>)}
        </Button>
      </form>
    </AuthShell>
  );
};

export default Signup;
