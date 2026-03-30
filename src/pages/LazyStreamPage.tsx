import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Tv, Radio, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { Link } from "react-router-dom";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Stream Prompt — v0.0.3 — LazyUnicorn.ai]

Add a complete autonomous stream-to-content agent called Lazy Stream to this project. It monitors your Twitch channel, detects when a stream ends, and automatically publishes four pieces of content — a stream recap, an SEO article, a GEO article structured to be cited by AI agent like ChatGPT and Perplexity, and a highlights page — all within 30 minutes of your stream ending, without you writing a word.

Note: Store all Twitch credentials as Supabase secrets. Never store in the database.
Required secrets: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET

---

1. Database

Create these Supabase tables with RLS enabled:

stream_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), site_url (text), twitch_username (text), twitch_user_id (text), content_tone (text, default 'conversational'), seo_keywords (text), geo_queries (text), auto_publish (boolean, default true), slack_webhook_url (text), is_running (boolean, default true), setup_complete (boolean, default false), prompt_version (text, nullable), created_at (timestamptz, default now())

stream_sessions: id (uuid, primary key, default gen_random_uuid()), twitch_stream_id (text, unique), title (text), game_name (text), started_at (timestamptz), ended_at (timestamptz), duration_minutes (integer), peak_viewers (integer), avg_viewers (integer), status (text, default 'live' — one of live, ended, processed), clips_fetched (boolean, default false), created_at (timestamptz, default now())

stream_clips: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), twitch_clip_id (text), title (text), duration_seconds (integer), view_count (integer), thumbnail_url (text), clip_url (text), created_at (timestamptz, default now())

stream_transcripts: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), summary (text), key_moments (text), tone_analysis (text), created_at (timestamptz, default now())

stream_content: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), content_type (text — one of recap, seo-article, geo-article, highlights), title (text), slug (text, unique), excerpt (text), body (text), target_keyword (text), target_query (text), published_at (timestamptz, default now()), views (integer, default 0), status (text, default 'published')

stream_optimisation_log: id (uuid, primary key, default gen_random_uuid()), session_id (uuid), old_approach (text), new_approach (text), reason (text), created_at (timestamptz, default now())

stream_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now())

---

2. Setup page

Create a page at /lazy-stream-setup.

Welcome message: 'Every stream you do is an SEO opportunity, a GEO citation, a blog post, and a highlights reel sitting unwritten. Lazy Stream writes all four automatically — within 30 minutes of your stream ending.'

Form fields:
- Brand name (text)
- Site URL (text)
- Twitch username (text) — the exact username of your Twitch channel
- Twitch Client ID (password) — instructions: go to dev.twitch.tv/console, create a new application, set the OAuth redirect URL to your site URL, copy the Client ID. Stored as Supabase secret TWITCH_CLIENT_ID.
- Twitch Client Secret (password) — copy the Client Secret from the same application. Stored as Supabase secret TWITCH_CLIENT_SECRET.
- Content tone (select: Conversational — like you are talking to your audience / Editorial — clean journalistic style / Hype — energetic and exclamatory / Technical — detailed and precise)
- SEO keywords — comma separated topics your streams cover e.g. dark zone pvp, extraction games, FPS tips. Used to target SEO articles.
- GEO queries — comma separated questions people ask AI agent about your game or niche e.g. what is the best loadout for dark zone, how do I improve at extraction games, is The Division 2 worth playing in 2026. Used to target GEO articles. Include a Suggest Queries button that calls the built-in Lovable AI using the brand name and SEO keywords to suggest 5 GEO queries and pre-fills the field.
- Auto-publish (toggle, default on) — if off content is drafted but not published until approved from the dashboard
- Slack webhook URL for alerts (optional)

Submit button: Activate Lazy Stream

