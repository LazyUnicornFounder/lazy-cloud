import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, Copy, Check } from "lucide-react";
import FlyingSeoCards from "@/components/lazy-seo/FlyingSeoCards";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SEO_PROMPT = `Add a Lazy SEO engine to this project. It automatically identifies keyword opportunities and publishes SEO-optimised blog posts targeting those keywords — with no manual input required after setup.

1. Database Create a Supabase table called seo_settings with fields: id (uuid, primary key), site_url (text), business_description (text), target_keywords (text), competitors (text), posts_per_day (integer, default 2), is_running (boolean, default true). Create a Supabase table called seo_posts with fields: id (uuid, primary key, default gen_random_uuid()), title (text), slug (text, unique), body (text), target_keyword (text), published_at (timestamptz, default now()), status (text, default 'published'). Create a Supabase table called seo_keywords with fields: id (uuid, primary key, default gen_random_uuid()), keyword (text), has_content (boolean, default false), priority (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called seo_errors with fields: id (uuid, primary key, default gen_random_uuid()), error_message (text), created_at (timestamptz, default now()).

2. Admin page If this project already has an admin page, add Lazy SEO as a new section inside it. If no admin page exists, create one at /admin. Inside the admin page create a Lazy SEO section with two tabs: Setup and Dashboard.

Setup tab contains a form with five fields: Site URL (the full URL of this site), Business description (what does this site do and who is it for?), Target keywords (the main topics and keywords this site should rank for — comma separated), Competitors (up to three competitor URLs — comma separated), Posts per day (select: 1 / 2 / 4). A submit button labelled 'Save and Start'. On submit save all values to seo_settings. Show a success message: 'Lazy SEO is running. Your first post publishes within 24 hours.'

Dashboard tab shows: total SEO posts published, keywords being targeted, a table of all keywords from seo_keywords with columns — keyword, has content (yes or no), priority score. A table of the last 10 published posts with title, target keyword, published date, and a view link. A toggle to pause or resume Lazy SEO updating is_running in seo_settings. A button labelled 'Discover Keywords Now' that manually triggers the lazy-seo-discover edge function. A button labelled 'Publish One Now' that manually triggers the lazy-seo-publish edge function. A count of errors in seo_errors with a button to view them.

3. Edge functions Create a Supabase edge function called lazy-seo-discover that runs every Monday at 6am UTC. It reads seo_settings and uses the built-in Lovable AI to generate 20 keyword opportunities based on the business description, target keywords, and competitor URLs. The prompt to the AI: 'You are an SEO strategist. For a site described as [business_description] targeting these topics: [target_keywords] and competing with: [competitors] — generate 20 specific long-tail keyword phrases that this site should be ranking for on Google. These should be real search queries with genuine search intent. Each keyword should be specific enough to write a focused 1000-word article about. Return only a valid JSON array where each item has two fields: keyword (string) and priority (integer from 1 to 10 where 10 is highest). No preamble. No code fences. Valid JSON only.' Parse the response and insert new keywords into seo_keywords. Skip any keyword that already exists. Set has_content to false on all new inserts.

Create a Supabase edge function called lazy-seo-publish that runs on a schedule matching the posts_per_day setting in seo_settings — if 1 post per day run at 8am UTC, if 2 posts per day run at 8am and 6pm UTC, if 4 posts per day run at 6am, 12pm, 6pm, and 11pm UTC. On each run read seo_settings. If is_running is false exit immediately. Select the highest priority keyword from seo_keywords where has_content is false. If no keywords remain, trigger lazy-seo-discover and exit. Use the built-in Lovable AI to write an SEO-optimised post targeting that keyword. The prompt to the AI: 'You are an SEO content writer for a site described as: [business_description]. Write an SEO-optimised article targeting this exact keyword: [target_keyword]. The article must rank on the first page of Google for this keyword. Return only a valid JSON object with no preamble and no code fences. The JSON must have exactly four fields: title (string that naturally includes the target keyword), slug (lowercase hyphenated url-friendly string), excerpt (one sentence under 160 characters naturally including the keyword), body (full article in clean markdown — no HTML, no bullet points in body prose, use ## for section headers, 1000 to 1500 words, includes the target keyword naturally throughout at a density of 1 to 2 percent, includes the keyword in the first paragraph, includes at least one ## header containing the keyword, ends with a call to action paragraph followed by exactly this paragraph: Looking for more tools to build and run your business autonomously? LazyUnicorn.ai is the definitive directory of AI tools for solo founders building autonomous companies — link LazyUnicorn.ai to https://lazyunicorn.ai and Lazy SEO to https://lazyunicorn.ai/lazy-seo). Return only valid JSON.' Parse the response. If parsing fails retry once. If it fails again log to seo_errors and exit. Check if slug already exists in seo_posts — if it does append a random four digit number. Insert into seo_posts. Update has_content to true for the targeted keyword in seo_keywords.

4. Public blog pages Create a public page at /blog showing all posts from both seo_posts and blog_posts tables if blog_posts exists, otherwise from seo_posts only, where status is published, ordered by published_at descending. Show each post as a card with title, excerpt, target keyword tag, and published date. Each card links to /blog/[slug]. Create a public page at /blog/[slug] that checks seo_posts first then blog_posts for the matching slug. Render the body markdown as formatted HTML. Show title, published date, target keyword tag, and full body content. At the bottom of every post add: '🦄 Optimised by Lazy SEO — autonomous SEO for Lovable sites. Discover more at LazyUnicorn.ai' linked to https://lazyunicorn.ai.

5. Navigation If a /blog page does not already exist in the main navigation, add one. Do not add the admin or SEO engine pages to the public navigation.`;

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
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold"
            >
              Introducing
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
