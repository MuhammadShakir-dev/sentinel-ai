import { useState, useEffect, useRef } from "react";
import { Keyboard, Play, Square, AlertTriangle, CheckCircle, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Process {
  pid: number;
  name: string;
  behavior: string;
  risk: "Safe" | "Suspicious" | "Malicious";
  cpu: string;
  memory: string;
}

const mockProcesses: Process[] = [
  { pid: 1024, name: "chrome.exe", behavior: "Normal browsing activity", risk: "Safe", cpu: "2.3%", memory: "450MB" },
  { pid: 2048, name: "svchost.exe", behavior: "System service", risk: "Safe", cpu: "0.1%", memory: "32MB" },
  { pid: 3072, name: "keyhelper.dll", behavior: "Keystroke interception detected", risk: "Malicious", cpu: "4.8%", memory: "12MB" },
  { pid: 4096, name: "explorer.exe", behavior: "Normal shell process", risk: "Safe", cpu: "1.2%", memory: "120MB" },
  { pid: 5120, name: "inputmon.exe", behavior: "Monitoring keyboard input API", risk: "Suspicious", cpu: "3.1%", memory: "28MB" },
  { pid: 6144, name: "notepad.exe", behavior: "Normal text editing", risk: "Safe", cpu: "0.3%", memory: "15MB" },
  { pid: 7168, name: "klogd_service.exe", behavior: "Hidden keystroke logger active", risk: "Malicious", cpu: "5.2%", memory: "8MB" },
  { pid: 8192, name: "update_helper.exe", behavior: "Unusual network activity", risk: "Suspicious", cpu: "2.7%", memory: "45MB" },
];

const KeyloggerDetection = () => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [monitoring, setMonitoring] = useState(false);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const startScan = async () => {
    setScanning(true);
    setScanComplete(false);
    setProcesses([]);
    setProgress(0);

    for (let i = 0; i <= 100; i += 2) {
      await new Promise((r) => setTimeout(r, 60));
      setProgress(i);
      if (i % 20 === 0 && i > 0) {
        const idx = Math.floor((i / 100) * mockProcesses.length);
        setProcesses((prev) => [...prev, ...mockProcesses.slice(prev.length, idx + 1)]);
      }
    }
    setProcesses(mockProcesses);
    setScanning(false);
    setScanComplete(true);
  };

  useEffect(() => {
    if (!monitoring) return;
    const logs = [
      "[INFO] Monitoring keyboard hooks...",
      "[OK] No suspicious API calls detected",
      "[WARN] Process klogd_service.exe accessing keyboard buffer",
      "[INFO] Checking clipboard access patterns...",
      "[OK] System drivers verified",
      "[WARN] inputmon.exe registered low-level keyboard hook",
      "[INFO] Scanning registry for persistence mechanisms...",
      "[ALERT] keyhelper.dll injected into explorer.exe address space",
      "[INFO] Network traffic from suspicious processes: 2.4KB/s",
      "[OK] No data exfiltration detected in last 30s",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setActivityLog((prev) => [...prev, `${new Date().toLocaleTimeString()} ${logs[i % logs.length]}`].slice(-20));
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [monitoring]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [activityLog]);

  const malicious = processes.filter((p) => p.risk === "Malicious").length;
  const suspicious = processes.filter((p) => p.risk === "Suspicious").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyber-purple/10">
          <Keyboard className="h-6 w-6 text-cyber-purple" />
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">Keylogger Detection</h1>
          <p className="text-sm text-muted-foreground">Detect hidden keyloggers and malicious background processes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button onClick={startScan} disabled={scanning} className="glow-cyan">
          {scanning ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Scanning System...
            </span>
          ) : (
            <><Shield className="h-4 w-4 mr-1" /> {scanComplete ? "Re-scan System" : "Start System Scan"}</>
          )}
        </Button>
        <Button
          variant={monitoring ? "destructive" : "outline"}
          onClick={() => { setMonitoring(!monitoring); if (!monitoring) setActivityLog([]); }}
          className={!monitoring ? "border-primary/30 hover:bg-primary/10" : ""}
        >
          {monitoring ? <><Square className="h-4 w-4 mr-1" /> Stop Monitoring</> : <><Play className="h-4 w-4 mr-1" /> Start Live Monitoring</>}
        </Button>
      </div>

      {/* Scan Progress */}
      {scanning && (
        <div className="glass rounded-xl p-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Scanning system processes...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-primary font-mono animate-pulse-glow">
            {progress < 30 ? "Enumerating running processes..." : progress < 60 ? "Analyzing API hooks and keyboard interceptors..." : progress < 90 ? "Checking for hidden processes..." : "Generating threat report..."}
          </p>
        </div>
      )}

      {/* Scan Results */}
      {scanComplete && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="grid grid-cols-3 gap-4">
            <div className="glass rounded-xl p-4 text-center">
              <CheckCircle className="h-5 w-5 text-accent mx-auto mb-1" />
              <div className="text-2xl font-mono font-bold text-foreground">{processes.length - malicious - suspicious}</div>
              <div className="text-xs text-muted-foreground">Safe</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <AlertTriangle className="h-5 w-5 text-warning mx-auto mb-1" />
              <div className="text-2xl font-mono font-bold text-warning">{suspicious}</div>
              <div className="text-xs text-muted-foreground">Suspicious</div>
            </div>
            <div className="glass rounded-xl p-4 text-center glow-red">
              <AlertTriangle className="h-5 w-5 text-destructive mx-auto mb-1" />
              <div className="text-2xl font-mono font-bold text-destructive">{malicious}</div>
              <div className="text-xs text-muted-foreground">Malicious</div>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h3 className="font-mono font-semibold text-foreground mb-4">Detected Processes</h3>
            <div className="space-y-2">
              {processes.map((p) => (
                <div key={p.pid} className={`flex items-center gap-4 p-3 rounded-lg ${
                  p.risk === "Malicious" ? "bg-destructive/5 border border-destructive/20" :
                  p.risk === "Suspicious" ? "bg-warning/5 border border-warning/20" :
                  "bg-muted/20"
                }`}>
                  <div className={`h-2 w-2 rounded-full ${
                    p.risk === "Malicious" ? "bg-destructive animate-pulse" : p.risk === "Suspicious" ? "bg-warning" : "bg-accent"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground">PID: {p.pid}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{p.behavior}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground hidden sm:block">
                    <div>CPU: {p.cpu}</div>
                    <div>RAM: {p.memory}</div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                    p.risk === "Malicious" ? "bg-destructive/10 text-destructive" :
                    p.risk === "Suspicious" ? "bg-warning/10 text-warning" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {p.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Monitoring Log */}
      {monitoring && (
        <div className="glass rounded-xl p-6 animate-fade-in">
          <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary animate-pulse" /> Live Activity Monitor
          </h3>
          <div ref={logRef} className="bg-background/80 rounded-lg p-4 h-60 overflow-y-auto font-mono text-xs space-y-1">
            {activityLog.length === 0 ? (
              <p className="text-muted-foreground">Initializing monitor...</p>
            ) : (
              activityLog.map((log, i) => (
                <div key={i} className={
                  log.includes("[ALERT]") ? "text-destructive" :
                  log.includes("[WARN]") ? "text-warning" :
                  log.includes("[OK]") ? "text-accent" :
                  "text-muted-foreground"
                }>
                  {log}
                </div>
              ))
            )}
            {monitoring && <div className="text-primary animate-pulse-glow">▌</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyloggerDetection;
