import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MessageSquare, Phone, Bell, ShoppingCart, Users, ShieldCheck, BarChart3, RefreshCw, CreditCard, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_SMS_PROMPT = `Install Lazy SMS — a self-improving Twilio SMS engine — into my existing Lovable project.

---

## Step 1: Ask me three setup questions

Before building anything, ask me these three questions one at a time:

1. What is your Twilio Account SID? (Get one at console.twilio.com)
2. What is your Twilio Auth Token?
3. What is your Twilio phone number? (The number you want to send SMS from, in E.164 format e.g. +15017122661)

---

## Step 2: Create the database

Create these Supabase tables with RLS enabled:

**sms_settings** — id, twilio_account_sid (stored as secret), twilio_auth_token (stored as secret), twilio_phone_number, is_running boolean default true, setup_complete boolean default false, self_improve boolean default true, created_at
**sms_sequences** — id, name (text), trigger_event (text), messages (jsonb array of {delay_minutes, body}), is_active boolean default true, response_rate decimal default 0, last_optimised_at timestamptz, created_at
**sms_messages** — id, sequence_id (uuid), recipient_phone (text), body (text), status (queued/sent/delivered/failed/replied), direction (outbound/inbound), twilio_sid (text), created_at, delivered_at
**sms_optouts** — id, phone_number (text unique), opted_out_at timestamptz default now()
**sms_errors** — id, error_message (text), context (text), created_at timestamptz default now()

---

## Step 3: Build default sequences

Create these default sequences in sms_sequences on setup:

1. **welcome** — trigger: new_customer — Message 1 (0 min): "Welcome to [brand]! Thanks for joining. Reply HELP anytime." Message 2 (1440 min / 24h): "Quick tip: [value proposition]. Questions? Just reply to this text."
2. **payment_confirmed** — trigger: payment_success — Message 1 (0 min): "Payment confirmed! $[amount] received for [product]. Thank you!"
3. **subscription_reminder** — trigger: subscription_renewing — Message 1 (0 min): "Heads up — your [product] subscription renews in 3 days at $[amount]. No action needed."
4. **checkout_recovery** — trigger: checkout_abandoned — Message 1 (60 min): "Looks like you didn't finish checking out. Your cart is still waiting: [checkout_link]"

---

## Step 4: Build the SMS sending engine

Create a Supabase edge function called sms-send that:
- Accepts a trigger_event, recipient_phone, and template_vars
- Checks sms_optouts — if phone is opted out, skip silently
- Looks up the matching sequence from sms_sequences
- For immediate messages (delay 0), sends via Twilio API immediately
- For delayed messages, inserts into sms_messages with status 'queued' and a scheduled send time
- Logs errors to sms_errors

Create a Supabase edge function called sms-process-queue that runs every 5 minutes:
- Queries sms_messages where status is 'queued' and scheduled time has passed
- Sends each via Twilio API
- Updates status to 'sent' or 'failed'

---

## Step 5: Build the webhook handler

Create a Supabase edge function called sms-webhook that:
- Receives incoming Twilio webhooks for delivery status updates and inbound messages
- On delivery confirmation: updates sms_messages status to 'delivered'
- On inbound message containing STOP/UNSUBSCRIBE: adds phone to sms_optouts, sends confirmation "You've been unsubscribed. Reply START to re-subscribe."
- On inbound message containing START: removes from sms_optouts
- On any other inbound message: uses AI to generate an appropriate response and sends it back
- Logs errors to sms_errors

---

## Step 6: Build the self-improvement engine

Create a Supabase edge function called sms-optimise that runs weekly:
- For each active sequence in sms_sequences:
  - Calculate response rate from sms_messages (delivered vs replied) for the past 7 days
  - If response rate is below 5% and more than 50 messages were sent:
    - Use AI to rewrite the message body based on the sequence name and current body
    - Update the sequence messages in sms_sequences
    - Set last_optimised_at to now()
- Log errors to sms_errors

---

## Step 7: Build the dashboard

Create a page at /sms-dashboard showing:
- Total messages sent, delivered, failed, and response rate
- Sequence performance table with send count, delivery rate, response rate per sequence
- Recent messages table
- Opt-out count
- Toggle to pause/resume Lazy SMS
- Toggle to enable/disable self-improvement
- Error log showing last 10 errors
- Link to /lazy-sms-setup to edit settings

---

## Step 8: Integrate with Lazy Pay (if installed)

If pay_checkouts table exists:
- On checkout completed → trigger payment_confirmed sequence
- On checkout abandoned (1 hour old) → trigger checkout_recovery sequence
- On subscription renewing (3 days before) → trigger subscription_reminder sequence

---

## Design rules

- Match my existing site's design system exactly
- Use my existing fonts, colors, spacing, and component patterns
- Use shadcn/ui components where appropriate
- All pages must be fully responsive

---

## Important

- Store Twilio credentials as Supabase secrets, never in client code
- Use Lovable Cloud (Supabase) for all database, storage, and edge function needs
- Every engine must handle errors gracefully and log to sms_errors
- Always check sms_optouts before sending any message
- The entire system should run autonomously after the initial setup`;

