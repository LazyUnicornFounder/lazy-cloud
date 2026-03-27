import { useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, Check, Copy, DollarSign, FileText, MessageCircle, Package, Radio, Rocket } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import { useState } from "react";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const SETUP_PROMPT = `[Lazy Telegram Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete autonomous Telegram integration called Lazy Telegram to this project. It mirrors Lazy Alert but for Telegram — sending real-time event notifications, a daily briefing, and accepting bot commands to control your engines directly from Telegram. Your autonomous business in your pocket, delivered through Telegram.

---

MARKETING PAGE PROMPT — paste into LazyUnicorn project:

Add a new page at /lazy-telegram. It is a marketing and landing page for a product called Lazy Telegram — a Telegram bot integration that connects every Lazy engine to your Telegram account so your autonomous business reports to you in real time.

Hero section
Headline: 'Your autonomous business. In your Telegram.' Subheading: 'Lazy Telegram connects every Lazy engine to a Telegram bot. Payments, posts, citations, customer replies, errors, and live events — all delivered as Telegram messages the moment they happen. One prompt. Your business in your pocket.' Primary button: Copy the Lovable Prompt. Secondary button: See What Gets Sent. Badge: Powered by Telegram.

How it works section
Four steps: 1. Copy the setup prompt. 2. Paste into your Lovable project. 3. Create a Telegram bot via BotFather and add your bot token. 4. Every significant event sends you a Telegram message automatically.

What gets sent section
Eight event cards identical in structure to Lazy Alert but for Telegram. Include mock Telegram message previews styled as the Telegram chat interface with a blue LazyUnicorn avatar. Events: payments received, SMS customer replies, brand citations, posts published, products listed, streams going live, releases published, engine errors.

Bot commands section
Headline: Control everything from Telegram. Show commands in a code block: /status — all engines running or paused. /publish blog — trigger one blog post. /publish seo — trigger one SEO post. /publish geo — trigger one GEO post. /pause [engine] — pause an engine. /resume [engine] — resume an engine. /errors — last 10 errors. /report — send daily briefing now. /help — all commands.

Pricing section
Free — self-hosted, bring your own Telegram bot (free). Pro at $9/month — coming soon, hosted version, group chat support, multiple recipient routing.

Bottom CTA
Headline: Your autonomous business. Reporting to you on Telegram. Primary button: Copy the Lovable Prompt.

Navigation: Add Lazy Telegram to the LazyUnicorn navigation.

---

SETUP PROMPT — paste into user's Lovable project:

Add a complete Telegram bot integration called Lazy Telegram to this project. It sends real-time Telegram notifications for every significant event across every installed Lazy engine, delivers a daily morning briefing, and accepts bot commands for controlling engines from Telegram.

1. Database
Create these Supabase tables with RLS enabled:

telegram_settings: id (uuid, primary key, default gen_random_uuid()), chat_id (text), daily_briefing_enabled (boolean, default true), daily_briefing_time (text, default '08:00'), alert_payments (boolean, default true), alert_sms_replies (boolean, default true), alert_posts (boolean, default false), alert_keywords (boolean, default true), alert_citations (boolean, default true), alert_products (boolean, default true), alert_streams (boolean, default true), alert_releases (boolean, default true), alert_errors (boolean, default true), last_checked (timestamptz), is_running (boolean, default true), setup_complete (boolean, default false),
prompt_version (text, nullable), created_at (timestamptz, default now()).
Note: Store TELEGRAM_BOT_TOKEN as a Supabase secret. Never in the database.

telegram_log: id (uuid, primary key, default gen_random_uuid()), engine (text), event_type (text), message (text), telegram_response (text), sent_at (timestamptz, default now()), success (boolean, default true).

telegram_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page
Create a page at /lazy-telegram-setup with a form:
- Telegram Bot Token (password) — with instructions: Open Telegram, search for BotFather, send /newbot, follow the prompts to name your bot, copy the token. Stored as Supabase secret TELEGRAM_BOT_TOKEN.
- Your Telegram Chat ID (text) — with instructions: Start a chat with your bot, then visit https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates after sending a message to your bot. Copy the chat id from the response.
- Daily briefing toggle (default on)
- Daily briefing time (select: 6am / 7am / 8am / 9am)
- Alert toggles: Payments, SMS Replies, Posts, Keywords, Citations, Products, Streams, Releases, Errors

Submit button: Connect to Telegram

On submit:
1. Store TELEGRAM_BOT_TOKEN as Supabase secret
2. Save chat_id and all toggles to telegram_settings
3. Set setup_complete to true and prompt_version to 'v0.0.1'
4. Send a test message via Telegram: Your Lazy Telegram bot is connected. Your autonomous business will now report to you here.
5. Redirect to /admin with message: Telegram connected. Check your bot for the test message.

3. Core send function
Create a Supabase edge function called telegram-send handling POST requests.
Accept: message (text), engine (text), event_type (text).
Read telegram_settings. If is_running is false exit.
Format message using Telegram MarkdownV2:
- Bold header with relevant emoji and event type
- Main message text
- Key details as a clean list
POST to https://api.telegram.org/bot[TELEGRAM_BOT_TOKEN]/sendMessage with: chat_id from telegram_settings, text as the formatted message, parse_mode MarkdownV2.
Insert into telegram_log.
Log errors to telegram_errors with function_name telegram-send.

4. Event monitor edge function
Create a Supabase edge function called telegram-monitor. Cron: every 5 minutes — */5 * * * *

Identical logic to Lazy Alert's alert-monitor but calling telegram-send instead of alert-send. Monitor: pay_transactions for payments, sms_messages for replies, seo_posts and geo_posts for keyword/citation events, store_products for new products, stream_sessions for live streams, code_content and gitlab_content for releases, all error tables for engine errors. Also monitor security_vulnerabilities for new critical or high severity findings where alerted is false and first_found_at is greater than last_checked — send alert with 🚨 emoji and mark as alerted true. Use last_checked watermark approach. Update last_checked after each run.
Log errors to telegram_errors with function_name telegram-monitor.

5. Daily briefing edge function
Create a Supabase edge function called telegram-briefing. Cron: 0 8 * * * (adjust based on setting).

Collect same metrics as Lazy Alert's briefing. Call the built-in Lovable AI to write a 3 to 5 bullet briefing. Format as a clean Telegram message with bold headers. Call telegram-send with engine Lazy Run and event_type daily-briefing.
Log errors to telegram_errors with function_name telegram-briefing.

6. Bot command edge function
Create a Supabase edge function called telegram-command handling POST requests at /api/telegram-webhook.

This receives Telegram webhook updates. Read TELEGRAM_BOT_TOKEN from secrets. Parse the message text from the update object.

Register the webhook by calling: https://api.telegram.org/bot[TELEGRAM_BOT_TOKEN]/setWebhook?url=[site_url]/api/telegram-webhook

Handle these commands:
/status — query all engine settings tables, return status of each engine with emoji indicators.
/publish blog — call blog-publish. Reply: Publishing one blog post now.
/publish seo — call seo-publish. Reply: Publishing one SEO post now.
/publish geo — call geo-publish. Reply: Publishing one GEO post now.
/pause [engine] — update is_running to false in matching engine settings table. Reply: [engine] paused.
/resume [engine] — update is_running to true. Reply: [engine] resumed.
/errors — query all engine error tables for last 5 errors each. Format and reply.
/pentest — trigger security-scan immediately if security_settings table exists and is_running is true. Reply: Pentest queued. Results will appear in your dashboard within the next hour. If not installed reply: Lazy Security is not installed.
/security — if security_settings exists query security_scans for latest completed scan score and security_vulnerabilities for open critical and high counts. Reply with score, open critical, open high, and next pentest date. If not installed reply: Lazy Security is not installed.
/report — trigger telegram-briefing immediately. Reply: Sending your briefing now.
/help — reply with all available commands and descriptions.

For unknown commands reply: Unknown command. Send /help for a list of available commands.

Respond to Telegram using the answerMessage API. Log errors to telegram_errors with function_name telegram-command.

7. Admin

Do not build a standalone dashboard page for this engine. The dashboard lives at /admin/telegram as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all engines in one place." and a link to /lazy-telegram-setup.

8. Navigation
Do not add any Lazy Telegram pages to public navigation. All pages are admin-only.`;

