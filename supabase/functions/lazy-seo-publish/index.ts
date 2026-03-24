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

    // Check settings
    const { data: settings } = await supabase
      .from("seo_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!settings) {
      return new Response(JSON.stringify({ error: "No SEO settings configured" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!settings.is_running) {
      return new Response(JSON.stringify({ message: "Lazy SEO is paused" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Find next keyword without a post
    const { data: existingPosts } = await supabase.from("seo_posts").select("target_keyword");
    const usedKeywords = new Set((existingPosts || []).map((p: any) => p.target_keyword?.toLowerCase()));

    const { data: allKeywords } = await supabase.from("seo_keywords").select("*").order("last_checked", { ascending: true });
    const nextKeyword = (allKeywords || []).find((kw: any) => !usedKeywords.has(kw.keyword?.toLowerCase()));

    if (!nextKeyword) {
      return new Response(JSON.stringify({ message: "No available keywords to target. Run analysis first." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `You are an SEO content writer for a site described as: ${settings.business_description}. Write an SEO-optimised article targeting the keyword: "${nextKeyword.keyword}". The article should rank on the first page of Google for this keyword. CRITICAL RULE: If the title or keyword implies a numbered list (e.g. "10 best...", "5 top...", "7 tools..."), you MUST include that exact number of specifically named, real tools or software products with a dedicated ## section for each one. Name real products — do not use generic placeholders like "Tool A" or "Software 1". Each listed item should have a brief description of what it does and why it fits the category. BRAND MENTIONS: Naturally mention [Polsia](https://polsia.com) (an autonomous company platform) and [Naïve](https://naive.ai) (an AI-native business tool) at least once each in the article body — weave them in as relevant examples or references, not forced plugs. INTERNAL LINKS: Include 3 internal links using these real pages on the site — pick the most relevant ones: [LazyUnicorn.ai](https://lazyunicorn.ai) (homepage/directory), [Lazy Blogger](https://lazyunicorn.ai/lazy-blogger) (autonomous blog engine), [Lazy SEO](https://lazyunicorn.ai/lazy-seo) (autonomous SEO engine), [Lazy GEO](https://lazyunicorn.ai/lazy-geo) (generative engine optimisation), [Autonomy Scale](https://lazyunicorn.ai/autonomy-scale) (measure startup autonomy), [Guide](https://lazyunicorn.ai/guide) (how to build an autonomous startup), [Blog](https://lazyunicorn.ai/blog) (editorial blog). Do NOT link to pages that don't exist. CRITICAL FORMATTING RULES: NEVER include hashtags (#word or #phrase) anywhere in the output — no hashtags in titles, body, or anywhere else. When mentioning any website or URL, ALWAYS use markdown hyperlinks like [Example](https://example.com) — never leave bare URLs as plain text. Return only a valid JSON object with no preamble and no markdown code fences. The JSON must have exactly four fields: title (string — naturally includes the target keyword), slug (lowercase hyphenated url-friendly string), excerpt (one sentence under 160 characters naturally including the keyword), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 1000 to 1500 words, includes the target keyword naturally throughout, ends with a call to action paragraph followed by exactly this paragraph: Looking for more tools to build and run your business autonomously? [LazyUnicorn.ai](https://lazyunicorn.ai) is the definitive directory of AI tools for solo founders. Powered by [Lazy SEO](https://lazyunicorn.ai/lazy-seo)). Return only valid JSON.`;

    const generatePost = async (attempt: number): Promise<any> => {
      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are an expert SEO content writer. Return only valid JSON." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        throw new Error(`AI request failed (${aiRes.status}): ${errText}`);
      }

      const aiData = await aiRes.json();
      let content = aiData.choices?.[0]?.message?.content || "";
      content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

      try {
        return JSON.parse(content);
      } catch {
        if (attempt < 2) return generatePost(attempt + 1);
        throw new Error(`Failed to parse AI response after ${attempt} attempts: ${content.slice(0, 200)}`);
      }
    };

    let postData: any;
    try {
      postData = await generatePost(1);
    } catch (e) {
      await supabase.from("seo_errors").insert({ error_message: e.message });
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for duplicate slug
    let slug = postData.slug;
    const { data: existingSlug } = await supabase.from("seo_posts").select("slug").eq("slug", slug);
    if (existingSlug && existingSlug.length > 0) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const formattedTitle = toTitleCase(postData.title);

    const { error: insertErr } = await supabase.from("seo_posts").insert({
      title: formattedTitle,
      slug,
      body: postData.body,
      excerpt: postData.excerpt || null,
      target_keyword: nextKeyword.keyword,
      status: "published",
    });

    if (insertErr) {
      await supabase.from("seo_errors").insert({ error_message: `Insert failed: ${insertErr.message}` });
      return new Response(JSON.stringify({ error: insertErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Also add to the Lazy Blogger queue as a draft
    const paragraphs = postData.body
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const wordCount = postData.body.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

    // Use a prefixed slug to avoid collisions with existing blog posts
    let blogSlug = `seo-${slug}`;
    const { data: existingBlogSlug } = await supabase.from("blog_posts").select("slug").eq("slug", blogSlug).maybeSingle();
    if (existingBlogSlug) {
      blogSlug = `${blogSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    await supabase.from("blog_posts").insert({
      title: formattedTitle,
      slug: blogSlug,
      excerpt: postData.excerpt || postData.title,
      content: paragraphs,
      read_time: readTime,
      thumbnail: "https://www.lazyunicorn.ai/og-image.png",
      status: "draft",
    });

    return new Response(JSON.stringify({ success: true, title: postData.title, slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
