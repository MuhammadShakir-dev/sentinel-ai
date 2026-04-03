import { useState } from "react";
import { Globe, Search, ShieldAlert, ShieldCheck, Lock, ExternalLink, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      setResult(data as ScanResult);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-accent/10 glow-green">
          <Globe className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Phishing Website Detection</h1>
          <p className="text-sm text-muted-foreground">AI-powered URL scanning for phishing threats</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="glass rounded-xl p-6">
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
          <div className={`glass rounded-xl p-6 ${riskGlow}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.risk === "Dangerous" ? <ShieldAlert className="h-8 w-8 text-destructive" /> :
                 result.risk === "Suspicious" ? <AlertTriangle className="h-8 w-8 text-warning" /> :
                 <ShieldCheck className="h-8 w-8 text-accent" />}
                <div>
                  <h3 className="text-xl font-mono font-bold text-foreground">
                    Status: <span className={riskColor}>{result.risk}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground font-mono">{url}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-mono font-bold ${riskColor}`}>{result.score}%</div>
                <div className="text-xs text-muted-foreground">Safety Score</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Security Checks
            </h3>
            <div className="space-y-3">
              {result.checks.map((check) => (
                <div key={check.name} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
                  <div className={`h-2 w-2 rounded-full ${
                    check.status === "pass" ? "bg-accent" : check.status === "warn" ? "bg-warning" : "bg-destructive"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.detail}</p>
                  </div>
                  <span className={`text-xs font-mono uppercase ${
                    check.status === "pass" ? "text-accent" : check.status === "warn" ? "text-warning" : "text-destructive"
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
