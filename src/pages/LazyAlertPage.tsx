import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Bell, MessageSquare, Zap, Terminal, Clock, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_ALERT_PROMPT = `Add a complete Slack integration called Lazy Alert to this project. It sends real-time Slack notifications for every significant event across every installed Lazy engine, delivers a daily morning briefing, installs slash commands for controlling engines from Slack, and alerts on errors — all automatically with no manual input required after setup.

1. Database Create a Supabase table called alert_settings with fields: id (uuid, primary key, default gen_random_uuid()), slack_webhook_url (text), slack_bot_token (text), slack_channel (text, default 'general'), daily_briefing_enabled (boolean, default true), daily_briefing_time (text, default '08:00'), alert_payments (boolean, default true), alert_sms_replies (boolean, default true), alert_posts (boolean, default false), alert_keywords (boolean, default true), alert_citations (boolean, default true), alert_products (boolean, default true), alert_streams (boolean, default true), alert_releases (boolean, default true), alert_errors (boolean, default true), is_running (boolean, default true), setup_complete (boolean, default false), created_at (timestamptz, default now()). Create a Supabase table called alert_log with fields: id (uuid, primary key, default gen_random_uuid()), engine (text), event_type (text), message (text), slack_response (text), sent_at (timestamptz, default now()), success (boolean, default true). Create a Supabase table called alert_errors with fields: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-alert-setup. Show a welcome message: 'Connect your autonomous business to Slack. Every significant event across every Lazy engine will send a Slack message automatically.' Form fields: Slack Incoming Webhook URL (text) — with instructions: Go to api.slack.com/apps, create a new app, go to Incoming Webhooks, activate and add a new webhook to your workspace, paste the webhook URL here. Slack Bot Token (password, optional) — with instructions: For slash commands go to your Slack app settings, add the slash commands listed below, then paste your Bot User OAuth Token here. Required only for slash commands. Leave blank if you only want incoming alerts. Slack Channel (text, default: general) — the channel name without the hash symbol. Daily briefing toggle (default on). Daily briefing time (time select, default 8:00am). Alert toggles — a grid of on/off toggles for each alert type: Payments, SMS Replies, Posts Published, Keywords Captured, Brand Citations, Products Listed, Streams Live, Releases Published, Engine Errors. Submit button: Connect to Slack. On submit save all values to alert_settings and set setup_complete to true. Immediately call alert-send with a test message: Your Lazy Alert is connected. Your autonomous business will now report to you in Slack. Show success message: Slack connected. Watch for the test message in your channel.

3. Core send function Create a Supabase edge function called alert-send handling POST requests. Accept: message (text), engine (text), event_type (text), fields (array of objects with title and value for Slack attachment fields). Read alert_settings. If is_running is false or setup_complete is false exit. Build a Slack message payload using the Block Kit format:

Header block: a bold title combining the engine name and event type with a relevant emoji prefix — use 💰 for payments, 💬 for SMS replies, 📝 for posts, 🔑 for keywords, 🤖 for citations, 🛍️ for products, 🔴 for streams going live, 🚀 for releases, ⚠️ for errors, 📊 for reports.

Section block: the main message text.

Fields block: up to four key-value pairs showing the most relevant details for that event type.

Context block: timestamp and engine name in small text. POST the payload to the slack_webhook_url stored in alert_settings. Insert into alert_log with the engine, event_type, message, slack response, and success status. Log errors to alert_errors with function_name alert-send.

4. Event listener edge function Create a Supabase edge function called alert-monitor that runs every 5 minutes. Read alert_settings. If is_running is false or setup_complete is false exit. Check each alert type that is enabled and look for new events since the last run. Use a watermark approach — store the last checked timestamp in alert_settings as last_checked (add this field: last_checked timestamptz). Only process events newer than last_checked.

For payments (if alert_payments is true and pay_transactions table exists): Query pay_transactions where status is succeeded and created_at is greater than last_checked. For each new transaction call alert-send with engine Lazy Pay, event_type payment-received, message [customer email] paid [amount] for [product name], fields showing: Amount, Product, Customer, Type (new or returning based on whether customer has prior transactions).

For SMS replies (if alert_sms_replies is true and sms_messages table exists): Query sms_messages where direction is inbound and message_type is not opt-out and created_at is greater than last_checked. For each new reply call alert-send with engine Lazy SMS, event_type customer-replied, message Customer replied: [message_body truncated to 100 characters], fields showing: From, Message, Time.

For keyword captures (if alert_keywords is true and seo_posts table exists): Query seo_posts where published_at is greater than last_checked. Batch these — do not send one per post. Instead send one summary message if any new SEO posts were published: [count] new SEO articles published. Latest: [most recent title]. Fields showing: Count, Latest Title, Latest Keyword, Link.

For brand citations (if alert_citations is true and geo_citations table exists): Query geo_citations where brand_mentioned is true and tested_at is greater than last_checked. For each new citation call alert-send with engine Lazy GEO, event_type brand-cited, message Your brand was cited by an AI engine for: [query], fields showing: Query, Confidence, Reason, Tested.

For products listed (if alert_products is true and store_products table exists): Query store_products where created_at is greater than last_checked. Batch these — send one summary: [count] new products discovered and listed. Latest: [most recent product name] at [price].

For streams going live (if alert_streams is true and stream_sessions table exists): Query stream_sessions where status is live and created_at is greater than last_checked. For each new live session call alert-send with engine Lazy Stream, event_type stream-live, message [twitch_username] is live: [title], fields showing: Game, Started At, Watch link using the Twitch URL.

For releases published (if alert_releases is true and code_content table exists): Query code_content where content_type is release-notes and published_at is greater than last_checked. For each new release call alert-send with engine Lazy Code, event_type release-published, message New release published: [title], fields showing: Version, Link to release notes.

For engine errors (if alert_errors is true): Query all engine error tables that exist — blog_errors, seo_errors, geo_errors, store_errors, voice_errors, pay_errors, sms_errors, stream_errors, code_errors, run_errors — for rows where created_at is greater than last_checked. Group by engine. For any engine with more than 3 new errors call alert-send with engine Lazy Run, event_type engine-error, message [engine name] has [count] errors in the last 5 minutes, fields showing: Engine, Error Count, Last Error Message, Time.

After processing all events update last_checked in alert_settings to now. Log all errors to alert_errors with function_name alert-monitor.

5. Daily briefing edge function Create a Supabase edge function called alert-briefing that runs every day at the configured daily_briefing_time. Cron: 0 8 * * * (default — adjust based on daily_briefing_time setting). Read alert_settings. If is_running is false or daily_briefing_enabled is false exit. Collect metrics from the last 24 hours from every installed engine:

blog_posts: count published in last 24 hours, split by post_type

seo_posts: count published in last 24 hours

geo_posts: count published in last 24 hours

geo_citations: count where brand_mentioned is true in last 24 hours

pay_transactions: count succeeded, sum of amount_cents divided by 100 for total revenue

sms_messages: count sent, count received, calculate response rate

store_products: count new products listed

voice_episodes: count new episodes generated

stream_sessions: count processed

code_content: count published Skip any table that does not exist gracefully. Call the built-in Lovable AI with this prompt: 'You are writing a daily Slack briefing for [brand_name]. Here are the metrics from the last 24 hours: [metrics list]. Write a very brief friendly summary — 3 to 5 bullet points maximum. Each bullet should be one line. Lead with the most impressive metric. Flag anything that looks wrong or unusually low. End with one forward-looking sentence about what the engines will do today. Return only the briefing text with bullet points. No preamble.' Build a Slack message with the briefing. Header: Good morning [brand_name] — your daily autonomous business report. Body: the AI-generated briefing. Footer: Powered by Lazy Run. Call alert-send with engine Lazy Run, event_type daily-briefing, and the formatted message. Log errors to alert_errors with function_name alert-briefing.

6. Slash command edge function Create a Supabase edge function called alert-command handling POST requests at /api/slack-command. This receives Slack slash command payloads. Verify the request using the Slack signing secret stored as Supabase secret SLACK_SIGNING_SECRET. Parse the command text from the payload. Handle these commands: /lazy status — query all engine settings tables that exist, collect is_running status and last published time for each. Return a formatted Slack response listing each engine with a green circle if running or red circle if paused and the last run time. /lazy publish blog — call blog-publish edge function. Return: Publishing one blog post now. Check Slack in a few minutes. /lazy publish seo — call seo-publish edge function. Return: Publishing one SEO post now. /lazy publish geo — call geo-publish edge function. Return: Publishing one GEO post now. /lazy pause [engine] — update is_running to false in the matching engine settings table. Return: [engine] paused. /lazy resume [engine] — update is_running to true in the matching engine settings table. Return: [engine] resumed. /lazy errors — query all engine error tables for the last 10 errors across all engines ordered by created_at descending. Return a formatted list showing engine, error message, and time for each. /lazy help — return a formatted list of all available commands with descriptions. For unknown commands return: Unknown command. Type /lazy help for a list of available commands. All responses use Slack ephemeral response format so only the person who typed the command sees the response. Log errors to alert_errors with function_name alert-command.

7. Admin dashboard Create a page at /lazy-alert-dashboard. Show at top: red error banner if alert_errors has rows from the last 24 hours. Show:

Connection status: green Connected or red Disconnected badge for Slack, last message sent time, total messages sent today.

Alert toggles: all alert_settings toggles displayed as a grid — update in real time when toggled without a save button.

Recent alert log: last 50 alert_log rows with engine, event type, message preview, sent time, and success badge.

Daily briefing preview: a button labelled Send Briefing Now that immediately triggers alert-briefing regardless of schedule. Shows the last briefing sent below it rendered as formatted text.

Slash commands reference: a copy-paste ready list of all slash commands with the correct /api/slack-command URL for configuring each one in the Slack app dashboard.

Controls: pause/resume toggle updating is_running, a button labelled Send Test Message triggering a test alert, error log showing last 10 alert_errors rows, link to /lazy-alert-setup labelled Edit Settings.

8. Slack app configuration instructions Show these instructions prominently on both the setup page and dashboard: To enable slash commands: go to api.slack.com/apps and select your app. Click Slash Commands and add these commands one by one, each pointing to [site_url]/api/slack-command: /lazy — Your autonomous business control panel Save each command. Go to OAuth and Permissions, copy the Bot User OAuth Token, and paste it into the Lazy Alert setup page. Go to Basic Information, copy the Signing Secret, and add it to your Supabase project as a secret called SLACK_SIGNING_SECRET. Reinstall the app to your workspace after making changes.

9. Navigation Do not add any Lazy Alert pages to the public navigation. All pages are admin-only.`;

