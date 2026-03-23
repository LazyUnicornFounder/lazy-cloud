import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are a senior editorial writer for Lazy Unicorn — a publication covering the rise of autonomous capitalism and recursive startups (companies that improve their own ability to improve themselves).

Your writing style:
- Bold, opinionated, and intellectually rigorous
- Mix of narrative journalism and sharp analysis
- Reference real trends in AI agents, autonomous companies, and the future of work
- Mention companies like Polsia, Naïve, and other autonomous company tools naturally
- Use concrete numbers and examples when possible
- Write in a voice that's confident but not arrogant, provocative but not clickbait
- Each post should feel like it belongs in a premium tech publication

Output format: Return valid JSON with this exact structure:
{
  "title": "Post title (compelling, specific, under 80 chars)",
  "slug": "kebab-case-url-slug",
  "excerpt": "1-2 sentence hook that makes readers want to click (under 200 chars)",
  "content": ["paragraph 1", "paragraph 2", ...],
  "readTime": "X min read"
}

Content should be 6-12 paragraphs. Use <strong> tags for emphasis. Include relevant links using <a> tags where natural.`;

const TOPIC_PROMPTS = [
  "Write about a specific trend you're seeing in autonomous companies right now — something most people haven't noticed yet.",
  "Profile a hypothetical new autonomous startup tool and analyze what it means for the space.",
  "Write a think piece about what happens to traditional employment when autonomous companies become the default.",
  "Analyze the economics of autonomous companies — why $49/month for a full business stack changes everything.",
  "Write about the concept of recursive startups — companies that improve their own ability to improve themselves.",
  "Explore what venture capital looks like when any founder can run a company with zero employees.",
  "Write about the trust problem — when should you let AI agents make real business decisions?",
  "Analyze the competitive dynamics between autonomous company platforms like Polsia and Naïve.",
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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Pick a random topic
    const topic = TOPIC_PROMPTS[Math.floor(Math.random() * TOPIC_PROMPTS.length)];

    // Generate blog post using Lovable AI
    const aiResponse = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("Lovable AI error:", aiResponse.status, errText);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted, please add funds in Settings > Workspace > Usage" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`Lovable AI error: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("No content from Lovable AI");

    // Parse JSON from the response (handle markdown code blocks)
    let jsonStr = rawContent;
    const codeBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    const post = JSON.parse(jsonStr);

    // Ensure unique slug by appending timestamp
    const timestamp = Date.now();
    const slug = `${post.slug}-${timestamp}`;

    // Insert as draft (requires admin approval)
    const { data, error } = await supabase.from("blog_posts").insert({
      slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      read_time: post.readTime || "5 min read",
      status: "draft",
    }).select().single();

    if (error) throw error;

    console.log("Generated blog post via Lovable AI:", data.title);

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
