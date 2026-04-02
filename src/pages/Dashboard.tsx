import { Link, useOutletContext } from "react-router-dom";
import { Newspaper, Globe, Keyboard, Activity, ArrowRight, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const tools = [
  { title: "Fake News Detection", desc: "Analyze news articles for credibility", icon: Newspaper, url: "/dashboard/fake-news", color: "text-primary", scans: 142 },
  { title: "Phishing Detection", desc: "Scan URLs for phishing threats", icon: Globe, url: "/dashboard/phishing", color: "text-accent", scans: 89 },
  { title: "Keylogger Detection", desc: "Detect hidden keyloggers on your system", icon: Keyboard, url: "/dashboard/keylogger", color: "text-cyber-purple", scans: 34 },
  { title: "DDoS Detection", desc: "Monitor network traffic for DDoS attacks", icon: Activity, url: "/dashboard/ddos", color: "text-destructive", scans: 67 },
];

const recentActivity = [
  { tool: "Fake News Detection", result: "Fake", time: "2 minutes ago", icon: Newspaper, status: "danger" },
  { tool: "Phishing Detection", result: "Safe", time: "15 minutes ago", icon: Globe, status: "safe" },
  { tool: "DDoS Detection", result: "Normal Traffic", time: "1 hour ago", icon: Activity, status: "safe" },
  { tool: "Keylogger Detection", result: "2 Suspicious", time: "3 hours ago", icon: Keyboard, status: "warning" },
];

const Dashboard = () => {
  const { user } = useOutletContext<{ user: { name: string; email: string } }>();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass rounded-xl p-6 glow-cyan">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">Your security dashboard is active and monitoring.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Scans", value: "332", icon: TrendingUp, color: "text-primary" },
          { label: "Threats Found", value: "18", icon: AlertTriangle, color: "text-destructive" },
          { label: "Safe Results", value: "314", icon: CheckCircle, color: "text-accent" },
          { label: "Active Tools", value: "4/4", icon: Shield, color: "text-cyber-purple" },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-4">
            <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
            <div className="text-2xl font-mono font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-lg font-mono font-semibold text-foreground mb-4">Security Tools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link key={tool.url} to={tool.url} className="glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex items-start justify-between">
                <div>
                  <tool.icon className={`h-8 w-8 ${tool.color} mb-3`} />
                  <h3 className="font-mono font-semibold text-foreground mb-1">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="text-foreground font-mono">{tool.scans}</span> scans completed
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-mono font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="glass rounded-xl divide-y divide-border/50">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.tool}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                item.status === "safe" ? "bg-accent/10 text-accent" :
                item.status === "danger" ? "bg-destructive/10 text-destructive" :
                "bg-warning/10 text-warning"
              }`}>
                {item.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
