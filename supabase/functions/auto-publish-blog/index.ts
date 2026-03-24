import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Product rotation order
const PRODUCTS = [
  "lazy-blogger",
  "lazy-seo",
  "lazy-geo",
  "lazy-stream",
  "lazy-voice",
  "lazy-store",
  "lazy-code",
  "lazy-sms",
  "lazy-pay",
  "lazy-alert",
  "lazy-gitlab",
  "lazy-supabase",
  "lazy-telegram",
  "lazy-linear",
  "lazy-contentful",
  "lazy-perplexity",
  "lazy-security",
];

// Each product gets SEO then GEO, so total slots = products * 2
// Slot 0 = product 0 SEO, slot 1 = product 0 GEO, slot 2 = product 1 SEO, etc.
function getSlotInfo(slotIndex: number) {
  const productIndex = Math.floor(slotIndex / 2) % PRODUCTS.length;
  const engine = slotIndex % 2 === 0 ? "lazy-seo-publish" : "lazy-geo-publish";
  return { product: PRODUCTS[productIndex], engine };
}

async function triggerEngine(engineName: string, product: string): Promise<void> {
  const baseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const url = `${baseUrl}/functions/v1/${engineName}`;

  console.log(`Triggering ${engineName} for product "${product}"...`);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${anonKey}`,
    },
    body: JSON.stringify({ product }),
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

    // Get the current rotation slot from app_config
    const { data: rotationRow } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "publish_rotation_slot")
      .maybeSingle();

    let currentSlot = parseInt(rotationRow?.value || "0", 10);
    if (isNaN(currentSlot)) currentSlot = 0;

    const totalSlots = PRODUCTS.length * 2;
    const { product, engine } = getSlotInfo(currentSlot);

    // Advance the slot for next time
    const nextSlot = (currentSlot + 1) % totalSlots;
    if (rotationRow) {
      await supabase
        .from("app_config")
        .update({ value: String(nextSlot) })
        .eq("key", "publish_rotation_slot");
    } else {
      await supabase
        .from("app_config")
        .insert({ key: "publish_rotation_slot", value: String(nextSlot) });
    }

    console.log(`Rotation slot ${currentSlot}: ${engine} for ${product} (next: ${nextSlot})`);
    await triggerEngine(engine, product);

    // Check remaining drafts
    const { count: remaining } = await supabase
      .from("blog_posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft");

    return new Response(JSON.stringify({
      success: true,
      published: published ? { title: published.title, slug: published.slug } : null,
      triggered: engine,
      product,
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
