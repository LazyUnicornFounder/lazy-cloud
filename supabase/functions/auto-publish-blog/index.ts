import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function triggerEngine(engineName: string): Promise<void> {
  const baseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const url = `${baseUrl}/functions/v1/${engineName}`;

  console.log(`Triggering ${engineName} to generate a draft...`);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${anonKey}`,
    },
    body: JSON.stringify({}),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`${engineName} returned ${res.status}: ${text}`);
  } else {
    const data = await res.json();
    console.log(`${engineName} response:`, JSON.stringify(data).slice(0, 200));
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // Check blog_settings
    const { data: settings } = await supabase
      .from("blog_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (settings && !settings.is_publishing) {
      return new Response(JSON.stringify({ message: "Lazy Blogger is paused" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check daily limit
    if (settings?.posts_per_day) {
      const todayStart = new Date();
      todayStart.setUTCHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "published")
        .gte("published_at", todayStart.toISOString());

      if ((count ?? 0) >= settings.posts_per_day) {
        console.log(`Daily limit reached: ${count}/${settings.posts_per_day}`);
        return new Response(JSON.stringify({ message: `Daily limit reached (${count}/${settings.posts_per_day})` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Publish the oldest draft
    const { data: nextDraft } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    let published = null;

    if (nextDraft) {
      const { error: updateErr } = await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", nextDraft.id);
      if (updateErr) throw updateErr;

      console.log(`Published: ${nextDraft.title}`);
      published = nextDraft;
    }

    // Determine which engine to trigger next (alternate SEO/GEO)
    // Count recent drafts by slug prefix to decide
    const { count: seoCount } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .like("slug", "seo-%");

    const { count: geoCount } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .like("slug", "geo-%");

    // Trigger the engine that has fewer posts (alternating effect)
    const nextEngine = (seoCount ?? 0) <= (geoCount ?? 0)
      ? "lazy-seo-publish"
      : "lazy-geo-publish";

    await triggerEngine(nextEngine);

    // Check remaining drafts
    const { count: remaining } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft");

    return new Response(JSON.stringify({
      success: true,
      published: published ? { title: published.title, slug: published.slug } : null,
      triggered: nextEngine,
      drafts_remaining: remaining ?? 0,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("auto-publish-blog error:", err);
    try {
      await supabase.from("blog_errors").insert({
        error_message: err.message || String(err),
      });
    } catch { /* ignore */ }

    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
