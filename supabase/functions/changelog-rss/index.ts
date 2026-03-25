import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: releases } = await supabase
    .from("prompt_releases")
    .select("*")
    .eq("published", true)
    .order("release_date", { ascending: false })
    .limit(50);

  const items = (releases || []).map((r: any) => {
    const slug = r.engine_name.toLowerCase().replace(/\s+/g, "-");
    const pubDate = new Date(r.release_date + "T12:00:00Z").toUTCString();
    return `    <item>
      <title>${escapeXml(r.engine_name)} ${escapeXml(r.version)} — ${escapeXml(r.summary)}</title>
      <description>${escapeXml(r.changes || r.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="false">${r.id}</guid>
      <link>https://lazyunicorn.ai/changelog#${slug}-${r.version}</link>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LazyUnicorn Prompt Changelog</title>
    <description>The latest prompt versions for every Lazy engine.</description>
    <link>https://lazyunicorn.ai/changelog</link>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { ...corsHeaders, "Content-Type": "application/rss+xml; charset=utf-8" },
  });
});
