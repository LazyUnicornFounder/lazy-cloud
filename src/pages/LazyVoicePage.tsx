import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import { motion } from "framer-motion";
import { Copy, Check, Mic, Headphones, Rss, Radio, Volume2, Play } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_VOICE_PROMPT = `Install Lazy Voice — an autonomous audio narration engine powered by ElevenLabs — into my existing Lovable project.

---

## Step 1: Ask me three setup questions

Before building anything, ask me these three questions one at a time:

1. What is your ElevenLabs API key? (Get one at elevenlabs.io)
2. Which ElevenLabs voice ID do you want to use? (Paste a voice ID or say "default" to use the Rachel voice)
3. Do you want to generate a podcast RSS feed at /listen? (yes/no)

---

## Step 2: Create the database

Create these Supabase tables with RLS enabled:

**voice_settings** — id, elevenlabs_api_key (stored as secret), voice_id, is_running boolean, rss_enabled boolean, created_at
**voice_episodes** — id, post_id (text), post_title, post_slug, audio_url, duration_seconds, status (pending/processing/published/error), source_table (blog_posts/seo_posts/geo_posts), created_at, published_at
**voice_errors** — id, error_message, post_id, created_at

---

## Step 3: Build the audio player component

Create a reusable AudioPlayer component that:
- Accepts an audio URL and title
- Shows play/pause, progress bar, duration, and speed controls
- Matches my existing site's design system
- Can be embedded at the top of any blog post page

Automatically inject this player into every blog post page, SEO post page, and GEO post page when a matching voice_episode with status 'published' exists.

---

## Step 4: Build the /listen page

Create a /listen page that:
- Lists every published voice_episode as a podcast feed
- Shows episode title, date, duration, and a play button
- Includes an inline audio player
- Has a link to the RSS feed
- Matches my existing site's design system

---

## Step 5: Build the narration engine

Create a Supabase edge function called voice-narrate:

- Query blog_posts, seo_posts, and geo_posts for any published post that does NOT have a matching voice_episode
- For each new post, send the post body to the ElevenLabs text-to-speech API using the configured voice_id
- Store the generated audio in Supabase Storage
- Insert a voice_episode record with the audio URL and status 'published'
- Log any errors to voice_errors
- Run every 30 minutes via pg_cron

---

## Step 6: Generate the RSS feed

Create a Supabase edge function called voice-rss:

- Query all published voice_episodes ordered by published_at desc
- Generate a valid podcast RSS 2.0 XML feed with iTunes tags
- Return the XML with proper content-type headers
- This feed can be submitted to Apple Podcasts and Spotify

---

## Step 7: Wire up the autonomous loop

Set up pg_cron to run voice-narrate every 30 minutes. The engine should:
- Detect every new blog post, SEO post, and GEO post automatically
- Generate audio and publish the episode without any manual intervention
- The entire pipeline runs forever after the initial setup

---

## Design rules

- Match my existing site's design system exactly
- Use my existing fonts, colors, spacing, and component patterns
- Use shadcn/ui components where appropriate
- All pages must be fully responsive

---

## Important

- Store the ElevenLabs API key as a Supabase secret, never in client code
- Use Lovable Cloud (Supabase) for all database, storage, and edge function needs
- Every engine must handle errors gracefully and log to voice_errors
- The entire system should run autonomously after the initial setup`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  variant = "primary",
}: {
  className?: string;
  onCopy: () => void;
  variant?: "primary" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(LAZY_VOICE_PROMPT);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy]);

  const base =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${base} ${className}`}
    >
      {copied ? (
        <><Check size={16} /> Copied ✓</>
      ) : (
        <><Copy size={16} /> Copy the Lovable Prompt</>
      )}
    </button>
  );
}

/* ── ElevenLabs badge ── */
function ElevenLabsBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide">
      <Volume2 size={14} />
      Powered by ElevenLabs
    </div>
  );
}

/* ── Steps data ── */
const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project.",
  "Add your ElevenLabs API key and choose your voice.",
  "Lazy Voice monitors every new post published by Lazy Blogger or Lazy SEO.",
  "Each post gets converted to audio and an audio player appears on the article automatically.",
];

/* ── Features data ── */
const features = [
  { icon: Play, title: "Audio on every post", desc: "An embedded audio player appears automatically at the top of every blog post the moment it publishes." },
  { icon: Mic, title: "Your voice", desc: "Clone your own voice in ElevenLabs once, and every post sounds like you narrated it personally." },
  { icon: Headphones, title: "A full podcast feed at /listen", desc: "Every narrated post in one place, presented as a podcast." },
  { icon: Rss, title: "RSS feed", desc: "Automatically submitted to Apple Podcasts, Spotify, and Google Podcasts. Your podcast grows without you recording anything." },
  { icon: Radio, title: "Works with Lazy Blogger and Lazy SEO", desc: "Monitors both engines and converts every post they publish automatically." },
  { icon: Volume2, title: "No editing, no recording, no uploading", desc: "The entire audio workflow runs without you." },
];

/* ── FAQ data ── */
const faqs = [
  { q: "Do I need a paid ElevenLabs account?", a: "The free tier works for basic voices. Voice cloning requires a paid ElevenLabs plan starting at $5/month." },
  { q: "Does it work without Lazy Blogger or Lazy SEO?", a: "Yes. Lazy Voice monitors your blog_posts table directly, so it works with any content publishing engine including manually published posts." },
  { q: "How long does audio generation take?", a: "ElevenLabs typically generates audio within 30 seconds per post. The player appears on the article automatically once the audio is ready." },
  { q: "Will my podcast appear on Spotify automatically?", a: "The RSS feed is generated automatically. Submitting it to Spotify and Apple Podcasts is a one-time manual step that takes five minutes. After that new episodes appear automatically." },
  { q: "Can I use a pre-built ElevenLabs voice instead of my own?", a: "Yes. Choose any ElevenLabs voice in the setup and every post gets narrated in that voice automatically." },
];

export default function LazyVoicePage() {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("page_view", { page: "/lazy-voice" });
  }, []);

  const handleCopy = () => trackEvent("copy_prompt", { product: "lazy-voice" });

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Lazy Voice — Autonomous Audio Narration for Every Blog Post"
        description="One prompt turns every blog post your Lovable site publishes into a narrated audio version automatically. Powered by ElevenLabs."
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ── HERO ── */}
        <section className="relative max-w-4xl mx-auto text-center px-6 pt-28 pb-24 md:mb-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy Voice
              <ElevenLabsBadge />
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-8 max-w-3xl mx-auto">
              Your Blog Posts.<br />
              Narrated in <span className="text-gradient-primary">Your Voice</span>.<br />
              Published Automatically.
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Lazy Voice monitors every post Lazy Blogger and Lazy SEO publish, sends them to ElevenLabs, and embeds an audio player on every article — automatically. Your site becomes a blog and a podcast at the same time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <CopyPromptButton onCopy={handleCopy} />
              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground hover:bg-muted transition-colors"
              >
                See How It Works
              </button>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              One prompt. Every post gets a voice.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              A blog and a podcast. From one prompt.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border p-6 bg-card"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <f.icon size={20} className="text-primary" />
                    <h3 className="font-display text-sm font-bold tracking-tight">{f.title}</h3>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPOUND EFFECT ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6"
            >
              Written content compounds on Google. Audio content compounds everywhere else.
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
            >
              Lazy Blogger and Lazy SEO publish articles that rank on Google. Lazy Voice turns every one of those articles into an audio episode that gets indexed on Apple Podcasts, Spotify, and Google Podcasts simultaneously. Same content. Double the reach. Zero extra work. Your site compounds in text and audio at the same time — automatically, continuously, forever.
            </motion.p>
          </div>
        </section>

        {/* ── VOICE CLONING CALLOUT ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6"
            >
              Record two minutes. Sound like yourself forever.
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-4"
            >
              ElevenLabs voice cloning lets you upload a short sample of your voice. From that point forward every post Lazy Voice generates sounds like you recorded it personally. Not a generic AI voice. Your voice. Narrating content you never sat down to record. The audience hears the founder. The founder does nothing.
            </motion.p>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="font-body text-xs text-muted-foreground/60"
            >
              Voice cloning requires an ElevenLabs paid plan. See{" "}
              <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">
                ElevenLabs.io
              </a>{" "}
              for details.
            </motion.p>
          </div>
        </section>

        {/* ── PRICING ── */}
        <LazyPricingSection
          lazyFeatures={[
            "Lazy Voice setup prompt",
            "Self-hosted",
            "Uses ElevenLabs free tier voice",
            "Bring your own ElevenLabs API key",
          ]}
          proFeatures={[
            "Hosted version",
            "Priority audio processing",
            "Automatic podcast submission to Apple & Spotify",
          ]}
          ctaButton={<CopyPromptButton onCopy={handleCopy} className="w-full justify-center" />}
        />

        {/* ── FAQ ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              FAQ
            </motion.h2>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border p-6 bg-card"
                >
                  <h3 className="font-display text-sm font-bold mb-2">{faq.q}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-4xl font-bold tracking-tight"
            >
              One prompt. A blog and a podcast. Running forever.
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
            >
              Every post Lazy Blogger and Lazy SEO publish gets a narrated audio version automatically. Your audience can read it or listen to it. Your podcast grows without you recording a single episode.
            </motion.p>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <CopyPromptButton onCopy={handleCopy} />
              <p className="font-body text-xs text-muted-foreground/60 max-w-sm">
                Then open your Lovable project, paste it in, add your ElevenLabs API key, and your site starts narrating itself.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
