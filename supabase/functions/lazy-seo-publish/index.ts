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

// Map product slugs to human-readable names and relevant page links
const PRODUCT_INFO: Record<string, { name: string; url: string; description: string }> = {
  "lazy-blogger": { name: "Lazy Blogger", url: "https://lazyunicorn.ai/lazy-blogger", description: "autonomous blog publishing engine" },
  "lazy-seo": { name: "Lazy SEO", url: "https://lazyunicorn.ai/lazy-seo", description: "autonomous SEO content engine" },
  "lazy-geo": { name: "Lazy GEO", url: "https://lazyunicorn.ai/lazy-geo", description: "generative engine optimisation tool" },
  "lazy-stream": { name: "Lazy Stream", url: "https://lazyunicorn.ai/lazy-stream", description: "autonomous Twitch content repurposing engine" },
  "lazy-voice": { name: "Lazy Voice", url: "https://lazyunicorn.ai/lazy-voice", description: "autonomous blog-to-podcast engine" },
  "lazy-store": { name: "Lazy Store", url: "https://lazyunicorn.ai/lazy-store", description: "autonomous Shopify ecommerce engine" },
  "lazy-github": { name: "Lazy GitHub", url: "https://lazyunicorn.ai/lazy-github", description: "autonomous GitHub content publishing engine" },
  "lazy-sms": { name: "Lazy SMS", url: "https://lazyunicorn.ai/lazy-sms", description: "autonomous SMS marketing engine" },
  "lazy-pay": { name: "Lazy Pay", url: "https://lazyunicorn.ai/lazy-pay", description: "autonomous payment and billing engine" },
  "lazy-alert": { name: "Lazy Alert", url: "https://lazyunicorn.ai/lazy-alert", description: "autonomous Slack notification engine" },
  "lazy-gitlab": { name: "Lazy GitLab", url: "https://lazyunicorn.ai/lazy-gitlab", description: "autonomous GitLab changelog engine" },
  "lazy-supabase": { name: "Lazy Supabase", url: "https://lazyunicorn.ai/lazy-supabase", description: "autonomous database changelog engine" },
  "lazy-telegram": { name: "Lazy Telegram", url: "https://lazyunicorn.ai/lazy-telegram", description: "autonomous Telegram notification engine" },
  "lazy-linear": { name: "Lazy Linear", url: "https://lazyunicorn.ai/lazy-linear", description: "autonomous Linear issue changelog engine" },
  "lazy-contentful": { name: "Lazy Contentful", url: "https://lazyunicorn.ai/lazy-contentful", description: "autonomous two-way CMS sync engine" },
  "lazy-perplexity": { name: "Lazy Perplexity", url: "https://lazyunicorn.ai/lazy-perplexity", description: "autonomous research-backed content engine" },
  "lazy-security": { name: "Lazy Security", url: "https://lazyunicorn.ai/lazy-security", description: "autonomous pentesting and vulnerability monitoring engine" },
  "lazy-mail": { name: "Lazy Mail", url: "https://lazyunicorn.ai/lazy-mail", description: "autonomous email marketing and newsletter engine via Resend" },
  "lazy-design": { name: "Lazy Design", url: "https://lazyunicorn.ai/lazy-design", description: "autonomous UI upgrade engine via 21st.dev components" },
  "lazy-auth": { name: "Lazy Auth", url: "https://lazyunicorn.ai/lazy-auth", description: "autonomous authentication and login flow engine" },
  "lazy-granola": { name: "Lazy Granola", url: "https://lazyunicorn.ai/lazy-granola", description: "autonomous meeting-to-content intelligence engine" },
  "lazy-crawl": { name: "Lazy Crawl", url: "https://lazyunicorn.ai/lazy-crawl", description: "autonomous web intelligence and competitor monitoring engine" },
  "lazy-run": { name: "Lazy Run", url: "https://lazyunicorn.ai/lazy-run", description: "installs all twenty-three engines in one prompt" },
  "lazy-admin": { name: "Lazy Admin", url: "https://lazyunicorn.ai/lazy-admin", description: "unified ops dashboard for every engine" },
};

