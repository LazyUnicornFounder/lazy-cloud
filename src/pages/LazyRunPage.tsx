import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText, Search, Globe, ShoppingCart, Mic, CreditCard,
  MessageSquare, Video, Code, ChevronDown, Zap, Activity,
  Clock, ArrowRight, Radar, Compass, Layers, BarChart3,
  Database, Bell, Send, Shield, LayoutDashboard
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";

const LAZY_RUN_PROMPT = `[Lazy Run Prompt — v0.0.4 — LazyUnicorn.ai]

Add a complete unified autonomous operations runtime called Lazy Run to this project. Lazy Run installs and manages all Lazy engines from a single setup prompt, a single dashboard, and a unified scheduling and monitoring system. Install only the engines the user activates during setup.

---

## IMPORTANT: Function naming

All edge functions must use these exact names. Lazy Run calls them by these names.

| Engine | Functions |
|--------|-----------|
| Blogger | blog-publish |
| SEO | seo-discover, seo-publish |
| GEO | geo-discover, geo-publish, geo-test |
| Store | store-discover, store-listings, store-prices, store-promote, store-optimise, store-content |
| Voice | voice-narrate, voice-rss |
| Pay | pay-checkout, pay-webhook, pay-optimise, pay-recover, pay-portal |
| SMS | sms-send, sms-receive, sms-status, sms-sequences-run, sms-optimise |
| Stream | stream-monitor, stream-process, stream-write-content, stream-optimise |
| Code | github-webhook, code-sync-roadmap, code-write-content, code-optimise |
| GitLab | gitlab-webhook, gitlab-sync-roadmap, gitlab-write-content, gitlab-optimise |
| Linear | linear-sync-all, linear-write-content, linear-velocity-report, linear-optimise |
| Crawl | crawl-run, crawl-extract, crawl-publish |
| Perplexity | perplexity-research, perplexity-feed-engines, perplexity-test-citations, perplexity-improve-content |
| Alert | alert-send, alert-monitor, alert-briefing, alert-command |
| Telegram | telegram-send, telegram-monitor, telegram-briefing, telegram-command |
| Contentful | contentful-pull, contentful-webhook, contentful-push |
| Supabase | supabase-monitor, supabase-publish-milestone, supabase-weekly-report |
| Security | security-scan, security-poll, security-alert, security-generate-report, security-monitor |
| Run | run-orchestrator, run-weekly-report, run-health-check |

---

## IMPORTANT: API key storage

ALL API keys must be stored as Supabase secrets. Never in database tables.
Reference in edge functions via Deno.env.get().

Required secrets by engine:
- Blogger/SEO/GEO/Store: none (uses built-in Lovable AI)
- Voice: ELEVENLABS_API_KEY
- Pay: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- Stream: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET
- Code: GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET
- GitLab: GITLAB_TOKEN, GITLAB_WEBHOOK_SECRET
- Linear: LINEAR_API_KEY
- Crawl: FIRECRAWL_API_KEY
- Perplexity: PERPLEXITY_API_KEY
- Alert: SLACK_SIGNING_SECRET
- Telegram: TELEGRAM_BOT_TOKEN
- Contentful: CONTENTFUL_DELIVERY_TOKEN, CONTENTFUL_MANAGEMENT_TOKEN, CONTENTFUL_WEBHOOK_SECRET
- Supabase monitoring: SUPABASE_SERVICE_ROLE_KEY
- Security: AIKIDO_API_KEY

---

## 1. Database

Create these Supabase tables with RLS enabled:

**run_settings**
id (uuid, primary key, default gen_random_uuid()),
site_url (text),
brand_name (text),
business_description (text),
target_audience (text),
support_email (text),
active_engines (text),
master_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

**run_activity**
id (uuid, primary key, default gen_random_uuid()),
engine (text),
action (text),
result (text),
details (text),
created_at (timestamptz, default now())

**run_performance**
id (uuid, primary key, default gen_random_uuid()),
engine (text),
metric_name (text),
metric_value (numeric),
recorded_at (timestamptz, default now())

**run_errors**
id (uuid, primary key, default gen_random_uuid()),
engine (text),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

Also create all database tables for each activated engine using these exact table names. Every engine settings table must include a prompt_version (text, nullable) field in addition to the standard fields. Set the prompt_version value when seeding each engine settings table in step 4 of the setup submit using the current version strings from SPEC.md.

Blogger: blog_settings, blog_posts, blog_errors
SEO: seo_settings, seo_posts, seo_keywords (add source field: text), seo_errors
GEO: geo_settings, geo_posts, geo_queries (add source field: text), geo_citations, geo_errors
Store: store_settings, store_products, store_promotions, store_content, store_errors
Voice: voice_settings, voice_episodes, voice_errors
Pay: pay_settings, pay_products, pay_customers, pay_transactions, pay_subscriptions, pay_abandoned, pay_optimisation_log, pay_errors
SMS: sms_settings, sms_contacts, sms_messages, sms_sequences, sms_optouts, sms_optimisation_log, sms_errors
Stream: stream_settings, stream_sessions, stream_content, stream_clips, stream_transcripts, stream_optimisation_log, stream_errors
Code: code_settings, code_commits, code_releases, code_content, code_roadmap, code_optimisation_log, code_errors
GitLab: gitlab_settings, gitlab_commits, gitlab_merge_requests, gitlab_releases, gitlab_content, gitlab_roadmap, gitlab_optimisation_log, gitlab_errors
Linear: linear_settings, linear_issues, linear_cycles, linear_projects, linear_content, linear_optimisation_log, linear_errors
Crawl: crawl_settings, crawl_targets, crawl_results, crawl_intel, crawl_leads, crawl_errors
Perplexity: perplexity_settings, perplexity_research, perplexity_citations, perplexity_content, perplexity_errors
Alert: alert_settings, alert_log, alert_errors
Telegram: telegram_settings, telegram_log, telegram_errors
Contentful: contentful_settings, contentful_entries, contentful_sync_log, contentful_errors
Supabase monitoring: supabase_settings, supabase_snapshots, supabase_milestones, supabase_content, supabase_errors
Security: security_settings, security_scans, security_vulnerabilities, security_reports, security_errors

Create only the tables for engines the user activates.

---

## 2. Setup page

Create a multi-step setup page at /lazy-run-setup.

**Step 1 — Welcome**
Show: "Welcome to Lazy Run. In the next 5 minutes you will set up the autonomous operations layer for your Lovable site. After setup your site will publish content, rank on Google, appear in AI answers, take payments, text customers, and more — automatically, forever."
Next button.

**Step 2 — Choose engines**
Show engine cards grouped by category. Each card shows engine name, one-line description, and an on/off toggle. Default content engines on (Blogger, SEO, GEO). All others default off.

Group: Content Engines
- Lazy Blogger: Publishes SEO and GEO blog posts automatically every 15 minutes
- Lazy SEO: Discovers keywords and publishes ranking articles
- Lazy GEO: Publishes content cited by ChatGPT and Perplexity
- Lazy Crawl: Monitors competitors and feeds real intelligence into your content engines
- Lazy Perplexity: Researches your niche with live web data and tests brand citation rates

Group: Commerce Engines
- Lazy Store: Discovers products, writes listings, optimises conversion
- Lazy Pay: Installs Stripe with self-improving conversion optimisation
- Lazy SMS: Sends automated texts via Twilio that improve themselves

Group: Media Engines
- Lazy Voice: Narrates every post in your voice via ElevenLabs
- Lazy Stream: Turns every Twitch stream into blog posts and SEO content

Group: Developer Engines
- Lazy Code: Turns every GitHub commit into a changelog and developer post
- Lazy GitLab: Turns every GitLab commit into a changelog and developer post
- Lazy Linear: Turns Linear issues and cycles into changelogs and product updates

Group: Channels
- Lazy Alert: Real-time Slack alerts for every engine event
- Lazy Telegram: Real-time Telegram alerts and bot commands for every engine
- Lazy Contentful: Two-way content sync between your Lovable site and Contentful
- Lazy Supabase: Monitors database milestones and publishes product update posts

Group: Security
- Lazy Security: Runs automated Aikido pentests, tracks vulnerabilities, and generates audit-ready reports

Below the cards show which API keys each selected engine requires.
Next button.

**Step 3 — Core settings**
Fields:
- Site URL
- Brand name
- Business description
- Target audience
- Support email

Include Suggest buttons that auto-fill related fields using the built-in Lovable AI.
Next button.

**Step 4 — API keys**
Show only the fields required by engines selected in step 2. Group by service:

Content engines: show note "Lazy Blogger, SEO, GEO, and Store use Lovable's built-in AI — no API key required."

Firecrawl section (if Lazy Crawl active): Firecrawl API key — stored as FIRECRAWL_API_KEY secret.

Perplexity section (if Lazy Perplexity active): Perplexity API key — stored as PERPLEXITY_API_KEY secret.

ElevenLabs section (if Lazy Voice active): API key stored as ELEVENLABS_API_KEY, Voice ID (default EXAVITQu4vr4xnSDxMaL).

Stripe section (if Lazy Pay active): Publishable Key as STRIPE_PUBLISHABLE_KEY, Secret Key as STRIPE_SECRET_KEY, Webhook Secret as STRIPE_WEBHOOK_SECRET.

Twilio section (if Lazy SMS active): Account SID as TWILIO_ACCOUNT_SID, Auth Token as TWILIO_AUTH_TOKEN, Phone Number.

Twitch section (if Lazy Stream active): Client ID as TWITCH_CLIENT_ID, Client Secret as TWITCH_CLIENT_SECRET, Username.

GitHub section (if Lazy Code active): Personal Access Token as GITHUB_TOKEN, Webhook Secret as GITHUB_WEBHOOK_SECRET, Username, Repository.

GitLab section (if Lazy GitLab active): Personal Access Token as GITLAB_TOKEN, Webhook Secret as GITLAB_WEBHOOK_SECRET, Username, Project path.

Linear section (if Lazy Linear active): API Key as LINEAR_API_KEY, Team ID.

Slack section (if Lazy Alert active): Slack Webhook URL, Signing Secret as SLACK_SIGNING_SECRET.

Telegram section (if Lazy Telegram active): Bot Token as TELEGRAM_BOT_TOKEN, Chat ID.

Contentful section (if Lazy Contentful active): Space ID, Delivery Token as CONTENTFUL_DELIVERY_TOKEN, Management Token as CONTENTFUL_MANAGEMENT_TOKEN, Webhook Secret as CONTENTFUL_WEBHOOK_SECRET.

Supabase monitoring section (if Lazy Supabase active): Project URL, Service Role Key as SUPABASE_SERVICE_ROLE_KEY.

Aikido section (if Lazy Security active):
- Aikido API key (password) — get at aikido.dev. Stored as AIKIDO_API_KEY secret.
- Aikido Project ID (text) — find in your Aikido project settings.
- Pentest frequency (select: Weekly / Monthly / Quarterly / Manual only)

Next button.

**Step 5 — Schedule**
Show a visual publishing schedule for active content engines. Selects for posts per day. Auto-stagger cron times so engines do not compete. Show a preview of the full weekly schedule as a timeline.
Launch button.

**On submit:**
1. Store all API keys as Supabase secrets
2. Save run_settings with active_engines as comma-separated list
3. Set setup_complete to true and prompt_version to 'v0.0.4'
4. Seed all engine-specific settings tables with provided values
5. Create all required database tables for active engines
6. For content engines immediately trigger: blog-publish, seo-discover, geo-discover
7. For Crawl if active immediately trigger crawl-run
8. For Perplexity if active immediately trigger perplexity-research
9. For Contentful if active immediately trigger contentful-pull
10. For Supabase if active immediately trigger supabase-monitor
11. For Security if active immediately trigger security-scan
12. Show loading: "Launching your autonomous operations layer..."
13. Redirect to /admin with message: "Lazy Run is active. Your autonomous operations layer is running."

---

## 3. Master orchestrator edge functions

**run-orchestrator**
Cron: every 30 minutes — */30 * * * *

1. Read run_settings. If master_running is false or setup_complete is false exit.
2. Read active_engines as comma-separated list.
3. For each active engine check if it is time to run based on configured schedule.
4. Stagger execution with a 2-minute delay between each engine call.
5. Call the corresponding function for each engine due to run:

Content engines:
- Blogger: blog-publish
- SEO: seo-publish (seo-discover runs on its own Monday cron)
- GEO: geo-publish (geo-discover runs on its own cron)
- Crawl: crawl-run every 30 min, crawl-publish daily 6am
- Perplexity: perplexity-research daily 5am, perplexity-test-citations Sunday 10am, perplexity-improve-content Wednesday 9am

Commerce engines:
- Store: store-discover daily, store-optimise Sunday, store-content Tue/Fri, store-listings and store-prices daily
- Pay: pay-optimise Sunday, pay-recover daily
- SMS: sms-sequences-run every hour

Media engines:
- Voice: voice-narrate every 30 min
- Stream: stream-monitor every 5 min

Developer engines:
- Code: code-sync-roadmap every hour
- GitLab: gitlab-sync-roadmap every hour
- Linear: linear-sync-all every hour, linear-velocity-report Monday

Channels:
- Alert: alert-monitor every 5 min, alert-briefing daily 8am
- Telegram: telegram-monitor every 5 min, telegram-briefing daily 8am
- Contentful: contentful-pull every hour, contentful-push every 30 min
- Supabase: supabase-monitor every hour, supabase-weekly-report Monday
- Security: security-scan every hour (checks if pentest is due), security-poll every 10 min (checks scan status), security-monitor daily 3am

6. Log each execution to run_activity: engine, action, result, details.
7. Log failures to run_errors.

**run-weekly-report**
Cron: every Monday at 7am UTC — 0 7 * * 1

1. Read run_settings. If master_running is false exit.
2. Collect last 7 days metrics from every active engine:
- Blogger: blog_posts count
- SEO: seo_posts count, seo_keywords count, keyword sources breakdown
- GEO: geo_posts count, citation rate, query sources breakdown
- Store: store_products count, active promotions
- Pay: pay_transactions succeeded count, MRR from pay_subscriptions
- SMS: sms_messages sent count, response rate from sms_sequences
- Voice: voice_episodes count
- Stream: stream_sessions processed, stream_content count
- Code: code_commits processed, code_content count
- GitLab: gitlab_commits processed, gitlab_content count
- Linear: linear_issues completed, linear_content count
- Crawl: crawl_targets active, crawl_intel count, crawl_leads count
- Perplexity: perplexity_research count, brand citation rate from perplexity_citations
- Alert: alert_log count, success rate
- Telegram: telegram_log count
- Contentful: contentful_entries synced, contentful_sync_log push count
- Supabase: supabase_milestones reached, supabase_content count
- Security: current security score from latest security_scans, open critical count, open high count from security_vulnerabilities, last pentest date

3. Call the built-in Lovable AI:
"Write a weekly performance report for [brand_name]. Metrics from the last 7 days: [metrics list]. Write a friendly report under 300 words. Cover what the engines accomplished, the best performing engine, any areas for improvement, projection for next week. Write in second person. Return only the report text."
4. If Lazy Alert is installed send to Slack via alert-send.
5. If Lazy Telegram is installed send via telegram-send.
6. Send email to support_email with subject: "Your Lazy Run weekly report — [current date]".
7. Insert into run_activity with engine run, action weekly-report, result success.
Log errors to run_errors.

**run-health-check**
Cron: every hour — 0 * * * *

1. Read run_settings.
2. For each active engine query its errors table for errors in the last hour.
3. If any engine has more than 3 errors in the last hour: insert warning into run_activity with result error. If Lazy Alert is installed call alert-send with the warning. If Lazy Telegram is installed call telegram-send.
4. For Security engine: also check security_vulnerabilities for any new critical severity vulnerabilities found in the last hour. If found and Lazy Alert or Lazy Telegram is installed send an immediate alert regardless of error threshold.
5. Insert performance snapshot into run_performance for each engine.
Log errors to run_errors.

---

## 4. Install all engine edge functions

Install all edge functions for each active engine using these exact function names:
blog-publish, seo-discover, seo-publish, geo-discover, geo-publish, geo-test, store-discover, store-listings, store-prices, store-promote, store-optimise, store-content, voice-narrate, voice-rss, pay-checkout, pay-webhook, pay-optimise, pay-recover, pay-portal, sms-send, sms-receive, sms-status, sms-sequences-run, sms-optimise, stream-monitor, stream-process, stream-write-content, stream-optimise, github-webhook, code-sync-roadmap, code-write-content, code-optimise, gitlab-webhook, gitlab-sync-roadmap, gitlab-write-content, gitlab-optimise, linear-sync-all, linear-write-content, linear-velocity-report, linear-optimise, crawl-run, crawl-extract, crawl-publish, perplexity-research, perplexity-feed-engines, perplexity-test-citations, perplexity-improve-content, alert-send, alert-monitor, alert-briefing, alert-command, telegram-send, telegram-monitor, telegram-briefing, telegram-command, contentful-pull, contentful-webhook, contentful-push, supabase-monitor, supabase-publish-milestone, supabase-weekly-report, security-scan, security-poll, security-alert, security-generate-report, security-monitor.

Only install functions for active engines.

---

## 5. Admin dashboard

Do not build a standalone /lazy-run-dashboard page. The unified admin dashboard lives at /admin and is built separately using the LazyUnicorn Admin Dashboard prompt.

Lazy Run's contribution to the admin is its data — run_activity, run_performance, run_errors, and run_settings are all read by the admin dashboard to power the overview page, activity feed, performance charts, and master controls.

On setup completion redirect to /admin with message: "Lazy Run is active. Your autonomous operations layer is running."

If /admin does not yet exist when Lazy Run is installed, create a temporary page at /admin that shows: the run_settings brand name, the master_running toggle connected to run_settings, a list of active engines from active_engines in run_settings each with their is_running status, the last 20 rows from run_activity, and a message: "Install the LazyUnicorn Admin Dashboard for the full control panel."

---

## 6. Public pages

Do not add any Lazy Run pages to public navigation.
Content published by individual engines appears through their own public routes.

---

## 7. Navigation

Add a single Admin link to site navigation pointing to /admin.
This replaces any existing admin links.
Do not expose any setup routes in public navigation.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const engines = [
  { name: "Lazy Blogger", desc: "Publishes four blog posts per day automatically.", icon: FileText, href: "/lazy-blogger" },
  { name: "Lazy SEO", desc: "Discovers keywords and publishes ranking articles.", icon: Search, href: "/lazy-seo" },
  { name: "Lazy GEO", desc: "Gets your brand cited by ChatGPT and Perplexity.", icon: Globe, href: "/lazy-geo" },
  { name: "Lazy Crawl", desc: "Monitors competitors and feeds intelligence to your engines.", icon: Radar, href: "/lazy-crawl" },
  { name: "Lazy Perplexity", desc: "Queries Perplexity for trends and feeds your content engines.", icon: Compass, href: "/lazy-perplexity" },
  { name: "Lazy Contentful", desc: "Two-way content sync with Contentful.", icon: Layers, href: "/lazy-contentful" },
  { name: "Lazy Store", desc: "Discovers products, writes listings, optimises conversion.", icon: ShoppingCart, href: "/lazy-store" },
  { name: "Lazy Voice", desc: "Narrates every blog post in your voice via ElevenLabs.", icon: Mic, href: "/lazy-voice" },
  { name: "Lazy Pay", desc: "Installs Stripe with self-improving conversion optimisation.", icon: CreditCard, href: "/lazy-pay" },
  { name: "Lazy SMS", desc: "Sends automated texts via Twilio that improve themselves.", icon: MessageSquare, href: "/lazy-sms" },
  { name: "Lazy Stream", desc: "Turns every Twitch stream into blog posts and SEO content.", icon: Video, href: "/lazy-stream" },
  { name: "Lazy GitHub", desc: "Turns every GitHub commit into a changelog and developer post.", icon: Code, href: "/lazy-github" },
  { name: "Lazy GitLab", desc: "Turns GitLab activity into public content.", icon: Code, href: "/lazy-gitlab" },
  { name: "Lazy Linear", desc: "Turns Linear cycles into product update content.", icon: BarChart3, href: "/lazy-linear" },
  { name: "Lazy Supabase", desc: "Narrates your database growth story automatically.", icon: Database, href: "/lazy-supabase" },
  { name: "Lazy Alert", desc: "Every engine event reported to Slack in real time.", icon: Bell, href: "/lazy-alert" },
  { name: "Lazy Telegram", desc: "Real-time engine reporting via Telegram bot.", icon: Send, href: "/lazy-telegram" },
  { name: "Lazy Security", desc: "Autonomous pentesting and vulnerability monitoring via Aikido.", icon: Shield, href: "/lazy-security" },
  
];

const faqs = [
  { q: "Do I need all seventeen engines?", a: "No. The setup screen lets you choose which engines to activate. You can start with two or three and add more later without reinstalling." },
  { q: "Does it replace the individual Lazy prompts?", a: "Yes. If you install Lazy Run you do not need to paste the individual prompts. Lazy Run includes all of them." },
  { q: "What API keys do I need?", a: "Only the ones for the engines you activate. Content engines like Lazy Blogger, Lazy SEO, and Lazy GEO use Lovable's built-in AI — no API key required. Lazy Pay needs Stripe. Lazy SMS needs Twilio. Lazy Voice needs ElevenLabs. Lazy Stream needs Twitch." },
  { q: "Can I still use individual engines if I have them installed?", a: "Yes. Lazy Run is additive. If you already have Lazy Blogger installed it will detect it and manage it alongside the others." },
  { q: "How is Lazy Run different from just pasting all the individual prompts?", a: "Lazy Run adds the coordination layer — unified scheduling, cross-engine activity feed, master controls, performance reporting, and smart resource management. The individual prompts do not talk to each other. Lazy Run makes them work as one system." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

const dashboardFeatures = [
  { icon: Zap, title: "Master toggle", desc: "One switch pauses or resumes every engine simultaneously." },
  { icon: Activity, title: "Unified feed", desc: "Every action from every engine in a single chronological activity stream." },
  { icon: Clock, title: "Smart scheduling", desc: "Engines are staggered automatically so they never compete for resources or API limits." },
];

function CopyPromptButton({ label = "COPY THE LOVABLE PROMPT" }: { label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_RUN_PROMPT);
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

export default function LazyRunPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Run — The Autonomous Runtime for Lovable"
        description="One prompt installs the complete autonomous operations layer into your Lovable project. Seventeen engines. One dashboard. Everything runs itself."
        url="/lazy-run"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
            <span className="inline-block font-display text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-foreground/20 text-foreground/50 mb-6">
              INCLUDES ALL LAZY ENGINES
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            <span>The autonomous half of Lovable. In one prompt.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl leading-relaxed mb-10"
          >
            Lazy Run installs the complete autonomous operations layer into your existing Lovable project. Blog posts that publish themselves. SEO that compounds. GEO that gets you cited by AI. Payments that optimise. SMS that converts. Audio that narrates. Stores that grow. All managed from one dashboard. All running without you.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("what-it-installs")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              SEE WHAT IT INSTALLS <ChevronDown size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Lovable builds your site.
            <br />
            Then what?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 leading-relaxed">
            Lovable is the best way to build a product. It is not the operations layer. It does not publish your blog. It does not target your SEO keywords. It does not send SMS confirmations. It does not narrate your posts. It does not optimise your payments. It does not process your GitHub commits. Those things require a second layer — the autonomous operations layer that runs your site after Lovable has built it. Lazy Run is that layer.
          </motion.p>
        </div>
      </section>

      {/* What It Installs */}
      <section id="what-it-installs" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Every Lazy engine. One prompt.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {engines.map((e, i) => (
              <motion.a
                key={e.name}
                href={e.href}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border p-6 bg-card hover:border-foreground/20 transition-colors group"
              >
                <e.icon size={20} className="text-foreground/30 mb-3 group-hover:text-foreground/60 transition-colors" />
                <h3 className="font-display text-sm font-bold mb-1">{e.name}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{e.desc}</p>
              </motion.a>
            ))}
          </div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-body text-sm text-foreground/30 text-center mt-10 max-w-lg mx-auto">
            All eighteen engines install in one prompt. All run automatically. All managed from one dashboard.
          </motion.p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            One dashboard. Everything running.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardFeatures.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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

      {/* Compound Effect */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Eighteen engines compounding simultaneously.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 leading-relaxed">
            Each Lazy engine compounds on its own. Lazy Blogger builds domain authority. Lazy SEO captures keyword traffic. Lazy GEO earns AI citations. Lazy Store grows revenue. Together they compound on each other. The blog posts support the SEO. The SEO drives traffic to the store. The store triggers the SMS sequences. The SMS drives repeat purchases. The payments data improves the copy. Lazy Run coordinates the whole system so every engine feeds every other one. One prompt. Eighteen compounding loops. Running forever.
          </motion.p>
        </div>
      </section>

      <LazyPricingSection
        lazyFeatures={["Lazy Run setup prompt", "Self-hosted in your existing Lovable project", "Installs all eighteen engines", "Bring your own API keys for each service"]}
        proFeatures={["Hosted version", "All API costs included", "Priority processing", "Weekly performance email", "Dedicated support"]}
        proPrice="$99"
        ctaButton={<CopyPromptButton label="Get the Prompt" />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Lovable builds your site.
            <br />
            Lazy Run runs it.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl mx-auto leading-relaxed mb-10">
            One prompt installs the complete autonomous operations layer — publishing, SEO, GEO, payments, SMS, audio, e-commerce, streams, and code — all managed from one dashboard, all running without you.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CopyPromptButton />
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-body text-xs text-foreground/25 mt-6 max-w-md mx-auto">
            Open your Lovable project, paste it into the chat, choose your engines, add your API keys. Your site starts running itself today.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="font-display text-[10px] tracking-[0.15em] uppercase text-foreground/20">
          Lazy Unicorn — Autonomous growth engines for Lovable
        </p>
      </footer>
    </div>
  );
}
