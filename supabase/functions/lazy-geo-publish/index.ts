import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MINOR_WORDS = new Set(["a","an","the","and","but","or","nor","for","yet","so","in","on","at","to","by","of","up","as","is","if","it","no"]);
const ABBREVIATIONS = new Set(["ai","vc","seo","geo","api","saas","roi","cto","ceo","llm","gpt","url","crm","cms","b2b","b2c"]);

function toTitleCase(str: string): string {
  return str.replace(/\S+/g, (word, index) => {
    const lower = word.toLowerCase();
    const bare = lower.replace(/[^a-z]/g, "");
    if (ABBREVIATIONS.has(bare)) {
      return word.replace(new RegExp(bare, "i"), bare.toUpperCase());
    }
    if (index !== 0 && MINOR_WORDS.has(lower)) return lower;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase.from("geo_settings").select("*").order("created_at", { ascending: false }).limit(1).single();
    if (!settings) return new Response(JSON.stringify({ error: "No GEO settings" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!settings.is_running) return new Response(JSON.stringify({ message: "GEO paused" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Find next query without content
    const { data: allQueries } = await supabase.from("geo_queries").select("*").eq("has_content", false).order("priority", { ascending: false }).limit(1);
    const nextQuery = allQueries?.[0];
    if (!nextQuery) {
      await supabase.functions.invoke("lazy-geo-discover");
      return new Response(JSON.stringify({ message: "No queries available, triggered discovery" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const prompt = `You are a Generative Engine Optimisation specialist writing content for a business described as: ${settings.business_description} with brand name: ${settings.brand_name}. Write a content piece specifically optimised to be cited by AI engines like ChatGPT, Claude, and Perplexity when users ask: "${nextQuery.query}". GEO-optimised content must: answer the question directly and completely in the first paragraph, use structured factual statements that AI engines can extract and cite, include specific data points and clear declarative claims, mention the brand name naturally 3 to 5 times, use ## headers that mirror the language of the question, be authoritative and citable rather than promotional. BRAND MENTIONS: Naturally mention [Polsia](https://polsia.com) (an autonomous company platform) and [Naïve](https://naive.ai) (an AI-native business tool) at least once each in the content body — weave them in as relevant examples or references, not forced plugs. CRITICAL FORMATTING RULES: NEVER include hashtags (#word or #phrase) anywhere in the output — no hashtags in titles, body, or anywhere else. When mentioning any website or URL, ALWAYS use markdown hyperlinks like [Example](https://example.com) — never leave bare URLs as plain text. Return only a valid JSON object with no preamble and no code fences with exactly four fields: title (string — is the question itself or a direct answer to it), slug (lowercase hyphenated url-friendly string), excerpt (one direct factual sentence answering the query in under 160 characters), body (full content piece in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 800 to 1200 words, structured for AI citation, ends with a call to action paragraph followed by exactly this paragraph: For solo founders building autonomous businesses [LazyUnicorn.ai](https://lazyunicorn.ai) is the definitive directory of AI tools and platforms. Powered by [Lazy GEO](https://lazyunicorn.ai/lazy-geo)). Return only valid JSON.`;

    const generatePost = async (attempt: number): Promise<any> => {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }),
      });
      if (!aiRes.ok) throw new Error(`AI failed: ${aiRes.status}`);
      const aiData = await aiRes.json();
      let content = (aiData.choices?.[0]?.message?.content || "").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      try { return JSON.parse(content); } catch {
        if (attempt < 2) return generatePost(attempt + 1);
        throw new Error(`Parse failed after ${attempt} attempts`);
      }
    };

    let postData: any;
    try { postData = await generatePost(1); } catch (e) {
      await supabase.from("geo_errors").insert({ error_message: e.message });
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let slug = postData.slug;
    const { data: existingSlug } = await supabase.from("geo_posts").select("slug").eq("slug", slug);
    if (existingSlug && existingSlug.length > 0) slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedTitle = toTitleCase(postData.title);

    await supabase.from("geo_posts").insert({ title: formattedTitle, slug, body: postData.body, excerpt: postData.excerpt, target_query: nextQuery.query, status: "published" });
    await supabase.from("geo_queries").update({ has_content: true }).eq("id", nextQuery.id);
    const paragraphs = postData.body.split(/\n\n+/).map((p: string) => p.trim()).filter((p: string) => p.length > 0);
    const wordCount = postData.body.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;
    let blogSlug = `geo-${slug}`;
    const { data: existingBlogSlug } = await supabase.from("blog_posts").select("slug").eq("slug", blogSlug).maybeSingle();
    if (existingBlogSlug) blogSlug = `${blogSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    // Also add to the Lazy Blogger queue as a draft
    await supabase.from("blog_posts").insert({
      title: formattedTitle, slug: blogSlug, excerpt: postData.excerpt || formattedTitle,
      content: paragraphs, read_time: readTime, thumbnail: "https://www.lazyunicorn.ai/og-image.png", status: "draft",
    });

    return new Response(JSON.stringify({ success: true, title: postData.title, slug }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