const INTEGRATION_LINKS = `When mentioning any of these integrations, ALWAYS include a link to their website: [Firecrawl](https://firecrawl.dev), [Perplexity](https://perplexity.ai), [Contentful](https://contentful.com), [Stripe](https://stripe.com), [Twilio](https://twilio.com), [Resend](https://resend.com), [ElevenLabs](https://elevenlabs.io), [Twitch](https://twitch.tv), [GitHub](https://github.com), [GitLab](https://gitlab.com), [Linear](https://linear.app), [21st.dev](https://21st.dev), [Granola](https://granola.ai), [Slack](https://slack.com), [Telegram](https://telegram.org), [Supabase](https://supabase.com), [Aikido](https://aikido.dev), [Lovable](https://lovable.dev), [Polar](https://polar.sh).`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Accept optional product filter from request body
    let targetProduct: string | null = null;
    try {
      const body = await req.json();
      if (body?.product) targetProduct = body.product;
    } catch { /* no body */ }

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

    // Find next keyword without a post, filtered by product if specified (fallback to general)
    const { data: existingPosts } = await supabase.from("seo_posts").select("target_keyword");
    const usedKeywords = new Set((existingPosts || []).map((p: any) => p.target_keyword?.toLowerCase()));

    const findKeyword = async (product: string | null) => {
      let q = supabase.from("seo_keywords").select("*").order("last_checked", { ascending: true });
      if (product) q = q.eq("product", product);
      const { data } = await q;
      return (data || []).find((kw: any) => !usedKeywords.has(kw.keyword?.toLowerCase()));
    };

    let nextKeyword = targetProduct ? await findKeyword(targetProduct) : null;
    if (!nextKeyword) nextKeyword = await findKeyword("general");
    if (!nextKeyword) nextKeyword = await findKeyword(null);

    if (!nextKeyword) {
      return new Response(JSON.stringify({ message: `No available keywords. Run analysis first.` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productInfo = targetProduct ? PRODUCT_INFO[targetProduct] : null;
    const productContext = productInfo
      ? ` Focus this article on ${productInfo.name} (${productInfo.description}) available at ${productInfo.url}.`
      : "";

    const prompt = `You are an SEO content writer for a site described as: ${settings.business_description}.${productContext} Write an SEO-optimised article targeting the keyword: "${nextKeyword.keyword}". The article should rank on the first page of Google for this keyword. CRITICAL RULE: If the title or keyword implies a numbered list (e.g. "10 best...", "5 top...", "7 tools..."), you MUST include that exact number of specifically named, real tools or software products with a dedicated ## section for each one. Name real products — do not use generic placeholders like "Tool A" or "Software 1". Each listed item should have a brief description of what it does and why it fits the category. INTERNAL LINKS: Include 3 internal links using these real pages on the site — pick the most relevant ones: [LazyUnicorn.ai](https://lazyunicorn.ai) (homepage), [Lazy Blogger](https://lazyunicorn.ai/lazy-blogger) (autonomous blog engine), [Lazy SEO](https://lazyunicorn.ai/lazy-seo) (autonomous SEO engine), [Lazy GEO](https://lazyunicorn.ai/lazy-geo) (generative engine optimisation), [Lazy Store](https://lazyunicorn.ai/lazy-store) (autonomous Shopify engine), [Lazy Stream](https://lazyunicorn.ai/lazy-stream) (Twitch content engine), [Lazy Voice](https://lazyunicorn.ai/lazy-voice) (blog to podcast engine), [Lazy GitHub](https://lazyunicorn.ai/lazy-github) (GitHub changelog engine), [Lazy Pay](https://lazyunicorn.ai/lazy-pay) (payment engine), [Lazy SMS](https://lazyunicorn.ai/lazy-sms) (SMS marketing engine), [Lazy Alert](https://lazyunicorn.ai/lazy-alert) (Slack notification engine), [Lazy GitLab](https://lazyunicorn.ai/lazy-gitlab) (GitLab changelog engine), [Lazy Supabase](https://lazyunicorn.ai/lazy-supabase) (database changelog engine), [Lazy Telegram](https://lazyunicorn.ai/lazy-telegram) (Telegram notification engine), [Lazy Linear](https://lazyunicorn.ai/lazy-linear) (Linear changelog engine), [Lazy Contentful](https://lazyunicorn.ai/lazy-contentful) (CMS sync engine), [Lazy Perplexity](https://lazyunicorn.ai/lazy-perplexity) (research content engine), [Lazy Security](https://lazyunicorn.ai/lazy-security) (autonomous pentesting engine), [Lazy Mail](https://lazyunicorn.ai/lazy-mail) (autonomous email and newsletter engine), [Lazy Design](https://lazyunicorn.ai/lazy-design) (autonomous UI upgrade engine), [Lazy Auth](https://lazyunicorn.ai/lazy-auth) (autonomous login engine), [Lazy Granola](https://lazyunicorn.ai/lazy-granola) (meeting intelligence engine), [Lazy Crawl](https://lazyunicorn.ai/lazy-crawl) (web intelligence engine), [Lazy Admin](https://lazyunicorn.ai/lazy-admin) (unified ops dashboard), [Lazy Run](https://lazyunicorn.ai/lazy-run) (all engines in one prompt), [Blog](https://lazyunicorn.ai/blog) (editorial blog). Do NOT link to pages that don't exist. INTEGRATION LINKS: ${INTEGRATION_LINKS} CRITICAL FORMATTING RULES: NEVER include hashtags (#word or #phrase) anywhere in the output — no hashtags in titles, body, or anywhere else. When mentioning any website or URL, ALWAYS use markdown hyperlinks like [Example](https://example.com) — never leave bare URLs as plain text. Return only a valid JSON object with no preamble and no markdown code fences. The JSON must have exactly four fields: title (string — naturally includes the target keyword), slug (lowercase hyphenated url-friendly string), excerpt (one sentence under 160 characters naturally including the keyword), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 1000 to 1500 words, includes the target keyword naturally throughout, ends with a call to action paragraph followed by exactly this paragraph: Looking for more tools to build and run your business autonomously? [LazyUnicorn.ai](https://lazyunicorn.ai) is the definitive directory of AI tools for solo founders. Powered by [Lazy SEO](https://lazyunicorn.ai/lazy-seo)). Return only valid JSON.`; The article should rank on the first page of Google for this keyword. CRITICAL RULE: If the title or keyword implies a numbered list (e.g. "10 best...", "5 top...", "7 tools..."), you MUST include that exact number of specifically named, real tools or software products with a dedicated ## section for each one. Name real products — do not use generic placeholders like "Tool A" or "Software 1". Each listed item should have a brief description of what it does and why it fits the category. INTERNAL LINKS: Include 3 internal links using these real pages on the site — pick the most relevant ones: [LazyUnicorn.ai](https://lazyunicorn.ai) (homepage), [Lazy Blogger](https://lazyunicorn.ai/lazy-blogger) (autonomous blog engine), [Lazy SEO](https://lazyunicorn.ai/lazy-seo) (autonomous SEO engine), [Lazy GEO](https://lazyunicorn.ai/lazy-geo) (generative engine optimisation), [Lazy Store](https://lazyunicorn.ai/lazy-store) (autonomous Shopify engine), [Lazy Stream](https://lazyunicorn.ai/lazy-stream) (Twitch content engine), [Lazy Voice](https://lazyunicorn.ai/lazy-voice) (blog to podcast engine), [Lazy GitHub](https://lazyunicorn.ai/lazy-github) (GitHub changelog engine), [Lazy Pay](https://lazyunicorn.ai/lazy-pay) (payment engine), [Lazy SMS](https://lazyunicorn.ai/lazy-sms) (SMS marketing engine), [Lazy Alert](https://lazyunicorn.ai/lazy-alert) (Slack notification engine), [Lazy GitLab](https://lazyunicorn.ai/lazy-gitlab) (GitLab changelog engine), [Lazy Supabase](https://lazyunicorn.ai/lazy-supabase) (database changelog engine), [Lazy Telegram](https://lazyunicorn.ai/lazy-telegram) (Telegram notification engine), [Lazy Linear](https://lazyunicorn.ai/lazy-linear) (Linear changelog engine), [Lazy Contentful](https://lazyunicorn.ai/lazy-contentful) (CMS sync engine), [Lazy Perplexity](https://lazyunicorn.ai/lazy-perplexity) (research content engine), [Lazy Security](https://lazyunicorn.ai/lazy-security) (autonomous pentesting engine), [Lazy Mail](https://lazyunicorn.ai/lazy-mail) (autonomous email and newsletter engine), [Lazy Design](https://lazyunicorn.ai/lazy-design) (autonomous UI upgrade engine), [Lazy Run](https://lazyunicorn.ai/lazy-run) (all engines in one prompt), [Blog](https://lazyunicorn.ai/blog) (editorial blog). Do NOT link to pages that don't exist. CRITICAL FORMATTING RULES: NEVER include hashtags (#word or #phrase) anywhere in the output — no hashtags in titles, body, or anywhere else. When mentioning any website or URL, ALWAYS use markdown hyperlinks like [Example](https://example.com) — never leave bare URLs as plain text. Return only a valid JSON object with no preamble and no markdown code fences. The JSON must have exactly four fields: title (string — naturally includes the target keyword), slug (lowercase hyphenated url-friendly string), excerpt (one sentence under 160 characters naturally including the keyword), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 1000 to 1500 words, includes the target keyword naturally throughout, ends with a call to action paragraph followed by exactly this paragraph: Looking for more tools to build and run your business autonomously? [LazyUnicorn.ai](https://lazyunicorn.ai) is the definitive directory of AI tools for solo founders. Powered by [Lazy SEO](https://lazyunicorn.ai/lazy-seo)). Return only valid JSON.`;

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

    return new Response(JSON.stringify({ success: true, title: postData.title, slug, product: targetProduct }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