const steps = ["Copy the setup prompt from this page.", "Paste it into your existing Lovable project.", "Create a Telegram bot via BotFather and add the token.", "Every significant event sends a Telegram message automatically."];

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
    <span className="inline-flex items-center gap-1.5 font-body text-[12px] tracking-[0.12em] uppercase text-foreground/45 border border-border px-3 py-1">
      Powered by Telegram
    </span>
  );
}

const LazyTelegramPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-telegram");
  const promptText = dbPrompt?.prompt_text || SETUP_PROMPT;

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_telegram_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Telegram — Autonomous Telegram Alerts for Lovable" description="Your autonomous business in your Telegram. Real-time alerts, daily briefings, and bot commands." url="/lazy-telegram" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[12px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-telegram" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Telegram
                </h1>
                <ServiceBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                Lazy Telegram connects every Lazy engine to a Telegram bot. Payments, posts, citations, customer replies, errors, and live events — all delivered as Telegram messages the moment they happen. One prompt. Your business in your pocket.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20 pt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">One prompt. Your business talks to you on Telegram.</motion.h2>
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
              { icon: DollarSign, title: "Payment Notifications", desc: "Instant Telegram message for every payment with amount, customer, and product." },
              { icon: MessageCircle, title: "SMS Reply Forwarding", desc: "Customer text replies appear in your Telegram chat immediately." },
              { icon: Brain, title: "Brand Citation Alerts", desc: "Know the moment an AI engine cites your brand." },
              { icon: FileText, title: "Post Published Alerts", desc: "Every new blog, SEO, or GEO post triggers a notification." },
              { icon: Package, title: "Product Discovery Alerts", desc: "New products listed by Lazy Store appear in Telegram instantly." },
              { icon: Radio, title: "Stream Live Alerts", desc: "Get notified the moment a monitored stream goes live." },
              { icon: Rocket, title: "Release Published Alerts", desc: "New changelogs and release notes trigger instant notifications." },
              { icon: AlertTriangle, title: "Engine Error Alerts", desc: "Error spikes across any engine are flagged immediately." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="border-b sm:odd:border-r last:border-b-0 border-border bg-card p-6">
                <item.icon size={18} className="text-foreground/40 mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection lazyFeatures={["Lazy Telegram setup prompt", "Self-hosted in your Lovable project", "Real-time event alerts", "Telegram bots are free to create"]} proFeatures={["Hosted version", "Group chat support", "Multiple recipient routing", "Custom bot branding"]} ctaButton={<CopyPromptButton text={promptText} onCopy={handlePromptCopy} className="w-full justify-center" />} />

        <LazyFaqSection faqs={[
          { q: "Is a Telegram account required?", a: "Yes. You need a Telegram account to receive messages. The bot is free to create via BotFather." },
          { q: "How do I find my chat ID?", a: "Start a conversation with your bot then visit the Telegram API getUpdates URL. Your chat ID appears in the response." },
          { q: "Is it different from Lazy Alert?", a: "Lazy Alert sends to Slack. Lazy Telegram sends to Telegram. Both install with one prompt and can run simultaneously." },
          { q: "Can I send to a Telegram group?", a: "Yes. Add your bot to a group and use the group chat ID. Multi-group routing is coming in Pro." },
          { q: "Do the bot commands work?", a: "Yes. Commands like /status, /publish, /pause, and /errors work in any chat where your bot is present." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Your autonomous business. Reporting to you on Telegram.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">One prompt installs real-time alerts, daily briefings, and bot commands into your existing Lovable project.</p>
            <CopyPromptButton text={promptText} onCopy={handlePromptCopy} />
            <p className="font-body text-xs text-foreground/35 mt-4">Open your Lovable project, paste it into the chat, add your API key. Done.</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyTelegramPage;
