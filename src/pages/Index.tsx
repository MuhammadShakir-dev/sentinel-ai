import { Link } from "react-router-dom";
import {
  Shield, Newspaper, Globe, Keyboard, Activity, ArrowRight, CheckCircle,
  Users, AlertTriangle, Zap, Sparkles, Lock, Eye, BarChart3, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "1.2M+", label: "Threats Detected" },
  { value: "50K+", label: "Users Protected" },
  { value: "5M+", label: "Scans Completed" },
  { value: "99.9%", label: "Uptime SLA" },
];

const features = [
  { icon: Newspaper, title: "Fake News Detection", description: "AI-powered NLP analyzes articles for credibility, source bias, and emotional manipulation patterns." },
  { icon: Globe, title: "Phishing Detection", description: "Scan URLs in real time. Detect spoofed domains, malicious patterns, and SSL anomalies instantly." },
  { icon: Keyboard, title: "Keylogger Detection", description: "Monitor system processes for hidden keystroke loggers and unauthorized input interception." },
  { icon: Activity, title: "DDoS Detection", description: "Deep learning models flag traffic anomalies and SYN floods before they bring your service down." },
];

const benefits = [
  { icon: Lock, title: "Enterprise-grade Security", desc: "Bank-level encryption and zero-trust architecture protect every scan." },
  { icon: Zap, title: "Real-time AI Analysis", desc: "Sub-second response from cutting-edge models running on the edge." },
  { icon: Eye, title: "Continuous Monitoring", desc: "Always-on threat detection across your entire digital perimeter." },
];

const testimonials = [
  { name: "Sarah Chen", role: "Security Engineer", quote: "CyberShield caught a phishing campaign targeting our team within minutes. The AI accuracy is genuinely impressive." },
  { name: "Marcus Reid", role: "IT Director", quote: "Having all four detection tools in one place transformed our incident response time from hours to seconds." },
  { name: "Priya Sharma", role: "CTO", quote: "The fake news detection has become essential for our newsroom. Clean UI, powerful results." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight">
              Cyber<span className="text-primary">Shield</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Benefits</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 radial-glow pointer-events-none" />
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
        <div className="container mx-auto px-6 pt-24 pb-32 relative">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary font-medium px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1.5" /> AI-Powered Cybersecurity Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.05] mb-6">
              Reliable Cyber Security<br />
              for Your <span className="text-gradient">Peace of Mind</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
              Four powerful AI-driven tools in one unified platform. Detect fake news, phishing, keyloggers, and DDoS attacks — before they cause damage.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6">
                  Start Securing Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-border/60 hover:bg-card font-medium px-6">
                  View Dashboard Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative orb */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px]">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl" />
            <div className="absolute inset-12 rounded-full border border-primary/30 grid-pattern" />
            <div className="absolute inset-24 rounded-full border border-accent/40" />
            <div className="absolute inset-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_40px_hsl(var(--primary))]" />
          </div>
        </div>
      </section>

      {/* ===== STATS BAND ===== */}
      <section className="border-y border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center md:text-left">
                <div className="text-3xl md:text-5xl font-display font-bold text-foreground">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="container mx-auto px-6 py-28">
        <div className="max-w-2xl mb-14">
          <Badge variant="outline" className="mb-4 border-border/60">Capabilities</Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Four powerful security tools, one platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive protection against the most common digital threats — built on modern AI and deep learning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f) => (
            <Card key={f.title} className="group bg-card/60 border-border/60 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>
                <div className="mt-6 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== BENEFITS SECTION ===== */}
      <section id="benefits" className="border-t border-border/60 bg-card/20">
        <div className="container mx-auto px-6 py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4 border-border/60">Why CyberShield</Badge>
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
                Benefits of choosing<br />
                <span className="text-gradient">CyberShield</span> security
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                We combine cutting-edge AI with decades of security research to deliver protection you can trust.
              </p>
              <div className="space-y-5">
                {benefits.map((b) => (
                  <div key={b.title} className="flex gap-4 p-5 rounded-xl bg-card/60 border border-border/60">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 grid place-items-center">
                      <b.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold mb-1">{b.title}</h4>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative aspect-square max-w-md mx-auto w-full">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl" />
              <Card className="relative h-full bg-card/80 border-border/60 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-accent/15 text-accent border-accent/30 hover:bg-accent/15">Live Scan</Badge>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-destructive/60" />
                      <div className="h-2 w-2 rounded-full bg-warning/60" />
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Phishing scan", status: "Clean", ok: true },
                      { label: "URL reputation", status: "Verified", ok: true },
                      { label: "Domain age", status: "12 years", ok: true },
                      { label: "SSL certificate", status: "Valid", ok: true },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="flex items-center gap-1.5 text-accent font-medium">
                          <CheckCircle className="h-3.5 w-3.5" /> {row.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Safety Score</span>
                      <span className="text-2xl font-display font-bold text-accent">98<span className="text-sm">%</span></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="container mx-auto px-6 py-28">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="outline" className="mb-4 border-border/60">Customers</Badge>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Trusted by security teams worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who rely on CyberShield daily.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-card/60 border-border/60">
              <CardContent className="p-7">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-display font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="container mx-auto px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/60 to-accent/10 p-12 md:p-16 text-center">
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
              Your safety is our mission.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Create your free account and access all four AI-powered cybersecurity tools instantly. No credit card required.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border/60">
        <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-display font-semibold">CyberShield AI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 CyberShield AI — Final Year Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
