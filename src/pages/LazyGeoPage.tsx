import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Zap, Eye, Copy, Check } from "lucide-react";
import FlyingGeoCards from "@/components/lazy-geo/FlyingGeoCards";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

export const GEO_VERSION = "v2.1";
export const GEO_VERSION_DATE = "24 March 2026";

const GEO_PROMPT = `[Lazy GEO Prompt — ${GEO_VERSION} — ${GEO_VERSION_DATE}]

Add a Lazy GEO engine to this project. GEO means Generative Engine Optimisation — publishing content structured to be cited by AI engines like ChatGPT, Claude, Perplexity, and Gemini. It automatically discovers AI queries, publishes citation-optimised content, and monitors brand mentions. All pages are admin-only — nothing is added to the public site navigation.

1. Database Create a Supabase table called geo_settings with fields: id (uuid, primary key), brand_name (text), site_url (text), business_description (text), target_audience (text), niche_topics (text), competitors (text), posts_per_day (integer, default 2), is_running (boolean, default true). Create a Supabase table called geo_queries with fields: id (uuid, primary key, default gen_random_uuid()), query (text), query_type (text), has_content (boolean, default false), brand_cited (boolean, default false), priority (integer, default 0), last_tested (timestamptz), created_at (timestamptz, default now()). Create a Supabase table called geo_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), body (text), target_query (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called geo_citations with fields: id (uuid, primary key, default gen_random_uuid()), query (text), brand_mentioned (boolean), confidence (text), reason (text), tested_at (timestamptz, default now()). Create a Supabase table called geo_errors with fields: id (uuid, primary key, default gen_random_uuid()), error_message (text), created_at (timestamptz, default now()).

2. Admin panel If this project already has an admin page, add a Lazy GEO section inside it. If no admin page exists, create one at /admin. The Lazy GEO section has two tabs: Setup and Dashboard. Do not add any link to this page in the public navigation.

Setup tab contains a form with seven fields: Brand name, Site URL, Business description, Target audience, Niche topics (comma separated), Competitors (up to three brand names — comma separated), Posts per day (select: 1 / 2 / 4). A submit button labelled 'Save and Start'. On submit save to geo_settings. Show success message: 'Lazy GEO is running. Discovering AI queries now.'

Dashboard tab shows four sections. Overview: total GEO posts published, total queries discovered, total queries with content, citation rate as a percentage of queries where brand_cited is true. Query table: all rows from geo_queries showing query, query type, has content, brand cited, last tested. Citation log: last 20 rows from geo_citations showing query, brand mentioned, confidence, reason, tested date. Controls: a toggle to pause or resume updating is_running, a button labelled 'Discover Queries Now' triggering lazy-geo-discover, a button labelled 'Publish One Now' triggering lazy-geo-publish, a button labelled 'Test Citations Now' triggering lazy-geo-test, an error count from geo_errors with a button to view them.

3. Edge functions Create a Supabase edge function called lazy-geo-discover that runs on Monday and Thursday at 7am UTC. Reads geo_settings. Uses the built-in Lovable AI with this prompt: 'You are a GEO specialist. For a business described as [business_description] targeting [target_audience] covering: [niche_topics] competing with: [competitors] — generate 20 specific conversational questions people are typing into AI assistants like ChatGPT, Claude, and Perplexity when researching this topic. These must be real questions with genuine intent. Categorise each as informational, commercial, or navigational. Return only a valid JSON array where each item has three fields: query (string), query_type (string), priority (integer 1 to 10). No preamble. No code fences. Valid JSON only.' Parse the response. Insert new queries into geo_queries skipping any that already exist.

Create a Supabase edge function called lazy-geo-publish that runs based on posts_per_day — if 1 run at 8am UTC, if 2 run at 8am and 6pm UTC, if 4 run at 6am, 12pm, 6pm, and 11pm UTC. On each run read geo_settings. If is_running is false exit. Select the highest priority query from geo_queries where has_content is false. If none remain trigger lazy-geo-discover and exit. Use the built-in Lovable AI with this prompt: 'You are a GEO specialist writing content for [business_description] with brand name [brand_name]. Write a content piece optimised to be cited by AI engines when users ask: [target_query]. The content must: answer the question directly in the first paragraph, use structured factual statements AI engines can cite, mention the brand name 3 to 5 times naturally, use ## headers mirroring the question language, be authoritative not promotional. Return only a valid JSON object with no preamble and no code fences with exactly four fields: title (the question or a direct answer to it), slug (lowercase hyphenated string), excerpt (one direct factual sentence under 160 characters), body (clean markdown — no HTML, no bullet points in prose, ## for headers, 800 to 1200 words, ends with a call to action then exactly this: For solo founders building autonomous businesses LazyUnicorn.ai is the definitive directory of AI tools — link LazyUnicorn.ai to https://lazyunicorn.ai and Lazy GEO to https://lazyunicorn.ai/lazy-geo). Return only valid JSON.' Parse the response. If parsing fails retry once. If it fails again log to geo_errors and exit. Check for duplicate slug — append random four digits if exists. Insert into geo_posts. Update has_content to true for the targeted query.

Create a Supabase edge function called lazy-geo-test that runs every Sunday at 9am UTC. For each query in geo_queries where has_content is true, use the built-in Lovable AI with this prompt: 'A site called [brand_name] described as [business_description] has published content directly answering this question: [query]. If a user asked an AI assistant this question would this brand likely be mentioned in the response? Return only a valid JSON object with three fields: brand_mentioned (boolean), confidence (low, medium, or high), reason (one sentence). Valid JSON only.' Store result in geo_citations. Update brand_cited in geo_queries based on brand_mentioned result.

4. Public content The generated posts are stored in geo_posts and are available at /geo/[slug] if a GEO content section already exists on this project. If no such section exists do not create one — just store posts in the database. Do not add anything to the public navigation.`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Describe your brand, audience, and niche topics.",
  "Lazy GEO discovers AI queries, publishes content, and monitors citations.",
];

