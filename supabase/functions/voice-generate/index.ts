import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get voice settings
    const { data: settingsRows } = await supabase.from("voice_settings").select("*").limit(1);
    const settings = settingsRows?.[0];
    if (!settings || !settings.is_running || !settings.setup_complete) {
      return new Response(JSON.stringify({ message: "Lazy Voice is not active." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { elevenlabs_api_key, voice_id } = settings;

    // Find recent published blog posts (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id, slug, title, content, published_at")
      .eq("status", "published")
      .gte("published_at", twoHoursAgo);

    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ message: "No new posts to narrate." }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let generated = 0;

    for (const post of posts) {
      // Check if episode already exists
      const { data: existing } = await supabase
        .from("voice_episodes")
        .select("id")
        .eq("post_slug", post.slug)
        .limit(1);

      if (existing && existing.length > 0) continue;

      try {
        // Strip markdown from content
        const bodyText = Array.isArray(post.content)
          ? post.content.join("\n")
          : String(post.content);
        const plainText = bodyText
          .replace(/#{1,6}\s+/g, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/[*_~`]/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        const fullText = `${post.title}\n\n${plainText}`;

        // Call ElevenLabs TTS API
        const ttsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
          {
            method: "POST",
            headers: {
              "xi-api-key": elevenlabs_api_key,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: fullText.slice(0, 5000),
              model_id: "eleven_monolingual_v1",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
              },
            }),
          }
        );

        if (!ttsResponse.ok) {
          const errText = await ttsResponse.text();
          throw new Error(`ElevenLabs API error: ${ttsResponse.status} - ${errText}`);
        }

        const audioBuffer = await ttsResponse.arrayBuffer();
        const audioBytes = new Uint8Array(audioBuffer);

        // Upload to storage
        const fileName = `${post.slug}.mp3`;
        const { error: uploadError } = await supabase.storage
          .from("voice-audio")
          .upload(fileName, audioBytes, {
            contentType: "audio/mpeg",
            upsert: true,
          });

        if (uploadError) throw new Error(`Storage upload error: ${uploadError.message}`);

        // Get public URL
        const { data: urlData } = supabase.storage.from("voice-audio").getPublicUrl(fileName);
        const audioUrl = urlData.publicUrl;

        // Estimate duration (~150 words per minute, ~5 chars per word)
        const wordCount = fullText.split(/\s+/).length;
        const estimatedDuration = Math.round((wordCount / 150) * 60);

        // Insert episode
        await supabase.from("voice_episodes").insert([{
          post_id: post.id,
          post_slug: post.slug,
          post_title: post.title,
          audio_url: audioUrl,
          duration_seconds: estimatedDuration,
          file_size_bytes: audioBytes.length,
          status: "published",
          published_at: new Date().toISOString(),
        }]);

        generated++;
      } catch (postError: any) {
        await supabase.from("voice_errors").insert([{
          error_message: postError.message || "Unknown error",
          post_slug: post.slug,
        }]);
      }
    }

    return new Response(
      JSON.stringify({ message: `Generated ${generated} episode(s).` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    await supabase.from("voice_errors").insert([{
      error_message: error.message || "Unknown error",
    }]);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
