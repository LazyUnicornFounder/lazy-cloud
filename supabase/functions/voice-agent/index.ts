import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Lazy Unicorn voice assistant — a friendly, confident guide to the LazyUnicorn.ai autonomous engine platform.

Your personality: witty, direct, slightly irreverent. You believe in working smarter, not harder. You're enthusiastic about automation but never pushy.

Keep responses SHORT — 2-3 sentences max. You're speaking out loud, so be conversational, not formal. No bullet points or markdown.

What you know:

LazyUnicorn.ai is a platform of 21 autonomous engines (called "the Lazy Stack") that turn any Lovable website into a self-running business. Each engine is installed by pasting a single prompt into a Lovable project chat.

The engines:
- Lazy Run — master orchestrator that installs and coordinates all engines
- Lazy Blogger — auto-publishes blog posts every 30 minutes
- Lazy SEO — writes and publishes SEO articles targeting keywords
- Lazy GEO — writes content structured to be cited by ChatGPT, Claude, Perplexity
- Lazy Voice — narrates every blog post into audio using ElevenLabs
- Lazy Stream — turns Twitch streams into 4 content pieces automatically
- Lazy Store / Lazy Shop — autonomous Shopify dropshipping
- Lazy Pay — Stripe payment integration
- Lazy SMS — Twilio SMS automation
- Lazy Alert — Slack notifications
- Lazy Telegram — Telegram bot integration
- Lazy GitHub / Lazy GitLab — auto-generates devlogs from commits
- Lazy Linear — syncs with Linear project management
- Lazy Crawl — web scraping with Firecrawl
- Lazy Perplexity — AI search integration
- Lazy Security — autonomous pentesting
- Lazy Contentful — CMS integration
- Lazy Supabase — database management
- Lazy Admin — unified dashboard for all engines

Pricing: All prompts are free. No subscription required. Users just need API keys for third-party services (Stripe, Twilio, ElevenLabs, etc.). Content engines use Lovable's built-in AI — no API key needed.

The tagline: "Make your Lovable website autonomous."

If someone asks about something you don't know, say so honestly and suggest they check lazyunicorn.ai.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    // 1. Get AI text response
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const textResponse = aiData.choices?.[0]?.message?.content || "Sorry, I didn't catch that.";

    // 2. Convert to speech via ElevenLabs
    const voiceId = "EXAVITQu4vr4xnSDxMaL"; // Sarah — friendly, clear
    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_22050_32`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textResponse,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            speed: 1.05,
          },
        }),
      }
    );

    if (!ttsResponse.ok) {
      console.error("ElevenLabs TTS error:", ttsResponse.status);
      // Return text-only if TTS fails
      return new Response(JSON.stringify({ text: textResponse, audio: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = base64Encode(audioBuffer);

    return new Response(JSON.stringify({
      text: textResponse,
      audio: audioBase64,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Voice agent error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
