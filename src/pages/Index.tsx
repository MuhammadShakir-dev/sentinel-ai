import { Link } from "react-router-dom";
import { Shield, Newspaper, Globe, Keyboard, Activity, ArrowRight, CheckCircle, Users, AlertTriangle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Threats Detected", value: "1.2M+", icon: AlertTriangle },
  { label: "Users Protected", value: "50K+", icon: Users },
  { label: "Scans Completed", value: "5M+", icon: CheckCircle },
  { label: "Uptime", value: "99.9%", icon: Zap },
];

const features = [
  {
    icon: Newspaper,
    title: "Fake News Detection",
    description: "Verify news credibility using NLP-powered analysis. Detect misinformation before it spreads.",
    color: "text-primary",
    glow: "glow-cyan",
  },
  {
    icon: Globe,
    title: "Phishing Detection",
    description: "Analyze URLs and website patterns to identify phishing attacks in real-time.",
    color: "text-accent",
    glow: "glow-green",
  },
  {
    icon: Keyboard,
    title: "Keylogger Detection",
    description: "Monitor system processes to detect hidden keyloggers and malicious background activities.",
    color: "text-cyber-purple",
    glow: "glow-cyan",
  },
  {
    icon: Activity,
    title: "DDoS Detection",
    description: "Real-time network traffic analysis using deep learning to detect and alert DDoS attacks.",
    color: "text-destructive",
    glow: "glow-red",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-pattern relative overflow-hidden">
      {/* Scanline effect */}
      <div className="fixed inset-0 scanline pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="relative z-10 border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-mono font-bold text-foreground">
              Cyber<span className="text-primary">Shield</span> AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="glow-cyan">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating shield icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
              <div className="relative p-6 rounded-full glass glow-cyan animate-float">
                <Shield className="h-16 w-16 text-primary" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 animate-fade-in">
            <span className="text-foreground">AI-Powered</span>
            <br />
            <span className="text-primary text-glow-cyan">Cyber Security</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            An intelligent, all-in-one platform to detect fake news, phishing websites, keyloggers, and DDoS attacks — powered by AI, ML, and Deep Learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 py-6 glow-cyan">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-mono font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-foreground mb-4">
            Four Powerful <span className="text-primary">Security Tools</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive protection against the most common digital threats, all in one unified platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`glass rounded-xl p-8 hover:border-primary/30 transition-all duration-300 ${feature.glow} hover:scale-[1.02] animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
              <h3 className="text-xl font-mono font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-24">
        <div className="glass rounded-2xl p-12 text-center glow-cyan max-w-3xl mx-auto">
          <h2 className="text-3xl font-mono font-bold text-foreground mb-4">
            Ready to Secure Your Digital World?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Create your free account and access all four AI-powered cybersecurity tools instantly.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-10 py-6 glow-cyan">
              Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-mono">CyberShield AI</span>
          </div>
          <p>© 2024 CyberShield AI — Final Year Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
