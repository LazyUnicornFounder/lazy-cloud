import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tv, Zap, FileText, Scissors, Search, MessageSquare, BarChart3, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `[Lazy Stream Prompt — v0.0.3 — LazyUnicorn.ai]

Add a complete autonomous Twitch content engine called Lazy Stream to this project. It monitors your Twitch channel, processes VODs, writes stream recaps, extracts clips, publishes SEO articles, tracks analytics, and improves its own content quality — all automatically with no manual input required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**stream_settings**
id (uuid, primary key, default gen_random_uuid()),
twitch_username (text),
twitch_user_id (text),
site_url (text),
business_name (text),
content_niche (text),
is_running (boolean, default true),
setup_complete (boolean, default false),
recap_template_guidance (text),
created_at (timestamptz, default now())

Note: Store Twitch credentials as Supabase secrets — TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET. Never store in the database table.

**stream_sessions**
id (uuid, primary key, default gen_random_uuid()),
twitch_stream_id (text, unique),
title (text),
game_name (text),
started_at (timestamptz),
ended_at (timestamptz),
duration_minutes (integer),
peak_viewers (integer),
average_viewers (integer),
status (text, default 'live'),
created_at (timestamptz, default now())

**stream_content**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid),
content_type (text),
title (text),
slug (text, unique),
excerpt (text),
body (text),
target_keyword (text),
published_at (timestamptz, default now()),
status (text, default 'published'),
views (integer, default 0),
created_at (timestamptz, default now())

**stream_clips**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid),
twitch_clip_id (text, unique),
title (text),
clip_url (text),
thumbnail_url (text),
view_count (integer),
duration_seconds (numeric),
published_at (timestamptz, default now()),
created_at (timestamptz, default now())

**stream_transcripts**
id (uuid, primary key, default gen_random_uuid()),
session_id (uuid, unique),
transcript_text (text),
word_count (integer),
processed_at (timestamptz, default now())

**stream_optimisation_log**
id (uuid, primary key, default gen_random_uuid()),
content_type (text),
old_template (text),
new_template (text),
trigger_reason (text),
optimised_at (timestamptz, default now())

**stream_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-stream-setup with a form:
- Twitch Client ID (text) — create an application at dev.twitch.tv/console. Stored as Supabase secret TWITCH_CLIENT_ID.
- Twitch Client Secret (password) — from the same Twitch developer application. Stored as Supabase secret TWITCH_CLIENT_SECRET.
- Twitch Username (your exact Twitch channel username)
- Content niche (what kind of content do you stream? e.g. gaming, just chatting, music, creative, educational)
- Business name
- Site URL

Submit button: Activate Lazy Stream

On submit:
1. Store TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET as Supabase secrets
2. Fetch Twitch user ID: call https://api.twitch.tv/helix/users with login=[username] using client credentials token. Store the user ID in twitch_user_id.
3. Save all other values to stream_settings
4. Set setup_complete to true
5. Redirect to /lazy-stream-dashboard with message: "Lazy Stream is active. Your next stream will be processed and published automatically when it ends."

---

## 3. Core edge functions

**stream-monitor**
Cron: every 5 minutes — */5 * * * *

1. Read stream_settings. If is_running is false or setup_complete is false exit.
2. Get Twitch access token via client credentials: POST to https://id.twitch.tv/oauth2/token using TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET secrets.
3. Call Twitch Streams API: https://api.twitch.tv/helix/streams?user_id=[twitch_user_id]
4. If a live stream is returned and no matching stream_session exists for twitch_stream_id: insert into stream_sessions with status live and stream details.
5. If no live stream is returned: check stream_sessions for any rows with status live. If found: update status to ended, set ended_at to now, call stream-process with that session_id.
Log errors to stream_errors with function_name stream-monitor.

**stream-process** — handles POST requests with session_id in body

1. Read stream_settings. Read matching stream_session.
2. Get Twitch access token.
3. Fetch VOD: https://api.twitch.tv/helix/videos?user_id=[twitch_user_id]&type=archive Find the VOD closest to the stream start time.
4. Fetch top clips: https://api.twitch.tv/helix/clips?broadcaster_id=[twitch_user_id]&started_at=[stream started_at]
5. Insert top 5 clips into stream_clips.
6. Call the built-in Lovable AI to generate a transcript summary:
"You are transcribing a Twitch stream titled [title] covering [game_name]. The top clips were titled: [clip titles]. Generate a detailed summary of what happened during this stream. Cover main topics, memorable moments, and key discussions. Write 500 to 800 words. Return only the summary text with no preamble."
7. Store in stream_transcripts.
8. Call stream-write-content with the session_id.
9. Update stream_sessions status to processed.
Log errors to stream_errors with function_name stream-process.

**stream-write-content** — handles POST requests with session_id in body

1. Read stream_settings, matching stream_session, and stream_transcripts row.
2. Make three AI calls:

Call 1 — recap:
"You are a content writer for [business_name] who streams [content_niche] on Twitch. Write an engaging stream recap for: title [title], game [game_name], summary [transcript_text]. Write 600 to 900 words in an enthusiastic conversational tone. Cover what happened, highlight moments, what to expect next. End with a call to action to follow on Twitch. Return only a valid JSON object: title (string), slug (lowercase hyphenated), excerpt (one sentence under 160 characters), body (clean markdown). No preamble. No code fences."

Call 2 — SEO article:
"You are an SEO content writer for [business_name]. Write an SEO-optimised article based on this Twitch stream. Game or topic: [game_name]. Stream summary: [transcript_text]. Target a keyword someone would search on Google related to this. Write 800 to 1200 words of genuinely useful content — tips, analysis, or commentary. End with: [business_name] streams [content_niche] live on Twitch. Follow at twitch.tv/[twitch_username] and discover more autonomous content tools at LazyUnicorn.ai — link LazyUnicorn.ai to https://lazyunicorn.ai. Return only a valid JSON object: title, slug, excerpt (under 160 chars), target_keyword, body (clean markdown). No preamble. No code fences."

Call 3 — highlights:
"Write a punchy highlights post for [business_name] based on these clip titles: [clip titles]. 200 to 300 words. Return only a valid JSON object: title, slug, excerpt (under 160 chars), body (clean markdown). No preamble. No code fences."

3. For each response: check for duplicate slug (append 4-digit number if exists), insert into stream_content with correct content_type (recap/seo-article/highlights).
Log errors to stream_errors with function_name stream-write-content.

---

## 4. Self-improving edge function

**stream-optimise**
Cron: every Sunday at 1pm UTC — 0 13 * * 0

1. Read stream_settings. If is_running is false exit.
2. Query stream_content where content_type is recap ordered by views descending. Take top 3 and bottom 3.
3. Call the built-in Lovable AI:
"You are a content strategist for [business_name] who streams [content_niche]. These recap posts perform well: [top performing titles and first 200 characters of body]. These perform poorly: [low performing titles and first 200 characters]. Identify what makes the high-performers better. Write improved guidance for future stream recaps. Return only the guidance text as a paragraph. No preamble."
4. Insert into stream_optimisation_log.
5. Update recap_template_guidance in stream_settings.
Log errors to stream_errors with function_name stream-optimise.

---

## 5. Public pages

**/streams**
Show all stream_sessions where status is processed ordered by started_at descending. Each row shows stream title, game, date, duration, and links to the recap, SEO article, and highlights for that session.

**/streams/[slug]**
Fetch matching stream_content row. Render full body as formatted HTML. Show title, content type tag, published date, full body. At bottom add: "🦄 Content by Lazy Stream — autonomous Twitch content publishing for Lovable sites. Built by LazyUnicorn.ai" — link to https://lazyunicorn.ai.

**/streams/highlights**
Show all stream_clips ordered by view_count descending. Each shows title, thumbnail image, view count, duration, Watch on Twitch link.

**/live**
If most recent stream_session has status live: show live banner with stream title, game, and Watch Live button linking to twitch.tv/[twitch_username].
If no live stream: show last stream date and Follow on Twitch button.

---

## 6. Admin dashboard

Create a page at /lazy-stream-dashboard.

Show at top: red error banner if stream_errors has rows from the last 24 hours.

Five sections:
- Overview: total streams processed, total content pieces, total clips saved, average views, live status (is the channel currently live?)
- Streams table: all stream_sessions with title, game, date, duration, status, links to published content
- Content table: all stream_content with title, type, published date, views
- Clips table: all stream_clips with title, view count, Watch link
- Controls: pause/resume toggle, Process Last Stream Now button, Optimise Content Now button, error log (last 10 stream_errors), link to /lazy-stream-setup

---

## 7. Navigation

Add a Streams link to the main site navigation pointing to /streams.
Add a Live link pointing to /live.
Do not add /lazy-stream-setup or /lazy-stream-dashboard to public navigation.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: Tv, title: "Live alerts", desc: "Your Lovable site shows a live badge automatically when you go live on Twitch." },
  { icon: FileText, title: "VOD transcription", desc: "Transcribes every stream using AI the moment the VOD becomes available." },
  { icon: Zap, title: "Stream recap", desc: "Writes a full blog post summarising each stream from the transcription automatically." },
  { icon: Scissors, title: "Clip extraction", desc: "Pulls your top clips from each stream and publishes them to a highlights page." },
  { icon: Search, title: "SEO articles", desc: "Writes a keyword-targeted SEO article from each stream targeting the topics and games you covered." },
  { icon: MessageSquare, title: "Chat highlights", desc: "Extracts the most engaged moments from chat and includes them in the recap." },
  { icon: BarChart3, title: "Viewer analytics", desc: "Tracks which streams drove the most site traffic and surfaces your best performing content." },
  { icon: Brain, title: "Self-improving content", desc: "Monitors which stream recaps get the most traffic and improves the writing template automatically week over week." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your Twitch credentials in the setup screen.",
  "Go live on Twitch as normal.",
  "Lazy Stream transcribes, writes, and publishes everything automatically when the stream ends.",
];

const faqs = [
  { q: "Do I need a Twitch affiliate or partner account?", a: "No. Lazy Stream works with any Twitch account. You need a free Twitch developer account to get API credentials." },
  { q: "How long does transcription take?", a: "Twitch VODs typically become available within a few minutes of the stream ending. Transcription and content generation usually completes within 15 to 30 minutes." },
  { q: "What if I stream for 8 hours?", a: "Lazy Stream processes the full VOD but focuses the recap and SEO article on the most engaged segments. Long streams produce richer content." },
  { q: "Does it post to social media automatically?", a: "Not in the current version. Content publishes to your Lovable site. Social posting is coming in the Pro version." },
  { q: "What games and content types does it work with?", a: "Everything. Lazy Stream works with any Twitch content — gaming, just chatting, music, creative. The AI adapts the recap style to the content type." },
];

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] bg-foreground text-background ${className}`}
    >
      {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyStreamPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Stream — Autonomous Twitch Content Engine for Lovable"
        description="One prompt turns every Twitch stream into a blog post, SEO article, and highlight reel — automatically."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
              <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Stream
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border text-foreground/25 text-xs font-body tracking-wide">
                <Tv size={14} />
                Powered by Twitch
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            Stream. Then do nothing. Lazy Stream handles the rest.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it installs */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>What it installs</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Hours of content. Zero post-production.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card p-8"
              >
                <f.icon size={20} className="text-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The content problem */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>The problem</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            You stream for hours. Your site gets nothing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Every stream is hours of content. Highlights, moments, tutorials, stories, commentary. Content that would rank on Google, drive traffic, and build an audience outside Twitch. Content that disappears the moment the stream ends because turning it into anything publishable requires time you do not have.
              </p>
            </div>
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Lazy Stream changes the economics. The stream ends. The engine starts. Transcription, recap, highlights, SEO article — all published to your Lovable site automatically before you have finished your post-stream routine. Your Twitch channel and your website compound together. One stream. Multiple pieces of permanent, indexed, searchable content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-improving */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Self-improving</p>
          <h2 className="mt-2 mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Stream recaps that get better every week without you.
          </h2>
          <p className="font-body text-sm text-foreground/50 leading-relaxed">
            Lazy Stream tracks which stream recaps drive the most traffic to your site. When it identifies patterns — stream length, topic, game, time of day — it adjusts the writing template automatically to produce more of what performs. The recaps get sharper. The SEO articles get better targeted. The highlights get more relevant. All without you changing a setting.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mt-8">
            {/* Free */}
            <div className="bg-card p-8 flex flex-col">
              <h3 className="font-display text-2xl font-bold text-foreground">Free</h3>
              <ul className="mt-6 space-y-3 flex-1">
                {["Lazy Stream setup prompt", "Self-hosted in your existing Lovable project", "Bring your own Twitch developer account", "Free to set up"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CopyPromptButton className="w-full justify-center" />
              </div>
            </div>
            {/* Pro */}
            <div className="bg-card p-8 flex flex-col border-l-2 border-yellow-600/40">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl font-bold text-foreground">Pro</h3>
                <span className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-yellow-600/40 text-yellow-600/70">Coming Soon</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground mt-2">$19<span className="text-base font-normal text-foreground/40">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Hosted version", "Automatic clip editing", "YouTube cross-posting", "Advanced stream analytics"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button disabled className="w-full font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/30 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>FAQ</p>
          <div className="mt-8 space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-b border-border py-6"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Your streams are content. Lazy Stream publishes them.
          </h2>
          <p className="mt-6 font-body text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
            Every hour you stream is an hour of blog posts, SEO articles, and highlights waiting to be published. One prompt installs the entire pipeline — transcription, writing, publishing — into your existing Lovable project.
          </p>
          <div className="mt-8">
            <CopyPromptButton />
          </div>
          <p className="mt-4 font-body text-xs text-foreground/25 max-w-md mx-auto leading-relaxed">
            Open your Lovable project, paste it into the chat, add your Twitch credentials. Your next stream will be published to your site automatically when it ends.
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
};

export default LazyStreamPage;
