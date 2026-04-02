import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));

    if (name && email && password.length >= 6) {
      localStorage.setItem("cybershield_user", JSON.stringify({ email, name }));
      toast({ title: "Account created!", description: "Welcome to CyberShield AI" });
      navigate("/dashboard");
    } else {
      toast({ title: "Signup failed", description: "Please fill all fields (password min 6 chars)", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-mono font-bold text-foreground">
              Cyber<span className="text-primary">Shield</span> AI
            </span>
          </Link>
          <h1 className="text-3xl font-mono font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join CyberShield AI and secure your digital world</p>
        </div>

        <div className="glass rounded-xl p-8 glow-cyan">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-muted/50 border-border/50 focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="agent@cybershield.ai" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-muted/50 border-border/50 focus:border-primary" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 bg-muted/50 border-border/50 focus:border-primary" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full glow-cyan" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">Create Account <ArrowRight className="h-4 w-4" /></span>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
