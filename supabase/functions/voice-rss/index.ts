import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822(dateStr: string): string {
  return new Date(dateStr).toUTCString();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: settingsRows } = await supabase.from("voice_settings").select("*").limit(1);
  const settings = settingsRows?.[0];

  const podcastTitle = settings?.podcast_title || "Lazy Voice Podcast";
  const podcastDesc = settings?.podcast_description || "AI-narrated blog posts.";
  const podcastAuthor = settings?.podcast_author || "Lazy Voice";
  const siteUrl = settings?.site_url || "https://lazyunicorn.ai";

  const { data: episodes } = await supabase
    .from("voice_episodes")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const items = (episodes || []).map((ep) => `
    <item>
      <title>${escapeXml(ep.post_title)}</title>
      <description>${escapeXml(ep.post_title)}</description>
      <enclosure url="${escapeXml(ep.audio_url)}" type="audio/mpeg" ${ep.file_size_bytes ? `length="${ep.file_size_bytes}"` : ""} />
      <pubDate>${ep.published_at ? toRfc2822(ep.published_at) : ""}</pubDate>
      <guid isPermaLink="false">${escapeXml(ep.audio_url)}</guid>
      <itunes:duration>${ep.duration_seconds || 0}</itunes:duration>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(podcastTitle)}</title>
    <description>${escapeXml(podcastDesc)}</description>
    <link>${escapeXml(siteUrl)}</link>
    <language>en-us</language>
    <itunes:author>${escapeXml(podcastAuthor)}</itunes:author>
    <itunes:category text="Technology" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
});