/* ── Reusable copy button ── */
function CopyPromptButton({ className = "", onCopy }: { className?: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(LAZY_SMS_PROMPT);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] ${className}`}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

function TwilioBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide">
      <Phone size={14} />
      Powered by Twilio
    </div>
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
];

export default function LazySmsPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("page_view", { page: "/lazy-sms" }); }, []);
  const handleCopy = () => trackEvent("copy_prompt", { product: "lazy-sms" });
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Lazy SMS — Self-Improving Twilio SMS Engine for Lovable"
        description="One prompt installs Twilio SMS confirmations, drip sequences, abandoned checkout recovery, and two-way messaging into any Lovable project."
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ── HERO ── */}
        <section className="relative max-w-4xl mx-auto text-center px-6 pt-28 pb-24 md:mb-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3">
              Introducing Lazy SMS
              <TwilioBadge />
            </motion.p>
            <span className="inline-block bg-primary text-primary-foreground font-display text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] px-5 py-1.5 rounded-full mb-6">BETA</span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-8 max-w-3xl mx-auto">
              One Prompt Installs <span className="text-gradient-primary">Twilio</span> Into Your Lovable Project.
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              SMS confirmations, drip sequences, and abandoned checkout recovery — running automatically. Lazy SMS handles the entire Twilio integration with no code required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <CopyPromptButton onCopy={handleCopy} />
              <button onClick={scrollToHowItWorks} className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full border border-border text-foreground hover:bg-muted transition-colors">
                See How It Works
              </button>
            </div>
          </motion.div>
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
                  <span className="w-10 h-10 rounded-full bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
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
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border rounded-2xl p-6 bg-card/40">
                  <div className="flex items-center gap-3 mb-3">
                    <f.icon size={20} className="text-primary" />
                    <h3 className="font-display text-sm font-bold tracking-tight">{f.title}</h3>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
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
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-border rounded-2xl p-6 bg-card/40">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap size={20} className="text-primary" />
                    <h3 className="font-display text-sm font-bold tracking-tight">{card.title}</h3>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
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
          ctaButton={<CopyPromptButton onCopy={handleCopy} className="w-full justify-center" />}
        />

        {/* ── FAQ ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">FAQ</motion.h2>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border rounded-2xl p-6 bg-card/40">
                  <h3 className="font-display text-sm font-bold mb-2">{faq.q}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
              <CopyPromptButton onCopy={handleCopy} />
              <p className="font-body text-xs text-muted-foreground/60 max-w-sm">
                Open your Lovable project, paste it into the chat, add your Twilio credentials. Your site starts texting customers within minutes.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
