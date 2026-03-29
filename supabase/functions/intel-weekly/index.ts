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

    // Gather weekly stats across agents
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const metrics: Record<string, number> = {};
    const tables = [
      { name: "blog_posts", label: "Blog posts" },
      { name: "seo_posts", label: "SEO posts" },
      { name: "geo_posts", label: "GEO posts" },
      { name: "voice_episodes", label: "Voice episodes" },
      { name: "stream_content", label: "Stream content" },
    ];

    for (const t of tables) {
      try {
        const { count } = await supabase
          .from(t.name)
          .select("*", { count: "exact", head: true })
          .gte("created_at", since);
        metrics[t.label] = count ?? 0;
      } catch { /* skip */ }
    }

    const metricsSummary = Object.entries(metrics).map(([k, v]) => `${k}: ${v}`).join(", ");

    // Generate intel report using AI
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
            content: "You are a competitive intelligence analyst for an AI-powered content platform called LazyUnicorn. Write a concise weekly intelligence report with insights and recommendations based on the production metrics provided.",
          },
          { role: "user", content: `Weekly production metrics: ${metricsSummary}` },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const report = aiData.choices?.[0]?.message?.content ?? "No report generated";

    // Store the report
    try {
      await supabase.from("intel_reports").insert({
        report_type: "weekly",
        content: report,
        metrics: metrics,
        status: "published",
      });
    } catch { /* table may not exist */ }

    return new Response(
      JSON.stringify({ ok: true, metrics, report }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
