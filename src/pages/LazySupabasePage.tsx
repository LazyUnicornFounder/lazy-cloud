import { useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { AlertTriangle, Check, Copy, Database, DollarSign, HardDrive, Hash, TrendingUp, Users, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import { useState } from "react";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Supabase Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete autonomous Supabase monitoring and content agent called Lazy Supabase to this project. It monitors your Supabase project for database events, user signups, edge function errors, and storage activity — turning database milestones, user growth, and system events into blog posts, product updates, and Slack alerts automatically.

---

MARKETING PAGE PROMPT — paste into LazyUnicorn project:

Add a new page at /lazy-supabase. It is a marketing and landing page for a product called Lazy Supabase — an autonomous monitoring and content agent that turns your Supabase database events into product updates, user milestone posts, and system alerts automatically.

Hero section
Headline: 'Your Supabase database is full of stories. Lazy Supabase tells them automatically.' Subheading: 'Lazy Supabase monitors your database for user signups, milestone events, and system health — turning every significant moment into a product update, blog post, or Slack alert without you writing a word.' Primary button: Copy the Lovable Prompt. Secondary button: See What It Monitors. Badge: Powered by Supabase.

How it works section
Headline: Your database events. Published automatically. Four steps: 1. Copy the setup prompt. 2. Paste into your Lovable project. 3. Configure which database events to monitor. 4. Significant events trigger content and alerts automatically.

What it monitors section
Eight cards: 1. User milestones — 100th user, 1000th user, growth streaks. Automatically writes a celebratory blog post for every milestone. 2. Signup spikes — detects unusual signup volume and alerts you in Slack. 3. Edge function errors — monitors all edge function error logs and alerts when error rates spike. 4. Storage growth — tracks storage usage and alerts when approaching limits. 5. Database size — monitors table growth and surfaces which tables are growing fastest. 6. Row milestones — when any key table hits a round number posts a product update automatically. 7. Revenue events — monitors pay_transactions if Lazy Pay is installed and surfaces MRR milestones. 8. Self-improving reports — learns which milestone posts get the most traffic and improves the template.

Pricing section
Free — self-hosted, uses your existing Supabase project. Pro at $19/month — coming soon.

Bottom CTA
Headline: Your database is growing. Let it tell its own story. Primary button: Copy the Lovable Prompt.

Navigation: Add Lazy Supabase to the LazyUnicorn navigation.

---

SETUP PROMPT — paste into user's Lovable project:

Add a complete autonomous Supabase monitoring and content agent called Lazy Supabase to this project. It monitors database events, user signups, edge function errors, and milestones — generating blog posts, product updates, and alerts automatically.

1. Database
Create these Supabase tables with RLS enabled:

supabase_settings: id (uuid, primary key, default gen_random_uuid()), brand_name (text), business_description (text), site_url (text), supabase_project_url (text), monitor_signups (boolean, default true), monitor_errors (boolean, default true), monitor_storage (boolean, default true), monitor_milestones (boolean, default true), milestone_tables (text), is_running (boolean, default true), setup_complete (boolean, default false),
prompt_version (text, nullable), created_at (timestamptz, default now()).
Note: Store SUPABASE_SERVICE_ROLE_KEY as a Supabase secret. Never in the database.

supabase_snapshots: id (uuid, primary key, default gen_random_uuid()), snapshot_type (text — one of signups, errors, storage, table-size), metric_name (text), metric_value (numeric), recorded_at (timestamptz, default now()).

supabase_milestones: id (uuid, primary key, default gen_random_uuid()), milestone_type (text), milestone_value (numeric), table_name (text), description (text), post_published (boolean, default false), alerted (boolean, default false), reached_at (timestamptz, default now()).

supabase_content: id (uuid, primary key, default gen_random_uuid()), content_type (text — one of milestone-post, product-update, growth-report), title (text), slug (text, unique), excerpt (text), body (text), published_at (timestamptz, default now()), status (text, default 'published'), views (integer, default 0).

supabase_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page
Create a page at /lazy-supabase-setup with a form:
- Brand name
- Business description
- Site URL
- Supabase project URL (your project URL from the Supabase dashboard)
- Supabase Service Role Key (password) — find in Supabase project settings under API. Stored as Supabase secret SUPABASE_SERVICE_ROLE_KEY.
- Monitor user signups (toggle, default on)
- Monitor edge function errors (toggle, default on)
- Monitor storage growth (toggle, default on)
- Monitor row milestones (toggle, default on)
- Tables to monitor for milestones (text, comma separated — e.g. blog_posts, pay_transactions, sms_messages)

Submit button: Activate Lazy Supabase

On submit:
1. Store SUPABASE_SERVICE_ROLE_KEY as Supabase secret
2. Save all values to supabase_settings
3. Set setup_complete to true and prompt_version to 'v0.0.1'
4. Immediately call supabase-monitor once
5. Redirect to /admin with message: Lazy Supabase is running. Monitoring your database for milestones and events.

3. Core monitoring edge function
Create a Supabase edge function called supabase-monitor. Cron: every hour — 0 * * * *

1. Read supabase_settings. If is_running is false or setup_complete is false exit.
2. Use the Supabase Management API at https://api.supabase.com using SUPABASE_SERVICE_ROLE_KEY to collect metrics:

User signups (if monitor_signups is true):
Query the auth.users table for count of users created in the last hour and total count. Insert a snapshot into supabase_snapshots with snapshot_type signups. Check if the total count has crossed a milestone: 10, 50, 100, 500, 1000, 5000, 10000. If so insert into supabase_milestones and trigger supabase-publish-milestone.

Edge function errors (if monitor_errors is true):
Query the edge function logs for error counts in the last hour. Insert a snapshot with snapshot_type errors. If error rate has increased more than 50 percent versus the previous hour insert a milestone with type error-spike and trigger alert-send if Lazy Alert is installed.

Storage growth (if monitor_storage is true):
Query Supabase storage for total bytes used. Insert a snapshot with snapshot_type storage. If approaching 90 percent of plan limits insert a milestone with type storage-warning and alert.

Table row milestones (if monitor_milestones is true):
For each table in milestone_tables query the row count. Insert a snapshot with snapshot_type table-size and the table name as metric_name. Check if the count has crossed a round milestone: 100, 500, 1000, 5000, 10000, 50000, 100000. If so insert into supabase_milestones and trigger supabase-publish-milestone.

Revenue milestones (if pay_transactions table exists):
Query total successful transaction count and sum of amount_cents. Check for MRR milestones. If Lazy Pay is installed and MRR crosses $100, $500, $1000, $5000 insert a milestone and publish a celebration post.

Log all errors to supabase_errors with function_name supabase-monitor.

4. Content generation edge function
Create a Supabase edge function called supabase-publish-milestone handling POST requests with a milestone_id.

1. Read supabase_settings. Read the matching supabase_milestones row.
2. Call the built-in Lovable AI:
'You are writing a product update post for [brand_name] described as [business_description]. Celebrate this milestone: [description]. Write an authentic, excited but not hypey post that founders and users will want to share. Include what the milestone means, how long it took to get here, and what comes next. 400 to 700 words. Return only a valid JSON object: title (string), slug (lowercase hyphenated), excerpt (one punchy sentence under 160 characters), body (clean markdown, no HTML, no bullet points in prose, ## for headers, ends with: Built autonomously using LazyUnicorn.ai — link to https://lazyunicorn.ai). No preamble. No code fences.'
3. Check for duplicate slug — append 4-digit number if exists.
4. Insert into supabase_content and also into blog_posts if that table exists.
5. Update supabase_milestones: set post_published to true.
6. If Lazy Alert is installed call alert-send with agent Lazy Supabase, event_type milestone-reached, and the milestone description.
Log errors to supabase_errors with function_name supabase-publish-milestone.

5. Weekly growth report edge function
Create a Supabase edge function called supabase-weekly-report. Cron: every Monday at 6am UTC — 0 6 * * 1

1. Read supabase_settings. If is_running is false exit.
2. Collect last 7 days of supabase_snapshots data. Calculate: new signups this week, total users, week over week growth rate, error rate trend, storage usage trend, top growing tables.
3. Call the built-in Lovable AI to write a growth report:
'Write a brief weekly growth report for [brand_name]. Data: [metrics]. Write 3 to 5 bullet points highlighting what grew, what stayed flat, and one thing to watch. Friendly tone. Return only the report text.'
4. Insert into supabase_content with content_type growth-report.
5. If Lazy Alert is installed send the report to Slack.
Log errors to supabase_errors with function_name supabase-weekly-report.

6. Public pages
/milestones — show all supabase_content ordered by published_at descending. Each shows title, content type tag, excerpt, and date. Links to /milestones/[slug].
/milestones/[slug] — full post rendered from markdown.
At the bottom add: 🦄 Powered by Lazy Supabase — autonomous database monitoring for Lovable sites. Built by LazyUnicorn.ai — link to https://lazyunicorn.ai.

7. Admin

Do not build a standalone dashboard page for this agent. The dashboard lives at /admin/supabase as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-supabase-setup.

8. Navigation
Add Milestones link to the main navigation pointing to /milestones. Add an Admin link to the main site navigation pointing to /admin.
Do not add the setup page to public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const steps = ["Copy the setup prompt from this page.", "Paste it into your existing Lovable project.", "Add your Supabase service role key.", "Database milestones publish automatically as blog posts."];

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
    <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">
      Powered by Supabase
    </span>
  );
}

