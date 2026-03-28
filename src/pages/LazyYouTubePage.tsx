import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Video, FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { Link } from "react-router-dom";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = "Lazy YouTube prompt — paste this into your Lovable project to install the autonomous YouTube content engine.";

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Connect your YouTube API key and Supadata API key during setup.",
  "Lazy YouTube polls your channel every 30 minutes and publishes content automatically.",
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-youtube" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyYouTubePage() {
  const { prompt } = useCurrentPrompt("lazy-youtube");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_youtube_page_view");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy YouTube — Autonomous YouTube Content Engine | Lazy Unicorn"
        description="Every video you upload triggers five content pieces — a transcript, SEO article, GEO article, summary, and chapter markers. Published automatically."
        url="/lazy-youtube"
        keywords="YouTube content engine, autonomous YouTube, video to blog post, YouTube SEO, YouTube transcript, Lovable YouTube"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-youtube" />

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy YouTube
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Paste one prompt into your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> project. Lazy YouTube detects new uploads, fetches transcripts via Supadata, and publishes five content pieces — a transcript, SEO article, GEO article, summary, and chapter markers — within an hour.
              </p>

              {/* Works with */}
              <div className="mt-8 mb-10">
                <p className="font-body text-[14px] tracking-[0.2em] uppercase font-semibold text-foreground/65 mb-3">
                  Works with
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Lazy Blogger", href: "/lazy-blogger" },
                    { label: "Lazy SEO", href: "/lazy-seo" },
                    { label: "Lazy GEO", href: "/lazy-geo" },
                    { label: "Lazy Voice", href: "/lazy-voice" },
                    { label: "Lazy Alert", href: "/lazy-alert" },
                    { label: "Lazy Mail", href: "/lazy-mail" },
                  ].map((tag) => (
                    <Link
                      key={tag.label}
                      to={tag.href}
                      className="font-body text-[14px] tracking-[0.12em] uppercase font-semibold px-3 py-1.5 border border-border text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-4">
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
              { icon: Video, title: "Channel monitoring", desc: "Polls your YouTube channel every 30 minutes. New uploads detected and processed automatically." },
              { icon: FileText, title: "5 content pieces", desc: "A transcript, SEO article, GEO article, summary, and chapter markers — published within an hour." },
              { icon: Zap, title: "Zero effort", desc: "No writing. No editing. No scheduling. Upload as normal and content appears on your site." },
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
                <item.icon size={18} className="text-foreground/65 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What gets published */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            One upload. Five autonomous outputs.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { badge: "📄 Transcript", title: "How I Built a SaaS in a Weekend — Full Transcript", desc: "Every word from your video, structured with timestamps and headers. Searchable by Google. Accessible to readers." },
              { badge: "🔍 SEO Article", title: "Best strategies for building a SaaS with Lovable in 2026", desc: "A long-form article targeting your keywords — written from the transcript but structured as independent content." },
              { badge: "🤖 GEO Article", title: "What tools do solo founders use to build SaaS products?", desc: "Structured to be cited by ChatGPT, Claude, and Perplexity. Factual. Specific. Citable." },
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
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/65 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <p className="font-body text-[14px] text-foreground/60 mt-3">Published 45 min ago</p>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border border-t-0">
            {[
              { badge: "✏️ Summary", title: "Key Takeaways — Building a SaaS in a Weekend", desc: "A tight summary covering the key takeaways. Great for newsletters, social sharing, and people who want substance without watching." },
              { badge: "📌 Chapters", title: "Auto-generated chapter markers", desc: "Timestamps generated from your transcript and added to your video description via the YouTube API. Better chapters improve watch time." },
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
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/65 mb-3">{item.badge}</p>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-6 font-body text-[13px] tracking-[0.1em] uppercase text-foreground/65">
            5 content pieces per video · Chapters generated automatically · Comments become SEO keywords
          </p>
        </section>

        {/* Transcript section */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Your transcript is a goldmine</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Every word you said in every video is sitting in YouTube as auto-generated captions. Nobody can search it. Google cannot index it. Lazy YouTube fetches every transcript via Supadata, cleans it up, structures it with headers and timestamps, and publishes it as a readable article on your site.
            </p>
            <div className="border border-border bg-background p-5 font-mono text-xs text-foreground/50 leading-relaxed">
              <p className="text-foreground/70 font-bold mb-3">How I Built a SaaS in a Weekend</p>
              <p className="mb-2"><span className="text-foreground/30">[0:00]</span> So the first thing I did was open Lovable and start with a blank project...</p>
              <p className="font-display text-foreground/60 text-sm font-bold mb-2 mt-4">## Setting Up the Database</p>
              <p className="mb-2"><span className="text-foreground/30">[2:30]</span> I connected Supabase and created three tables — users, products, and orders...</p>
              <p className="mt-4 text-foreground/40">Watch at 4:32 →</p>
            </div>
          </motion.div>
        </section>

        {/* Comment intelligence */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Your comments section is your content strategy</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Every week Lazy YouTube scans the comments on your most-discussed videos. It extracts every question your audience asked, every topic they mentioned that you did not cover, every complaint or request. These become SEO keyword targets, blog post ideas, and GEO query topics — automatically fed into Lazy Blogger and Lazy SEO.
            </p>
            <div className="border border-border bg-background p-5">
              <span className="inline-block text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-0.5 mb-2 bg-foreground text-background">question-asked</span>
              <p className="font-body text-sm text-foreground/60 leading-relaxed mb-2">What tool do you use to build the database layer? Several commenters asking about Supabase setup. Added to SEO keyword queue.</p>
              <p className="font-body text-xs text-foreground/30">Source: How I built a SaaS in a weekend</p>
            </div>
          </motion.div>
        </section>

        {/* Compounding */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            The longer you run it, the smarter it gets
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { badge: "Month 1", desc: "Videos upload. Transcripts publish. SEO articles target your keywords. GEO articles appear in AI search results." },
              { badge: "Month 3", desc: "Comment questions become new SEO targets. High-performing topics feed back into Lazy Blogger. Your YouTube strategy and site strategy align automatically." },
              { badge: "Month 6", desc: "Your site has 60+ indexed articles from your videos. You rank for dozens of keywords your videos never touched. AI engines cite you regularly." },
            ].map((item, i) => (
              <motion.div
                key={item.badge}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6"
              >
                <p className="font-display text-[14px] tracking-[0.15em] uppercase font-bold text-foreground/65 mb-3">{item.badge}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Better together */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-3">
            Better together
          </motion.h2>
          <p className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto leading-relaxed mb-8">
            Lazy YouTube works on its own, but it compounds with the rest of the Lazy Stack — turning one video into a dozen touchpoints.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {[
              { emoji: "✍️", name: "Lazy Blogger", href: "/lazy-blogger", desc: "High-performing video topics feed into the blog queue automatically." },
              { emoji: "🔍", name: "Lazy SEO", href: "/lazy-seo", desc: "Comment questions become keyword targets. New keywords added weekly." },
              { emoji: "🌐", name: "Lazy GEO", href: "/lazy-geo", desc: "GEO articles from your videos get your channel cited by ChatGPT and Perplexity." },
              { emoji: "🎙️", name: "Lazy Voice", href: "/lazy-voice", desc: "Video summaries get narrated automatically and added to your podcast RSS feed." },
              { emoji: "🔔", name: "Lazy Alert", href: "/lazy-alert", desc: "Slack notification every time a video is processed and content is published." },
              { emoji: "📧", name: "Lazy Mail", href: "/lazy-mail", desc: "New video summaries go into your weekly newsletter automatically." },
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
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  <span className="inline-block mt-3 font-body text-[14px] tracking-[0.15em] uppercase font-semibold text-foreground/60 group-hover:text-foreground/50 transition-colors">
                    Learn more →
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy YouTube setup prompt", "Self-hosted in your Lovable project", "Transcript + SEO + GEO articles", "Auto-generated chapter markers", "Comment intelligence loop"]}
          proFeatures={["Hosted version", "Multi-channel support", "Advanced analytics dashboard", "Priority content generation"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={[
          { q: "What if my video has no captions?", a: "Lazy YouTube tries Supadata first which works on most public videos with auto-generated captions. If captions are unavailable it generates content from the video title, description, and metadata." },
          { q: "Do I need to give Lazy YouTube access to my YouTube channel?", a: "For reading video data and fetching transcripts you only need a YouTube API key. For automatically updating video descriptions with chapters you need to authorise with OAuth 2.0." },
          { q: "How long after uploading does content appear?", a: "Lazy YouTube checks for new videos every 30 minutes. The full cycle takes between 30 minutes and 90 minutes from upload to published content." },
          { q: "Can I control which videos get processed?", a: "Yes. You can pause specific videos from processing in the admin dashboard. You can also set content to draft mode instead of auto-publish." },
          { q: "Does it work with old videos?", a: "Yes. Lazy YouTube can backfill your existing video catalogue. From the admin dashboard click Sync All Videos to process your last 50 uploads." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              You film it once. Lazy YouTube works it forever.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every video you upload is five content pieces sitting unwritten. Lazy YouTube writes them for you.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
