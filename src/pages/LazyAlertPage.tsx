import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Bell, MessageSquare, Zap, Terminal, Clock, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_ALERT_PROMPT = `You are setting up Lazy Alert — a Slack integration that connects every Lazy engine to your Slack workspace so your autonomous business narrates itself to you in real time.

## What it does
Lazy Alert hooks into every Lazy engine's database triggers and edge functions to send real-time Slack messages whenever a significant event occurs. It also sends a daily briefing every morning at 8am and installs slash commands for controlling engines from Slack.

## Database tables

CREATE TABLE public.alert_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  slack_webhook_url TEXT,
  slack_channel TEXT DEFAULT '#lazy-alerts',
  is_running BOOLEAN DEFAULT false,
  setup_complete BOOLEAN DEFAULT false,
  daily_briefing_enabled BOOLEAN DEFAULT true,
  briefing_hour INT DEFAULT 8,
  enabled_alerts JSONB DEFAULT '{"pay":true,"sms":true,"blogger":true,"seo":true,"geo":true,"store":true,"stream":true,"code":true,"run":true}'::jsonb
);

CREATE TABLE public.alert_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  engine TEXT NOT NULL,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  slack_response TEXT,
  status TEXT DEFAULT 'sent'
);

CREATE TABLE public.alert_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  error_message TEXT NOT NULL
);

## Edge functions

### send-slack-alert
Accepts { engine, event_type, message } and posts to the configured Slack webhook URL. Logs every message to alert_log. Checks alert_settings to see if this engine type is enabled before sending.

### daily-briefing
Runs on a cron schedule every morning. Queries all engine tables for yesterday's activity — posts published, revenue earned, keywords ranking, citation rate, SMS responses, errors. Formats a single rich Slack message and sends it.

### alert-slash-command
Receives Slack slash command payloads and routes them:
- /lazy status — queries all engine settings tables and returns running/paused status
- /lazy publish blog — invokes auto-publish-blog function
- /lazy publish seo — invokes lazy-seo-publish function
- /lazy publish geo — invokes lazy-geo-publish function
- /lazy pause [engine] — sets is_running=false on the engine's settings table
- /lazy resume [engine] — sets is_running=true on the engine's settings table
- /lazy errors — queries all error tables and returns the last 10

## Setup page at /lazy-alert-setup
A form that collects: Slack webhook URL, channel name, which alert types to enable (toggles for each engine), daily briefing on/off, briefing time. Save to alert_settings.

## Admin dashboard section
Show alert_log with recent messages, delivery status, and error count. Toggle to pause/resume alerts.

## Navigation
Add "Lazy Alert" to the main navigation and admin sidebar.`;

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
      <header className="pt-32 md:pt-44 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} transition={{ duration: 0.5 }}>
            <SlackBadge />
          </motion.div>

          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6" style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "#f0ead6", opacity: 0.4 }}>
            Introducing
          </motion.p>

          <motion.h1 variants={fadeUp} transition={{ duration: 0.8 }} className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            Your autonomous business.
            <br />
            Reporting to you in Slack.
          </motion.h1>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-2">
            <span className="font-body text-[10px] tracking-[0.2em] uppercase px-2 py-0.5 border border-foreground/20 text-foreground/30">
              BETA
            </span>
          </motion.div>

          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6 font-body text-base text-foreground/50 max-w-2xl leading-relaxed">
            Lazy Alert connects every Lazy engine to your Slack workspace. Payments, posts, citations, customer replies, errors, and live events — all delivered as Slack messages the moment they happen. One prompt. Your business in your pocket.
          </motion.p>

          <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-start gap-4 mt-10">
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("events")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-8 py-4 font-semibold border border-foreground/20 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-colors"
            >
              See What Gets Sent
            </button>
          </motion.div>
        </motion.div>
      </header>

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
                <SlackMessage avatar={card.avatar} name="LazyUnicorn" time="just now">
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
            <SlackMessage avatar="🦄" name="LazyUnicorn" time="8:00 AM">
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
