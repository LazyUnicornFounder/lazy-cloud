import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find recent blog posts that haven't been repurposed
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt, content, slug")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(5);

    if (!posts || posts.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, message: "No posts to repurpose" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const repurposed: string[] = [];

    for (const post of posts.slice(0, 2)) {
      // Check if already repurposed
      try {
        const { count } = await supabase
          .from("repurpose_output")
          .select("*", { count: "exact", head: true })
          .eq("source_id", post.id);
        if (count && count > 0) continue;
      } catch { /* table may not exist */ }

      // Generate repurposed content using AI
      const aiRes = await fetch("https://api.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: "Repurpose this blog post into a Twitter thread (5 tweets) and a LinkedIn post. Return JSON: { twitter_thread: string[], linkedin_post: string }",
            },
            { role: "user", content: `Title: ${post.title}\nExcerpt: ${post.excerpt}\nContent: ${Array.isArray(post.content) ? post.content.join("\n") : post.content}` },
          ],
        }),
      });

      const aiData = await aiRes.json();
      const output = aiData.choices?.[0]?.message?.content ?? "";

      try {
        await supabase.from("repurpose_output").insert({
          source_id: post.id,
          source_type: "blog_post",
          source_title: post.title,
          output_content: output,
          status: "ready",
        });
        repurposed.push(post.title);
      } catch { /* table may not exist */ }
    }

    return new Response(
      JSON.stringify({ ok: true, repurposed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
