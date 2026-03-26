import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a Lovable prompt engineer who specialises in building beautiful landing pages. You write Lovable prompts that produce stunning, conversion-optimised landing pages matching the LazyUnicorn design aesthetic: dark background (#0a0a0a), gold accents (#f5c842), high contrast white text, clean sans-serif typography, generous whitespace, subtle animations, and a premium feel. You write prompts that are specific, detailed, and produce great results on the first attempt. Never use generic placeholder text. Always ground the prompt in the specific business described.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description, targetAudience, pricing, cta, tone } = await req.json();

    if (!description || description.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Business description is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let userMessage = `Write a complete Lovable prompt to build a landing page for this business: ${description}.`;
    if (targetAudience) userMessage += ` Target audience: ${targetAudience}.`;
    if (pricing) userMessage += ` Pricing: ${pricing}.`;
    if (cta) userMessage += ` Primary CTA: ${cta}.`;
    if (tone) userMessage += ` Tone: ${tone}.`;

    userMessage += `

The prompt must specify:

The exact dark colour scheme: background #0a0a0a, accent gold #f5c842, white text

A hero section with a punchy headline (write the actual headline — do not use placeholders), subheadline, and primary CTA button

A problem section that names the pain this product solves

A features section with 3 to 6 specific features from the business description

Social proof section — testimonial cards even if placeholder, with realistic names and roles relevant to this audience

Pricing section if pricing was mentioned

A final CTA section

Footer with navigation

Subtle scroll animations using CSS — elements fade in as they enter the viewport

Mobile responsive

No stock photos — use emoji, geometric shapes, or abstract SVG illustrations as visual elements

Write the prompt in second person directed at Lovable. Start with: "Build a landing page for [business name or type]. Use these exact design specs:" then give complete, specific instructions. Write the actual copy — headlines, subheadlines, feature descriptions — do not use placeholders like [INSERT HEADLINE HERE]. Make the copy punchy and specific to this business. The prompt should be immediately pasteable into Lovable with no editing required.

Return only the prompt text. No preamble. No explanation. No markdown formatting around it.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content;

    if (!generatedPrompt) throw new Error("No content returned from AI");

    return new Response(JSON.stringify({ prompt: generatedPrompt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("lazy-launch-generate error:", e);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
