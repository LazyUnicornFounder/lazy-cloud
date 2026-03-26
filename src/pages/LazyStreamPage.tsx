import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Tv, Radio, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { Link } from "react-router-dom";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Stream Prompt — v0.0.4 — LazyUnicorn.ai]

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
prompt_version (text, nullable),
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
created_at (timestamptz, default now())`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Connect your Twitch Client ID and Client Secret.",
  "Lazy Stream monitors your channel and publishes content automatically after every stream.",
];

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyStreamPage = () => {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_stream_page_view");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Stream — Autonomous Twitch Content Engine for Lovable"
        description="One prompt turns every Twitch stream into a recap article, SEO post, GEO citation page, and highlights reel — automatically."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
                <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Stream
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                Paste one prompt into your Lovable project. Lazy Stream detects when your Twitch stream ends and automatically publishes a recap article, an SEO post, a GEO citation page, and a highlights reel — before you have even eaten dinner.
              </p>

              {/* Works with */}
              <div className="mt-8 mb-10">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-foreground/25 mb-3">
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
                      className="font-body text-[10px] tracking-[0.12em] uppercase font-semibold px-3 py-1.5 border border-border text-foreground/45 hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <CopyPromptButton />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Radio, title: "Stream detection", desc: "Monitors your Twitch channel every 5 minutes. When you go offline, engines fire automatically." },
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
                <item.icon size={18} className="text-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What gets published */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
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
                <p className="font-display text-[10px] tracking-[0.15em] uppercase font-bold text-foreground/40 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                <p className="font-body text-[10px] text-foreground/20 mt-3">Published 12 min ago</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 font-body text-[11px] tracking-[0.1em] uppercase text-foreground/25">
            3 content pieces per stream · Published in under 30 minutes · 100% automated
          </p>
        </section>

        {/* Twitch Connection */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Works with your existing Twitch account</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Lazy Stream connects to Twitch using your Client ID and Client Secret. It monitors your stream status every 5 minutes. When you go offline it fires automatically. No manual trigger. No app to open. No webhook to configure.
            </p>
            <div className="border border-border bg-background p-5">
              <div className="flex items-center gap-3 mb-4">
                <Tv size={18} className="text-foreground/40" />
                <div>
                  <p className="font-display text-sm font-bold text-foreground">Connected</p>
                  <p className="font-body text-[11px] text-foreground/30">Last checked: 2 minutes ago</p>
                </div>
              </div>
              <div className="space-y-2 font-body text-xs text-foreground/40">
                <div className="flex justify-between"><span>Next check</span><span className="text-foreground/60">3 minutes</span></div>
                <div className="flex justify-between"><span>Stream status</span><span className="text-foreground/30">Offline — last stream 4h ago</span></div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Better together */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-3">
            Better together
          </motion.h2>
          <p className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto leading-relaxed mb-8">
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
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  <span className="inline-block mt-3 font-body text-[10px] tracking-[0.15em] uppercase font-semibold text-foreground/20 group-hover:text-foreground/50 transition-colors">
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
          ctaButton={<CopyPromptButton className="w-full justify-center" />}
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
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Your streams deserve an audience beyond Twitch.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every stream you do is an SEO opportunity, a blog post, and a highlights reel sitting unwritten. Lazy Stream writes them for you.
            </p>
            <CopyPromptButton />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyStreamPage;
