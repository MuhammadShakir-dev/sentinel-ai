import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { traffic } = await req.json();
    if (!traffic || typeof traffic !== "string" || traffic.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Provide a traffic log or sample to analyze." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional cybersecurity AI specializing in DDoS detection and network traffic analysis. The user will provide network traffic samples or summaries (could include req/sec, unique IPs, connection counts, packet types, time windows).

Analyze for DDoS indicators:
- Abnormal request rates compared to baseline
- SYN flood patterns (high half-open connections)
- HTTP flood (many requests from few IPs)
- UDP amplification, ICMP floods
- Botnet patterns (many unique IPs hitting same endpoint)
- Slowloris (many slow connections held open)
- Geographic anomalies

You MUST respond with ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "status": "Normal" or "Warning" or "Under Attack",
  "attack_type": "None" or "SYN Flood" or "HTTP Flood" or "UDP Amplification" or "Slowloris" or "Volumetric" or "Application Layer",
  "confidence": number between 60-99,
  "summary": "1-2 sentence assessment",
  "indicators": [
    { "label": "string", "value": "string", "severity": "info" or "warning" or "critical" }
  ],
  "recommendations": ["short actionable string", "..."]
}

Provide 3-5 indicators and 2-4 recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this traffic data:\n\n${traffic.slice(0, 4000)}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    let result;
    try {
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleaned);
    } catch {
      console.error("Parse fail:", content);
      throw new Error("Failed to parse AI analysis");
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("analyze-ddos error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
