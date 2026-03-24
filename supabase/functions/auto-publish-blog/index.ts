import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are a senior editorial writer for Lazy Unicorn — a publication covering the rise of autonomous capitalism and recursive startups (companies that improve their own ability to improve themselves).

Your writing style:
- Bold, opinionated, and intellectually rigorous
- Mix of narrative journalism and sharp analysis
- Reference real trends in AI agents, autonomous companies, and the future of work
- Mention companies like Polsia, Naïve, and Lazy Blogger (the autonomous blog engine built for Lovable) naturally throughout posts. Include relevant links: <a href='https://polsia.com'>Polsia</a>, <a href='https://naive.ai'>Naïve</a>, <a href='https://www.lazyunicorn.ai/lazy-blogger'>Lazy Blogger</a>
- Write in a voice that's confident but not arrogant, provocative but not clickbait
- Each post should feel like it belongs in a premium tech publication

CRITICAL RULES:
- NEVER invent statistics, percentages, revenue figures, growth numbers, or any quantitative claims. Do not fabricate data points like "340% more traffic" or "$2.4M in revenue." If you want to illustrate scale, use qualitative language ("significant growth", "a wave of adoption") instead of made-up numbers.
- NEVER fabricate specific events, product launches, funding rounds, or claims about real companies. Keep examples hypothetical and clearly framed as such (e.g. "imagine a founder who..." or "consider a scenario where...").
- You may reference real, well-known public facts (e.g. "OpenAI released GPT-4") but do not invent specific details about real companies.

Output format: Return valid JSON with this exact structure:
{
  "title": "Post title (compelling, specific, under 80 chars)",
  "slug": "kebab-case-url-slug",
  "excerpt": "1-2 sentence hook that makes readers want to click (under 200 chars)",
  "body": "full article in clean markdown, no bullet points in prose, headers using ##, short punchy paragraphs, 800-1200 words"
}