const SlackBadge = () => (
  <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase text-foreground/30 border border-border px-3 py-1">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
    Powered by Slack
  </span>
);

function CopyPromptButton() {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_ALERT_PROMPT);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    trackEvent("copy_prompt", { product: "lazy-alert" });
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
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
          <span className="font-body text-[10px] text-foreground/20">{time}</span>
        </div>
        <div className="font-body text-sm text-foreground/60 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

const eventCards = [
  { engine: "Lazy Pay", trigger: "Payment received", avatar: "💰", example: (<><strong className="text-foreground/80">💰 Payment received</strong><br />Product: <em>Pro Subscription</em> · $19.00<br />Customer: jane@example.com · Returning customer</>) },
  { engine: "Lazy SMS", trigger: "Customer replied", avatar: "💬", example: (<><strong className="text-foreground/80">💬 SMS reply received</strong><br />From: +1 (555) 012-3456<br />"Yes, I'd like to upgrade to the annual plan please"</>) },
  { engine: "Lazy Blogger", trigger: "Post published", avatar: "📝", example: (<><strong className="text-foreground/80">📝 New blog post published</strong><br />Title: <em>Why Autonomous Systems Win</em><br />Type: SEO · <span className="underline">Read it →</span></>) },
  { engine: "Lazy SEO", trigger: "Keyword captured", avatar: "🔍", example: (<><strong className="text-foreground/80">🔍 SEO article published</strong><br />Keyword: "autonomous business tools"<br />Article: <em>The Complete Guide to Autonomous Growth</em> · <span className="underline">View →</span></>) },
  { engine: "Lazy GEO", trigger: "Brand cited", avatar: "🌐", example: (<><strong className="text-foreground/80">🌐 Brand citation detected</strong><br />Query: "best tools for autonomous startups"<br />Confidence: High · Cited by: ChatGPT</>) },
  { engine: "Lazy Store", trigger: "Product listed", avatar: "🏪", example: (<><strong className="text-foreground/80">🏪 New product listed</strong><br />Product: <em>Wireless Charger Pro</em> · $34.99<br /><span className="underline">View in store →</span></>) },
  { engine: "Lazy Stream", trigger: "Stream went live", avatar: "🎮", example: (<><strong className="text-foreground/80">🎮 Stream is LIVE</strong><br />Title: <em>Building in public — Day 47</em><br /><span className="underline">Watch Live →</span></>) },
  { engine: "Lazy Code", trigger: "Release published", avatar: "🚀", example: (<><strong className="text-foreground/80">🚀 New release published</strong><br />Tag: v2.4.0 · <em>Performance improvements</em><br /><span className="underline">Release notes →</span></>) },
  { engine: "Lazy Run", trigger: "Engine error", avatar: "⚠️", example: (<><strong className="text-foreground/80">⚠️ Engine error alert</strong><br />Engine: Lazy SEO · 5 errors in the last hour<br />Last error: "Rate limit exceeded on keyword API"</>) },
  { engine: "Lazy Run", trigger: "Weekly report", avatar: "📊", example: (<><strong className="text-foreground/80">📊 Weekly performance report</strong><br />Posts: 14 · Revenue: $847 · Keywords: 23 ranking<br />Citation rate: 68% · SMS replies: 12 · Errors: 2</>) },
];

