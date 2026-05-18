import { useState } from "react";
import { Activity, Search, AlertTriangle, CheckCircle, ShieldCheck, Wand2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveScan } from "@/hooks/useAuth";

interface DDoSResult {
  status: "Normal" | "Warning" | "Under Attack";
  attack_type: string;
  confidence: number;
  summary: string;
  indicators: { label: string; value: string; severity: "info" | "warning" | "critical" }[];
  recommendations: string[];
}

const SAMPLE = `Time window: last 60 seconds
Requests/sec: 4,820 (baseline 180)
Unique source IPs: 12,400
Top endpoint: /login (94% of requests)
Half-open TCP connections: 8,500
Avg request size: 240 bytes
Geographic spread: 86 countries, 60% from 2 ASNs
SYN packets: 320,000 in 60s
HTTP 503 rate: 42%`;

const DDoSDetection = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<DDoSResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);
    const tick = setInterval(() => setProgress((p) => (p >= 90 ? p : p + Math.random() * 8)), 250);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-ddos", { body: { traffic: text } });
      clearInterval(tick);
      setProgress(100);
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const r = data as DDoSResult;
      setResult(r);
      await saveScan({
        tool: "ddos",
        input: text.slice(0, 200),
        verdict: r.status,
        status: r.status === "Under Attack" ? "danger" : r.status === "Warning" ? "warning" : "safe",
        confidence: r.confidence,
        result: r,
      });
    } catch (err: any) {
      toast({ title: "Scan failed", description: err.message || "Could not analyze traffic.", variant: "destructive" });
    } finally {
      clearInterval(tick);
      setLoading(false);
    }
  };

  const statusColor = result?.status === "Under Attack" ? "text-destructive" : result?.status === "Warning" ? "text-warning" : "text-accent";
  const statusGlow = result?.status === "Under Attack" ? "glow-red" : result?.status === "Warning" ? "" : "glow-green";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">DDoS Attack Detection</h1>
          <p className="text-sm text-muted-foreground">Paste traffic stats or logs — AI analyzes patterns for DDoS indicators</p>
        </div>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6 space-y-4">
          <Textarea
            placeholder="Paste traffic stats, log lines, or a summary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[180px] resize-none font-code text-sm"
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => setText(SAMPLE)}>
              <Wand2 className="h-4 w-4 mr-1.5" /> Load sample
            </Button>
            <Button onClick={handleScan} disabled={loading || !text.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <><Search className="h-4 w-4 mr-1.5" /> Analyze Traffic</>
              )}
            </Button>
          </div>
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-primary font-medium">
                {progress < 30 ? "Parsing traffic data..." : progress < 70 ? "Running deep learning analysis..." : "Identifying attack vectors..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card className={`border-border/60 bg-card/60 ${statusGlow}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {result.status === "Normal" ? <ShieldCheck className="h-8 w-8 text-accent" /> : <AlertTriangle className={`h-8 w-8 ${statusColor} ${result.status === "Under Attack" ? "animate-pulse" : ""}`} />}
                  <div>
                    <h3 className="text-xl font-display font-bold">
                      Status: <span className={statusColor}>{result.status}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                    {result.attack_type !== "None" && (
                      <Badge variant="outline" className="mt-2 border-destructive/30 bg-destructive/10 text-destructive">
                        Attack type: {result.attack_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-display font-bold ${statusColor}`}>{result.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" /> Traffic Indicators
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {result.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm text-muted-foreground">{ind.label}</span>
                    <span className={`text-sm font-medium ${
                      ind.severity === "critical" ? "text-destructive" :
                      ind.severity === "warning" ? "text-warning" : "text-accent"
                    }`}>{ind.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {result.recommendations?.length > 0 && (
            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-6">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" /> Recommendations
                </h3>
                <ul className="space-y-2">
                  {result.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-primary">→</span>
                      <span className="text-foreground/90">{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default DDoSDetection;
