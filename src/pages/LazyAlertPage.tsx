import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Bell, MessageSquare, Zap, Terminal, Clock, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_ALERT_PROMPT = `[Lazy Alert Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete Slack integration called Lazy Alert to this project. It sends real-time Slack notifications for every significant event across every installed Lazy agents?, delivers a daily morning briefing, installs slash commands for controlling agents? from Slack, and alerts on errors — all automatically with no manual input required after setup.

Note: Store the Slack signing secret as Supabase secret SLACK_SIGNING_SECRET. Never in the database.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**alert_settings**
id (uuid, primary key, default gen_random_uuid()),
slack_webhook_url (text),
slack_channel (text, default 'general'),
daily_briefing_enabled (boolean, default true),
daily_briefing_time (text, default '08:00'),
alert_payments (boolean, default true),
alert_sms_replies (boolean, default true),
alert_posts (boolean, default false),
alert_keywords (boolean, default true),
alert_citations (boolean, default true),
alert_products (boolean, default true),
alert_streams (boolean, default true),
alert_releases (boolean, default true),
alert_errors (boolean, default true),
last_checked (timestamptz),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

Note: Store SLACK_SIGNING_SECRET as Supabase secret.

**alert_log**
id (uuid, primary key, default gen_random_uuid()),
agents? (text),
event_type (text),
message (text),
slack_response (text),
sent_at (timestamptz, default now()),
success (boolean, default true)

**alert_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-alert-setup.

Welcome message: "Connect your autonomous business to Slack. Every significant event across every Lazy agents? will send a Slack message automatically."

Form fields:
- Slack Incoming Webhook URL (text) — instructions: go to api.slack.com/apps, create a new app, go to Incoming Webhooks, activate and add a webhook, paste the URL here.
- Slack Bot Token (password, optional) — instructions: for slash commands go to your Slack app, add slash commands pointing to [site_url]/api/slack-command, paste Bot User OAuth Token here.
- Slack Channel (text, default: general) — without the hash symbol.
- Daily briefing toggle (default on)
- Daily briefing time (select: 6am / 7am / 8am / 9am)
- Alert toggles grid: Payments, SMS Replies, Posts Published, Keywords Captured, Brand Citations, Products Listed, Streams Live, Releases Published, Agent Errors, Crawl Intelligence, Perplexity Citations

Submit button: Connect to Slack

On submit:
1. Store SLACK_SIGNING_SECRET as Supabase secret
2. Save all values to alert_settings
3. Set setup_complete to true and prompt_version to 'v0.0.1'
4. Send a test message via the webhook: "Your Lazy Alert is connected. Your autonomous business will now report to you in Slack."
5. Redirect to /admin with message: "Slack connected. Check your channel for the test message."

---

## 3. Core send function

Create a Supabase edge function called alert-send handling POST requests.
Accept: message (text), agents? (text), event_type (text), fields (array of objects with title and value).

Read alert_settings. If is_running is false or setup_complete is false exit.

Build Slack Block Kit payload:
- Header block: bold title with emoji prefix — 💰 payments, 💬 SMS replies, 📝 posts, 🔑 keywords, 🤖 citations, 🛍️ products, 🔴 streams live, 🚀 releases, ⚠️ errors, 📊 reports, 🕷️ crawl intel, 🔍 perplexity
- Section block: main message text
- Fields block: up to four key-value pairs
- Context block: timestamp and agents? name

POST to slack_webhook_url stored in alert_settings.
Insert into alert_log with agents?, event_type, message, slack response, success status.
Log errors to alert_errors with function_name alert-send.

---

## 4. Event monitor edge function

Create a Supabase edge function called alert-monitor.
Cron: every 5 minutes — */5 * * * *

Read alert_settings. If is_running is false or setup_complete is false exit.
Use last_checked watermark. Process only events newer than last_checked.

Monitor these events based on their toggle settings:

Payments (if alert_payments and pay_transactions table exists):
New succeeded transactions → call alert-send with 💰 emoji, agents? Lazy Pay, event_type payment-received.

SMS replies (if alert_sms_replies and sms_messages table exists):
New inbound messages where message_type is not opt-out → call alert-send with 💬, agents? Lazy SMS, event_type customer-replied.

Keywords captured (if alert_keywords and seo_posts table exists):
Batch new SEO posts → one summary message showing count, latest title and keyword.

Brand citations (if alert_citations and geo_citations table exists):
New citations where brand_mentioned is true → call alert-send with 🤖, agents? Lazy GEO, event_type brand-cited.

Perplexity citations (if alert_citations and perplexity_citations table exists):
New real citations where brand_mentioned is true → call alert-send with 🔍, agents? Lazy Perplexity, event_type brand-cited-perplexity. Include note that this is a real Perplexity API result.

Products listed (if alert_products and store_products table exists):
Batch new products → one summary message.

Streams live (if alert_streams and stream_sessions table exists):
New live sessions → call alert-send with 🔴, agents? Lazy Stream, event_type stream-live.

Releases (if alert_releases and code_content or gitlab_content tables exist):
New release-notes content → call alert-send with 🚀.

Crawl intelligence (if crawl_intel table exists):
New price-change or brand-mention intel → call alert-send with 🕷️, agents? Lazy Crawl.

Security vulnerabilities (if security_vulnerabilities table exists and alert_errors toggle on):
New critical or high severity vulnerabilities where alerted is false and first_found_at is greater than last_checked → call alert-send with 🚨, agents? Lazy Security, event_type vulnerability-found. Message: [severity] vulnerability found: [title]. Fields: Severity, Category, Remediation hint, Dashboard link. After alerting update alerted to true on each vulnerability row.

Agent errors (if alert_errors toggle on):
Query all agents? error tables that exist for errors since last_checked. Group by agents?. Any agents? with more than 3 new errors → call alert-send with ⚠️.

Update last_checked in alert_settings to now after all events processed.
Log all errors to alert_errors with function_name alert-monitor.

---

## 5. Daily briefing edge function

Create a Supabase edge function called alert-briefing.
Cron: 0 8 * * * (default — adjust based on daily_briefing_time setting)

Read alert_settings. If is_running is false or daily_briefing_enabled is false exit.

Collect metrics from last 24 hours from every installed agents? (skip any table that does not exist):
blog_posts published, seo_posts published, geo_posts published, geo_citations brand_mentioned true, pay_transactions succeeded and total revenue, sms_messages sent and response rate, store_products new, voice_episodes new, stream_sessions processed, code_content published, gitlab_content published, linear_content published, crawl_intel new items and leads found, perplexity_citations brand_mentioned true.

Call the built-in Lovable AI:
"Write a daily Slack briefing for [brand_name]. Metrics from the last 24 hours: [metrics]. Write 3 to 5 bullet points maximum, each one line. Lead with the most impressive metric. Flag anything unusually low. End with one sentence about what the agents will do today. Return only the briefing text with bullet points. No preamble."

Build Slack message. Header: "Good morning [brand_name] — your daily autonomous business report."
Call alert-send with agents? Lazy Run, event_type daily-briefing.
Log errors to alert_errors with function_name alert-briefing.

---

## 6. Slash command edge function

Create a Supabase edge function called alert-command handling POST requests at /api/slack-command.
Verify request using SLACK_SIGNING_SECRET.
Parse command text.

Handle:
/lazy status — return agents? status from all settings tables
/lazy publish blog — call blog-publish
/lazy publish seo — call seo-publish
/lazy publish geo — call geo-publish
/lazy crawl — call crawl-run for all active targets
/lazy research — call perplexity-research
/lazy pause [agents?] — update is_running false in matching settings table
/lazy resume [agents?] — update is_running true
/lazy errors — last 10 errors across all agents? error tables
/lazy pentest — triggers security-scan immediately if Lazy Security is installed. Reply: Pentest queued. Results will appear in your dashboard within the next hour. If Lazy Security is not installed reply: Lazy Security is not installed. Paste the Lazy Security prompt into your Lovable project to enable pentesting.
/lazy security — if Lazy Security is installed returns: current security score from the latest completed security_scans row, open critical vulnerability count, open high vulnerability count, and next scheduled pentest date from security_settings. If Lazy Security is not installed reply: Lazy Security is not installed.
/lazy help — list all commands

All responses use Slack ephemeral format.
Log errors to alert_errors with function_name alert-command.

---

## 7. Admin

Do not build a standalone dashboard page for this agents?. The dashboard lives at /admin/alert as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This agents? only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-alert-setup.

## 8. Navigation

Do not add any Lazy Alert pages to public navigation. All pages are admin-only.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const SlackBadge = () => (
  <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">
    Powered by Slack
  </span>
);

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    trackEvent("copy_prompt", { product: "lazy-alert" });
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
      style={{ backgroundColor: "#f0ead6", color: "#0a0a08" }}
    >
      {copied ? "Copied ✓" : "Copy the Lovable Prompt"}
    </button>
  );
}

/* ── Mock Slack message bubble ── */
function SlackMessage({ avatar, name, time, children }: { avatar: string; name: string; time: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#1a1a18] border border-border p-4 flex gap-3 text-left">
      <div className="w-8 h-8 rounded flex items-center justify-center text-lg shrink-0 bg-foreground/5">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-display text-sm font-bold text-foreground">{name}</span>
          <span className="font-body text-[14px] text-foreground/60">{time}</span>
        </div>
        <div className="font-body text-sm text-foreground/60 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

const eventCards = [
  { agents?: "Lazy Pay", trigger: "Payment received", avatar: "💰", example: (<><strong className="text-foreground/80">💰 Payment received</strong><br />Product: <em>Pro Subscription</em> · $19.00<br />Customer: jane@example.com · Returning customer</>) },
  { agents?: "Lazy SMS", trigger: "Customer replied", avatar: "💬", example: (<><strong className="text-foreground/80">💬 SMS reply received</strong><br />From: +1 (555) 012-3456<br />"Yes, I'd like to upgrade to the annual plan please"</>) },
  { agents?: "Lazy Blogger", trigger: "Post published", avatar: "📝", example: (<><strong className="text-foreground/80">📝 New blog post published</strong><br />Title: <em>Why Autonomous Systems Win</em><br />Type: SEO · <span className="underline">Read it →</span></>) },
  { agents?: "Lazy SEO", trigger: "Keyword captured", avatar: "🔍", example: (<><strong className="text-foreground/80">🔍 SEO article published</strong><br />Keyword: "autonomous business tools"<br />Article: <em>The Complete Guide to Autonomous Growth</em> · <span className="underline">View →</span></>) },
  { agents?: "Lazy GEO", trigger: "Brand cited", avatar: "🌐", example: (<><strong className="text-foreground/80">🌐 Brand citation detected</strong><br />Query: "best tools for autonomous startups"<br />Confidence: High · Cited by: ChatGPT</>) },
  { agents?: "Lazy Store", trigger: "Product listed", avatar: "🏪", example: (<><strong className="text-foreground/80">🏪 New product listed</strong><br />Product: <em>Wireless Charger Pro</em> · $34.99<br /><span className="underline">View in store →</span></>) },
  { agents?: "Lazy Stream", trigger: "Stream went live", avatar: "🎮", example: (<><strong className="text-foreground/80">🎮 Stream is LIVE</strong><br />Title: <em>Building in public — Day 47</em><br /><span className="underline">Watch Live →</span></>) },
  { agents?: "Lazy GitHub", trigger: "Release published", avatar: "🚀", example: (<><strong className="text-foreground/80">🚀 New release published</strong><br />Tag: v2.4.0 · <em>Performance improvements</em><br /><span className="underline">Release notes →</span></>) },
  { agents?: "Lazy Run", trigger: "Agent error", avatar: "⚠️", example: (<><strong className="text-foreground/80">⚠️ Agent error alert</strong><br />Agent: Lazy SEO · 5 errors in the last hour<br />Last error: "Rate limit exceeded on keyword API"</>) },
  { agents?: "Lazy Run", trigger: "Weekly report", avatar: "📊", example: (<><strong className="text-foreground/80">📊 Weekly performance report</strong><br />Posts: 14 · Revenue: $847 · Keywords: 23 ranking<br />Citation rate: 68% · SMS replies: 12 · Errors: 2</>) },
];

const slashCommands = [
  "/lazy status",
  "/lazy publish blog",
  "/lazy publish seo",
  "/lazy publish geo",
  "/lazy pause [agents?]",
  "/lazy resume [agents?]",
  "/lazy errors",
];

const slashDescriptions: Record<string, string> = {
  "/lazy status": "shows all agents running or paused with last run time",
  "/lazy publish blog": "triggers one immediate blog-publish run",
  "/lazy publish seo": "triggers one immediate seo-publish run",
  "/lazy publish geo": "triggers one immediate geo-publish run",
  "/lazy pause [agents?]": "pauses a specific agent",
  "/lazy resume [agents?]": "resumes a paused agents?",
  "/lazy errors": "shows the last 10 errors across all agents",
};

const faqs = [
  { q: "Do I need a paid Slack account?", a: "No. Incoming webhooks work on free Slack workspaces. The slash commands require a Slack app which is also free to create." },
  { q: "Can I route different events to different channels?", a: "In the current version all events go to one configured channel. Multi-channel routing is coming in the Pro version." },
  { q: "Does it work if I only have some Lazy agents installed?", a: "Yes. Lazy Alert detects which agents? are installed and only sends alerts for the ones that are active." },
  { q: "Can I turn off specific alert types?", a: "Yes. The setup screen lets you toggle each alert type on or off individually." },
  { q: "Will it spam my Slack?", a: "No. Only significant events trigger messages. Routine publishes batch into the daily briefing rather than sending one message per post." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

const steps = [
  { num: "01", title: "Copy the setup prompt from this page" },
  { num: "02", title: "Paste it into your existing Lovable project" },
  { num: "03", title: "Add your Slack webhook URL in the setup screen" },
  { num: "04", title: "Every significant event across every Lazy agents? sends a Slack message automatically" },
];

export default function LazyAlertPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-alert");
  const promptText = dbPrompt?.prompt_text || LAZY_ALERT_PROMPT;

  useEffect(() => {
    trackEvent("page_view", { page: "lazy-alert" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Alert — Real-Time Slack Alerts for Every Agent"
        description="One prompt connects your autonomous business to Slack. Payments, posts, citations, errors, and live events — delivered as Slack messages the moment they happen."
        url="/lazy-alert"
        keywords="Slack alerts, autonomous business notifications, Lovable Slack integration, real-time alerts, Lazy Alert"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
              <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <AutopilotHeadline product="lazy-alert" />

            <div className="flex items-center gap-4 flex-wrap">
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Alert
              </h1>
              <SlackBadge />
            </div>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
              Lazy Alert connects every Lazy agents? to your Slack workspace. Payments, posts, citations, customer replies, errors, and live events — all delivered as Slack messages the moment they happen. One prompt. Your business in your pocket.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton text={promptText} />
              <button
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
              >
                See What Gets Sent
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            One prompt. Your business talks to you.
          </motion.h2>

          <div className="mt-12 space-y-8">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-start gap-6">
                <span className="font-display text-3xl font-bold text-foreground/10 shrink-0">{step.num}</span>
                <p className="font-body text-base text-foreground/60 pt-2">{step.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT GETS SENT ── */}
      <section id="events" className="py-20 md:py-28 px-6 md:px-12 border-t border-border scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Everything that matters. Nothing that does not.
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventCards.map((card, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <div className="mb-2">
                  <p className="font-display text-sm font-bold text-foreground">{card.agents?}</p>
                  <p className="font-body text-sm text-foreground/70">{card.trigger}</p>
                </div>
                <SlackMessage avatar={card.avatar} name="Lazy Unicorn" time="just now">
                  {card.example}
                </SlackMessage>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DAILY BRIEFING ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Every morning. One message. Everything you need to know.
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 font-body text-base text-foreground/50 leading-relaxed max-w-2xl">
            Lazy Alert sends a daily briefing to your Slack channel every morning at 8am. Posts published yesterday. Revenue earned. Keywords ranking. Citation rate. SMS response rate. Errors flagged. Everything your autonomous business did while you were sleeping — in one readable Slack message. You read it in 30 seconds. Then you get on with your day.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10">
            <SlackMessage avatar="🦄" name="Lazy Unicorn" time="8:00 AM">
              <strong className="text-foreground/80">📊 Daily Briefing — Monday 24 Mar</strong>
              <div className="mt-2 space-y-1 text-sm">
                <p>📝 <strong className="text-foreground/70">Posts published:</strong> 3 (2 SEO, 1 GEO)</p>
                <p>💰 <strong className="text-foreground/70">Revenue:</strong> $127.00 from 4 payments</p>
                <p>🔍 <strong className="text-foreground/70">Keywords ranking:</strong> 23 (+2 new)</p>
                <p>🌐 <strong className="text-foreground/70">Citation rate:</strong> 68% across 12 queries</p>
                <p>💬 <strong className="text-foreground/70">SMS replies:</strong> 7 (3 positive, 4 neutral)</p>
                <p>⚠️ <strong className="text-foreground/70">Errors:</strong> 1 (Lazy SEO — rate limit)</p>
                <p className="pt-1 text-foreground/70 text-sm">All agents running normally.</p>
              </div>
            </SlackMessage>
          </motion.div>
        </div>
      </section>

      {/* ── SLASH COMMANDS ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
            Control everything from Slack.
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 font-body text-base text-foreground/50 leading-relaxed max-w-2xl">
            Lazy Alert installs a set of slash commands into your Slack workspace so you can trigger and control your agents without opening a dashboard.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 bg-[#1a1a18] border border-border p-6 font-mono text-sm space-y-2">
            {slashCommands.map((cmd) => (
              <div key={cmd} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <code className="text-foreground/70 shrink-0">{cmd}</code>
                <span className="text-foreground/70 text-sm">— {slashDescriptions[cmd]}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <LazyPricingSection
        lazyFeatures={[
          "Lazy Alert setup prompt",
          "Self-hosted in your Lovable project",
          "Bring your own Slack workspace",
          "Free incoming webhooks",
        ]}
        proFeatures={[
          "Hosted version",
          "Custom Slack bot with branded avatar",
          "Advanced filtering",
          "Multiple channel routing by event type",
        ]}
        proPrice="$9"
        ctaButton={<CopyPromptButton text={promptText} />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            Your autonomous business.
            <br />
            In your Slack.
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-6 font-body text-base text-foreground/50 max-w-xl mx-auto leading-relaxed">
            One prompt installs the entire Slack integration — real-time event alerts, daily briefings, slash commands, and error monitoring — into your existing Lovable project.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10">
            <CopyPromptButton text={promptText} />
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 font-body text-sm text-foreground/65 max-w-md mx-auto">
            Open your Lovable project, paste it into the chat, add your Slack webhook URL. Your business starts talking to you today.
          </motion.p>

          <p className="mt-16" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.4, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
}