const slashCommands = [
  "/lazy status",
  "/lazy publish blog",
  "/lazy publish seo",
  "/lazy publish geo",
  "/lazy pause [engine]",
  "/lazy resume [engine]",
  "/lazy errors",
];

const slashDescriptions: Record<string, string> = {
  "/lazy status": "shows all engines running or paused with last run time",
  "/lazy publish blog": "triggers one immediate blog-publish run",
  "/lazy publish seo": "triggers one immediate seo-publish run",
  "/lazy publish geo": "triggers one immediate geo-publish run",
  "/lazy pause [engine]": "pauses a specific engine",
  "/lazy resume [engine]": "resumes a paused engine",
  "/lazy errors": "shows the last 10 errors across all engines",
};

const faqs = [
  { q: "Do I need a paid Slack account?", a: "No. Incoming webhooks work on free Slack workspaces. The slash commands require a Slack app which is also free to create." },
  { q: "Can I route different events to different channels?", a: "In the current version all events go to one configured channel. Multi-channel routing is coming in the Pro version." },
  { q: "Does it work if I only have some Lazy engines installed?", a: "Yes. Lazy Alert detects which engines are installed and only sends alerts for the ones that are active." },
  { q: "Can I turn off specific alert types?", a: "Yes. The setup screen lets you toggle each alert type on or off individually." },
  { q: "Will it spam my Slack?", a: "No. Only significant events trigger messages. Routine publishes batch into the daily briefing rather than sending one message per post." },
];

