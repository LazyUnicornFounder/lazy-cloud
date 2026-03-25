import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText, Search, Globe, ShoppingCart, Mic, CreditCard,
  MessageSquare, Video, Code, ChevronDown, Zap, Activity,
  Clock, ArrowRight, Radar, Compass, Layers, BarChart3,
  Database, Bell, Send, Shield
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const LAZY_RUN_PROMPT = `[Lazy Run Prompt — v0.0.3 — LazyUnicorn.ai]

Add a complete unified autonomous operations runtime called Lazy Run to this project. Lazy Run installs and manages all Lazy engines — Blogger, SEO, GEO, Store, Voice, Pay, SMS, Stream, and Code — from a single setup prompt, a single dashboard, and a unified scheduling and monitoring system. Install only the engines the user activates during setup.

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
| Run | run-orchestrator, run-weekly-report, run-health-check |

---

## IMPORTANT: API key storage

ALL API keys and secrets must be stored as Supabase secrets. Never in database tables.
Reference them in edge functions via Deno.env.get().

Required secrets by engine:
- Blogger/SEO/GEO/Store: none (uses built-in Lovable AI)
- Voice: ELEVENLABS_API_KEY
- Pay: STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET
- SMS: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN
- Stream: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET
- Code: GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET

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

Also create all database tables required by each activated engine. Use these exact table names:

Blogger: blog_settings, blog_posts, blog_errors
SEO: seo_settings, seo_posts, seo_keywords, seo_errors
GEO: geo_settings, geo_posts, geo_queries, geo_citations, geo_errors
Store: store_settings, store_products, store_promotions, store_content, store_errors
Voice: voice_settings, voice_episodes, voice_errors
Pay: pay_settings, pay_products, pay_customers, pay_transactions, pay_subscriptions, pay_abandoned, pay_optimisation_log, pay_errors
SMS: sms_settings, sms_contacts, sms_messages, sms_sequences, sms_optouts, sms_optimisation_log, sms_errors
Stream: stream_settings, stream_sessions, stream_content, stream_clips, stream_transcripts, stream_optimisation_log, stream_errors
Code: code_settings, code_commits, code_releases, code_content, code_roadmap, code_optimisation_log, code_errors

Create only the tables for engines the user activates.

---

## 2. Setup page

Create a multi-step setup page at /lazy-run-setup.

**Step 1 — Welcome**
Show a welcome screen: "Welcome to Lazy Run. In the next 5 minutes you will set up the autonomous operations layer for your Lovable site. After setup your site will publish content, rank on Google, appear in AI answers, and more — automatically, forever."
Show a Next button.

**Step 2 — Choose engines**
Show eighteen engine cards in a grid — one per engine. Each card shows: engine name, one-line description, and an on/off toggle. Default all content engines to on (Blogger, SEO, GEO). Default commerce and media engines to off.

Engine descriptions:
- Lazy Blogger: Publishes blog posts automatically every 15 minutes
- Lazy SEO: Discovers keywords and publishes ranking articles
- Lazy GEO: Publishes content that gets cited by ChatGPT and Perplexity
- Lazy Store: Discovers products, writes listings, optimises conversion
- Lazy Voice: Narrates every post in your voice via ElevenLabs
- Lazy Pay: Installs Stripe with self-improving conversion optimisation
- Lazy SMS: Sends automated texts via Twilio that improve themselves
- Lazy Stream: Turns every Twitch stream into blog posts and SEO content
- Lazy Code: Turns every GitHub commit into a changelog and developer post

Below the cards show which API keys each selected engine will require so the user knows what to prepare.
Show a Next button.

**Step 3 — Core settings**
Fields:
- Site URL
- Brand name
- Business description (what does this site do and who is it for?)
- Target audience (who are your ideal customers?)
- Support email (for payment confirmations and weekly reports)

Include Suggest buttons next to the business description that auto-fill related fields using the built-in Lovable AI.
Show a Next button.

**Step 4 — API keys**
Show only the API key fields required by the engines selected in step 2. Group by service:

Content engines (no API key required — uses built-in Lovable AI):
Show a note: "Lazy Blogger, SEO, and GEO use Lovable's built-in AI — no API key required."

ElevenLabs section (shown if Lazy Voice is active):
- ElevenLabs API key (password) — stored as ELEVENLABS_API_KEY secret
- Voice ID (text, default: EXAVITQu4vr4xnSDxMaL)

Stripe section (shown if Lazy Pay is active):
- Stripe Publishable Key — stored as STRIPE_PUBLISHABLE_KEY secret
- Stripe Secret Key (password) — stored as STRIPE_SECRET_KEY secret
- Stripe Webhook Secret (password) — stored as STRIPE_WEBHOOK_SECRET secret

Twilio section (shown if Lazy SMS is active):
- Twilio Account SID — stored as TWILIO_ACCOUNT_SID secret
- Twilio Auth Token (password) — stored as TWILIO_AUTH_TOKEN secret
- Twilio Phone Number (text)

GitHub section (shown if Lazy Code is active):
- GitHub Personal Access Token (password) — stored as GITHUB_TOKEN secret
- GitHub Webhook Secret (password) — stored as GITHUB_WEBHOOK_SECRET secret
- GitHub Username
- Repository Name

Twitch section (shown if Lazy Stream is active):
- Twitch Client ID — stored as TWITCH_CLIENT_ID secret
- Twitch Client Secret (password) — stored as TWITCH_CLIENT_SECRET secret
- Twitch Username

Show a Next button.

**Step 5 — Schedule**
Show a visual publishing schedule. For each active content engine show a select for posts per day. Automatically stagger the cron times so engines do not compete. Show a preview of the full weekly schedule as a timeline.
Show a Launch button.

**On submit:**
1. Store all API keys as Supabase secrets
2. Save run_settings with active_engines as comma-separated list
3. Set setup_complete to true
4. Seed all engine-specific settings tables with the provided values
5. Create all required database tables for active engines
6. For content engines: immediately trigger one run of blog-publish, seo-discover, and geo-discover
7. Show loading: "Launching your autonomous operations layer..."
8. Redirect to /lazy-run-dashboard with message: "Lazy Run is active. Your autonomous operations layer is running."

---

## 3. Master orchestrator edge functions

**run-orchestrator**
Cron: every 30 minutes — */30 * * * *

1. Read run_settings. If master_running is false or setup_complete is false exit immediately.
2. Read active_engines (comma-separated list).
3. For each active engine check if it is time to run based on the configured schedule.
4. Stagger execution: add a 2-minute delay between each engine call to prevent simultaneous API overload.
5. Call the corresponding edge function for each engine due to run:
   - Blogger: blog-publish
   - SEO: seo-publish (seo-discover runs on its own Monday cron)
   - GEO: geo-publish (geo-discover runs on its own cron)
   - Store: store-discover on Mondays, store-optimise on Sundays, store-content on Tuesdays and Fridays, store-listings and store-prices daily
   - Voice: voice-narrate
   - Pay: pay-optimise on Sundays, pay-recover daily
   - SMS: sms-sequences-run
   - Stream: stream-monitor
   - Code: code-sync-roadmap
6. Log each execution to run_activity: engine name, action, result (success or error), details.
7. Log any failures to run_errors.

**run-weekly-report**
Cron: every Monday at 7am UTC — 0 7 * * 1

1. Read run_settings. If master_running is false exit.
2. Collect metrics for each active engine from the last 7 days:
   - Blogger: total blog_posts published
   - SEO: total seo_posts published, total seo_keywords discovered
   - GEO: total geo_posts published, citation rate from geo_queries
   - Store: total store_products listed, active promotions
   - Voice: total voice_episodes generated
   - Pay: total pay_transactions succeeded, MRR from pay_subscriptions
   - SMS: total sms_messages sent, response rate from sms_sequences
   - Stream: total stream_sessions processed, total stream_content published
   - Code: total code_commits processed, total code_content published
3. Call the built-in Lovable AI:
"Write a weekly performance report for [brand_name]. Metrics from the last 7 days: [metrics list]. Write a friendly report under 300 words. Cover: what the engines accomplished, the best performing engine, any areas for improvement, projection for next week. Write in second person. Return only the report text."
4. Send email to support_email with subject: "Your Lazy Run weekly report — [current date]" and the report as the body.
5. Insert into run_activity with engine run, action weekly-report, result success.
Log errors to run_errors.

**run-health-check**
Cron: every hour — 0 * * * *

1. Read run_settings.
2. For each active engine query its errors table for errors in the last hour.
3. If any engine has more than 3 errors in the last hour: insert warning into run_activity with result error and details describing which engine is failing and error count.
4. Insert performance snapshot into run_performance for each engine — total content published today, error count today.
Log errors to run_errors.

---

## 4. Install all engine edge functions

Install all edge functions for each active engine using these exact function names:
blog-publish, seo-discover, seo-publish, geo-discover, geo-publish, geo-test, store-discover, store-listings, store-prices, store-promote, store-optimise, store-content, voice-narrate, voice-rss, pay-checkout, pay-webhook, pay-optimise, pay-recover, pay-portal, sms-send, sms-receive, sms-status, sms-sequences-run, sms-optimise, stream-monitor, stream-process, stream-write-content, stream-optimise, github-webhook, code-sync-roadmap, code-write-content, code-optimise.

Only install functions for active engines. The logic for each function is defined in its individual engine prompt. Follow that logic exactly.

---

## 5. Unified admin dashboard

Create a page at /lazy-run-dashboard.

**Header row**
Brand name. A large master toggle: "Everything is running" or "Everything is paused" — updates master_running in run_settings and immediately pauses or resumes all engines. Last activity time. Next scheduled run time.

Show a red banner at the top if run_errors has any rows from the last 24 hours — show error count and a View Errors button.

**Engine status grid**
One card per active engine showing:
- Engine name
- Individual on/off toggle (updates the is_running field in that engine's settings table)
- Posts or actions count today
- Last run time
- Error count today (shown in red if above zero)
- A Publish One Now button that triggers one immediate run of that engine's primary publish function

**Unified activity feed**
All run_activity rows from the last 7 days in reverse chronological order. Each row shows:
- Coloured dot: green for success, red for error, gold for optimisation
- Engine name
- Action description
- Timestamp
Filter buttons above the feed to filter by engine or result type.

**Performance charts**
For each active content engine: a simple bar chart showing posts published per day for the last 14 days.
For Lazy Pay: MRR trend line for the last 30 days.
For Lazy SMS: message volume and response rate for the last 14 days.

**Weekly report**
The most recent run_activity row where action is weekly-report, rendered as formatted text.

**Error log**
All run_errors rows from the last 7 days grouped by engine. Each group shows error count and most recent error message. A Clear button marks errors as read.

**Quick links**
Links to the individual setup pages for each active engine so settings can be updated without leaving the dashboard.

---

## 6. Public pages

Do not add any Lazy Run management pages to the public navigation.
The run-orchestrator operates entirely in the background.
Content published by individual engines appears through their own public routes as normal.

---

## 7. Navigation

Add a single Admin link to the site navigation pointing to /lazy-run-dashboard.
This replaces any existing admin links.
Do not expose any other admin or setup routes in the public navigation.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const engines = [
  { name: "Lazy Blogger", desc: "Publishes four blog posts per day automatically.", icon: FileText, href: "/lazy-blogger" },
  { name: "Lazy SEO", desc: "Discovers keywords and publishes ranking articles.", icon: Search, href: "/lazy-seo" },
  { name: "Lazy GEO", desc: "Gets your brand cited by ChatGPT and Perplexity.", icon: Globe, href: "/lazy-geo" },
  { name: "Lazy Crawl", desc: "Monitors competitors and feeds intelligence to your engines.", icon: Radar },
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
  { q: "What API keys do I need?", a: "Only the ones for the engines you activate. Lazy Blogger and Lazy SEO only need an Anthropic key. Lazy Pay needs Stripe. Lazy SMS needs Twilio. Lazy Voice needs ElevenLabs." },
  { q: "Can I still use individual engines if I have them installed?", a: "Yes. Lazy Run is additive. If you already have Lazy Blogger installed it will detect it and manage it alongside the others." },
  { q: "How is Lazy Run different from just pasting all the individual prompts?", a: "Lazy Run adds the coordination layer — unified scheduling, cross-engine activity feed, master controls, performance reporting, and smart resource management. The individual prompts do not talk to each other. Lazy Run makes them work as one system." },
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
            The autonomous half of Lovable.
            <br />
            In one prompt.
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

      {/* Pricing */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            Pricing
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="border border-border p-8 bg-card flex flex-col">
              <h3 className="font-display text-lg font-bold mb-1">Free</h3>
              <p className="font-body text-2xl font-bold mb-4">$0</p>
              <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
                <li>✓ Lazy Run setup prompt</li>
                <li>✓ Self-hosted in your existing Lovable project</li>
                <li>✓ Installs all nine engines</li>
                <li>✓ Bring your own API keys for each service</li>
              </ul>
              <div className="mt-6"><CopyPromptButton label="Get the Prompt" /></div>
            </motion.div>

            {/* Pro */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border-2 border-primary/40 p-8 bg-card flex flex-col relative">
              <span className="absolute top-4 right-4 bg-accent text-accent-foreground text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1">
                Coming Soon
              </span>
              <h3 className="font-display text-lg font-bold mb-1">Pro</h3>
              <p className="font-body text-2xl font-bold mb-4">
                $99<span className="text-sm text-muted-foreground font-normal">/month</span>
              </p>
              <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
                <li>✓ Hosted version</li>
                <li>✓ All API costs included</li>
                <li>✓ Priority processing</li>
                <li>✓ Weekly performance email</li>
                <li>✓ Dedicated support</li>
              </ul>
              <button disabled className="mt-6 w-full inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-muted-foreground cursor-not-allowed opacity-50">
                Coming Soon
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            FAQ
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border bg-card px-6">
                <AccordionTrigger className="font-display text-sm font-bold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-foreground/45 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

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
