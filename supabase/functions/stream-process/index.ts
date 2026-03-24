import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getTwitchToken(clientId: string, clientSecret: string): Promise<string> {
  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get Twitch token");
  return data.access_token;
}

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
    const { session_id } = await req.json();
    if (!session_id) throw new Error("Missing session_id");

    const { data: settings } = await supabase.from("stream_settings").select("*").limit(1).maybeSingle();
    if (!settings) throw new Error("No stream settings found");

    const { data: session } = await supabase.from("stream_sessions").select("*").eq("id", session_id).single();
    if (!session) throw new Error("Session not found");

    const token = await getTwitchToken(settings.twitch_client_id, settings.twitch_client_secret);
    const headers = { "Client-ID": settings.twitch_client_id, Authorization: `Bearer ${token}` };

    // Fetch clips
    let clipTitles: string[] = [];
    try {
      const startedAt = new Date(session.started_at).toISOString();
      const clipsRes = await fetch(
        `https://api.twitch.tv/helix/clips?broadcaster_id=${settings.twitch_user_id}&started_at=${startedAt}&first=5`,
        { headers }
      );
      const clipsData = await clipsRes.json();
      const clips = clipsData.data || [];

      for (const clip of clips.slice(0, 5)) {
        await supabase.from("stream_clips").upsert({
          session_id,
          twitch_clip_id: clip.id,
          title: clip.title,
          clip_url: clip.url,
          thumbnail_url: clip.thumbnail_url,
          view_count: clip.view_count,
          duration_seconds: clip.duration,
        }, { onConflict: "twitch_clip_id" });
        clipTitles.push(clip.title);
      }
    } catch (e) {
      console.error("Clips fetch error:", e);
    }

    // Generate transcript summary
    const transcriptPrompt = `You are transcribing a Twitch stream. The stream was titled "${session.title}" and covered ${session.game_name || "various topics"}. ${clipTitles.length > 0 ? `The top clips were titled: ${clipTitles.join(", ")}.` : ""} Generate a detailed summary of what likely happened during this stream based on these signals. Write it as if you are summarising a transcript — covering the main topics, memorable moments, and key discussions. Write 500 to 800 words. Return only the summary text with no preamble.`;

    const transcriptText = await callAI(transcriptPrompt);
    const wordCount = transcriptText.split(/\s+/).length;

    await supabase.from("stream_transcripts").upsert({
      session_id,
      transcript_text: transcriptText,
      word_count: wordCount,
    }, { onConflict: "session_id" });

    // Trigger content writing
    await supabase.functions.invoke("stream-write-content", {
      body: { session_id },
    });

    // Update session status
    await supabase.from("stream_sessions").update({ status: "processed" }).eq("id", session_id);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stream-process error:", e);
    await supabase.from("stream_errors").insert({
      function_name: "stream-process",
      error_message: e instanceof Error ? e.message : String(e),
    });
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