const LazySupabasePage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-supabase");
  const promptText = dbPrompt?.prompt_text || SETUP_PROMPT;

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_supabase_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Supabase — Autonomous Database Monitoring Agent for Lovable" description="Your Supabase database is full of stories. Lazy Supabase tells them automatically." url="/lazy-supabase" />
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
              <AutopilotHeadline product="lazy-supabase" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Supabase
                </h1>
                <ServiceBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy Supabase monitors your database for user signups, milestone events, and system health — turning every significant moment into a product update, blog post, or Slack alert without you writing a word.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
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

        {/* How it works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20 pt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">Your database grows. Lazy Supabase tells the story.</motion.h2>
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
              { icon: Users, title: "User Milestones", desc: "100th user, 1000th user, growth streaks — automatically writes a celebratory post." },
              { icon: TrendingUp, title: "Signup Spikes", desc: "Detects unusual signup volume and alerts you immediately." },
              { icon: AlertTriangle, title: "Edge Function Errors", desc: "Monitors all edge function error logs and alerts when error rates spike." },
              { icon: HardDrive, title: "Storage Growth", desc: "Tracks storage usage and alerts when approaching limits." },
              { icon: Database, title: "Database Size", desc: "Monitors table growth and surfaces which tables are growing fastest." },
              { icon: Hash, title: "Row Milestones", desc: "When any key table hits a round number, posts a product update automatically." },
              { icon: DollarSign, title: "Revenue Events", desc: "Monitors pay_transactions if Lazy Pay is installed and surfaces MRR milestones." },
              { icon: Zap, title: "Self-Improving Reports", desc: "Learns which milestone posts get the most traffic and improves the template." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="border-b sm:odd:border-r last:border-b-0 border-border bg-card p-6">
                <item.icon size={18} className="text-foreground/65 mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection lazyFeatures={["Lazy Supabase setup prompt", "Self-hosted in your Lovable project", "Database milestone monitoring", "Uses your existing Supabase project"]} proFeatures={["Hosted version", "Multi-project monitoring", "Advanced growth analytics", "Custom milestone thresholds"]} ctaButton={<CopyPromptButton text={promptText} onCopy={handlePromptCopy} className="w-full justify-center" />} />

        <LazyFaqSection faqs={[
          { q: "Does it need access to my data?", a: "It uses your service role key to count rows and monitor metrics. It never reads the content of your data." },
          { q: "What counts as a milestone?", a: "User counts hitting 10, 50, 100, 500, 1000 etc. Row counts in key tables hitting round numbers. MRR milestones if Lazy Pay is installed." },
          { q: "Will it publish every event?", a: "No. Only significant milestones trigger posts. Routine database activity is monitored but not published." },
          { q: "Can I choose which tables to monitor?", a: "Yes. The setup page lets you specify which tables to track for row milestones." },
          { q: "Does it work with multiple Supabase projects?", a: "The current version monitors one project. Multi-project support is coming in Pro." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Your database is growing. Let it tell its own story.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">Every milestone, every spike, every significant moment in your database — published automatically.</p>
            <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
            <p className="font-body text-sm text-foreground/60 mt-4">Open your Lovable project, paste it into the chat, add your API key. Done.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazySupabasePage;
