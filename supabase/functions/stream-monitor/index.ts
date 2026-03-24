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
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Failed to get Twitch token: " + JSON.stringify(data));
  return data.access_token;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { data: settings } = await supabase.from("stream_settings").select("*").limit(1).maybeSingle();
    if (!settings || !settings.is_running || !settings.setup_complete) {
      return new Response(JSON.stringify({ skipped: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const token = await getTwitchToken(settings.twitch_client_id, settings.twitch_client_secret);

    // Check if live
    const streamsRes = await fetch(`https://api.twitch.tv/helix/streams?user_id=${settings.twitch_user_id}`, {
      headers: { "Client-ID": settings.twitch_client_id, Authorization: `Bearer ${token}` },
    });
    const streamsData = await streamsRes.json();
    const liveStream = streamsData.data?.[0];

    if (liveStream) {
      // Check if session already exists
      const { data: existing } = await supabase
        .from("stream_sessions")
        .select("id")
        .eq("twitch_stream_id", liveStream.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("stream_sessions").insert({
          twitch_stream_id: liveStream.id,
          title: liveStream.title,
          game_name: liveStream.game_name,
          started_at: liveStream.started_at,
          peak_viewers: liveStream.viewer_count,
          average_viewers: liveStream.viewer_count,
          status: "live",
        });
      } else {
        // Update peak viewers
        await supabase.from("stream_sessions")
          .update({ peak_viewers: liveStream.viewer_count })
          .eq("twitch_stream_id", liveStream.id);
      }
    } else {
      // No live stream — check for sessions still marked 'live'
      const { data: liveSessions } = await supabase
        .from("stream_sessions")
        .select("*")
        .eq("status", "live");

      if (liveSessions && liveSessions.length > 0) {
        for (const session of liveSessions) {
          const endedAt = new Date().toISOString();
          const startedAt = new Date(session.started_at).getTime();
          const durationMin = Math.round((Date.now() - startedAt) / 60000);

          await supabase.from("stream_sessions")
            .update({ status: "ended", ended_at: endedAt, duration_minutes: durationMin })
            .eq("id", session.id);

          // Trigger processing
          await supabase.functions.invoke("stream-process", {
            body: { session_id: session.id },
          });
        }
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stream-monitor error:", e);
    await supabase.from("stream_errors").insert({
      function_name: "stream-monitor",
      error_message: e instanceof Error ? e.message : String(e),
    });
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
