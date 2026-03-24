import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are the Operations Agent for Lazy Unicorn — an autonomous platform running three growth engines for Lovable websites:

1. **Lazy Blogger** — auto-publishes blog posts on a schedule
2. **Lazy SEO** — discovers keywords and publishes SEO-optimized content
3. **Lazy GEO** — creates content to get cited by AI engines (ChatGPT, Claude, Perplexity)

You monitor and manage all three engines. You can check their status, publish content, pause/resume engines, review errors, and report stats.

Be concise, operational, and direct. Use bullet points for status reports. When taking actions, confirm what you did. If something looks wrong, proactively suggest fixes.`;

const TOOLS = [
  {
    name: "get_engine_status",
    description: "Get the current status of all three engines (Blogger, SEO, GEO) — whether they're running, paused, and key metrics.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_blog_stats",
    description: "Get detailed blog statistics: total posts, published today, drafts in queue, recent errors.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_seo_stats",
    description: "Get SEO engine statistics: published posts, tracked keywords, keyword positions.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "get_geo_stats",
    description: "Get GEO engine statistics: published posts, discovered queries, citation rate.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "publish_blog_post",
    description: "Publish the next blog post from the draft queue immediately.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "publish_seo_post",
    description: "Trigger publishing of the next SEO post immediately.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "publish_geo_post",
    description: "Trigger publishing of the next GEO post immediately.",
    input_schema: { type: "object" as const, properties: {}, required: [] as string[] },
  },
  {
    name: "toggle_blog_engine",
    description: "Pause or resume the Lazy Blogger engine.",
    input_schema: {
      type: "object" as const,
      properties: { action: { type: "string", enum: ["pause", "resume"], description: "Whether to pause or resume" } },
      required: ["action"],
    },
  },
  {
    name: "toggle_seo_engine",
    description: "Pause or resume the Lazy SEO engine.",
    input_schema: {
      type: "object" as const,
      properties: { action: { type: "string", enum: ["pause", "resume"], description: "Whether to pause or resume" } },
      required: ["action"],
    },
  },
  {
    name: "toggle_geo_engine",
    description: "Pause or resume the Lazy GEO engine.",
    input_schema: {
      type: "object" as const,
      properties: { action: { type: "string", enum: ["pause", "resume"], description: "Whether to pause or resume" } },
      required: ["action"],
    },
  },
  {
    name: "get_recent_errors",
    description: "Get recent errors across all engines (blog, SEO, GEO).",
    input_schema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "Number of errors to return (default 10)" } },
      required: [] as string[],
    },
  },
  {
    name: "get_recent_posts",
    description: "Get the most recently published posts across all engines.",
    input_schema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "Number of posts to return (default 5)" } },
      required: [] as string[],
    },
  },
];

async function executeTool(name: string, input: any, supabase: any): Promise<string> {
  switch (name) {
    case "get_engine_status": {
      const [blogSettings, seoSettings, geoSettings] = await Promise.all([
        supabase.from("blog_settings").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("seo_settings").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("geo_settings").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      return JSON.stringify({
        blogger: blogSettings.data ? { running: blogSettings.data.is_publishing, posts_per_day: blogSettings.data.posts_per_day, frequency_minutes: blogSettings.data.frequency_minutes } : "Not configured",
        seo: seoSettings.data ? { running: seoSettings.data.is_running, site_url: seoSettings.data.site_url } : "Not configured",
        geo: geoSettings.data ? { running: geoSettings.data.is_running, brand: geoSettings.data.brand_name, posts_per_day: geoSettings.data.posts_per_day } : "Not configured",
      });
    }
    case "get_blog_stats": {
      const todayStart = new Date(); todayStart.setUTCHours(0, 0, 0, 0);
      const [total, published, drafts, errors] = await Promise.all([
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", todayStart.toISOString()),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
        supabase.from("blog_errors").select("*").order("created_at", { ascending: false }).limit(3),
      ]);
      return JSON.stringify({
        total_posts: total.count ?? 0,
        published_today: published.count ?? 0,
        drafts_in_queue: drafts.count ?? 0,
        recent_errors: errors.data?.map((e: any) => ({ message: e.error_message, at: e.created_at })) ?? [],
      });
    }
    case "get_seo_stats": {
      const [posts, keywords] = await Promise.all([
        supabase.from("seo_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("seo_keywords").select("*").order("last_checked", { ascending: false }).limit(10),
      ]);
      return JSON.stringify({
        published_posts: posts.count ?? 0,
        tracked_keywords: keywords.data?.length ?? 0,
        top_keywords: keywords.data?.map((k: any) => ({ keyword: k.keyword, position: k.current_position, change: k.previous_position ? k.previous_position - (k.current_position ?? 0) : null })) ?? [],
      });
    }
    case "get_geo_stats": {
      const [posts, queries, citations] = await Promise.all([
        supabase.from("geo_posts").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("geo_queries").select("id, brand_cited", { count: "exact", head: true }),
        supabase.from("geo_citations").select("brand_mentioned").order("tested_at", { ascending: false }).limit(20),
      ]);
      const cited = citations.data?.filter((c: any) => c.brand_mentioned).length ?? 0;
      const total = citations.data?.length ?? 0;
      return JSON.stringify({
        published_posts: posts.count ?? 0,
        total_queries: queries.count ?? 0,
        citation_rate: total > 0 ? `${Math.round((cited / total) * 100)}%` : "No data",
      });
    }
    case "publish_blog_post": {
      const { data: draft } = await supabase.from("blog_posts").select("*").eq("status", "draft").order("created_at", { ascending: true }).limit(1).maybeSingle();
      if (!draft) return JSON.stringify({ success: false, reason: "No drafts in queue" });
      const { error } = await supabase.from("blog_posts").update({ status: "published", published_at: new Date().toISOString() }).eq("id", draft.id);
      if (error) return JSON.stringify({ success: false, reason: error.message });
      return JSON.stringify({ success: true, title: draft.title, slug: draft.slug });
    }
    case "publish_seo_post": {
      const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/lazy-seo-publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}` },
      });
      const data = await res.json();
      return JSON.stringify(data);
    }
    case "publish_geo_post": {
      const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/lazy-geo-publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}` },
      });
      const data = await res.json();
      return JSON.stringify(data);
    }
    case "toggle_blog_engine": {
      const resume = input.action === "resume";
      const { error } = await supabase.from("blog_settings").update({ is_publishing: resume }).order("created_at", { ascending: false }).limit(1);
      if (error) return JSON.stringify({ success: false, reason: error.message });
      return JSON.stringify({ success: true, status: resume ? "running" : "paused" });
    }
    case "toggle_seo_engine": {
      const resume = input.action === "resume";
      const { error } = await supabase.from("seo_settings").update({ is_running: resume }).order("created_at", { ascending: false }).limit(1);
      if (error) return JSON.stringify({ success: false, reason: error.message });
      return JSON.stringify({ success: true, status: resume ? "running" : "paused" });
    }
    case "toggle_geo_engine": {
      const resume = input.action === "resume";
      const { error } = await supabase.from("geo_settings").update({ is_running: resume }).order("created_at", { ascending: false }).limit(1);
      if (error) return JSON.stringify({ success: false, reason: error.message });
      return JSON.stringify({ success: true, status: resume ? "running" : "paused" });
    }
    case "get_recent_errors": {
      const limit = input.limit || 10;
      const [blogErrs, seoErrs, geoErrs] = await Promise.all([
        supabase.from("blog_errors").select("*").order("created_at", { ascending: false }).limit(limit),
        supabase.from("seo_errors").select("*").order("created_at", { ascending: false }).limit(limit),
        supabase.from("geo_errors").select("*").order("created_at", { ascending: false }).limit(limit),
      ]);
      return JSON.stringify({
        blog_errors: blogErrs.data ?? [],
        seo_errors: seoErrs.data ?? [],
        geo_errors: geoErrs.data ?? [],
      });
    }
    case "get_recent_posts": {
      const limit = input.limit || 5;
      const [blogs, seo, geo] = await Promise.all([
        supabase.from("blog_posts").select("title, slug, status, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(limit),
        supabase.from("seo_posts").select("title, slug, status, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(limit),
        supabase.from("geo_posts").select("title, slug, status, published_at").eq("status", "published").order("published_at", { ascending: false }).limit(limit),
      ]);
      return JSON.stringify({
        blog_posts: blogs.data ?? [],
        seo_posts: seo.data ?? [],
        geo_posts: geo.data ?? [],
      });
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) throw new Error("messages array is required");

    let anthropicMessages = messages.map((m: any) => ({ role: m.role, content: m.content }));

    let maxIterations = 10;
    let finalText = "";

    while (maxIterations-- > 0) {
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_API_KEY.replace(/[^\x20-\x7E]/g, "").trim(),
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: anthropicMessages,
          tools: TOOLS,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Anthropic ${response.status}: ${errText}`);
      }

      const data = await response.json();

      if (data.stop_reason === "tool_use") {
        anthropicMessages.push({ role: "assistant", content: data.content });

        const toolResults: any[] = [];
        for (const block of data.content) {
          if (block.type === "tool_use") {
            console.log(`Executing tool: ${block.name}`, block.input);
            const result = await executeTool(block.name, block.input, supabase);
            toolResults.push({
              type: "tool_result",
              tool_use_id: block.id,
              content: result,
            });
          }
        }

        anthropicMessages.push({ role: "user", content: toolResults });
      } else {
        for (const block of data.content) {
          if (block.type === "text") finalText += block.text;
        }
        break;
      }
    }

    return new Response(JSON.stringify({ response: finalText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("ops-agent error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