const steps = [
  { num: "01", title: "Copy the setup prompt from this page" },
  { num: "02", title: "Paste it into your existing Lovable project" },
  { num: "03", title: "Add your Slack webhook URL in the setup screen" },
  { num: "04", title: "Every significant event across every Lazy engine sends a Slack message automatically" },
];

export default function LazyAlertPage() {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("page_view", { page: "lazy-alert" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Alert — Real-Time Slack Alerts for Every Lazy Engine"
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
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
              <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Alert
              </h1>
              <SlackBadge />
            </div>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
              Lazy Alert connects every Lazy engine to your Slack workspace. Payments, posts, citations, customer replies, errors, and live events — all delivered as Slack messages the moment they happen. One prompt. Your business in your pocket.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton />
              <button
                onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
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
                  <p className="font-display text-sm font-bold text-foreground">{card.engine}</p>
                  <p className="font-body text-xs text-foreground/30">{card.trigger}</p>
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
                <p className="pt-1 text-foreground/30 text-xs">All engines running normally.</p>
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
            Lazy Alert installs a set of slash commands into your Slack workspace so you can trigger and control your engines without opening a dashboard.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10 bg-[#1a1a18] border border-border p-6 font-mono text-sm space-y-2">
            {slashCommands.map((cmd) => (
              <div key={cmd} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <code className="text-foreground/70 shrink-0">{cmd}</code>
                <span className="text-foreground/30 text-xs">— {slashDescriptions[cmd]}</span>
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
        ctaButton={<CopyPromptButton />}
      />

      {/* ── FAQ ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-12">
            FAQ
          </motion.h2>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="border border-border p-6 bg-card">
                <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            Your autonomous business.
            <br />
            In your Slack.
          </motion.h2>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-6 font-body text-base text-foreground/50 max-w-xl mx-auto leading-relaxed">
            One prompt installs the entire Slack integration — real-time event alerts, daily briefings, slash commands, and error monitoring — into your existing Lovable project.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-10">
            <CopyPromptButton />
          </motion.div>

          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 font-body text-xs text-foreground/25 max-w-md mx-auto">
            Open your Lovable project, paste it into the chat, add your Slack webhook URL. Your business starts talking to you today.
          </motion.p>

          <p className="mt-16" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
}
