import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Gather recent errors across agents
    const errorTables = ["blog_errors", "seo_errors", "geo_errors", "voice_errors", "stream_errors"];
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const allErrors: { source: string; message: string }[] = [];

    for (const table of errorTables) {
      try {
        const { data } = await supabase
          .from(table)
          .select("error_message")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10);
        if (data) {
          allErrors.push(...data.map((e: any) => ({ source: table, message: e.error_message })));
        }
      } catch { /* skip */ }
    }

    if (allErrors.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "No recent errors to analyse" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to analyse error patterns and suggest fixes
    const errorSummary = allErrors.slice(0, 20).map(e => `[${e.source}] ${e.message}`).join("\n");

    const aiRes = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a DevOps analyst. Analyse error logs and suggest concrete fixes. Return JSON: { improvements: [{ agent: string, problem: string, suggestion: string }] }",
          },
          { role: "user", content: `Recent agent errors:\n${errorSummary}` },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const analysis = aiData.choices?.[0]?.message?.content ?? "No analysis available";

    // Store improvement suggestions
    try {
      await supabase.from("fix_improvements").insert({
        analysis,
        error_count: allErrors.length,
        status: "pending",
      });
    } catch { /* table may not exist */ }

    return new Response(
      JSON.stringify({ ok: true, errors_analysed: allErrors.length, analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
