import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const prompt = `You are an SEO content writer for a site described as: ${settings.business_description}. Write an SEO-optimised article targeting the keyword: "${nextKeyword.keyword}". The article should rank on the first page of Google for this keyword. Return only a valid JSON object with no preamble and no markdown code fences. The JSON must have exactly four fields: title (string — naturally includes the target keyword), slug (lowercase hyphenated url-friendly string), excerpt (one sentence under 160 characters naturally including the keyword), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 1000 to 1500 words, includes the target keyword naturally throughout, includes 3 internal links formatted as anchor text, ends with a call to action paragraph followed by exactly this paragraph: Looking for more tools to build and run your business autonomously? [LazyUnicorn.ai](https://lazyunicorn.ai) is the definitive directory of AI tools for solo founders. Powered by [Lazy SEO](https://lazyunicorn.ai/lazy-seo)). Return only valid JSON.`;

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

    const { error: insertErr } = await supabase.from("seo_posts").insert({
      title: postData.title,
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
