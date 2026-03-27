import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYSE_SYSTEM = `You are an automation strategist for LazyUnicorn.ai — a platform of 21 autonomous engines for Lovable sites. The engines are: Lazy Blogger (publishes blog posts automatically), Lazy SEO (discovers keywords and publishes ranking articles), Lazy GEO (publishes content cited by ChatGPT and Perplexity), Lazy Crawl (monitors competitors with Firecrawl), Lazy Perplexity (researches the niche with live web data), Lazy Store (discovers products and runs promotions), Lazy Pay (Stripe payments that optimise themselves), Lazy SMS (Twilio SMS sequences that improve themselves), Lazy Mail (subscriber capture, welcome sequences, and AI newsletters via Resend), Lazy Voice (narrates every post via ElevenLabs), Lazy Stream (turns Twitch streams into articles), Lazy GitHub (turns commits into changelogs), Lazy GitLab (same for GitLab), Lazy Linear (turns Linear cycles into product updates), Lazy Alert (Slack alerts for every engine event), Lazy Telegram (same for Telegram), Lazy Contentful (two-way CMS sync), Lazy Supabase (database milestone posts), Lazy Security (automated Aikido pentests), Lazy Run (installs and orchestrates all engines), Lazy Admin (unified dashboard). Given a business idea, identify which engines are most relevant and explain specifically how each one would help this exact business.`;

const ANALYSE_USER = (idea: string) =>
  `Business idea: ${idea}. Return only a valid JSON array where each item has: engine_name (string — exact engine name from the list), relevance (string — high, medium, or low), headline (string — one punchy line explaining what this engine does for THIS specific business, written in second person e.g. "Your streams become SEO articles automatically"), description (string — 2 sentences explaining specifically how this engine helps this business), questions (array of 2 to 3 strings — clarifying questions to ask the user if they select this engine, specific to their business type). Order by relevance descending. Include only engines with high or medium relevance. No preamble. No code fences. Valid JSON array only.`;

const GENERATE_SYSTEM = `You are a Lovable prompt engineer specialising in autonomous business systems. You write complete, specific, immediately-pasteable prompts that install autonomous engines into existing Lovable projects. You write in clear direct English. You always specify exact database table names, edge function names, and cron schedules. You never use placeholder text — everything in the prompt is specific to the user's actual business. You follow the LazyUnicorn SPEC: all API keys stored as Supabase secrets via Deno.env.get(), never in the database. All dashboards redirect to /admin. Every setup page writes prompt_version to the settings table on submit. Edge functions use short names matching the LazyUnicorn naming convention.`;

const GENERATE_USER = (data: {
  idea: string;
  brandName: string;
  audience: string;
  siteUrl: string;
  engines: string[];
  answers: Record<string, Record<string, string>>;
}) =>
  `Generate a complete Lovable prompt to install the following autonomous engines into an existing Lovable project. Business idea: ${data.idea}. Brand name: ${data.brandName}. Target audience: ${data.audience}. Site URL: ${data.siteUrl}. Selected engines: ${data.engines.join(", ")}. Configuration answers per engine: ${JSON.stringify(data.answers)}. Write a single cohesive prompt that installs all selected engines. Include for each engine: the exact database tables with all fields, the setup page at /lazy-[engine]-setup with the correct fields pre-informed by the user answers, the edge functions with exact cron schedules and logic, and the public pages. The prompt should be immediately pasteable into a Lovable project with no editing required. Write it as direct instructions to Lovable in second person. Start with: Add the following autonomous engines to this Lovable project for ${data.brandName} — `;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode } = body;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt: string;
    let userMessage: string;

    if (mode === "analyse") {
      const { idea } = body;
      if (!idea || typeof idea !== "string" || idea.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Please provide a business idea." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      systemPrompt = ANALYSE_SYSTEM;
      userMessage = ANALYSE_USER(idea.trim());
    } else if (mode === "generate") {
      const { idea, brandName, audience, siteUrl, engines, answers } = body;
      if (!idea || !engines?.length) {
        return new Response(JSON.stringify({ error: "Missing required fields." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      systemPrompt = GENERATE_SYSTEM;
      userMessage = GENERATE_USER({ idea, brandName, audience: audience || "", siteUrl: siteUrl || "", engines, answers: answers || {} });
    } else {
      return new Response(JSON.stringify({ error: "Invalid mode. Use 'analyse' or 'generate'." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
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
    const content = data.choices?.[0]?.message?.content ?? "";

    if (mode === "analyse") {
      // Parse JSON array from response
      let engines;
      try {
        // Strip code fences if present
        const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        engines = JSON.parse(cleaned);
      } catch {
        console.error("Failed to parse engines JSON:", content);
        return new Response(JSON.stringify({ error: "Failed to parse automation analysis. Please try again." }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ engines }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ prompt: content }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("lazy-launch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
