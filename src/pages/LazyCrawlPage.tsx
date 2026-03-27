import { useCallback, useState } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { BarChart3, Check, Copy, Database, Eye, Globe, Search, TrendingUp, Users, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Crawl Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete autonomous web intelligence engine called Lazy Crawl to this project. It uses the Firecrawl API to monitor competitor websites, extract trending topics, discover keyword opportunities, find leads from public directories, and feed real current data into your content engines — all automatically.

---

1. Database
Create these Supabase tables with RLS enabled:

crawl_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), business_description (text), niche (text), competitors (text), target_urls (text), site_url (text), is_running (boolean, default true), setup_complete (boolean, default false), prompt_version (text, nullable), created_at (timestamptz, default now())

crawl_targets: id (uuid, primary key, default gen_random_uuid()), url (text), crawl_type (text), frequency (text), last_crawled (timestamptz), status (text, default 'active'), created_at (timestamptz, default now())

crawl_results: id (uuid, primary key, default gen_random_uuid()), target_id (uuid, references crawl_targets), url (text), content (text), extracted_data (jsonb), crawled_at (timestamptz, default now())

crawl_intel: id (uuid, primary key, default gen_random_uuid()), intel_type (text), title (text), summary (text), source_url (text), relevance_score (numeric), fed_to_engine (text), created_at (timestamptz, default now())

crawl_leads: id (uuid, primary key, default gen_random_uuid()), name (text), url (text), source (text), extracted_data (jsonb), status (text, default 'new'), created_at (timestamptz, default now())

crawl_errors: id (uuid, primary key, default gen_random_uuid()), error_message (text), function_name (text), created_at (timestamptz, default now())

2. Edge functions
crawl-run: Crawls all active targets on schedule. Stores results.
crawl-extract: Extracts intelligence from crawl results using Lovable AI.
crawl-publish: Feeds extracted intel into Lazy Blogger, Lazy SEO, and Lazy GEO queues.

3. Setup page at /lazy-crawl-setup
Step 1: Welcome. Step 2: Add competitor URLs and directories to monitor. Step 3: Configure crawl frequency. Step 4: Add Firecrawl API key. Step 5: Launch.`;

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project.",
  "Add your Firecrawl API key.",
  "Competitor intelligence flows into your content engines automatically.",
];

function CopyPromptButton({ className = "", onCopy, text }: { className?: string; onCopy: () => void; text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

function ServiceBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase text-foreground/30 border border-border px-3 py-1">
      Powered by Firecrawl
    </span>
  );
}

const LazyCrawlPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-crawl");
  const promptText = dbPrompt?.prompt_text || SETUP_PROMPT;

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_crawl_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Crawl — Autonomous Web Intelligence Engine for Lovable" description="Monitor competitors, extract trends, discover leads, and feed real web data into your content engines — all powered by Firecrawl." url="/lazy-crawl" />
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
              <AutopilotHeadline product="lazy-crawl" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Crawl
                </h1>
                <ServiceBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                Lazy Crawl uses the Firecrawl API to monitor competitor websites, extract trending topics, discover keyword opportunities, and feed real current data into your content engines — automatically, forever.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
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

        {/* How it works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20 pt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">Real intelligence. Flowing into your content engines.</motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What it does */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">What it does</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {[
              { icon: Globe, title: "Competitor Monitoring", desc: "Crawl competitor websites weekly for pricing changes, new features, and content updates." },
              { icon: Search, title: "Keyword Discovery", desc: "Extract the keywords your competitors are ranking for and feed them into Lazy SEO." },
              { icon: TrendingUp, title: "Trend Extraction", desc: "Discover trending topics from industry news sites and add them to your blog queue." },
              { icon: Users, title: "Lead Discovery", desc: "Find and extract leads from directories and public databases automatically." },
              { icon: Eye, title: "Live Intelligence Feed", desc: "Build a continuously updating industry intelligence feed from real web data." },
              { icon: Database, title: "Real Data for Content", desc: "Feed real current data into your blog posts instead of AI guesswork." },
              { icon: BarChart3, title: "Change Detection", desc: "Get alerted when competitor pricing, features, or messaging changes." },
              { icon: Zap, title: "Engine Integration", desc: "Extracted intel flows automatically into Lazy Blogger, Lazy SEO, and Lazy GEO." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="border-b sm:odd:border-r last:border-b-0 border-border bg-card p-6">
                <item.icon size={18} className="text-foreground/40 mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy Crawl setup prompt", "Self-hosted in your Lovable project", "Feeds into Lazy Blogger, SEO, and GEO", "Bring your own Firecrawl API key"]}
          proFeatures={["Hosted version", "Firecrawl API costs included", "Daily competitor reports", "Priority processing"]}
          ctaButton={<CopyPromptButton text={promptText} onCopy={handlePromptCopy} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={[
          { q: "What is Firecrawl?", a: "Firecrawl is a web scraping API that extracts clean, structured content from any website. Lazy Crawl uses it to monitor competitors and extract intelligence automatically." },
          { q: "Do I need a Firecrawl API key?", a: "Yes. Get one at firecrawl.dev. The free tier includes 500 credits which is enough for initial setup and testing." },
          { q: "How often does it crawl?", a: "By default every 30 minutes for active targets. You can configure frequency per target — some sites weekly, others daily." },
          { q: "Does it work without the other Lazy engines?", a: "Yes. It stores intelligence independently. But it becomes much more powerful when Lazy Blogger, Lazy SEO, and Lazy GEO are also installed — intel flows directly into your content pipeline." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Stop guessing. Start knowing.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">Competitor monitoring, trend extraction, lead discovery — all feeding real data into your content engines.</p>
            <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
            <p className="font-body text-xs text-foreground/20 mt-4">Open your Lovable project, paste it into the chat, add your API key. Done.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyCrawlPage;
