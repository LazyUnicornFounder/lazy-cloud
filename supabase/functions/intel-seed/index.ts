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

    // Get latest intel report
    const { data: report } = await supabase
      .from("intel_reports")
      .select("content, metrics")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!report) {
      return new Response(
        JSON.stringify({ ok: true, message: "No intel reports found. Run intel-weekly first." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to generate seed topics for content engines
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
            content: "Based on the intelligence report, generate 5 SEO keywords and 5 GEO queries that should be targeted. Return JSON: { seo_keywords: string[], geo_queries: string[] }",
          },
          { role: "user", content: report.content },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const seeds = aiData.choices?.[0]?.message?.content ?? "{}";

    let parsed: { seo_keywords?: string[]; geo_queries?: string[] } = {};
    try {
      const cleaned = seeds.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch { /* parse failed */ }

    // Seed SEO keywords
    if (parsed.seo_keywords?.length) {
      for (const kw of parsed.seo_keywords) {
        try {
          await supabase.from("seo_keywords").upsert(
            { keyword: kw, product: "intel-seeded" },
            { onConflict: "keyword" }
          );
        } catch { /* skip */ }
      }
    }

    // Seed GEO queries
    if (parsed.geo_queries?.length) {
      for (const q of parsed.geo_queries) {
        try {
          await supabase.from("geo_queries").upsert(
            { query: q, query_type: "intel-seeded", has_content: false },
            { onConflict: "query" }
          );
        } catch { /* skip */ }
      }
    }

    return new Response(
      JSON.stringify({ ok: true, seeded: parsed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
