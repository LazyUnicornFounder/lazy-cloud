import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callAI(prompt: string): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { data: settings } = await supabase.from("stream_settings").select("*").limit(1).maybeSingle();
    if (!settings || !settings.is_running) {
      return new Response(JSON.stringify({ skipped: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get top and bottom performing recaps
    const { data: topRecaps } = await supabase
      .from("stream_content")
      .select("title, body, views")
      .eq("content_type", "recap")
      .order("views", { ascending: false })
      .limit(3);

    const { data: bottomRecaps } = await supabase
      .from("stream_content")
      .select("title, body, views")
      .eq("content_type", "recap")
      .order("views", { ascending: true })
      .limit(3);

    if (!topRecaps?.length || !bottomRecaps?.length) {
      return new Response(JSON.stringify({ skipped: true, reason: "Not enough data" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const topSummary = topRecaps.map(r => `"${r.title}" (${r.views} views): ${(r.body || "").substring(0, 200)}`).join("\n");
    const bottomSummary = bottomRecaps.map(r => `"${r.title}" (${r.views} views): ${(r.body || "").substring(0, 200)}`).join("\n");

    const prompt = `You are a content strategist for ${settings.business_name || "a Twitch streamer"} who streams ${settings.content_niche || "content"}.
These stream recap posts perform well in terms of traffic:
${topSummary}

These perform poorly:
${bottomSummary}

Identify what makes the high-performing recaps better. Write an improved content template instruction for future stream recaps that captures the qualities of the top performers. Return only the template instruction text — a paragraph of guidance for writing better stream recaps. No preamble.`;

    const newTemplate = await callAI(prompt);
    const oldTemplate = settings.recap_template_guidance || "";

    // Log the optimisation
    await supabase.from("stream_optimisation_log").insert({
      content_type: "recap",
      old_template: oldTemplate,
      new_template: newTemplate,
      trigger_reason: "Weekly automated optimisation",
    });

    // Update settings with new guidance
    await supabase.from("stream_settings").update({ recap_template_guidance: newTemplate }).eq("id", settings.id);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stream-optimise error:", e);
    await supabase.from("stream_errors").insert({
      function_name: "stream-optimise",
      error_message: e instanceof Error ? e.message : String(e),
    });
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
