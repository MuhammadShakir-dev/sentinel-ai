import { useState } from "react";
import { Globe, Search, ShieldAlert, ShieldCheck, Lock, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveScan } from "@/hooks/useAuth";

interface ScanResult {
  risk: "Safe" | "Suspicious" | "Dangerous";
  score: number;
  checks: { name: string; status: "pass" | "fail" | "warn"; detail: string }[];
  summary: string;
}

const PhishingDetection = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 250);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-phishing", {
        body: { url },
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const r = data as ScanResult;
      setResult(r);
      await saveScan({
        tool: "phishing",
        input: url,
        verdict: r.risk,
        status: r.risk === "Dangerous" ? "danger" : r.risk === "Suspicious" ? "warning" : "safe",
        confidence: r.score,
        result: r,
      });
    } catch (err: any) {
      toast({
        title: "Scan Failed",
        description: err.message || "Could not scan URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  const riskColor = result?.risk === "Dangerous" ? "text-destructive" : result?.risk === "Suspicious" ? "text-warning" : "text-accent";
  const riskGlow = result?.risk === "Dangerous" ? "glow-red" : result?.risk === "Suspicious" ? "glow-cyan" : "glow-green";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center">
          <Globe className="h-5 w-5 text-foreground/70" />
        </div>
        <div>
          <h1 className="text-3xl tracking-tight font-semibold">
            Phishing <span className="font-serif italic font-normal">detection.</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Drop any URL — our AI checks reputation, domain age, SSL and threat signals.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <ExternalLink className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter URL to scan (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 bg-muted/30 border-border/50"
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>
          <Button onClick={handleScan} disabled={loading || !url.trim()} className="glow-cyan">
            {loading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <><Search className="h-4 w-4 mr-1" /> Scan</>
            )}
          </Button>
        </div>

        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>AI Scanning URL...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-primary font-mono animate-pulse-glow">
              {progress < 25 ? "Analyzing URL structure..." : progress < 50 ? "Checking domain patterns..." : progress < 75 ? "Running AI threat model..." : "Generating security report..."}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl bg-card border p-6 shadow-card-soft ${result.risk === "Dangerous" ? "border-destructive/30" : result.risk === "Suspicious" ? "border-warning/30" : "border-success/30"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.risk === "Dangerous" ? <ShieldAlert className="h-7 w-7 text-destructive" /> :
                 result.risk === "Suspicious" ? <AlertTriangle className="h-7 w-7 text-warning" /> :
                 <ShieldCheck className="h-7 w-7 text-success" />}
                <div>
                  <h3 className="text-xl tracking-tight font-semibold">
                    Status: <span className={result.risk === "Dangerous" ? "text-destructive" : result.risk === "Suspicious" ? "text-warning" : "text-success"}>{result.risk}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono break-all">{url}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tracking-tight">{result.score}%</div>
                <div className="text-xs text-muted-foreground">Safety score</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft">
            <h3 className="font-semibold tracking-tight mb-4 flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" /> Security checks
            </h3>
            <div className="space-y-2">
              {result.checks.map((check) => (
                <div key={check.name} className="flex items-center gap-4 p-3 rounded-xl bg-secondary">
                  <div className={`h-2 w-2 rounded-full ${
                    check.status === "pass" ? "bg-success" : check.status === "warn" ? "bg-warning" : "bg-destructive"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                  <span className={`text-xs uppercase tracking-wider ${
                    check.status === "pass" ? "text-success" : check.status === "warn" ? "text-warning" : "text-destructive"
                  }`}>
                    {check.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingDetection;
