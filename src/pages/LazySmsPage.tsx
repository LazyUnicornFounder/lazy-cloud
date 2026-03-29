import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MessageSquare, Phone, Bell, ShoppingCart, Users, ShieldCheck, BarChart3, RefreshCw, CreditCard, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_SMS_PROMPT = `[Lazy SMS Prompt — v0.0.4 — LazyUnicorn.ai]

Add a complete self-improving Twilio SMS agent called Lazy SMS to this project. It installs payment confirmations, subscription alerts, abandoned checkout recovery texts, welcome sequences, two-way messaging, opt-out management, delivery tracking, and autonomous message optimisation — with no manual Twilio integration required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**sms_settings**
id (uuid, primary key, default gen_random_uuid()),
business_name (text),
site_url (text),
twilio_phone_number (text),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

Note: Store Twilio credentials as Supabase secrets — TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN. Never store in the database table.

**sms_contacts**
id (uuid, primary key, default gen_random_uuid()),
phone_number (text, unique),
name (text),
email (text),
opted_out (boolean, default false),
opted_out_at (timestamptz),
created_at (timestamptz, default now())

**sms_messages**
id (uuid, primary key, default gen_random_uuid()),
contact_id (uuid),
phone_number (text),
message_body (text),
direction (text),
message_type (text),
twilio_message_sid (text),
status (text, default 'queued'),
sent_at (timestamptz),
delivered_at (timestamptz),
created_at (timestamptz, default now())

**sms_sequences**
id (uuid, primary key, default gen_random_uuid()),
name (text),
trigger (text),
step_number (integer),
delay_hours (integer),
message_template (text),
response_rate (numeric, default 0),
sends (integer, default 0),
responses (integer, default 0),
last_optimised (timestamptz),
active (boolean, default true),
created_at (timestamptz, default now())

**sms_optouts**
id (uuid, primary key, default gen_random_uuid()),
phone_number (text, unique),
opted_out_at (timestamptz, default now())

**sms_optimisation_log**
id (uuid, primary key, default gen_random_uuid()),
sequence_id (uuid),
sequence_name (text),
old_template (text),
new_template (text),
old_response_rate (numeric),
optimised_at (timestamptz, default now())

**sms_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-sms-setup with a form:
- Twilio Account SID (text) — find in Twilio console. Stored as Supabase secret TWILIO_ACCOUNT_SID.
- Twilio Auth Token (password) — find in Twilio console. Stored as Supabase secret TWILIO_AUTH_TOKEN.
- Twilio Phone Number (text) — the SMS-enabled number in E.164 format e.g. +12025551234
- Business name
- Site URL

Show a notice on the setup page:
"After saving, go to your Twilio console, select your phone number, and set:
Messaging webhook URL: [site_url]/api/sms-receive (HTTP POST)
Status Callback URL: [site_url]/api/sms-status (HTTP POST)"

Submit button: Activate Lazy SMS

On submit:
1. Store TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN as Supabase secrets
2. Save twilio_phone_number, business_name, site_url to sms_settings
3. Set setup_complete to true and prompt_version to 'v0.0.3'
4. Seed sms_sequences with four default sequences:
   - trigger: new-customer, step: 1, delay: 0, template: "Welcome to [business_name]. We are glad to have you. Reply STOP to opt out."
   - trigger: payment-success, step: 1, delay: 0, template: "Payment confirmed. Thank you for your purchase from [business_name]. Reply STOP to opt out."
   - trigger: subscription-renewal, step: 1, delay: 72, template: "Your [business_name] subscription renews in 3 days. Manage it here: [site_url]/manage-subscription. Reply STOP to opt out."
   - trigger: checkout-abandoned, step: 1, delay: 1, template: "You left something at [business_name]. Complete your purchase here: [checkout_url]. Reply STOP to opt out."
5. Redirect to /admin with message: "Lazy SMS is active. Your site will now text customers automatically."

---

## 3. Core edge functions

**sms-send** — handles POST requests
- Accept phone_number (text), message_body (text), message_type (text), contact_id (uuid optional)
- Check sms_optouts for the phone number — if found return without sending
- Read TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN from Supabase secrets
- Send via Twilio Messages API: https://api.twilio.com/2010-04-01/Accounts/[TWILIO_ACCOUNT_SID]/Messages.json using Basic Auth
- Body: From = twilio_phone_number, To = phone_number, Body = message_body
- Insert into sms_messages with twilio_message_sid from response and status sent
- Log errors to sms_errors with function_name sms-send

**sms-receive** — handles POST requests at /api/sms-receive
- Parse Twilio webhook: From (sender number), Body (message text), MessageSid
- If body is STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, or QUIT: insert into sms_optouts, update opted_out in sms_contacts, insert inbound message with message_type opt-out. Exit.
- For all other messages: insert into sms_messages with direction inbound. Find contact in sms_contacts by phone number. Increment responses on matching outbound messages.
- Call the built-in Lovable AI:
  "You are a helpful customer service assistant for [business_name]. A customer texted: [message_body]. Write a brief helpful SMS reply under 160 characters. Be friendly and concise. Do not use emojis. End with: Reply STOP to opt out. Return only the message text, nothing else."
- Call sms-send with the reply and customer phone number and message_type reply
- Log errors to sms_errors with function_name sms-receive

**sms-status** — handles POST requests at /api/sms-status
- Parse Twilio webhook: MessageSid and MessageStatus
- Update matching sms_messages row — set status, set delivered_at to now if status is delivered
- Log errors to sms_errors with function_name sms-status

---

## 4. Sequence edge function

**sms-sequences-run**
Cron: every hour — 0 * * * *

1. Read sms_settings. If is_running is false or setup_complete is false exit.
2. For each active sequence in sms_sequences find eligible contacts:
   - new-customer: sms_contacts created in the last hour
   - payment-success: pay_transactions where status is succeeded and created_at in the last hour (skip if pay_transactions table does not exist)
   - checkout-abandoned: pay_abandoned where recovery_email_sent is true and created_at between 1 and 2 hours ago (skip if table does not exist)
   - subscription-renewal: pay_subscriptions where current_period_end is between 72 and 73 hours from now (skip if table does not exist)
3. For each matching contact: check they have not already received this sequence step (query sms_messages). Check they are not in sms_optouts.
4. Personalise template: replace [business_name], [site_url], [checkout_url] with values from sms_settings.
5. Call sms-send for each eligible contact.
6. Increment sends on the sequence row.
Log errors to sms_errors with function_name sms-sequences-run.

---

## 5. Self-improving edge function

**sms-optimise**
Cron: every Sunday at 12pm UTC — 0 12 * * 0

1. Read sms_settings. If is_running is false exit.
2. For each active sequence where sends > 20: calculate response_rate = (responses / sends) * 100. Update response_rate in sms_sequences.
3. If response_rate < 5 and (last_optimised is null or older than 14 days):
   Call the built-in Lovable AI:
   "You are an SMS marketing specialist for [business_name]. This message has a [response_rate]% response rate from [sends] sends. Rewrite it to be more engaging. Keep it under 160 characters. Current message: [message_template]. Trigger context: [trigger]. Return only the new message text. Do not include STOP instructions — those will be appended automatically."
4. Insert into sms_optimisation_log with old and new values.
5. Update message_template in sms_sequences.
6. Set last_optimised to now.
Log errors to sms_errors with function_name sms-optimise.

---

## 6. Admin

Do not build a standalone dashboard page for this agent. The dashboard lives at /admin/sms as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This agent only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-sms-setup.

## 7. Navigation

Do not add any Lazy SMS pages to the public navigation. All pages are admin-only.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

/* ── Reusable copy button ── */
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
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity bg-primary text-primary-foreground ${className}`}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

function TwilioBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/50 border border-border px-3 py-1">
      Powered by Twilio
    </span>
  );
}

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your Twilio credentials in the setup screen.",
  "Your site starts texting customers automatically at every key moment in their journey.",
];

const features = [
  { icon: CreditCard, title: "Payment confirmations", desc: "Instant SMS on every successful Stripe payment if Lazy Pay is installed." },
  { icon: Bell, title: "Subscription alerts", desc: "Renewal reminders sent automatically 3 days before billing." },
  { icon: ShoppingCart, title: "Abandoned checkout recovery", desc: "Texts customers 1 hour after an incomplete checkout with a fresh link." },
  { icon: Users, title: "Welcome sequences", desc: "Automated multi-message onboarding sequence sent to every new customer." },
  { icon: MessageSquare, title: "Two-way messaging", desc: "Customers reply to messages and get intelligent AI-generated responses automatically." },
  { icon: ShieldCheck, title: "Opt-out management", desc: "Handles STOP replies automatically and stays fully compliant with SMS regulations." },
  { icon: BarChart3, title: "Delivery dashboard", desc: "Tracks sent, delivered, failed, and response rates for every message type." },
  { icon: RefreshCw, title: "Self-improving sequences", desc: "Monitors response rates weekly and rewrites underperforming messages automatically using AI." },
];

const payCards = [
  { title: "Payment confirmed", desc: "Customer receives an instant SMS confirmation with order details the moment payment succeeds." },
  { title: "Subscription renewing", desc: "Customer receives a reminder text 3 days before their next billing date." },
  { title: "Checkout abandoned", desc: "Customer receives a recovery text 1 hour after leaving checkout with a fresh payment link." },
];

