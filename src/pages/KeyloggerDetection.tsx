import { useState } from "react";
import { Keyboard, Search, AlertTriangle, CheckCircle, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveScan } from "@/hooks/useAuth";

interface AnalyzedProcess {
  name: string;
  pid: string;
  risk: "Safe" | "Suspicious" | "Malicious";
  reason: string;
}
interface KeyloggerResult {
  summary: string;
  threat_level: "Safe" | "Suspicious" | "Critical";
  confidence: number;
  processes: AnalyzedProcess[];
}

const SAMPLE = `chrome.exe [1024] 2.3% 450MB - browser
svchost.exe [2048] 0.1% 32MB - system service
keyhelper.dll [3072] 4.8% 12MB - injected into explorer.exe
explorer.exe [4096] 1.2% 120MB - shell
inputmon.exe [5120] 3.1% 28MB - low-level keyboard hook registered
notepad.exe [6144] 0.3% 15MB - text editor
klogd_service.exe [7168] 5.2% 8MB - hidden, captures keystrokes
update_helper.exe [8192] 2.7% 45MB - unusual outbound network`;

const KeyloggerDetection = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<KeyloggerResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    const tick = setInterval(() => setProgress((p) => (p >= 90 ? p : p + Math.random() * 8)), 250);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-keylogger", { body: { processes: text } });
      clearInterval(tick);
      setProgress(100);
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const r = data as KeyloggerResult;
      setResult(r);
      await saveScan({
        tool: "keylogger",
        input: text.slice(0, 200),
        verdict: r.threat_level,
        status: r.threat_level === "Critical" ? "danger" : r.threat_level === "Suspicious" ? "warning" : "safe",
        confidence: r.confidence,
        result: r,
      });
    } catch (err: any) {
      toast({ title: "Scan failed", description: err.message || "Could not analyze processes.", variant: "destructive" });
    } finally {
      clearInterval(tick);
      setLoading(false);
    }
  };

  const counts = result ? {
    malicious: result.processes.filter((p) => p.risk === "Malicious").length,
    suspicious: result.processes.filter((p) => p.risk === "Suspicious").length,
    safe: result.processes.filter((p) => p.risk === "Safe").length,
  } : null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center">
          <Keyboard className="h-5 w-5 text-foreground/70" />
        </div>
        <div>
          <h1 className="text-3xl tracking-tight font-semibold">
            Keylogger <span className="font-serif italic font-normal">forensics.</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Paste a process list, our AI flags hidden keystroke loggers and unusual hooks.</p>
        </div>
      </div>

      <Card className="border-border/60 bg-card/60">
        <CardContent className="p-6 space-y-4">
          <Textarea
            placeholder="Paste running processes (one per line). Example: chrome.exe [1024] 2.3% 450MB"
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
                <><Search className="h-4 w-4 mr-1.5" /> Analyze</>
              )}
            </Button>
          </div>
          {loading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-primary font-medium">
                {progress < 30 ? "Reading process list..." : progress < 70 ? "Running AI behavioral analysis..." : "Generating threat report..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card className={`border-border/60 bg-card/60 ${
            result.threat_level === "Critical" ? "glow-red" : result.threat_level === "Suspicious" ? "" : "glow-green"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {result.threat_level === "Critical" ? <AlertTriangle className="h-7 w-7 text-destructive" /> :
                   result.threat_level === "Suspicious" ? <AlertTriangle className="h-7 w-7 text-warning" /> :
                   <CheckCircle className="h-7 w-7 text-accent" />}
                  <div>
                    <h3 className="text-xl font-display font-bold">
                      Threat: <span className={
                        result.threat_level === "Critical" ? "text-destructive" :
                        result.threat_level === "Suspicious" ? "text-warning" : "text-accent"
                      }>{result.threat_level}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">{result.summary}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold">{result.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {counts && (
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-border/60 bg-card/60"><CardContent className="p-4 text-center">
                <CheckCircle className="h-5 w-5 text-accent mx-auto mb-1" />
                <div className="text-2xl font-display font-bold">{counts.safe}</div>
                <div className="text-xs text-muted-foreground">Safe</div>
              </CardContent></Card>
              <Card className="border-border/60 bg-card/60"><CardContent className="p-4 text-center">
                <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
                <div className="text-2xl font-display font-bold text-warning">{counts.suspicious}</div>
                <div className="text-xs text-muted-foreground">Suspicious</div>
              </CardContent></Card>
              <Card className="border-border/60 bg-card/60"><CardContent className="p-4 text-center">
                <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
                <div className="text-2xl font-display font-bold text-destructive">{counts.malicious}</div>
                <div className="text-xs text-muted-foreground">Malicious</div>
              </CardContent></Card>
            </div>
          )}

          <Card className="border-border/60 bg-card/60">
            <CardContent className="p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Detected Processes
              </h3>
              <div className="space-y-2">
                {result.processes.map((p, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                    p.risk === "Malicious" ? "bg-destructive/5 border border-destructive/20" :
                    p.risk === "Suspicious" ? "bg-warning/5 border border-warning/20" :
                    "bg-muted/30"
                  }`}>
                    <div className={`h-2 w-2 rounded-full mt-2 ${
                      p.risk === "Malicious" ? "bg-destructive animate-pulse" :
                      p.risk === "Suspicious" ? "bg-warning" : "bg-accent"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-code font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">PID: {p.pid}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.reason}</p>
                    </div>
                    <Badge variant="outline" className={
                      p.risk === "Malicious" ? "border-destructive/30 bg-destructive/10 text-destructive" :
                      p.risk === "Suspicious" ? "border-warning/30 bg-warning/10 text-warning" :
                      "border-accent/30 bg-accent/10 text-accent"
                    }>{p.risk}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KeyloggerDetection;
