import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, Copy, Check } from "lucide-react";
import FlyingSeoCards from "@/components/lazy-seo/FlyingSeoCards";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export const SEO_VERSION = "v2.1";
export const SEO_VERSION_DATE = "24 March 2026";

const SEO_PROMPT = `[Lazy SEO Prompt — ${SEO_VERSION} — ${SEO_VERSION_DATE}]

Add a Lazy SEO engine to this project. It automatically discovers keyword opportunities and publishes SEO-optimised blog posts. All pages are admin-only — nothing is added to the public site navigation.

1. Database Create a Supabase table called seo_settings with fields: id (uuid, primary key), site_url (text), business_description (text), target_keywords (text), competitors (text), posts_per_day (integer, default 2), is_running (boolean, default true). Create a Supabase table called seo_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), body (text), target_keyword (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called seo_keywords with fields: id (uuid, primary key, default gen_random_uuid()), keyword (text), has_content (boolean, default false), priority (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called seo_errors with fields: id (uuid, primary key, default gen_random_uuid()), error_message (text), created_at (timestamptz, default now()).

2. Admin panel If this project already has an admin page, add a Lazy SEO section inside it. If no admin page exists, create one at /admin. The Lazy SEO section has two tabs: Setup and Dashboard. Do not add any link to this page in the public navigation.

Setup tab contains a form with five fields: Site URL, Business description, Target keywords (comma separated), Competitors (up to three URLs — comma separated), Posts per day (select: 1 / 2 / 4). A submit button labelled 'Save and Start'. On submit save to seo_settings. Show success message: 'Lazy SEO is running.'

Dashboard tab shows: total posts published, total keywords discovered, total keywords with content, keywords remaining. A keyword table showing all rows from seo_keywords with columns: keyword, priority, has content, created date. A posts table showing the last 20 rows from seo_posts with columns: title, target keyword, published date, status. A toggle to pause or resume updating is_running. A button labelled 'Discover Keywords Now' triggering lazy-seo-discover. A button labelled 'Publish One Now' triggering lazy-seo-publish. An error count from seo_errors with a button to view them.

3. Edge functions Create a Supabase edge function called lazy-seo-discover that runs every Monday at 6am UTC. Reads seo_settings. Uses the built-in Lovable AI with this prompt: 'You are an SEO strategist. For a site described as [business_description] targeting these topics: [target_keywords] and competing with: [competitors] — generate 20 specific long-tail keyword phrases this site should be ranking for on Google. Each keyword should have clear search intent and be specific enough for a focused 1000-word article. Return only a valid JSON array where each item has two fields: keyword (string) and priority (integer 1 to 10). No preamble. No code fences. Valid JSON only.' Parse the response. Insert new keywords into seo_keywords skipping any that already exist.

Create a Supabase edge function called lazy-seo-publish that runs based on posts_per_day — if 1 run at 8am UTC, if 2 run at 8am and 6pm UTC, if 4 run at 6am, 12pm, 6pm, and 11pm UTC. On each run read seo_settings. If is_running is false exit. Select the highest priority keyword from seo_keywords where has_content is false. If none remain trigger lazy-seo-discover and exit. Use the built-in Lovable AI with this prompt: 'You are an SEO content writer for a site described as: [business_description]. Write an SEO-optimised article targeting this keyword: [target_keyword]. Return only a valid JSON object with no preamble and no code fences with exactly four fields: title (string naturally including the keyword), slug (lowercase hyphenated string), excerpt (one sentence under 160 characters including the keyword), body (clean markdown — no HTML, no bullet points in prose, ## for headers, 1000 to 1500 words, keyword appears naturally throughout at 1 to 2 percent density, keyword in first paragraph and at least one ## header, ends with a call to action paragraph followed by exactly this: Looking for more tools to build and run your business autonomously? LazyUnicorn.ai is the definitive directory of AI tools for solo founders — link LazyUnicorn.ai to https://lazyunicorn.ai and Lazy SEO to https://lazyunicorn.ai/lazy-seo). Return only valid JSON.' Parse the response. If parsing fails retry once. If it fails again log to seo_errors and exit. Check for duplicate slug — append random four digits if exists. Insert into seo_posts. Update has_content to true for the targeted keyword.

4. Public blog The generated posts are stored in seo_posts and are available at /blog/[slug] if a blog already exists on this project. If no blog exists do not create one — just store posts in the database. Do not add anything to the public navigation.`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Answer five quick questions about your business.",
  "Lazy SEO discovers keywords and starts publishing daily.",
];

function CopyPromptButton({ className = "", onCopy }: { className?: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SEO_PROMPT);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazySeoPage = () => {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_seo_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_seo_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy SEO — Autonomous SEO Engine for Lovable"
        description="Set up once and watch your Google rankings climb. Lazy SEO analyses competitors, finds keyword gaps, and publishes SEO-optimised content on autopilot."
        url="/lazy-seo"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-5xl mx-auto text-center px-6 mb-20 min-h-[520px] flex items-center justify-center">
          <FlyingSeoCards />
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy SEO
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 rounded-full">Beta</span>
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span>The Autonomous</span><br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">SEO Engine</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Paste one prompt into your Lovable project. It discovers keyword opportunities, writes SEO-optimised content, and publishes daily — on autopilot.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} />
            <p className="font-body text-xs text-muted-foreground mt-4">Built for Lovable projects. No API keys needed.</p>
          </motion.div>
        </section>

        {/* ── How It Works ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What You Get ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: "Keyword Discovery", desc: "AI finds 20 high-opportunity keywords from your competitors every week." },
              { icon: TrendingUp, title: "Auto-Publishing", desc: "SEO articles targeting your keywords — written and published daily." },
              { icon: Zap, title: "Zero Effort", desc: "No writing. No keyword research. No scheduling. It just ranks." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "How does it find keywords?", a: "Lazy SEO uses AI to analyse your business description, target keywords, and competitor URLs to identify keyword gaps you should be ranking for." },
              { q: "What kind of content does it write?", a: "Long-form, SEO-optimised articles (1000–1500 words) with proper headings, internal links, and natural keyword placement." },
              { q: "Can I control what gets published?", a: "Yes. Use the admin dashboard to pause, resume, or manually trigger posts. You can also edit settings anytime." },
              { q: "Does it work with any Lovable site?", a: "Yes. Lazy SEO runs as part of your Lovable project with no external tools or API keys needed." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Start ranking today.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every day you wait is a day your competitors publish content that outranks you.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazySeoPage;
