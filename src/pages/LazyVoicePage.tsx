import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import { motion } from "framer-motion";
import { Copy, Check, Mic, Headphones, Rss, Radio, Volume2, Play } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_VOICE_PROMPT = `[Lazy Voice Prompt — v0.0.4 — LazyUnicorn.ai]

Add an autonomous audio narration engine called Lazy Voice to this project. It monitors every new post published to blog_posts, seo_posts, and geo_posts, converts each to audio using the ElevenLabs API, stores the audio file, embeds an audio player on every blog post page, and publishes a podcast feed at /listen — all automatically with no manual input required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**voice_settings**
id (uuid, primary key, default gen_random_uuid()),
podcast_title (text),
podcast_description (text),
podcast_author (text),
site_url (text),
voice_id (text, default 'EXAVITQu4vr4xnSDxMaL'),
rss_enabled (boolean, default true),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

Note: Store the ElevenLabs API key as a Supabase secret — ELEVENLABS_API_KEY. Never store it in the database table.

**voice_episodes**
id (uuid, primary key, default gen_random_uuid()),
post_id (text),
post_slug (text, unique),
post_title (text),
audio_url (text),
duration_seconds (integer),
file_size_bytes (integer),
source_table (text),
status (text, default 'published'),
published_at (timestamptz, default now()),
created_at (timestamptz, default now())

**voice_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
post_slug (text),
created_at (timestamptz, default now())

Create a Supabase storage bucket called voice-audio with public access enabled.

---

## 2. Setup page

Create a page at /lazy-voice-setup with a form:
- ElevenLabs API key (password) — get one at elevenlabs.io. Will be stored as Supabase secret ELEVENLABS_API_KEY. Never stored in the database.
- Voice ID (text) — the ElevenLabs voice ID to use. Default: EXAVITQu4vr4xnSDxMaL (Rachel voice). Note: find other voice IDs in your ElevenLabs dashboard under Voices.
- Podcast title (what is your podcast called?)
- Podcast description (one sentence describing your podcast)
- Podcast author name
- Site URL (your full site URL — used to build the RSS feed)
- Enable RSS feed (toggle, default on)

Submit button: Start Lazy Voice

On submit:
1. Store ElevenLabs API key as Supabase secret ELEVENLABS_API_KEY
2. Save all other values to voice_settings
3. Set setup_complete to true and prompt_version to 'v0.0.3'
4. Redirect to /admin with message: "Lazy Voice is running. Every new blog post will be narrated automatically within 30 minutes of publishing."

---

## 3. Edge functions

**voice-narrate**
Cron: every 30 minutes — */30 * * * *

1. Read voice_settings. If is_running is false or setup_complete is false exit.
2. Query blog_posts, seo_posts, and geo_posts for posts where status is published and published_at is within the last hour. For each table that does not exist skip it gracefully.
3. For each post check if a voice_episodes row already exists with matching post_slug. If it does skip.
4. Strip all markdown formatting from the post body to get clean plain text.
5. Send to ElevenLabs API at https://api.elevenlabs.io/v1/text-to-speech/[voice_id]:
   - Header: xi-api-key set to ELEVENLABS_API_KEY secret
   - Header: Content-Type application/json
   - Body: model_id "eleven_monolingual_v1", text "[post title]. [cleaned post body]", voice_settings stability 0.5 similarity_boost 0.75
6. Receive the audio binary response.
7. Upload to voice-audio Supabase storage bucket as [post-slug].mp3.
8. Get the public URL of the uploaded file.
9. Insert into voice_episodes: post_slug, post_title, audio_url, source_table (blog_posts/seo_posts/geo_posts), status published, published_at now.
Log all errors to voice_errors with function_name voice-narrate and the post_slug.

**voice-rss**
Serves the podcast RSS feed when called via GET request.

1. Read voice_settings.
2. Query all voice_episodes where status is published ordered by published_at descending.
3. Generate valid RSS 2.0 XML with iTunes podcast namespace:
   - Channel: title, description, link (site_url), language en-us, itunes:author, itunes:category Technology
   - Each episode item: title, description (post title), enclosure url (audio_url) type audio/mpeg, pubDate RFC 2822 format, guid (audio_url)
4. Return XML with Content-Type application/rss+xml.

---

## 4. Audio player component

Create a reusable AudioPlayer React component:
- Props: audioUrl (string), title (string)
- Shows: play/pause button, progress bar, current time, total duration, 1x/1.5x/2x speed control
- Matches the existing site design system
- Accessible: keyboard navigable, ARIA labels

Modify every blog post page at /blog/[slug], /seo/[slug], and /geo/[slug]:
- Query voice_episodes for a matching post_slug
- If an episode exists with status published show the AudioPlayer at the top of the post body before the article content
- Show a label: "🎧 Listen to this article" above the player
- If no episode exists show nothing — no loading state, no placeholder

---

## 5. Podcast feed page

Create a public page at /listen:
- Show podcast title and description from voice_settings at the top
- Show a copyable RSS feed URL: [site_url]/functions/v1/voice-rss
- Show instructions: "Copy this RSS URL and submit it to Apple Podcasts at podcasters.apple.com and Spotify at podcasters.spotify.com to distribute your podcast automatically."
- List all voice_episodes ordered by published_at descending. Each shows: post title, published date, duration, and an embedded HTML audio player using the audio_url.
- At the bottom add: "🦄 Powered by Lazy Voice — autonomous audio narration for Lovable sites. Built by LazyUnicorn.ai" — link to https://lazyunicorn.ai.

---

## 6. Admin

Do not build a standalone dashboard page for this engine. The dashboard lives at /admin/voice as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This engine only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all engines in one place." and a link to /lazy-voice-setup.

## 7. Navigation

Add a Listen link to the main site navigation pointing to /listen.
Add an Admin link to the main site navigation pointing to /admin.
Do not add /lazy-voice-setup to public navigation.`;

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
      ? "bg-primary text-primary-foreground"
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
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
                <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Voice
                </h1>
                <ElevenLabsBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                Lazy Voice monitors every post Lazy Blogger and Lazy SEO publish, sends them to ElevenLabs, and embeds an audio player on every article — automatically. Your site becomes a blog and a podcast at the same time.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handleCopy} />
                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
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