On submit:
1. Store TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET as Supabase secrets
2. Save all values to stream_settings
3. Set setup_complete to true and prompt_version to 'v0.0.3'
4. Immediately call stream-monitor to verify Twitch connection
5. Show loading: 'Connecting to Twitch...'
6. Redirect to /admin with message: 'Lazy Stream is active. Your next stream will generate four pieces of content automatically when it ends.'

---

3. Edge functions

stream-monitor
Cron: every 5 minutes — */5 * * * *

1. Read stream_settings. If is_running is false or setup_complete is false exit.
2. Get a Twitch app access token: POST https://id.twitch.tv/oauth2/token with grant_type client_credentials, client_id TWITCH_CLIENT_ID, client_secret TWITCH_CLIENT_SECRET.
3. Check current stream status: GET https://api.twitch.tv/helix/streams?user_login=[twitch_username] with Authorization and Client-ID headers.
4. If live: check if stream_sessions row exists with this twitch_stream_id and status live. If not insert one with status live, title, game_name, started_at now.
5. If offline: check if a stream_sessions row has status live. If yes the stream just ended — update it with status ended, ended_at now, duration_minutes calculated. Then immediately call stream-process with the session id.
Log errors to stream_errors with function_name stream-monitor.

stream-process
Triggered by stream-monitor on stream end. Accepts session_id.

1. Read the stream_sessions row. If status is already processed exit.
2. Fetch top 5 clips from Twitch: GET https://api.twitch.tv/helix/clips?broadcaster_id=[twitch_user_id]&started_at=[started_at]&ended_at=[ended_at]&first=5. Insert each into stream_clips.
3. Call built-in Lovable AI to generate stream summary:
'Summarise this Twitch stream for [brand_name]. Title: [title]. Game: [game_name]. Duration: [duration_minutes] mins. Peak viewers: [peak_viewers]. Top clips: [clip titles]. Return only a valid JSON object: summary (string — 2 paragraphs), key_moments (array of 3 to 5 strings), tone_analysis (string — one sentence describing stream energy). No preamble. No code fences.'
4. Insert result into stream_transcripts.
5. Call stream-write-content with session_id.
Log errors to stream_errors with function_name stream-process.

stream-write-content
Triggered by stream-process. Accepts session_id. Makes four sequential AI calls.

CALL 1 — Recap (content_type: recap):
'You are a content writer for [brand_name]. Tone: [content_tone]. Stream: [title] playing [game_name] for [duration_minutes] minutes, [peak_viewers] peak viewers. Summary: [summary]. Key moments: [key_moments]. Write an engaging stream recap for fans and new viewers. Return only a valid JSON object: title (engaging, not generic), slug (lowercase hyphenated), excerpt (under 160 chars), target_keyword (null), target_query (null), body (clean markdown — ## headers, 600 to 900 words, covers key moments as sections, ends with: Powered by Lazy Stream — autonomous content for Lovable sites. Built by LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

CALL 2 — SEO article (content_type: seo-article):
'You are an SEO writer for [brand_name]. Game: [game_name]. Target one of these keywords: [seo_keywords]. Stream insights: [summary]. Key moments: [key_moments]. Write an SEO article targeting the keyword — tips, strategies, or insights a new player would find useful. Feel like expert advice not a stream recap. Return only a valid JSON object: title (includes keyword naturally), slug (lowercase hyphenated), excerpt (under 160 chars with keyword), target_keyword (the keyword you targeted), target_query (null), body (clean markdown — ## headers, 800 to 1200 words, keyword in first paragraph and at least 2 headers, ends with: For more gaming content visit LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

