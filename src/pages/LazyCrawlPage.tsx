import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Search, TrendingUp, Users, Eye, Zap, Database, BarChart3 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { toast } from "sonner";

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

const features = [
  { icon: Globe, title: "Competitor monitoring", desc: "Crawl competitor websites weekly for pricing changes, new features, and content updates." },
  { icon: Search, title: "Keyword discovery", desc: "Extract the keywords your competitors are ranking for and feed them into Lazy SEO." },
  { icon: TrendingUp, title: "Trend extraction", desc: "Discover trending topics from industry news sites and add them to your blog queue." },
  { icon: Users, title: "Lead discovery", desc: "Find and extract leads from directories and public databases automatically." },
  { icon: Eye, title: "Live intelligence feed", desc: "Build a continuously updating industry intelligence feed from real web data." },
  { icon: Database, title: "Real data for content", desc: "Feed real current data into your blog posts instead of AI guesswork." },
  { icon: BarChart3, title: "Change detection", desc: "Get alerted when competitor pricing, features, or messaging changes." },
  { icon: Zap, title: "Engine integration", desc: "Extracted intel flows automatically into Lazy Blogger, Lazy SEO, and Lazy GEO." },
];

const faqs = [
  { q: "What is Firecrawl?", a: "Firecrawl is a web scraping API that extracts clean, structured content from any website. Lazy Crawl uses it to monitor competitors and extract intelligence automatically." },
  { q: "Do I need a Firecrawl API key?", a: "Yes. Get one at firecrawl.dev. The free tier includes 500 credits which is enough for initial setup and testing." },
  { q: "How often does it crawl?", a: "By default every 30 minutes for active targets. You can configure frequency per target — some sites weekly, others daily." },
  { q: "Does it work without the other Lazy engines?", a: "Yes. It stores intelligence independently. But it becomes much more powerful when Lazy Blogger, Lazy SEO, and Lazy GEO are also installed — intel flows directly into your content pipeline." },
];

function CopyPromptButton({ label = "COPY THE LOVABLE PROMPT" }: { label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function LazyCrawlPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Crawl — Autonomous Web Intelligence Engine for Lovable"
        description="Monitor competitors, extract trends, discover leads, and feed real web data into your content engines — all powered by Firecrawl, all running autonomously."
        url="/lazy-crawl"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
            <span className="inline-block font-display text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-foreground/20 text-foreground/50 mb-6">
              POWERED BY FIRECRAWL
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Real web data. Real intelligence. Fed into your engines.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl leading-relaxed mb-10"
          >
            Lazy Crawl uses the Firecrawl API to monitor competitor websites, extract trending topics, discover keyword opportunities, and feed real current data into your content engines — automatically, forever.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="flex flex-wrap gap-4">
            <CopyPromptButton />
          </motion.div>
        </div>
      </section>

      {/* What it does */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Web intelligence on autopilot.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border p-6 bg-card"
              >
                <f.icon size={20} className="text-foreground/30 mb-3" />
                <h3 className="font-display text-sm font-bold mb-2">{f.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Four steps. Real intelligence flowing.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { step: "01", title: "Copy the prompt", desc: "Copy the Lazy Crawl setup prompt from this page." },
              { step: "02", title: "Paste into Lovable", desc: "Paste it into your existing Lovable project chat." },
              { step: "03", title: "Add your Firecrawl key", desc: "Get a key at firecrawl.dev and add it during setup." },
              { step: "04", title: "Intelligence flows", desc: "Competitors are monitored. Trends are extracted. Your content engines are fed real data." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-6 bg-card"
              >
                <span className="font-display text-[10px] font-bold tracking-[0.2em] text-foreground/20">{s.step}</span>
                <h3 className="font-display text-sm font-bold mt-2 mb-1">{s.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <LazyPricingSection
        lazyFeatures={["Lazy Crawl setup prompt", "Self-hosted in your Lovable project", "Bring your own Firecrawl API key", "Feeds into Lazy Blogger, SEO, and GEO"]}
        proFeatures={["Hosted version", "Firecrawl API costs included", "Daily competitor reports", "Priority processing", "Dedicated support"]}
        proPrice="$29"
        ctaButton={<CopyPromptButton label="Get the Prompt" />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Stop guessing. Start knowing.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl mx-auto leading-relaxed mb-10">
            One prompt installs autonomous web intelligence — competitor monitoring, trend extraction, lead discovery, and real data flowing into your content engines.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CopyPromptButton />
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="font-display text-[10px] tracking-[0.15em] uppercase text-foreground/20">
          Lazy Unicorn — Autonomous growth engines for Lovable
        </p>
      </footer>
    </div>
  );
}
