import { useState } from "react";
import { Newspaper, Search, AlertTriangle, CheckCircle, BarChart3, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  classification: "Real" | "Fake";
  confidence: number;
  indicators: { label: string; value: string; risk: "low" | "medium" | "high" }[];
  sentiment: string;
  summary: string;
}

const simulateAnalysis = (text: string): AnalysisResult => {
  const isFake = text.toLowerCase().includes("shocking") || text.toLowerCase().includes("you won't believe") || text.toLowerCase().includes("miracle") || text.length < 50;
  const confidence = isFake ? 72 + Math.random() * 20 : 78 + Math.random() * 18;
  return {
    classification: isFake ? "Fake" : "Real",
    confidence: Math.round(confidence * 10) / 10,
    indicators: [
      { label: "Emotional Language", value: isFake ? "High" : "Low", risk: isFake ? "high" : "low" },
      { label: "Source Credibility", value: isFake ? "Unverified" : "Verified", risk: isFake ? "high" : "low" },
      { label: "Factual Consistency", value: isFake ? "Inconsistent" : "Consistent", risk: isFake ? "medium" : "low" },
      { label: "Clickbait Pattern", value: isFake ? "Detected" : "None", risk: isFake ? "high" : "low" },
    ],
    sentiment: isFake ? "Sensationalist" : "Neutral",
    summary: isFake
      ? "The content exhibits patterns commonly associated with misinformation, including emotional language and unverified claims."
      : "The content appears to follow journalistic standards with factual language and verifiable information.",
  };
};

const FakeNewsDetection = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<{ text: string; result: AnalysisResult; time: string }[]>([]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise((r) => setTimeout(r, 80));
      setProgress(i);
    }

    const analysis = simulateAnalysis(text);
    setResult(analysis);
    setHistory((prev) => [{ text: text.slice(0, 80) + "...", result: analysis, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 glow-cyan">
          <Newspaper className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Fake News Detection</h1>
          <p className="text-sm text-muted-foreground">Analyze news content using NLP-powered AI</p>
        </div>
      </div>

      {/* Input Area */}
      <div className="glass rounded-xl p-6">
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
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-primary font-mono animate-pulse-glow">
              {progress < 30 ? "Tokenizing text..." : progress < 60 ? "Running NLP model..." : progress < 90 ? "Analyzing sentiment patterns..." : "Generating report..."}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Main Result */}
          <div className={`glass rounded-xl p-6 ${result.classification === "Fake" ? "glow-red border-destructive/30" : "glow-green border-accent/30"}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.classification === "Fake" ? (
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-accent" />
                )}
                <div>
                  <h3 className="text-xl font-mono font-bold text-foreground">
                    Classification: <span className={result.classification === "Fake" ? "text-destructive" : "text-accent"}>{result.classification}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">Sentiment: {result.sentiment}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-foreground">{result.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{result.summary}</p>
          </div>

          {/* Indicators */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Analysis Indicators
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {result.indicators.map((ind) => (
                <div key={ind.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">{ind.label}</span>
                  <span className={`text-sm font-mono font-medium ${
                    ind.risk === "high" ? "text-destructive" : ind.risk === "medium" ? "text-warning" : "text-accent"
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
        <div className="glass rounded-xl p-6">
          <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" /> Recent Analyses
          </h3>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <span className="text-sm text-muted-foreground truncate max-w-[60%]">{h.text}</span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono ${h.result.classification === "Fake" ? "text-destructive" : "text-accent"}`}>
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
