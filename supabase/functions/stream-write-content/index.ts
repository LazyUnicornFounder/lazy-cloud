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

function parseJSON(text: string): any {
  // Strip code fences if present
  const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned);
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { session_id } = await req.json();
    if (!session_id) throw new Error("Missing session_id");

    const { data: settings } = await supabase.from("stream_settings").select("*").limit(1).maybeSingle();
    if (!settings) throw new Error("No stream settings found");

    const { data: session } = await supabase.from("stream_sessions").select("*").eq("id", session_id).single();
    if (!session) throw new Error("Session not found");

    const { data: transcript } = await supabase.from("stream_transcripts").select("*").eq("session_id", session_id).single();
    if (!transcript) throw new Error("Transcript not found");

    const { data: clips } = await supabase.from("stream_clips").select("title").eq("session_id", session_id);
    const clipTitles = (clips || []).map((c: any) => c.title);

    const businessName = settings.business_name || "the streamer";
    const niche = settings.content_niche || "content";
    const username = settings.twitch_username || "";
    const templateGuidance = settings.recap_template_guidance || "";

    // 1. Stream recap
    const recapPrompt = `You are a content writer for ${businessName} who streams ${niche} on Twitch. Write an engaging stream recap blog post for this stream.
Stream title: ${session.title}. Game or category: ${session.game_name || "Various"}.
Stream summary: ${transcript.transcript_text}
${templateGuidance ? `Follow this writing guidance: ${templateGuidance}` : ""}
Write 600 to 900 words in an enthusiastic conversational tone. Include a section on what happened, highlight moments, and what to expect next stream. End with a call to action to follow on Twitch.
Return only a valid JSON object with three fields: title (string), slug (lowercase hyphenated string), body (clean markdown). No preamble. No code fences.`;

    const recapRaw = await callAI(recapPrompt);
    const recap = parseJSON(recapRaw);

    // 2. SEO article
    const seoPrompt = `You are an SEO content writer for ${businessName}. Write an SEO-optimised article based on this Twitch stream.
Game or topic: ${session.game_name || session.title}. Stream content summary: ${transcript.transcript_text}
Target a keyword that someone would search on Google related to this game or topic. Write 800 to 1200 words. Structure it as genuinely useful content — tips, analysis, or commentary — not just a stream summary.
End with this paragraph: ${businessName} streams ${niche} live on Twitch. Follow at twitch.tv/${username} and discover more autonomous content tools at [LazyUnicorn.ai](https://lazyunicorn.ai).
Return only a valid JSON object with four fields: title, slug, target_keyword, body. No preamble. No code fences.`;

    const seoRaw = await callAI(seoPrompt);
    const seo = parseJSON(seoRaw);

    // 3. Highlights
    const highlightsPrompt = `You are writing a highlights post for ${businessName}. Based on these clip titles from today's stream write a short punchy highlights post — 200 to 300 words — covering the best moments.
Clip titles: ${clipTitles.length > 0 ? clipTitles.join(", ") : "No clips available — write based on the stream title: " + session.title}
Return only a valid JSON object with three fields: title, slug, body. No preamble. No code fences.`;

    const highlightsRaw = await callAI(highlightsPrompt);
    const highlights = parseJSON(highlightsRaw);

    // Insert all three
    const timestamp = Date.now();
    const contents = [
      { session_id, content_type: "recap", title: recap.title, slug: `${recap.slug}-${timestamp}`, body: recap.body },
      { session_id, content_type: "seo-article", title: seo.title, slug: `${seo.slug}-${timestamp}`, body: seo.body, target_keyword: seo.target_keyword },
      { session_id, content_type: "highlights", title: highlights.title, slug: `${highlights.slug}-${timestamp}`, body: highlights.body },
    ];

    const { error } = await supabase.from("stream_content").insert(contents);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, content_count: 3 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stream-write-content error:", e);
    await supabase.from("stream_errors").insert({
      function_name: "stream-write-content",
      error_message: e instanceof Error ? e.message : String(e),
    });
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
