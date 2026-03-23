import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are the writer for LazyUnicorn.ai — a directory of AI tools for solo founders building autonomous companies. Write one blog post per call. Pick a fresh angle every time — vary the topic, structure, and opening. Never repeat a title. Topics rotate across: autonomous companies, solo founding, AI agents, self-building startups, the future of work, passive income via AI, autonomous unicorns, and the end of hiring. Tone: dark, editorial, provocative, honest. Return a JSON object with four fields only: title (string), slug (url-friendly lowercase-hyphenated string), excerpt (one punchy sentence max 160 chars), and body (full article in clean markdown, no HTML, no bullet points in prose, headers using ##, short punchy paragraphs, 800-1200 words). Always end with a one-paragraph CTA pointing to lazyunicorn.ai. Return only valid JSON, no preamble, no markdown code fences, no other text.`;

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

async function callLovableAI(apiKey: string, topic: string): Promise<string> {
  const response = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: topic },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Lovable AI ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Lovable AI");
  return text;
}

function parseJson(raw: string) {
  let str = raw.trim();
  const match = str.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) str = match[1].trim();
  return JSON.parse(str);
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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const topic = TOPIC_SEEDS[Math.floor(Math.random() * TOPIC_SEEDS.length)];

    // Call Lovable AI with one retry on parse failure
    let post: { title: string; slug: string; excerpt: string; body: string };
    let raw = await callLovableAI(LOVABLE_API_KEY, topic);

    try {
      post = parseJson(raw);
    } catch {
      console.warn("Parse failed, retrying...");
      raw = await callLovableAI(LOVABLE_API_KEY, topic);
      try {
        post = parseJson(raw);
      } catch (secondErr) {
        await supabase.from("blog_errors").insert({
          error_message: `Parse failed twice: ${secondErr.message}. Raw: ${raw.slice(0, 500)}`,
        });
        throw new Error("JSON parse failed after retry");
      }
    }

    // Split body into paragraphs for content text[] column
    const paragraphs: string[] = post.body
      .split(/\n\n+/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    // Deduplicate slug
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

    console.log(`Queued: ${data.title}`);

    return new Response(JSON.stringify({ success: true, post: data }), {
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