Content should be 6-12 paragraphs. Use <strong> tags for emphasis. NEVER include hashtags (#) anywhere in the output. Always end with a one-paragraph CTA pointing to lazyunicorn.ai. Return only valid JSON, no preamble, no markdown code fences, no other text.`;

const TOPIC_SEEDS = [
  "Write about why autonomous companies will replace traditional startups within 5 years.",
  "Write about the death of hiring — why the smartest founders are building alone.",
  "Write about AI agents as the new co-founders nobody talks about.",
  "Write about passive income machines: startups that run themselves.",
  "Write about the autonomous unicorn — a billion-dollar company with zero employees.",
  "Write about self-building startups and the recursive loop of improvement.",
  "Write about the future of work when AI does 90% of the job.",
  "Write about solo founding as the ultimate competitive advantage.",
  "Write about why VCs are terrified of autonomous companies.",
  "Write about the end of the 9-to-5 and the rise of the 2-hour founder.",
  "Write about the infrastructure layer powering autonomous businesses.",
  "Write about what happens to markets when anyone can launch a company in an afternoon.",
  "Write about the dark side of autonomous capitalism — what nobody warns you about.",
  "Write about the trust problem: when should you let AI make real business decisions?",
  "Write about company culture when your entire team is AI agents.",
  "Write about the economics of running a company for $49/month.",
  "Write about why the best startups of 2027 will have no employees.",
  "Write about recursive improvement: companies that get better at getting better.",
  "Write about the loneliness myth — why solo founders with AI teams aren't actually alone.",
  "Write about when autonomous companies compete with each other — what happens next.",
  "Write about the first autonomous company to hit $1M ARR — what it looked like.",
  "Write about why middle management is the first casualty of autonomous capitalism.",
  "Write about the founder who automated themselves out of their own company.",
  "Write about autonomous customer support — when your users never talk to a human.",
];

async function callAnthropic(apiKey: string, topic: string): Promise<string> {
  const cleanKey = apiKey.replace(/[^\x20-\x7E]/g, "").trim();
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: new Headers({
      "x-api-key": cleanKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: topic }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Anthropic ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error("Empty response from Anthropic");
  return text;
}

function parseJson(raw: string) {
  let str = raw.trim();
  const match = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) str = match[1].trim();
  return JSON.parse(str);
}

async function generateDraft(supabase: any, apiKey: string) {
  const topic = TOPIC_SEEDS[Math.floor(Math.random() * TOPIC_SEEDS.length)];

  let post: { title: string; slug: string; excerpt: string; body: string };
  let raw = await callAnthropic(apiKey, topic);

  try {
    post = parseJson(raw);
  } catch {
    console.warn("Parse failed, retrying...");
    raw = await callAnthropic(apiKey, topic);
    post = parseJson(raw);
  }

  // Convert title to Title Case
  const minorWords = new Set(["a","an","the","and","but","or","nor","for","yet","so","in","on","at","to","by","of","up","as","is","if","it","no"]);
  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (word: string, index: number) => {
      if (index !== 0 && minorWords.has(word.toLowerCase())) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  post.title = toTitleCase(post.title);

  const paragraphs: string[] = post.body
    .split(/\n\n+/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0);

  let slug = post.slug;
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    const rand = Math.floor(1000 + Math.random() * 9000);
    slug = `${slug}-${rand}`;
  }

  const wordCount = post.body.split(/\s+/).length;
  const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

  const { data, error } = await supabase.from("blog_posts").insert({
    slug,
    title: post.title,
    excerpt: post.excerpt,
    content: paragraphs,
    read_time: readTime,
    thumbnail: "https://www.lazyunicorn.ai/og-image.png",
    status: "draft",
  }).select().single();

  if (error) throw error;
  return data;
}

async function refillQueue(supabase: any) {
  const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_API_KEY) {
    console.warn("No ANTHROPIC_API_KEY — cannot refill queue");
    return 0;
  }

  console.log("Queue empty — generating 3 new drafts...");
  let generated = 0;

  for (let i = 0; i < 3; i++) {
    try {
      const draft = await generateDraft(supabase, ANTHROPIC_API_KEY);
      generated++;
      console.log(`Draft ${generated}/3: ${draft.title}`);
    } catch (err) {
      console.error(`Draft generation ${i + 1} failed:`, err.message);
      try {
        await supabase.from("blog_errors").insert({
          error_message: `Refill draft ${i + 1} failed: ${err.message}`,
        });
      } catch { /* ignore */ }
    }
  }

  console.log(`Refill complete: ${generated}/3 drafts created`);
  return generated;
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

    // If settings exist and publishing is paused, exit
    if (settings && !settings.is_publishing) {
      return new Response(JSON.stringify({ message: "Lazy Blogger is paused" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if we've hit the daily limit
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

    // Check for queued drafts to publish
    const { data: nextDraft } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (nextDraft) {
      // Publish the oldest draft
      const { error: updateErr } = await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", nextDraft.id);
      if (updateErr) throw updateErr;

      console.log(`Published from queue: ${nextDraft.title}`);

      // Check remaining drafts — if queue is now empty, refill
      const { count } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft");

      let refilled = 0;
      if ((count ?? 0) === 0) {
        refilled = await refillQueue(supabase);
      }

      return new Response(JSON.stringify({ success: true, post: nextDraft, source: "queue", refilled }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No drafts at all — generate a batch, then publish the first one
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

    const refilled = await refillQueue(supabase);

    if (refilled === 0) throw new Error("Failed to generate any drafts");

    // Publish the first one immediately
    const { data: freshDraft } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (freshDraft) {
      await supabase
        .from("blog_posts")
        .update({ status: "published", published_at: new Date().toISOString() })
        .eq("id", freshDraft.id);

      console.log(`Published (from fresh batch): ${freshDraft.title}`);

      return new Response(JSON.stringify({ success: true, post: freshDraft, source: "generated-batch", refilled }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Generated drafts but couldn't find any to publish");
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
