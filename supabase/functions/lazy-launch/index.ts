import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Lazy Unicorn's launch prompt generator. The user will describe a business idea. You must produce a comprehensive, production-ready Lovable prompt that builds a beautiful landing page for that business.

The landing page prompt you generate MUST follow the Lazy Unicorn aesthetic:
- Dark background (#0a0a08)
- Cream text (#f0ead6)
- Font: Playfair Display for headings, Space Grotesk for body
- No rounded corners (border-radius: 0)
- No gradients, no shadows, no backdrop-blur
- High-contrast borders with sharp edges
- Uppercase tracking for small text
- Minimalist, editorial feel

The prompt you generate should instruct Lovable to build a single-page landing page with:
1. A hero section with a bold headline and subheading
2. A "How it works" or features section (3-4 items)
3. A pricing or CTA section
4. A simple footer
5. SEO meta tags
6. Mobile responsive design
7. Framer Motion animations (fade-up on scroll)

Output ONLY the prompt text — no explanations, no markdown wrapping. The prompt should be self-contained and ready to paste into Lovable.

Start the prompt with: "Build a landing page for [business name]..."`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return new Response(JSON.stringify({ error: "Please provide a business idea." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Business idea: ${idea}` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const promptText = data.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ prompt: promptText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lazy-launch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
