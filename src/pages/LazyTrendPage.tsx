import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, TrendingUp, Search, Flame, Clock } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Trend Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous trend detection agent called Lazy Trend to this project. It monitors trending topics in your niche every 6 hours using Firecrawl and Perplexity, identifies spikes relevant to your content, adds urgent keywords to your SEO queue, queues GEO articles for immediate publication, and alerts you via Slack — so you publish on trending topics within hours, not days.`;

const problemCards = [
  { emoji: "📰", text: "A major tool in your niche just launched a new feature. Every creator is talking about it. You find out three days later from a newsletter." },
  { emoji: "🏃", text: "You write the article. It takes a day. By the time it publishes the trend has peaked and the search results are full of competitors who moved faster." },
  { emoji: "🎯", text: "Trending topics get 10x the organic reach of evergreen content in the first 72 hours. You are missing every single window." },
];

const howItWorks = [
  { icon: "🔍", title: "Scan every 6 hours", desc: "Lazy Trend queries Perplexity for live trending topics, scrapes competitor sites with Firecrawl, and monitors Hacker News and Reddit for your niche keywords." },
  { icon: "🧠", title: "Filter and score", desc: "Claude evaluates every signal against your niche keywords and scores it 1 to 10. Only topics above your threshold trigger action — no noise." },
  { icon: "⚡", title: "Instant queue", desc: "High-signal trends are added to your SEO keyword queue as urgent and a GEO article draft is queued for immediate publication." },
  { icon: "📣", title: "Slack alert", desc: "For urgent trends (expected to peak within 24 hours) a Slack alert fires immediately: topic, signal strength, and the specific content angle to take." },
];

const sources = [
  { emoji: "🔎", title: "Perplexity", desc: "Live web search for what people are asking about in your niche right now" },
  { emoji: "🕷️", title: "Firecrawl", desc: "Competitor site monitoring for new posts and content signals" },
  { emoji: "🗞️", title: "Hacker News", desc: "Tech and builder community trend detection" },
  { emoji: "🤖", title: "Reddit", desc: "Community conversation trend signals" },
];

const urgencyLevels = [
  { emoji: "🔥", title: "High urgency", desc: "Peak within 24 hours. Slack alert fires immediately. SEO and GEO queued instantly.", color: "text-red-400" },
  { emoji: "🟡", title: "Medium urgency", desc: "Peak within 2 to 7 days. Added to your weekly queue. Good window to publish thoughtful content.", color: "text-yellow-400" },
  { emoji: "🟢", title: "Low urgency", desc: "Peak within 1 to 2 weeks. Added to your regular content calendar. Low pressure but worth covering.", color: "text-green-400" },
];

const faqs = [
  { q: "How noisy is it?", a: "You control the signal threshold in setup. Set it to 3 for broad detection, 7 for only viral topics. The default of 5 catches meaningful trends without flooding your queue." },
  { q: "Does it compete with Lazy Crawl?", a: "They complement each other. Lazy Crawl monitors specific competitor URLs on a schedule. Lazy Trend monitors the broader topic landscape in real time for spikes. Both can run simultaneously." },
  { q: "What if a trend is not relevant to my niche?", a: "Claude filters every signal against your niche keywords before queuing anything. You can also dismiss individual signals from the admin dashboard." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-trend" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyTrendPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_trend_page_view"); }, [trackEvent]);
  const { prompt } = useCurrentPrompt("lazy-trend");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Trend — Autonomous Trend Detection Agent for Lovable"
        description="Be first on every trending topic in your niche. Lazy Trend scans Perplexity, Firecrawl, Hacker News, and your competitors every 6 hours and queues content instantly."
        url="/lazy-trend"
        keywords="trend detection, autonomous trending topics, content velocity, Lovable agent, real-time trend monitoring"
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
              <AutopilotHeadline product="lazy-trend" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Trend
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy Trend scans Perplexity, Firecrawl, Hacker News, and your competitors every 6 hours. When a topic spikes in your niche it adds an urgent SEO keyword to your queue, drafts a GEO article for immediate publication, and fires a Slack alert. You publish while the trend is rising — not after it peaks.
              </p>
              <div className="flex items-center gap-3 mt-4 mb-8">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Agents 🔥</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 mt-16 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            By the time you notice a trend, someone else ranked for it.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {problemCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-3">{card.emoji}</p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Speed is the moat in content. Lazy Trend gives you a 6-hour detection window on every trend in your niche.
          </motion.p>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {howItWorks.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 border-b sm:odd:border-r last:border-b-0 sm:[&:nth-child(3)]:border-b-0 border-border`}>
                <p className="text-2xl mb-3">{s.icon}</p>
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Signal Sources */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Four sources. One signal score.
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
            {sources.map((src, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className={`bg-card p-5 text-center ${i < 3 ? "border-r border-border" : ""} border-b md:border-b-0`}>
                <p className="text-2xl mb-2">{src.emoji}</p>
                <h3 className="font-display text-xs font-bold tracking-[0.1em] uppercase mb-1">{src.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{src.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-4 font-body text-sm text-foreground/40">
            Every source contributes to a single signal strength score. Topics that appear in multiple sources score higher and trigger faster.
          </motion.p>
        </section>

        {/* Urgency levels */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {urgencyLevels.map((lvl, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-2">{lvl.emoji}</p>
                <h3 className={`font-display text-sm font-bold tracking-[0.08em] uppercase mb-2 ${lvl.color}`}>{lvl.title}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{lvl.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "6-hour trend scanning", "Perplexity + Firecrawl sources", "Automatic SEO keyword queuing", "GEO article drafts", "Slack alerts for urgent trends"]}
          proFeatures={["Everything in Lazy", "Custom source configuration", "Hourly scanning option", "Multi-brand monitoring", "Advanced signal analytics"]}
          ctaButton={<CopyPromptButton text={promptText} />}
        />

        <section className="max-w-2xl mx-auto px-6 text-center mb-16">
          <p className="font-body text-sm text-foreground/40">
            Requires FIRECRAWL_API_KEY and PERPLEXITY_API_KEY. Both are already set if Lazy Crawl and Lazy Perplexity are installed.
          </p>
        </section>

        {/* FAQ */}
        <LazyFaqSection faqs={faqs} />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-10 text-center">
            <p className="font-body text-sm text-foreground/50 mb-4 leading-relaxed max-w-lg mx-auto">
              The trend window is 72 hours. Your scanner runs every 6.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>

        <AutopilotHeadline product="lazy-trend" />
      </main>
    </div>
  );
}