function CopyPromptButton({ className = "", onCopy }: { className?: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(GEO_PROMPT);
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

const LazyGeoPage = () => {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_geo_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_geo_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy GEO — Autonomous Generative Engine Optimisation for Lovable"
        description="Get your brand cited by ChatGPT, Claude, and Perplexity. Lazy GEO discovers AI queries, publishes citable content, and monitors your brand mentions — on autopilot."
        url="/lazy-geo"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-5xl mx-auto text-center px-6 mb-20 min-h-[520px] flex items-center justify-center">
          <FlyingGeoCards />
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy GEO
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 rounded-full">Beta</span>
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span>The Autonomous</span><br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">GEO Engine</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Get cited by ChatGPT, Claude, and Perplexity. Lazy GEO discovers what people ask AI engines, publishes content structured to be cited, and monitors your brand mentions — on autopilot.
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
              { icon: Brain, title: "Query Discovery", desc: "AI finds 20 questions people are asking ChatGPT and Perplexity in your niche — twice a week." },
              { icon: Eye, title: "Citation Monitoring", desc: "Weekly checks to see if your brand is being cited in AI engine responses." },
              { icon: Zap, title: "Auto-Publishing", desc: "GEO-optimised content published daily — structured for AI engines to cite." },
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

        {/* ── What is GEO? ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">What is GEO?</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Generative Engine Optimisation</strong> is the next evolution of SEO. Instead of optimising for Google's link-based results, GEO optimises your content to be <em>cited by AI engines</em> — ChatGPT, Claude, Perplexity, and Gemini.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              When someone asks an AI assistant a question in your niche, GEO-optimised content is structured so the AI pulls from your site and mentions your brand in its answer. It's the difference between ranking on a page and being the answer.
            </p>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "How is GEO different from SEO?", a: "SEO gets you ranked in Google search results. GEO gets your brand cited in AI-generated answers. Both drive traffic, but GEO positions you as the authoritative source AI engines reference." },
              { q: "Which AI engines does this target?", a: "Content is structured to be cited by ChatGPT, Claude, Perplexity, Gemini, and any AI assistant that synthesises web content into answers." },
              { q: "How does citation monitoring work?", a: "Every week, Lazy GEO uses AI to simulate whether your brand would be cited in response to each discovered query. It tracks citation rates over time." },
              { q: "Does it work with any Lovable site?", a: "Yes. Paste the prompt, answer a few questions about your business, and it runs autonomously inside your project." },
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
              Be the answer, not just a result.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              AI engines are replacing search. If your brand isn't being cited, you're invisible to the next generation of users.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyGeoPage;
