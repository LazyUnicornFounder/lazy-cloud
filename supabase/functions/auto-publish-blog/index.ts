import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are the writer for LazyUnicorn.ai — a directory of AI tools for solo founders building autonomous companies. Write one blog post per call. Return a JSON object with four fields only: title (string), slug (url-friendly string), excerpt (one sentence, max 160 chars), and body (the full article in clean markdown — no HTML, no bullet points in prose, headers using ##, short punchy paragraphs, 800-1200 words). Topics rotate across: autonomous companies, solo founding, AI agents, self-building startups, the future of work, passive income via AI, autonomous unicorns, and the end of hiring. Tone: dark, editorial, provocative, honest. Always end with a one-paragraph call to action pointing readers to the LazyUnicorn.ai directory. Return only valid JSON, no other text.`;

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

    const topic = TOPIC_SEEDS[Math.floor(Math.random() * TOPIC_SEEDS.length)];

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
        messages: [{ role: "user", content: topic }],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Anthropic API error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Anthropic API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.content?.[0]?.text;
    if (!rawContent) throw new Error("No content from Anthropic");

    // Parse JSON — handle possible markdown code fences
    let jsonStr = rawContent.trim();
    const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const post = JSON.parse(jsonStr);

    // Split markdown body into paragraphs for the content text[] column
    const paragraphs: string[] = post.body
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    // Ensure unique slug
    const slug = `${post.slug}-${Date.now()}`;

    // Estimate read time (~200 wpm)
    const wordCount = post.body.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;

    const { data, error } = await supabase.from("blog_posts").insert({
      slug,
      title: post.title,
      excerpt: post.excerpt,
      content: paragraphs,
      read_time: readTime,
      status: "draft",
    }).select().single();

    if (error) throw error;

    console.log("Auto-published blog post:", data.title);

    return new Response(JSON.stringify({ success: true, post: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("auto-publish-blog error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
