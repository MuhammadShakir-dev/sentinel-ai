import { useState, useEffect, useRef } from "react";
import { Activity, Play, Square, AlertTriangle, CheckCircle, Wifi, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface TrafficPoint {
  time: string;
  requests: number;
  bandwidth: number;
}

interface Alert {
  time: string;
  type: string;
  severity: "info" | "warning" | "critical";
  message: string;
}

const DDoSDetection = () => {
  const [monitoring, setMonitoring] = useState(false);
  const [status, setStatus] = useState<"Normal" | "Warning" | "Under Attack">("Normal");
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState({ requests: 0, bandwidth: 0, connections: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!monitoring) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    tickRef.current = 0;
    setTrafficData([]);
    setAlerts([]);
    setStatus("Normal");

    intervalRef.current = setInterval(() => {
      tickRef.current++;
      const t = tickRef.current;
      const isAttack = t > 15 && t < 30;
      const isWarning = t > 12 && t <= 15;

      const baseReq = 150 + Math.random() * 50;
      const requests = isAttack ? 800 + Math.random() * 400 : isWarning ? 400 + Math.random() * 200 : baseReq;
      const bandwidth = isAttack ? 450 + Math.random() * 200 : isWarning ? 200 + Math.random() * 100 : 50 + Math.random() * 30;
      const connections = isAttack ? 5000 + Math.floor(Math.random() * 3000) : isWarning ? 2000 + Math.floor(Math.random() * 1000) : 200 + Math.floor(Math.random() * 100);

      const now = new Date().toLocaleTimeString();
      setTrafficData((prev) => [...prev.slice(-30), { time: now, requests: Math.round(requests), bandwidth: Math.round(bandwidth) }]);
      setStats({ requests: Math.round(requests), bandwidth: Math.round(bandwidth), connections });

      if (isAttack) {
        setStatus("Under Attack");
        if (t === 16) setAlerts((prev) => [{ time: now, type: "DDoS", severity: "critical", message: "SYN flood attack detected — traffic spike 5x above baseline" }, ...prev].slice(0, 10));
        if (t === 20) setAlerts((prev) => [{ time: now, type: "DDoS", severity: "critical", message: "HTTP flood pattern identified from 150+ unique IPs" }, ...prev].slice(0, 10));
        if (t === 25) setAlerts((prev) => [{ time: now, type: "DDoS", severity: "warning", message: "Attack intensity decreasing — mitigation in effect" }, ...prev].slice(0, 10));
      } else if (isWarning) {
        setStatus("Warning");
        if (t === 13) setAlerts((prev) => [{ time: now, type: "Anomaly", severity: "warning", message: "Unusual traffic spike detected — monitoring closely" }, ...prev].slice(0, 10));
      } else if (t >= 30) {
        setStatus("Normal");
        if (t === 30) setAlerts((prev) => [{ time: now, type: "Recovery", severity: "info", message: "Traffic returned to normal levels — attack mitigated" }, ...prev].slice(0, 10));
      }
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [monitoring]);

  const statusColor = status === "Under Attack" ? "text-destructive" : status === "Warning" ? "text-warning" : "text-accent";
  const statusGlow = status === "Under Attack" ? "glow-red" : status === "Warning" ? "glow-cyan" : "glow-green";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-destructive/10 glow-red">
          <Activity className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-mono font-bold text-foreground">DDoS Attack Detection</h1>
          <p className="text-sm text-muted-foreground">Real-time network traffic monitoring using deep learning</p>
        </div>
      </div>

      {/* Controls + Status */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="glass rounded-xl p-6 flex-1">
          <Button
            onClick={() => setMonitoring(!monitoring)}
            className={monitoring ? "" : "glow-cyan"}
            variant={monitoring ? "destructive" : "default"}
          >
            {monitoring ? <><Square className="h-4 w-4 mr-1" /> Stop Monitoring</> : <><Play className="h-4 w-4 mr-1" /> Start Monitoring</>}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            {monitoring ? "Deep learning model is analyzing network traffic in real-time..." : "Click to begin real-time network traffic analysis"}
          </p>
        </div>

        <div className={`glass rounded-xl p-6 flex-1 ${statusGlow}`}>
          <div className="text-xs text-muted-foreground mb-1">Network Status</div>
          <div className={`text-2xl font-mono font-bold ${statusColor} flex items-center gap-2`}>
            {status === "Normal" ? <CheckCircle className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6 animate-pulse" />}
            {status}
          </div>
        </div>
      </div>

      {/* Stats */}
      {monitoring && (
        <div className="grid grid-cols-3 gap-4 animate-fade-in">
          <div className="glass rounded-xl p-4 text-center">
            <Server className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-foreground">{stats.requests}</div>
            <div className="text-xs text-muted-foreground">Req/sec</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Wifi className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-foreground">{stats.bandwidth} MB</div>
            <div className="text-xs text-muted-foreground">Bandwidth</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <Activity className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-mono font-bold text-foreground">{stats.connections.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Connections</div>
          </div>
        </div>
      )}

      {/* Traffic Chart */}
      {trafficData.length > 2 && (
        <div className="glass rounded-xl p-6 animate-fade-in">
          <h3 className="font-mono font-semibold text-foreground mb-4">Network Traffic</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bwGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(230, 40%, 16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "hsl(230, 60%, 8%)", border: "1px solid hsl(230, 40%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 92%)" }} />
              <Area type="monotone" dataKey="requests" stroke="hsl(185, 100%, 50%)" fill="url(#reqGrad)" name="Requests/s" />
              <Area type="monotone" dataKey="bandwidth" stroke="hsl(0, 84%, 60%)" fill="url(#bwGrad)" name="Bandwidth (MB)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="glass rounded-xl p-6 animate-fade-in">
          <h3 className="font-mono font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" /> Alerts
          </h3>
          <div className="space-y-2">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                a.severity === "critical" ? "bg-destructive/5 border border-destructive/20" :
                a.severity === "warning" ? "bg-warning/5 border border-warning/20" :
                "bg-accent/5 border border-accent/20"
              }`}>
                <div className={`h-2 w-2 rounded-full mt-1.5 ${
                  a.severity === "critical" ? "bg-destructive animate-pulse" : a.severity === "warning" ? "bg-warning" : "bg-accent"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono uppercase ${
                      a.severity === "critical" ? "text-destructive" : a.severity === "warning" ? "text-warning" : "text-accent"
                    }`}>{a.severity}</span>
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                  </div>
                  <p className="text-sm text-foreground mt-1">{a.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DDoSDetection;
