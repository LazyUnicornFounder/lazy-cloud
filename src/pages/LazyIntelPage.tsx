import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Intel Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous performance intelligence agent called Lazy Intel to this project. Every Monday at 6am it reads all available content analytics, YouTube performance, customer discovery signals, comment intelligence, and competitor data — generates a weekly content strategy brief — and automatically adds the best SEO keywords and GEO queries to your content queues. Your strategy writes itself.

Note: Lazy Intel uses no external APIs. It reads your existing Supabase tables from other installed Lazy agents. The more agents installed, the richer the intelligence.`;

const dataSources = [
  { source: "Blog posts", reads: "Top topics, output velocity", agent: "Lazy Blogger" },
  { source: "SEO performance", reads: "Keyword coverage gaps", agent: "Lazy SEO" },
  { source: "YouTube comments", reads: "Audience questions", agent: "Lazy YouTube" },
  { source: "Customer calls", reads: "Problems mentioned, features requested", agent: "Lazy Granola" },
  { source: "Competitor intel", reads: "Competitor topics and keywords", agent: "Lazy Crawl" },
  { source: "Perplexity research", reads: "Live web questions", agent: "Lazy Perplexity" },
  { source: "GEO coverage", reads: "AI citation gaps", agent: "Lazy GEO" },
  { source: "YouTube analytics", reads: "Top video topics", agent: "Lazy YouTube" },
];

const faqs = [
  { q: "What if I only have Lazy Blogger installed?", a: "Lazy Intel reads whatever tables exist and skips the ones that don't. With only Lazy Blogger it works from blog post performance data alone — limited but useful. Install more agents for richer intelligence." },
  { q: "Can I run it on demand?", a: "Yes. In your admin dashboard there is a Regenerate Brief button that triggers intel-analyse immediately. Useful when you want a mid-week strategy refresh." },
  { q: "Does it change my content automatically?", a: "Only the queue. If auto-add is enabled it adds keywords to seo_keywords and queries to geo_queries automatically. Lazy Blogger, Lazy SEO, and Lazy GEO then pick those up on their next run. You can also turn auto-add off and add them manually from the brief." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-intel" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyIntelPage() {
  const { prompt } = useCurrentPrompt("lazy-intel");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_intel_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Intel — Autonomous Content Strategy | Lazy Unicorn" description="Every Monday Lazy Intel reads all your agent data and generates a weekly content strategy — adding SEO keywords and GEO queries to your queues automatically." url="/lazy-intel" keywords="content strategy, autonomous intelligence, weekly strategy brief, SEO keywords automation, GEO queries" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <AutopilotHeadline product="lazy-intel" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Intel
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Ops</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Every Monday at 6am Lazy Intel reads your blog performance, YouTube analytics, customer discovery signals, comment intelligence, and competitor data. It generates a weekly content strategy brief, adds 5 new SEO keywords to your queue, and adds 3 new GEO queries — all before you start your week.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("data-sources")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See What Gets Generated
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20 mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            Your best content ideas are already in your data. You never look.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              "💬 Your YouTube comments have 12 questions about your niche that your site doesn't answer. They've been there for weeks.",
              "📊 One blog post gets 5x the traffic of everything else. You've never written a follow-up. Nobody connected the dots.",
              "🎯 Your SEO keyword list hasn't changed in a month. Your competitors added 40 new keywords last week. You didn't know.",
            ].map((text, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6">
                <p className="font-body text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50 font-semibold">
            Lazy Intel reads everything. Every Monday your queues are already updated with what actually works.
          </motion.p>
        </section>

        {/* Data sources */}
        <section id="data-sources" className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            The more agents installed, the smarter it gets.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {dataSources.map((ds, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.04 }} className="border-b sm:odd:border-r last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 border-border bg-card p-5">
                <p className="font-display text-sm font-bold text-foreground mb-1">{ds.source}</p>
                <p className="font-body text-sm mb-1">{ds.reads}</p>
                <p className="font-display text-[10px] tracking-[0.15em] uppercase font-bold text-[#c8a961]">{ds.agent}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50">
            Lazy Intel works with just Lazy Blogger. But with every additional agent it reads more signals and generates sharper strategy.
          </motion.p>
        </section>

        {/* Mock brief */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            What gets generated
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-8">
            <p className="font-display text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/40 mb-4">Weekly Intel Brief — Monday {new Date().toLocaleDateString()}</p>
            <div className="space-y-4">
              <div>
                <p className="font-display text-xs tracking-[0.1em] uppercase font-bold text-foreground/50 mb-1">🏆 Top topic</p>
                <p className="font-body text-sm text-foreground/50 font-semibold">Building autonomous Lovable sites</p>
              </div>
              <div>
                <p className="font-display text-xs tracking-[0.1em] uppercase font-bold text-foreground/50 mb-1">🎯 Underserved topics</p>
                <div className="flex flex-wrap gap-2">
                  {["Supabase edge function debugging", "Lovable prompt versioning", "No-code SaaS monetisation"].map(t => (
                    <span key={t} className="font-body text-xs px-2 py-1 border border-border text-foreground/50">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-display text-xs tracking-[0.1em] uppercase font-bold text-foreground/50 mb-1">🔑 New SEO keywords (5)</p>
                <p className="font-body text-sm">lovable autonomous blog, supabase edge function tutorial, no-code SaaS stack, prompt engineering for Lovable, build-in-public content strategy</p>
              </div>
              <div>
                <p className="font-display text-xs tracking-[0.1em] uppercase font-bold text-foreground/50 mb-1">🤖 New GEO queries (3)</p>
                <p className="font-body text-sm">How to build an autonomous website with Lovable? What is generative agent optimisation? Best tools for no-code SaaS founders?</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="font-body text-sm text-foreground/50 leading-relaxed italic">
                  "Build-in-public content outperformed tutorial content 3x last week. Double down on founder story posts and ship two GEO articles on Lovable automation this week."
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "Weekly strategy briefs", "Auto SEO keyword seeding", "Auto GEO query seeding", "8 data source integration", "Slack weekly summaries"]}
          proFeatures={["Everything in Lazy", "Daily intelligence cycles", "Competitor tracking", "Content calendar generation", "Trend alerts"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        <section className="text-center px-6 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-xl font-bold mb-4">Stop guessing your content strategy.</h2>
            <p className="font-body text-sm mb-6 max-w-md mx-auto">Paste one prompt. Every Monday your content strategy is already written and your queues are updated.</p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
