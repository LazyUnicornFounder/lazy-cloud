import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, MessageSquare, Phone, Bell, ShoppingCart, Users, ShieldCheck, BarChart3, RefreshCw, CreditCard, Zap } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_SMS_PROMPT = `Add a complete self-improving Twilio SMS engine called Lazy SMS to this project. It installs payment confirmations, subscription alerts, abandoned checkout recovery texts, welcome sequences, two-way messaging, opt-out management, delivery tracking, and autonomous message optimisation — with no manual Twilio integration required after setup.

1. Database Create a Supabase table called sms_settings with fields: id (uuid, primary key), twilio_account_sid (text), twilio_auth_token (text), twilio_phone_number (text), business_name (text), site_url (text), is_running (boolean, default true), setup_complete (boolean, default false). Create a Supabase table called sms_contacts with fields: id (uuid, primary key, default gen_random_uuid()), phone_number (text, unique), name (text), email (text), opted_out (boolean, default false), opted_out_at (timestamptz), created_at (timestamptz, default now()). Create a Supabase table called sms_messages with fields: id (uuid, primary key, default gen_random_uuid()), contact_id (uuid), phone_number (text), message_body (text), direction (text — one of outbound or inbound), message_type (text — one of confirmation, reminder, recovery, welcome, sequence, reply), twilio_message_sid (text), status (text, default 'queued'), sent_at (timestamptz), delivered_at (timestamptz), created_at (timestamptz, default now()). Create a Supabase table called sms_sequences with fields: id (uuid, primary key, default gen_random_uuid()), name (text), trigger (text — one of new-customer, payment-success, subscription-renewal, checkout-abandoned), step_number (integer), delay_hours (integer), message_template (text), response_rate (numeric, default 0), sends (integer, default 0), responses (integer, default 0), last_optimised (timestamptz), active (boolean, default true), created_at (timestamptz, default now()). Create a Supabase table called sms_optouts with fields: id (uuid, primary key, default gen_random_uuid()), phone_number (text, unique), opted_out_at (timestamptz, default now()). Create a Supabase table called sms_optimisation_log with fields: id (uuid, primary key, default gen_random_uuid()), sequence_id (uuid), sequence_name (text), old_template (text), new_template (text), old_response_rate (numeric), optimised_at (timestamptz, default now()). Create a Supabase table called sms_errors with fields: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-sms-setup with a form containing five fields: Twilio Account SID (text field — find this in your Twilio console dashboard), Twilio Auth Token (password field — find this in your Twilio console dashboard), Twilio Phone Number (text field — the SMS-enabled number from your Twilio account in E.164 format like +12025551234), Business name, Site URL. A submit button labelled Activate Lazy SMS. On submit save all values to sms_settings and set setup_complete to true. Seed the sms_sequences table with four default sequences: one with trigger new-customer, step 1, delay 0 hours, message Welcome to [business_name]. We are glad to have you. Reply STOP to opt out. One with trigger payment-success, step 1, delay 0 hours, message Payment confirmed. Thank you for your purchase from [business_name]. Reply STOP to opt out. One with trigger subscription-renewal, step 1, delay 72 hours before renewal, message Your [business_name] subscription renews in 3 days. Manage it here: [site_url]/manage-subscription. Reply STOP to opt out. One with trigger checkout-abandoned, step 1, delay 1 hour, message You left something at [business_name]. Complete your purchase here: [checkout_url]. Reply STOP to opt out. Redirect to /lazy-sms-dashboard with message: Lazy SMS is active. Your site will now text customers automatically at every key moment.

3. Core edge functions Create a Supabase edge function called sms-send handling POST requests. Accept phone_number (text), message_body (text), message_type (text), contact_id (uuid optional). Check sms_optouts for the phone number — if found return without sending. Read sms_settings for Twilio credentials. Send the SMS via the Twilio Messages API at https://api.twilio.com/2010-04-01/Accounts/[account_sid]/Messages.json using Basic Auth with account_sid and auth_token. Request body: From set to twilio_phone_number, To set to phone_number, Body set to message_body. Insert a row into sms_messages with the message details and twilio_message_sid from the response and status set to sent. Log errors to sms_errors.

Create a Supabase edge function called sms-receive handling POST requests at /api/sms-receive. This is the Twilio webhook for inbound messages. Parse the Twilio webhook body to get From (the sender phone number), Body (the message text), and MessageSid. Check if the body is STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, or QUIT — if so insert into sms_optouts and update opted_out to true in sms_contacts for that phone number and insert an inbound message into sms_messages with message_type set to opt-out. For all other inbound messages insert into sms_messages with direction inbound. Find the contact in sms_contacts by phone number. Update their responses count on matching outbound messages. Use the built-in Lovable AI to generate an intelligent reply with this prompt: You are a helpful customer service assistant for [business_name]. A customer texted: [message_body]. Write a brief, helpful SMS reply under 160 characters. Be friendly and concise. Do not use emojis. End with: Reply STOP to opt out. Return only the message text, nothing else. Call sms-send with the generated reply and the customer phone number with message_type set to reply. Log errors to sms_errors.

Create a Supabase edge function called sms-status handling POST requests at /api/sms-status. This is the Twilio status callback webhook. Parse MessageSid and MessageStatus from the Twilio webhook. Update the matching row in sms_messages — set status to the new status, set delivered_at to now if status is delivered. Log errors to sms_errors.

4. Trigger edge functions Create a Supabase edge function called sms-sequences-run that runs every hour. Read sms_settings. If is_running is false or setup_complete is false exit. For each active sequence in sms_sequences find contacts who should receive that step now — new-customer trigger checks sms_contacts created in the last hour, payment-success trigger checks pay_transactions table if it exists for successful transactions in the last hour, checkout-abandoned trigger checks pay_abandoned table if it exists for rows where recovery_email_sent is true and created_at is between 1 and 2 hours ago, subscription-renewal trigger checks pay_subscriptions table if it exists for subscriptions where current_period_end is between 72 and 73 hours from now. For each matching contact check they have not already received this sequence step by querying sms_messages. Check they are not in sms_optouts. Personalise the message template by replacing [business_name] with the stored business name and [site_url] with the stored site url and [checkout_url] with the relevant URL if available. Call sms-send for each eligible contact. Update sends count on the sequence row. Log errors to sms_errors.

5. Self-improving edge function Create a Supabase edge function called sms-optimise that runs every Sunday at 12pm UTC. Read sms_settings. If is_running is false exit. For each active sequence in sms_sequences where sends is greater than 20 calculate the response rate by dividing responses by sends multiplied by 100 and update response_rate in sms_sequences. If response_rate is below 5 percent and last_optimised is null or older than 14 days use the built-in Lovable AI with this prompt: You are an SMS marketing specialist for [business_name]. This message has a [response_rate] percent response rate from [sends] sends. Rewrite it to be more engaging and likely to get a response. Keep it under 160 characters. Current message: [message_template]. Trigger context: [trigger]. Return only the new message text, nothing else. Do not include STOP instructions — those will be appended automatically. Insert into sms_optimisation_log with old and new template values. Update message_template in sms_sequences with the new version. Set last_optimised to now. Log errors to sms_errors.

6. Admin dashboard Create a page at /lazy-sms-dashboard with five sections: Overview showing total messages sent, total delivered, overall delivery rate as a percentage, total contacts, opted-out contacts count, and active sequences count. Messages log showing last 50 rows from sms_messages with phone number, message type, direction, status, and sent time. Sequences table showing all sms_sequences rows with name, trigger, delay, current message template, sends, responses, response rate, last optimised date, and an active toggle. Optimisation log showing all sms_optimisation_log rows with sequence name, old response rate, old template, new template, and date. Controls showing a toggle to pause or resume all Lazy SMS functions updating is_running in sms_settings, a button labelled Run Sequences Now triggering sms-sequences-run, a button labelled Optimise Messages Now triggering sms-optimise, an error log showing the last 10 sms_errors rows, and a link to /lazy-sms-setup labelled Edit Settings.

7. Twilio webhook configuration note Display a notice on the dashboard and setup page with these instructions: In your Twilio console go to Phone Numbers, select your number, and set the Messaging webhook URL to [site_url]/api/sms-receive with HTTP POST method. Set the Status Callback URL to [site_url]/api/sms-status with HTTP POST method. Save. Lazy SMS will now receive inbound messages and delivery confirmations automatically.

8. Navigation Do not add any Lazy SMS pages to the public navigation. All pages are admin-only.`;

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
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity bg-primary text-primary-foreground ${className}`}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

function TwilioBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide">
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
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
                <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy SMS
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                SMS confirmations, drip sequences, and abandoned checkout recovery — running automatically. Lazy SMS handles the entire Twilio integration with no code required.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handleCopy} />
                <button onClick={scrollToHowItWorks} className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
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
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border p-6 bg-card">
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
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-border p-6 bg-card">
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
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border p-6 bg-card">
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