const faqs = [
  { q: "Do I need a paid Twilio account?", a: "Twilio is free to set up with a trial. Sending SMS requires a paid account — roughly $0.0079 per message in the US plus a phone number at around $1/month." },
  { q: "How does it handle opt-outs?", a: "When a customer replies STOP, Lazy SMS automatically adds them to a blocklist and never texts them again. This is handled automatically and keeps you compliant." },
  { q: "Does it work without Lazy Pay?", a: "Yes. Lazy SMS works standalone. You can trigger messages from any event in your Supabase database. But combined with Lazy Pay it covers the full customer payment journey automatically." },
  { q: "How does the self-improvement work?", a: "Lazy SMS tracks response rates per message weekly. When a message falls below a response rate threshold it uses AI to rewrite it and replaces it in the sequence." },
  { q: "What countries does it support?", a: "Twilio supports SMS in 180+ countries. Phone number availability and pricing varies by country." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazySmsPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-sms");
  const promptText = dbPrompt?.prompt_text || LAZY_SMS_PROMPT;
  useEffect(() => { trackEvent("page_view", { page: "/lazy-sms" }); }, []);
  const handleCopy = () => trackEvent("copy_prompt", { product: "lazy-sms" });
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Lazy SMS — Self-Improving Twilio SMS Agent for Lovable"
        description="One prompt installs Twilio SMS confirmations, drip sequences, abandoned checkout recovery, and two-way messaging into any Lovable project."
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ── HERO ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-sms" />

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy SMS
                </h1>


              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Commerce</span>
              </div>


              <TwilioBadge />
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                SMS confirmations, drip sequences, and abandoned checkout recovery — running automatically. Lazy SMS handles the entire Twilio integration with no code required.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handleCopy} />
                <button onClick={scrollToHowItWorks} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              Twilio integrated. Self-improving. In one paste.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                  <p className="font-body text-sm leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IT INSTALLS ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              Everything Twilio needs. Plus the part that makes messages better every week.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border p-6 bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <f.icon size={20} className="text-primary" />
                    <h3 className="font-display text-sm font-bold tracking-tight">{f.title}</h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── THE 98% SECTION ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Email gets opened 20% of the time. SMS gets opened 98% of the time.
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              Every Lovable founder sending confirmation emails is using the least effective communication channel available. SMS is read within 3 minutes of delivery on average. Abandoned checkout texts recover 3–5× more revenue than abandoned cart emails. Subscription reminder texts reduce churn significantly more than email reminders. Lazy SMS puts the highest-performing communication channel on autopilot — so your customers hear from you at exactly the right moment without you writing or scheduling a single message.
            </motion.p>
          </div>
        </section>

        {/* ── SELF-IMPROVING ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6">
              Messages that get better every week without you.
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              Lazy SMS monitors response rates for every message sequence weekly. When a message gets low engagement it rewrites it automatically using AI and updates the sequence. The welcome message that converts poorly gets replaced. The recovery text that gets ignored gets rewritten. The reminder that causes opt-outs gets softened. Every week the sequences compound toward the version that works best for your specific audience.
            </motion.p>
          </div>
        </section>

        {/* ── WORKS WITH LAZY PAY ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              Install Lazy Pay and Lazy SMS together. Your payments talk to your customers.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {payCards.map((card, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-border p-6 bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={20} className="text-primary" />
                    <h3 className="font-display text-sm font-bold tracking-tight">{card.title}</h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <LazyPricingSection
          lazyFeatures={[
            "Lazy SMS setup prompt",
            "Self-hosted in your Lovable project",
            "Bring your own Twilio account",
            "Twilio standard rates apply (~$0.0079/SMS US)",
          ]}
          proFeatures={[
            "Hosted version",
            "Advanced sequence builder",
            "A/B testing",
            "Campaign analytics",
          ]}
          ctaButton={<CopyPromptButton text={promptText} onCopy={handleCopy} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* ── BOTTOM CTA ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-4xl font-bold tracking-tight">
              Your Lovable Site. Texting Customers. Improving Itself.
            </motion.h2>
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
              Email open rates are 20%. SMS open rates are 98%. One prompt installs the entire Twilio integration — confirmations, sequences, recovery, two-way messaging, and self-improving copy.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center gap-3">
              <CopyPromptButton text={promptText} onCopy={handleCopy} />
              <p className="font-body text-sm/60 max-w-sm">
                Open your Lovable project, paste it into the chat, add your Twilio credentials. Your site starts texting customers within minutes.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
