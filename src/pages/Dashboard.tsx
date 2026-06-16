import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Newspaper, Globe, Keyboard, Activity, ArrowUpRight, ShieldCheck, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const TOOL_META: Record<string, { title: string; desc: string; icon: any; url: string }> = {
  "fake-news": { title: "Fake News",  desc: "Article credibility analysis",  icon: Newspaper, url: "/dashboard/fake-news" },
  "phishing":  { title: "Phishing",   desc: "URL reputation scanning",        icon: Globe,     url: "/dashboard/phishing" },
  "keylogger": { title: "Keylogger",  desc: "Process behavioral forensics",   icon: Keyboard,  url: "/dashboard/keylogger" },
  "ddos":      { title: "DDoS",       desc: "Traffic pattern analysis",       icon: Activity,  url: "/dashboard/ddos" },
};

interface Scan { id: string; tool: string; verdict: string; status: string; created_at: string; }

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
    { label: "Total scans",   value: String(total),   icon: TrendingUp,    hint: total ? `${warnings} warnings` : "Run your first scan" },
    { label: "Threats found", value: String(threats), icon: AlertTriangle, hint: threats ? "Action recommended" : "All clear" },
    { label: "Safe results",  value: String(safe),    icon: CheckCircle,   hint: total ? `${safeRate}% safe rate` : "-" },
    { label: "Active tools",  value: "4 / 4",         icon: ShieldCheck,   hint: "All operational" },
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl md:text-4xl tracking-tight font-semibold">
          Hello, <span className="font-serif italic font-normal">{displayName}.</span>
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">Here's what's happening across your security perimeter today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card border border-border/60 p-5 shadow-card-soft">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.16em]">{s.label}</span>
              <s.icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl tracking-tight font-semibold">Security tools</h2>
          <span className="text-xs text-muted-foreground">All systems operational</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {Object.entries(TOOL_META).map(([key, t]) => (
            <Link key={key} to={t.url} className="group rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft hover:shadow-soft transition-shadow flex items-start gap-5">
              <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center shrink-0">
                <t.icon className="h-5 w-5 text-foreground/70" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold tracking-tight">{t.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{counts[key] ?? 0}</span> scans completed
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-xl tracking-tight font-semibold">Recent activity</h2>
          <span className="text-xs text-muted-foreground">{scans.length} total</span>
        </div>
        <div className="rounded-2xl bg-card border border-border/60 shadow-card-soft divide-y divide-border/60">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
          ) : scans.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No scans yet. Pick a tool above to get started.
            </div>
          ) : (
            scans.slice(0, 8).map((item) => {
              const meta = TOOL_META[item.tool];
              if (!meta) return null;
              return (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="h-9 w-9 rounded-lg bg-secondary grid place-items-center">
                    <meta.icon className="h-4 w-4 text-foreground/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{meta.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    item.status === "safe" ? "border-success/30 bg-success/10 text-success" :
                    item.status === "danger" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                    "border-warning/30 bg-warning/10 text-warning"
                  }`}>{item.verdict}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
