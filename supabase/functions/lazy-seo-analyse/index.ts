import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get settings
    const { data: settings, error: settingsErr } = await supabase
      .from("seo_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (settingsErr || !settings) {
      return new Response(JSON.stringify({ error: "No SEO settings found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an SEO keyword researcher. A site is described as: "${settings.business_description}".
Their target keywords are: ${settings.target_keywords}.
Their competitors are: ${settings.competitors}.

Analyse keyword gaps. Generate exactly 20 specific long-tail search queries this site should target to rank on Google. Focus on queries with high intent and low competition.

Return only a valid JSON array of strings. No preamble, no code fences. Example: ["keyword one", "keyword two"]`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert SEO analyst. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI error:", errText);
      await supabase.from("seo_errors").insert({ error_message: `AI analysis failed: ${aiRes.status}` });
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiRes.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    // Strip code fences if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let keywords: string[];
    try {
      keywords = JSON.parse(content);
    } catch {
      await supabase.from("seo_errors").insert({ error_message: `Failed to parse keyword JSON: ${content.slice(0, 200)}` });
      return new Response(JSON.stringify({ error: "Failed to parse keywords" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert keywords
    const rows = keywords.map((kw: string) => ({
      keyword: kw,
      current_position: null,
      previous_position: null,
      last_checked: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase.from("seo_keywords").insert(rows);
    if (insertErr) {
      console.error("Insert error:", insertErr);
      return new Response(JSON.stringify({ error: "Failed to insert keywords" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, count: keywords.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
