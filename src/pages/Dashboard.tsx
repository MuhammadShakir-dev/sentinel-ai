import { Link, useOutletContext } from "react-router-dom";
import { Newspaper, Globe, Keyboard, Activity, ArrowRight, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tools = [
  { title: "Fake News Detection", desc: "Analyze articles for credibility", icon: Newspaper, url: "/dashboard/fake-news", scans: 142 },
  { title: "Phishing Detection", desc: "Scan URLs for phishing threats", icon: Globe, url: "/dashboard/phishing", scans: 89 },
  { title: "Keylogger Detection", desc: "Detect hidden keyloggers", icon: Keyboard, url: "/dashboard/keylogger", scans: 34 },
  { title: "DDoS Detection", desc: "Monitor network traffic", icon: Activity, url: "/dashboard/ddos", scans: 67 },
];

const recentActivity = [
  { tool: "Fake News Detection", result: "Fake", time: "2 minutes ago", icon: Newspaper, status: "danger" },
  { tool: "Phishing Detection", result: "Safe", time: "15 minutes ago", icon: Globe, status: "safe" },
  { tool: "DDoS Detection", result: "Normal Traffic", time: "1 hour ago", icon: Activity, status: "safe" },
  { tool: "Keylogger Detection", result: "2 Suspicious", time: "3 hours ago", icon: Keyboard, status: "warning" },
];

const stats = [
  { label: "Total Scans", value: "332", icon: TrendingUp, hint: "+12% this week" },
  { label: "Threats Found", value: "18", icon: AlertTriangle, hint: "3 critical" },
  { label: "Safe Results", value: "314", icon: CheckCircle, hint: "94.6% rate" },
  { label: "Active Tools", value: "4/4", icon: Shield, hint: "All operational" },
];

const Dashboard = () => {
  const { user } = useOutletContext<{ user: { name: string; email: string } }>();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Welcome back, <span className="text-primary">{user.name}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening across your security perimeter.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60 bg-card/60">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-3xl font-display font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.hint}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Security Tools</h2>
          <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">All Systems Operational</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <Link key={tool.url} to={tool.url} className="group">
              <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base font-display mb-1">{tool.title}</CardTitle>
                  <CardDescription>{tool.desc}</CardDescription>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span className="text-foreground font-semibold font-display">{tool.scans}</span> scans completed
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-0 divide-y divide-border/60">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-9 w-9 rounded-lg bg-muted/50 grid place-items-center">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.tool}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === "safe" ? "border-accent/30 bg-accent/10 text-accent" :
                    item.status === "danger" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                    "border-warning/30 bg-warning/10 text-warning"
                  }
                >
                  {item.result}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
