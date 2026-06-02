import { useEffect, useState } from "react";
import { Newspaper, Search, AlertTriangle, CheckCircle, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { saveScan } from "@/hooks/useAuth";

interface AnalysisResult {
  classification: "Real" | "Fake";
  confidence: number;
  indicators: { label: string; value: string; risk: "low" | "medium" | "high" }[];
  sentiment: string;
  summary: string;
}

const FakeNewsDetection = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: AnalysisResult; time: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("scans").select("input, verdict, confidence, result, created_at")
        .eq("tool", "fake-news").order("created_at", { ascending: false }).limit(5);
      if (data) {
        setHistory(data.map((s: any) => ({
          text: s.input,
          result: s.result as AnalysisResult,
          time: new Date(s.created_at).toLocaleTimeString(),
        })));
      }
    })();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    // Animate progress while waiting for AI
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8;
      });
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-fake-news", {
        body: { text },
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      const analysis = data as AnalysisResult;
      setResult(analysis);
      const shortInput = text.slice(0, 120);
      setHistory((prev) => [
        { text: shortInput, result: analysis, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4),
      ]);
      await saveScan({
        tool: "fake-news",
        input: shortInput,
        verdict: analysis.classification,
        status: analysis.classification === "Fake" ? "danger" : "safe",
        confidence: analysis.confidence,
        result: analysis,
      });
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || "Could not analyze content. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-xl bg-secondary grid place-items-center">
          <Newspaper className="h-5 w-5 text-foreground/70" />
        </div>
        <div>
          <h1 className="text-3xl tracking-tight font-semibold">
            Fake news <span className="font-serif italic font-normal">detection.</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Paste any article — our AI rates credibility, sentiment and manipulation patterns.</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft">
        <Textarea
          placeholder="Paste news article text or content to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[150px] bg-muted/30 border-border/50 resize-none mb-4"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{text.length} characters</span>
          <Button onClick={handleAnalyze} disabled={loading || !text.trim()} className="glow-cyan">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Search className="h-4 w-4" /> Analyze Content</span>
            )}
          </Button>
        </div>

        {loading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>AI Analysis in Progress...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-primary font-mono animate-pulse-glow">
              {progress < 30 ? "Sending to AI model..." : progress < 60 ? "Running NLP analysis..." : progress < 90 ? "Evaluating credibility patterns..." : "Generating report..."}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          <div className={`rounded-2xl border p-6 shadow-card-soft bg-card ${result.classification === "Fake" ? "border-destructive/30" : "border-success/30"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.classification === "Fake" ? (
                  <AlertTriangle className="h-7 w-7 text-destructive" />
                ) : (
                  <CheckCircle className="h-7 w-7 text-success" />
                )}
                <div>
                  <h3 className="text-xl tracking-tight font-semibold">
                    Verdict: <span className={result.classification === "Fake" ? "text-destructive" : "text-success"}>{result.classification}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Sentiment: {result.sentiment}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tracking-tight">{result.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft">
            <h3 className="font-semibold tracking-tight mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" /> Analysis indicators
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {result.indicators.map((ind) => (
                <div key={ind.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                  <span className="text-sm text-muted-foreground">{ind.label}</span>
                  <span className={`text-sm font-medium ${
                    ind.risk === "high" ? "text-destructive" : ind.risk === "medium" ? "text-warning" : "text-success"
                  }`}>
                    {ind.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-2xl bg-card border border-border/60 p-6 shadow-card-soft">
          <h3 className="font-semibold tracking-tight mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" /> Recent analyses
          </h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary">
                <span className="text-sm text-muted-foreground truncate max-w-[60%]">{h.text}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${h.result.classification === "Fake" ? "text-destructive" : "text-success"}`}>
                    {h.result.classification} ({h.result.confidence}%)
                  </span>
                  <span className="text-xs text-muted-foreground">{h.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FakeNewsDetection;
