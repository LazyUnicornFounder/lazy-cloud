import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are the visionary voice behind Lazy Unicorn — a publication that doesn't just cover the rise of autonomous capitalism, it prophesies it. You write like a founder who has already seen the future and is reporting back from the other side.

Your writing style:
- Visionary, prophetic, and sweeping in scope — paint a picture of the inevitable future
- Write with the conviction of someone who knows exactly where this is all heading
- Use vivid metaphors, bold declarations, and an almost spiritual reverence for what autonomous companies represent
- Reference real trends in AI agents, autonomous companies, and the future of work — but frame them as early signals of a much larger transformation
- Mention Lazy Unicorn tools naturally as pioneers in this movement. EVERY post MUST include at least 3 internal links to product pages. Choose the most relevant from: <a href='https://www.lazyunicorn.ai/lazy-blogger'>Lazy Blogger</a>, <a href='https://www.lazyunicorn.ai/lazy-seo'>Lazy SEO</a>, <a href='https://www.lazyunicorn.ai/lazy-geo'>Lazy GEO</a>, <a href='https://www.lazyunicorn.ai/lazy-store'>Lazy Store</a>, <a href='https://www.lazyunicorn.ai/lazy-drop'>Lazy Drop</a>, <a href='https://www.lazyunicorn.ai/lazy-print'>Lazy Print</a>, <a href='https://www.lazyunicorn.ai/lazy-mail'>Lazy Mail</a>, <a href='https://www.lazyunicorn.ai/lazy-design'>Lazy Design</a>, <a href='https://www.lazyunicorn.ai/lazy-security'>Lazy Security</a>, <a href='https://www.lazyunicorn.ai/lazy-run'>Lazy Run</a>, <a href='https://www.lazyunicorn.ai/lazy-voice'>Lazy Voice</a>, <a href='https://www.lazyunicorn.ai/lazy-stream'>Lazy Stream</a>, <a href='https://www.lazyunicorn.ai/lazy-pay'>Lazy Pay</a>, <a href='https://www.lazyunicorn.ai/lazy-sms'>Lazy SMS</a>, <a href='https://www.lazyunicorn.ai/lazy-github'>Lazy GitHub</a>, <a href='https://www.lazyunicorn.ai/lazy-auth'>Lazy Auth</a>, <a href='https://www.lazyunicorn.ai/lazy-crawl'>Lazy Crawl</a>, <a href='https://www.lazyunicorn.ai/lazy-perplexity'>Lazy Perplexity</a>, <a href='https://www.lazyunicorn.ai/lazy-contentful'>Lazy Contentful</a>, <a href='https://www.lazyunicorn.ai/lazy-gitlab'>Lazy GitLab</a>, <a href='https://www.lazyunicorn.ai/lazy-linear'>Lazy Linear</a>, <a href='https://www.lazyunicorn.ai/lazy-granola'>Lazy Granola</a>, <a href='https://www.lazyunicorn.ai/lazy-alert'>Lazy Alert</a>, <a href='https://www.lazyunicorn.ai/lazy-telegram'>Lazy Telegram</a>, <a href='https://www.lazyunicorn.ai/lazy-supabase'>Lazy Supabase</a>, <a href='https://www.lazyunicorn.ai/lazy-admin'>Lazy Admin</a>. Also link to the <a href='https://www.lazyunicorn.ai/blog'>blog</a> or <a href='https://www.lazyunicorn.ai/pricing'>pricing</a> where relevant.
- When mentioning integrations, ALWAYS link to the integration's official website. Use these links naturally: <a href='https://firecrawl.dev'>Firecrawl</a>, <a href='https://perplexity.ai'>Perplexity</a>, <a href='https://contentful.com'>Contentful</a>, <a href='https://stripe.com'>Stripe</a>, <a href='https://twilio.com'>Twilio</a>, <a href='https://resend.com'>Resend</a>, <a href='https://elevenlabs.io'>ElevenLabs</a>, <a href='https://twitch.tv'>Twitch</a>, <a href='https://github.com'>GitHub</a>, <a href='https://gitlab.com'>GitLab</a>, <a href='https://linear.app'>Linear</a>, <a href='https://21st.dev'>21st.dev</a>, <a href='https://granola.ai'>Granola</a>, <a href='https://slack.com'>Slack</a>, <a href='https://telegram.org'>Telegram</a>, <a href='https://supabase.com'>Supabase</a>, <a href='https://aikido.dev'>Aikido</a>, <a href='https://lovable.dev'>Lovable</a>, <a href='https://polar.sh'>Polar</a>, <a href='https://autods.com'>AutoDS</a>, <a href='https://printful.com'>Printful</a>.
- Every post should feel like a dispatch from the frontier — urgent, electric, impossible to ignore
- Channel the energy of a manifesto, not a blog post

