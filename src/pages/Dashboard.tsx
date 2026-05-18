import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Newspaper, Globe, Keyboard, Activity, ArrowRight, Shield, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const TOOL_META: Record<string, { title: string; desc: string; icon: any; url: string }> = {
  "fake-news": { title: "Fake News Detection", desc: "Analyze articles for credibility", icon: Newspaper, url: "/dashboard/fake-news" },
  "phishing":  { title: "Phishing Detection",  desc: "Scan URLs for phishing threats",  icon: Globe,     url: "/dashboard/phishing" },
  "keylogger": { title: "Keylogger Detection", desc: "Detect hidden keyloggers",        icon: Keyboard,  url: "/dashboard/keylogger" },
  "ddos":      { title: "DDoS Detection",      desc: "Monitor network traffic",         icon: Activity,  url: "/dashboard/ddos" },
};

interface Scan {
  id: string;
  tool: string;
  verdict: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const { displayName } = useOutletContext<{ displayName: string }>();
  const [scans, setScans] = useState<Scan[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("scans")
        .select("id, tool, verdict, status, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      const all = (data ?? []) as Scan[];
      setScans(all);
      const c: Record<string, number> = {};
      all.forEach((s) => { c[s.tool] = (c[s.tool] ?? 0) + 1; });
      setCounts(c);
      setLoading(false);
    })();
  }, []);

  const total = scans.length;
  const threats = scans.filter((s) => s.status === "danger").length;
  const safe = scans.filter((s) => s.status === "safe").length;
  const warnings = scans.filter((s) => s.status === "warning").length;
  const safeRate = total ? Math.round((safe / total) * 100) : 0;

  const stats = [
    { label: "Total Scans", value: String(total), icon: TrendingUp, hint: total ? `${warnings} warnings` : "Run your first scan" },
    { label: "Threats Found", value: String(threats), icon: AlertTriangle, hint: threats ? "Action recommended" : "All clear" },
    { label: "Safe Results", value: String(safe), icon: CheckCircle, hint: total ? `${safeRate}% safe rate` : "—" },
    { label: "Active Tools", value: "4/4", icon: Shield, hint: "All operational" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight">
          Welcome back, <span className="text-primary">{displayName}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening across your security perimeter.</p>
      </div>

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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Security Tools</h2>
          <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">All Systems Operational</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(TOOL_META).map(([key, t]) => (
            <Link key={key} to={t.url} className="group">
              <Card className="border-border/60 bg-card/60 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 h-full">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 grid place-items-center group-hover:bg-primary/20 transition-colors">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base font-display mb-1">{t.title}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <span className="text-foreground font-semibold font-display">{counts[key] ?? 0}</span> scans completed
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
        <Card className="border-border/60 bg-card/60">
          <CardContent className="p-0 divide-y divide-border/60">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
            ) : scans.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No scans yet. Pick a tool above to get started.
              </div>
            ) : (
              scans.slice(0, 8).map((item) => {
                const meta = TOOL_META[item.tool];
                if (!meta) return null;
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="h-9 w-9 rounded-lg bg-muted/50 grid place-items-center">
                      <meta.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{meta.title}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "safe" ? "border-accent/30 bg-accent/10 text-accent" :
                        item.status === "danger" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                        "border-warning/30 bg-warning/10 text-warning"
                      }
                    >
                      {item.verdict}
                    </Badge>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
