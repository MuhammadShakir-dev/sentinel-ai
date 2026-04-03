import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string" || url.trim().length < 4) {
      return new Response(JSON.stringify({ error: "Please provide a valid URL to scan." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert phishing website detection AI. Analyze the provided URL and determine the likelihood it is a phishing/malicious website.

You MUST respond with ONLY a valid JSON object (no markdown, no code fences) with this exact structure:
{
  "risk": "Safe" or "Suspicious" or "Dangerous",
  "score": number between 0-100 (100 = completely safe, 0 = definitely phishing),
  "summary": "A 1-2 sentence summary of the analysis",
  "checks": [
    {"name": "SSL Certificate", "status": "pass" or "fail" or "warn", "detail": "explanation"},
    {"name": "Domain Age", "status": "pass" or "fail" or "warn", "detail": "explanation"},
    {"name": "URL Pattern Analysis", "status": "pass" or "fail" or "warn", "detail": "explanation"},
    {"name": "Redirect Chain", "status": "pass" or "fail" or "warn", "detail": "explanation"},
    {"name": "Content Analysis", "status": "pass" or "fail" or "warn", "detail": "explanation"},
    {"name": "Blacklist Check", "status": "pass" or "fail" or "warn", "detail": "explanation"}
  ]
}

Analyze based on: URL structure, domain reputation, use of IP addresses, suspicious subdomains, typosquatting, URL length, use of HTTPS, known phishing patterns, suspicious TLDs, URL encoding tricks, and brand impersonation attempts.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this URL for phishing threats:\n\n${url}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings > Workspace > Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-phishing error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