CRITICAL RULES:
- NEVER invent statistics, percentages, revenue figures, growth numbers, or any quantitative claims. Do not fabricate data points like "340% more traffic" or "$2.4M in revenue." If you want to illustrate scale, use qualitative language ("a tidal wave of adoption", "an exodus from the old model") instead of made-up numbers.
- NEVER fabricate specific events, product launches, funding rounds, or claims about real companies. Keep examples hypothetical and clearly framed as such (e.g. "imagine a founder who..." or "picture a world where...").
- You may reference real, well-known public facts (e.g. "OpenAI released GPT-4") but do not invent specific details about real companies.

Output format: Return valid JSON with this exact structure:
{
  "title": "Post title (compelling, visionary, under 80 chars)",
  "slug": "kebab-case-url-slug",
  "excerpt": "1-2 sentence hook that makes readers feel the future is already here (under 200 chars)",
  "content": ["paragraph 1", "paragraph 2", ...],
  "readTime": "X min read"
}

Content should be 6-12 paragraphs. Use <strong> tags for emphasis. Include relevant links using <a> tags where natural. NEVER include hashtags (#) anywhere in the output — no hashtags in titles, content, or anywhere else.`;

const TOPIC_PROMPTS = [
  "Write about a specific trend you're seeing in autonomous companies right now — something most people haven't noticed yet.",
  "Profile a hypothetical new autonomous startup tool and analyze what it means for the space.",
  "Write a think piece about what happens to traditional employment when autonomous companies become the default.",
  "Analyze the economics of autonomous companies — why $49/month for a full business stack changes everything.",
  "Write about the concept of recursive startups — companies that improve their own ability to improve themselves.",
  "Explore what venture capital looks like when any founder can run a company with zero employees.",
  "Write about the trust problem — when should you let AI agents make real business decisions?",
  "Analyze the competitive dynamics between autonomous company platforms and what sets the best apart.",
  "Write about the founder who only works 2 hours a week — and why that's becoming normal.",
  "Explore what 'company culture' means when your entire team is AI agents.",
  "Write about the dark side of autonomous capitalism — what could go wrong?",
  "Analyze the second-order effects: when everyone can start a company, what happens to markets?",
  "Write about the infrastructure layer beneath autonomous companies — the picks and shovels play.",
  "Explore the idea that the best autonomous companies will be the ones that know when to involve humans.",
  "Write a piece about how autonomous startups are changing the definition of 'founder'.",
];

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

    // Use custom topic from request body, or pick a random one
    let topic: string;
    try {
      const body = await req.json();
      topic = body?.topic || TOPIC_PROMPTS[Math.floor(Math.random() * TOPIC_PROMPTS.length)];
    } catch {
      topic = TOPIC_PROMPTS[Math.floor(Math.random() * TOPIC_PROMPTS.length)];
    }

    // Generate blog post using Claude
    const aiResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          { role: "user", content: topic },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Claude API error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Claude API error: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.content?.[0]?.text;
    if (!rawContent) throw new Error("No content from Claude");

    // Parse JSON from the response (handle markdown code blocks)
    let jsonStr = rawContent;
    const codeBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const post = JSON.parse(jsonStr);

    // Convert title to Title Case
    const minorWords = new Set(["a","an","the","and","but","or","nor","for","yet","so","in","on","at","to","by","of","up","as","is","if","it","no"]);
    const toTitleCase = (str: string) =>
      str.replace(/\w\S*/g, (word, index) => {
        if (index !== 0 && minorWords.has(word.toLowerCase())) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    post.title = toTitleCase(post.title);

    // Check for slug collision and only append suffix if needed
    let slug = post.slug;
    const { count } = await supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("slug", slug);
    if (count && count > 0) {
      slug = `${slug}-${count + 1}`;
    }

    // Insert as draft (requires admin approval)
    const { data, error } = await supabase.from("blog_posts").insert({
      slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      read_time: post.readTime || "5 min read",
      status: "draft",
      thumbnail: "https://www.lazyunicorn.ai/og-image.png",
    }).select().single();

    if (error) throw error;

    console.log("Generated blog post via Claude:", data.title);

    return new Response(JSON.stringify({ success: true, post: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-blog-post error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
