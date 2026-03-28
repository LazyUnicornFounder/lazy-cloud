import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

interface ProductTarget {
  product: string;
  seo_posts_per_day: number;
  geo_posts_per_day: number;
  enabled: boolean;
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
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    if (settings?.posts_per_day) {
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

    // ── Per-product rotation using product_publish_settings ──
    const { data: productTargets } = await supabase
      .from("product_publish_settings")
      .select("*")
      .eq("enabled", true)
      .order("product");

    const targets: ProductTarget[] = productTargets || [];

    if (targets.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        published: published ? { title: published.title, slug: published.slug } : null,
        message: "No enabled products for SEO/GEO generation",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build a flat list of (product, engine) slots based on per-product targets
    // Count how many SEO and GEO posts each product already has today
    const [{ data: seoToday }, { data: geoToday }] = await Promise.all([
      supabase
        .from("seo_posts")
        .select("target_keyword")
        .gte("published_at", todayStart.toISOString()),
      supabase
        .from("geo_posts")
        .select("target_query")
        .gte("published_at", todayStart.toISOString()),
    ]);

    const seoCountToday = seoToday?.length ?? 0;
    const geoCountToday = geoToday?.length ?? 0;

    // Use a rotation slot to fairly distribute across products
    const { data: rotationRow } = await supabase
      .from("app_config")
      .select("value")
      .eq("key", "publish_rotation_slot")
      .maybeSingle();

    let currentSlot = parseInt(rotationRow?.value || "0", 10);
    if (isNaN(currentSlot)) currentSlot = 0;

    // Build available slots: products that haven't hit their daily target
    type Slot = { product: string; engine: string };
    const availableSlots: Slot[] = [];

    // We don't have per-product counts from the cron, so we use the rotation
    // to distribute evenly. The daily limits are enforced by counting slots
    // in the rotation cycle.
    for (const t of targets) {
      for (let i = 0; i < t.seo_posts_per_day; i++) {
        availableSlots.push({ product: t.product, engine: "lazy-seo-publish" });
      }
      for (let i = 0; i < t.geo_posts_per_day; i++) {
        availableSlots.push({ product: t.product, engine: "lazy-geo-publish" });
      }
    }

    if (availableSlots.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        published: published ? { title: published.title, slug: published.slug } : null,
        message: "All per-product targets are 0",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Pick the slot for this invocation
    const slotIndex = currentSlot % availableSlots.length;
    const { product, engine } = availableSlots[slotIndex];

    // Advance the slot
    const nextSlot = currentSlot + 1;
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

    console.log(`Slot ${slotIndex}/${availableSlots.length}: ${engine} for ${product} (global slot: ${currentSlot} → ${nextSlot})`);
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
      slot: `${slotIndex}/${availableSlots.length}`,
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