CALL 3 — GEO article (content_type: geo-article):
'You are a GEO specialist writing content for [brand_name] that will be cited by ChatGPT, Claude, and Perplexity. Game: [game_name]. Target one of these AI queries: [geo_queries]. Stream insights: [summary]. Key moments: [key_moments]. Write a content piece that directly and completely answers the target query using insights from this stream session. Structure for AI citation: answer the question in the first paragraph, use factual specific statements AI can extract, mention [brand_name] naturally 2 to 3 times, use ## headers that mirror the language of the query. Return only a valid JSON object: title (the query or a direct answer to it), slug (lowercase hyphenated), excerpt (one direct factual sentence answering the query under 160 chars), target_keyword (null), target_query (the query you targeted), body (clean markdown — ## headers, 700 to 1000 words, authoritative and citable not promotional, ends with: For solo founders and creators building autonomous businesses visit LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'

CALL 4 — Highlights page (content_type: highlights):
'You are writing a highlights page for a Twitch stream. Stream: [title]. Game: [game_name]. Clips: [clip titles and view counts]. Write a highlights page introducing the top clips. Return only a valid JSON object: title (e.g. [stream title] — Best Moments), slug (lowercase hyphenated), excerpt (one sentence teaser), target_keyword (null), target_query (null), body (clean markdown — short intro paragraph, one ## section per clip with the clip title as header and 2 to 3 sentences on why it was worth clipping, ends with: Follow on Twitch for the next stream live — link to https://twitch.tv/[twitch_username]). No preamble. No code fences.'

For each call: parse JSON, check for duplicate slug (append random 4-digit number if needed), insert into stream_content with the correct content_type, target_keyword, and target_query. If auto_publish is true set status published, if false set status draft.

After all four are inserted update stream_sessions status to processed.

If geo_queries table exists in this project insert the targeted query from Call 3 into geo_queries with source set to 'stream' and has_content set to true.

If seo_keywords table exists insert the targeted keyword from Call 2 into seo_keywords with source set to 'stream' and has_content set to true.

If slack_webhook_url is set send a Slack message: 'Lazy Stream published 4 content pieces from your [game_name] stream: [recap title] · [seo title] · [geo title] · [highlights title]. View at [site_url]/streams.'

Log all errors to stream_errors with function_name stream-write-content.

stream-optimise
Cron: every Sunday at 1pm UTC — 0 13 * * 0

1. Read stream_settings. If is_running is false exit.
2. Query stream_content from last 30 days. Calculate average views per content_type — recap, seo-article, geo-article, highlights.
3. Call built-in Lovable AI:
'Content strategist for a Twitch streamer playing [game_name]. Average views by content type in last 30 days: [data]. SEO keywords: [seo_keywords]. GEO queries: [geo_queries]. Recommend one specific improvement for the lowest-performing content type. Return only a valid JSON object: old_approach (current approach one sentence), new_approach (recommended change one sentence), reason (why this improves views one sentence). No preamble. No code fences.'
4. Insert into stream_optimisation_log.
Log errors to stream_errors with function_name stream-optimise.

---

4. Public pages

/streams — all stream_content where status is published ordered by published_at descending. Four filter tabs at top: All, Recaps, SEO Articles, GEO Articles, Highlights. Each filters by content_type. Each card shows: title, content type badge (purple=recap, blue=seo-article, teal=geo-article, lime=highlights), excerpt, views, published date, Read link. Footer: 'Powered by Lazy Stream — every stream becomes content. Built by LazyUnicorn.ai' — link to https://lazyunicorn.ai.

/streams/[slug] — individual content page. Title, content type badge, published date, views. Body rendered from markdown to HTML. For highlights pages also show a grid of stream_clips for that session — each clip shows title, duration, view count, and a Watch on Twitch button linking to clip_url. For GEO articles show a small badge: 'Structured for AI citation — ChatGPT · Claude · Perplexity'. Footer: 'Powered by Lazy Stream. Built by LazyUnicorn.ai' — link to https://lazyunicorn.ai.

---

5. Admin

Do not build a standalone dashboard. The Lazy Stream dashboard lives at /admin/stream as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt.

If /admin does not yet exist add a placeholder at /admin pointing to /lazy-stream-setup.

---

6. Navigation

