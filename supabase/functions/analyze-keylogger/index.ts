import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { processes } = await req.json();
    if (!processes || typeof processes !== "string" || processes.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Provide a process list (one per line) to analyze." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a professional cybersecurity AI specializing in keylogger and malware detection. The user will provide a list of running processes from a system (one per line, format: "process_name [pid] cpu% memMB" or just process names with optional descriptions).

Analyze each process for indicators of keylogger behavior:
- Keyboard hook APIs (SetWindowsHookEx, low-level keyboard hooks)
- Known keylogger names or DLLs
- Suspicious DLL injection patterns (e.g., into explorer.exe)
- Hidden processes pretending to be system services
- Unusual input monitoring or clipboard access
- Network exfiltration from input-monitoring processes

You MUST respond with ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "summary": "1-2 sentence overall assessment",
  "threat_level": "Safe" or "Suspicious" or "Critical",
  "confidence": number between 60-99,
  "processes": [
    {
      "name": "process name",
      "pid": "PID if given else 'N/A'",
      "risk": "Safe" or "Suspicious" or "Malicious",
      "reason": "Short explanation why"
    }
  ]
}

Include ALL provided processes in the output, classified individually.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze these processes:\n\n${processes.slice(0, 4000)}` },
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
    console.error("analyze-keylogger error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