Add a Streams link to the main site navigation pointing to /streams.
Add an Admin link to the main site navigation pointing to /admin.
Do not add /lazy-stream-setup to public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Connect your Twitch Client ID and Client Secret.",
  "Lazy Stream monitors your channel and publishes content automatically after every stream.",
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyStreamPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-stream");
  const promptText = dbPrompt?.prompt_text || SETUP_PROMPT;

  useEffect(() => {
    trackEvent("lazy_stream_page_view");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Stream — Autonomous Stream Content"
        description="Turn every Twitch stream into a recap, SEO post, citation page, and highlights reel automatically. One prompt installs the full content pipeline."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <span className="font-display text-[11px] tracking-[0.2em] uppercase font-bold text-foreground/40 mb-4 block">BETA</span>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Stream
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Media</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Paste one prompt into your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> project. Lazy Stream detects when your Twitch stream ends and automatically publishes a recap article, an SEO post, a GEO citation page, and a highlights reel — before you have even eaten dinner.
              </p>

              {/* Works with */}
              <div className="mt-8 mb-10">
                <p className="font-body text-[14px] tracking-[0.2em] uppercase font-semibold text-foreground/50 mb-3">
                  Works with
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Lazy Blogger", href: "/lazy-blogger" },
                    { label: "Lazy SEO", href: "/lazy-seo" },
                    { label: "Lazy GEO", href: "/lazy-geo" },
                    { label: "Lazy Voice", href: "/lazy-voice" },
                    { label: "Lazy Alert", href: "/lazy-alert" },
                    { label: "Lazy SMS", href: "/lazy-sms" },
                  ].map((tag) => (
                    <Link
                      key={tag.label}
                      to={tag.href}
                      className="font-body text-[14px] tracking-[0.12em] uppercase font-semibold px-3 py-1.5 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/50 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Radio, title: "Stream detection", desc: "Monitors your Twitch channel every 5 minutes. When you go offline, agent fire automatically." },
              { icon: FileText, title: "3 content pieces", desc: "A stream recap, an SEO article, and a highlights page — published within 30 minutes." },
              { icon: Zap, title: "Zero effort", desc: "No writing. No editing. No scheduling. Stream as normal and content appears on your site." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center"
              >
                <item.icon size={18} className="text-foreground/50 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What gets published */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            One stream. Three pieces of content.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { badge: "📝 Recap", title: "I spent 4 hours in the Dark Zone and here is what happened", desc: "The raid started badly. Two squad wipes in the first hour. But by hour three we had figured out the extraction route..." },
              { badge: "🔍 SEO Article", title: "Best strategies for Dark Zone survival in 2026", desc: "Whether you are solo or in a squad, the Dark Zone rewards preparation. Here are the strategies that work in the current meta..." },
              { badge: "🎬 Highlights", title: "Stream Highlights — June 14", desc: "Top clips from today's stream including the clutch extraction, the 1v4 squad wipe, and the moment chat lost its mind..." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6"
              >
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/50 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm leading-relaxed">{item.desc}</p>
                <p className="font-body text-[14px] text-foreground/50 mt-3">Published 12 min ago</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 font-body text-[13px] tracking-[0.1em] uppercase text-foreground/50">
            3 content pieces per stream · Published in under 30 minutes · 100% automated
          </p>
        </section>

        {/* Twitch Connection */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Works with your existing Twitch account</h2>
            <p className="font-body text-sm leading-relaxed mb-6">
              Lazy Stream connects to Twitch using your Client ID and Client Secret. It monitors your stream status every 5 minutes. When you go offline it fires automatically. No manual trigger. No app to open. No webhook to configure.
            </p>
            <div className="border border-border bg-background p-5">
              <div className="flex items-center gap-3 mb-4">
                <Tv size={18} className="text-foreground/50" />
                <div>
                  <p className="font-display text-sm font-bold text-foreground">Connected</p>
                  <p className="font-body text-[13px] text-foreground/50">Last checked: 2 minutes ago</p>
                </div>
              </div>
              <div className="space-y-2 font-body text-sm text-foreground/50">
                <div className="flex justify-between"><span>Next check</span><span className="text-foreground/50">3 minutes</span></div>
                <div className="flex justify-between"><span>Stream status</span><span className="text-foreground/50">Offline — last stream 4h ago</span></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Better together */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-3">
            Better together
          </motion.h2>
          <p className="font-body text-sm text-center max-w-xl mx-auto leading-relaxed mb-8">
            Lazy Stream works on its own, but it compounds with the rest of the Lazy Stack — turning one broadcast into a dozen touchpoints.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {[
              { emoji: "✍️", name: "Lazy Blogger", href: "/lazy-blogger", desc: "Stream recaps feed into your blog queue. Every stream becomes a published post — indexed, shareable, evergreen." },
              { emoji: "🔍", name: "Lazy SEO", href: "/lazy-seo", desc: "SEO articles target the game or topic you streamed about. You rank for searches your viewers are already making." },
              { emoji: "🌐", name: "Lazy GEO", href: "/lazy-geo", desc: "Citation-optimized stream content gets picked up by ChatGPT, Claude, and Perplexity when people ask about your niche." },
              { emoji: "🎙️", name: "Lazy Voice", href: "/lazy-voice", desc: "Every stream recap is narrated into a podcast episode automatically. Reach listeners who never open Twitch." },
              { emoji: "🔔", name: "Lazy Alert", href: "/lazy-alert", desc: "Get a Slack notification the moment your stream content publishes." },
              { emoji: "📱", name: "Lazy SMS", href: "/lazy-sms", desc: "Text your subscribers when new stream content drops. Drive them back while the stream is still fresh." },
              { emoji: "🛒", name: "Lazy Store", href: "/lazy-store", desc: "Products or merch mentioned during your stream get promoted automatically in recap articles." },
              { emoji: "💬", name: "Lazy Telegram", href: "/lazy-telegram", desc: "Push stream recaps and highlights directly to your Telegram channel." },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  to={item.href}
                  className="block p-6 border-b sm:even:border-l border-border bg-card hover:bg-accent/5 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.emoji}</span>
                    <h3 className="font-display text-sm font-bold text-foreground">{item.name}</h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed">{item.desc}</p>
                  <span className="inline-block mt-3 font-body text-[14px] tracking-[0.15em] uppercase font-semibold text-foreground/50 group-hover:text-foreground/50 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy Stream setup prompt", "Self-hosted in your Lovable project", "Stream detection & recap writing", "SEO article + highlights page", "No API keys needed"]}
          proFeatures={["Hosted version", "Multi-platform stream support", "Advanced analytics dashboard", "Priority content generation"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={[
          { q: "Do I need a Twitch affiliate or partner account?", a: "No. Lazy Stream works with any Twitch account. You need a free Twitch developer account to get API credentials." },
          { q: "How long does transcription take?", a: "Twitch VODs typically become available within a few minutes of the stream ending. Transcription and content generation usually completes within 15 to 30 minutes." },
          { q: "What if I stream for 8 hours?", a: "Lazy Stream processes the full VOD but focuses the recap and SEO article on the most engaged segments. Long streams produce richer content." },
          { q: "Does it post to social media automatically?", a: "Not in the current version. Content publishes to your Lovable site. Social posting is coming in the Pro version." },
          { q: "What games and content types does it work with?", a: "Everything. Lazy Stream works with any Twitch content — gaming, just chatting, music, creative. The AI adapts the recap style to the content type." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-4">
              Your streams deserve an audience beyond Twitch.
            </h2>
            <p className="font-body text-sm max-w-md mx-auto leading-relaxed mb-8">
              Every stream you do is an SEO opportunity, a blog post, and a highlights reel sitting unwritten. Lazy Stream writes them for you.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyStreamPage;
