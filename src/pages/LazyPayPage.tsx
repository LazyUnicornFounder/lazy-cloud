import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, CreditCard, RefreshCw, BarChart3, Mail, ShieldCheck, Users, Zap, ShoppingCart } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_PAY_PROMPT = `[Lazy Pay Prompt — v0.0.4 — LazyUnicorn.ai]

Add a complete self-improving Stripe payments agent called Lazy Pay to this project. It installs one-time payments, subscriptions, webhook handling, a customer portal, confirmation emails, a revenue dashboard, autonomous conversion optimisation, and abandoned checkout recovery — with no manual Stripe integration required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**pay_settings**
id (uuid, primary key, default gen_random_uuid()),
business_name (text),
support_email (text),
site_url (text),
currency (text, default 'usd'),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

Note: Store Stripe keys as Supabase secrets — STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET. Never store them in the database table.

**pay_products**
id (uuid, primary key, default gen_random_uuid()),
name (text),
description (text),
price_cents (integer),
billing_type (text),
billing_interval (text, nullable),
stripe_price_id (text),
stripe_product_id (text),
active (boolean, default true),
views (integer, default 0),
last_optimised (timestamptz),
created_at (timestamptz, default now())

**pay_customers**
id (uuid, primary key, default gen_random_uuid()),
email (text, unique),
stripe_customer_id (text, unique),
name (text),
created_at (timestamptz, default now())

**pay_transactions**
id (uuid, primary key, default gen_random_uuid()),
customer_id (uuid),
product_id (uuid),
stripe_session_id (text),
amount_cents (integer),
currency (text),
status (text),
billing_type (text),
created_at (timestamptz, default now())

**pay_subscriptions**
id (uuid, primary key, default gen_random_uuid()),
customer_id (uuid),
product_id (uuid),
stripe_subscription_id (text, unique),
status (text),
current_period_start (timestamptz),
current_period_end (timestamptz),
cancel_at_period_end (boolean, default false),
created_at (timestamptz, default now())

**pay_abandoned**
id (uuid, primary key, default gen_random_uuid()),
customer_email (text),
product_id (uuid),
stripe_session_id (text, unique),
recovery_email_sent (boolean, default false),
recovery_sent_at (timestamptz),
converted (boolean, default false),
created_at (timestamptz, default now())

**pay_optimisation_log**
id (uuid, primary key, default gen_random_uuid()),
product_id (uuid),
product_name (text),
old_description (text),
new_description (text),
old_conversion_rate (numeric),
optimised_at (timestamptz, default now())

**pay_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
context (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-pay-setup with a form:
- Business name
- Support email address
- Site URL
- Currency (select: USD / GBP / EUR / AUD)
- Stripe Publishable Key (text) — note: will be stored as Supabase secret STRIPE_PUBLISHABLE_KEY
- Stripe Secret Key (password) — note: will be stored as Supabase secret STRIPE_SECRET_KEY
- Stripe Webhook Secret (password) — with instructions: In the Stripe dashboard create a webhook pointing to [site_url]/api/stripe-webhook listening for: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed, checkout.session.expired, customer.subscription.created, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed. Paste the signing secret here. — will be stored as Supabase secret STRIPE_WEBHOOK_SECRET.

Submit button: Activate Lazy Pay

On submit:
1. Store Stripe keys as Supabase secrets
2. Save business_name, support_email, site_url, currency to pay_settings
3. Set setup_complete to true and prompt_version to 'v0.0.3'
4. Redirect to /admin with message: "Lazy Pay is active. Add your first product to start taking payments."

---

## 3. Core edge functions

**pay-checkout** — handles POST requests
- Accept product_id (uuid) and customer_email (text)
- Read matching product from pay_products, increment views by 1
- Read pay_settings and Stripe keys from Supabase secrets
- Create or retrieve Stripe customer, insert into pay_customers if new
- Create Stripe checkout session using stripe_price_id. Set mode to subscription or payment based on billing_type. Set success_url to site_url/payment-success, cancel_url to site_url/payment-cancelled
- Insert into pay_abandoned with stripe_session_id and recovery_email_sent false
- Return checkout URL
- Log errors to pay_errors with function_name pay-checkout

**pay-webhook** — handles POST requests at /api/stripe-webhook
- Verify Stripe webhook signature using STRIPE_WEBHOOK_SECRET secret — reject invalid with 400
- Handle checkout.session.completed: set converted to true in pay_abandoned, insert successful transaction in pay_transactions, send confirmation email with subject "Payment confirmed — [business_name]"
- Handle checkout.session.expired: mark pay_abandoned row as ready for recovery (recovery_email_sent false, converted false)
- Handle payment_intent.payment_failed: update transaction status to failed
- Handle customer.subscription.created: insert into pay_subscriptions with status active
- Handle customer.subscription.updated: update matching pay_subscriptions row
- Handle customer.subscription.deleted: update status to cancelled
- Handle invoice.payment_failed: update subscription status to past_due
- Log all errors to pay_errors with function_name pay-webhook

**pay-portal** — handles POST requests
- Accept customer_email (text)
- Look up stripe_customer_id from pay_customers
- Create Stripe billing portal session with return_url set to site_url
- Return portal URL
- Log errors to pay_errors with function_name pay-portal

---

## 4. Self-improving edge functions

**pay-optimise**
Cron: every Sunday at 11am UTC — 0 11 * * 0

1. Read pay_settings. If is_running is false or setup_complete is false exit.
2. For each active product in pay_products calculate conversion rate: (successful transactions in last 30 days / views) * 100.
3. If conversion rate < 3% and views > 30 and last_optimised is null or older than 14 days:
   Call the built-in Lovable AI:
   "You are a conversion rate specialist for [business_name]. This product has a [conversion_rate]% conversion rate from [views] views. Rewrite the name and description to be significantly more compelling. Product: [name]. Current description: [description]. Price: [price]. Return only a valid JSON object with two fields: name (string) and description (string, 80 to 120 words). No preamble. No code fences. Valid JSON only."
4. Insert into pay_optimisation_log with old and new values.
5. Update name and description in pay_products.
6. Update the product in Stripe via the Products API using STRIPE_SECRET_KEY secret.
7. Set last_optimised to now.
Log errors to pay_errors with function_name pay-optimise.

**pay-recover**
Cron: daily at 10am UTC — 0 10 * * *

1. Read pay_settings. If is_running is false or setup_complete is false exit.
2. Query pay_abandoned where recovery_email_sent is false and converted is false and created_at is older than 24 hours.
3. For each row get the matching product from pay_products.
4. Call pay-checkout to generate a fresh checkout URL for the customer email and product.
5. Send recovery email: subject "You left something behind" body "You started checking out [product_name] but did not complete your purchase. Complete it here: [fresh checkout URL]. This link is valid for 48 hours. Questions? [support_email]"
6. Update pay_abandoned: set recovery_email_sent to true, recovery_sent_at to now.
Log errors to pay_errors with function_name pay-recover.

---

## 5. Public pages

**/pricing**
Show all active pay_products ordered by price_cents ascending. Each card shows name, description, formatted price, billing interval for subscriptions, and a Buy Now button. On click show email input modal then call pay-checkout and redirect to the Stripe checkout URL.

**/payment-success**
Show: "Payment confirmed. Thank you for your purchase." Link home.

**/payment-cancelled**
Show: "Payment cancelled. No charge was made." Link to /pricing.

**/manage-subscription**
Show email input. On submit call pay-portal and redirect to Stripe customer portal.

---

## 6. Admin

Do not build a standalone dashboard page for this agent. The dashboard lives at /admin/pay as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This agent only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-pay-setup.

## 7. Navigation

Add a Pricing link to the main site navigation pointing to /pricing.
Add a Manage Subscription link in the site footer pointing to /manage-subscription.
Add an Admin link to the main site navigation pointing to /admin.
Do not add /lazy-pay-setup to public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  variant = "primary",
  text,
}: {
  className?: string;
  onCopy: () => void;
  variant?: "primary" | "ghost";
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, text]);

  const base =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${base} ${className}`}
    >
      {copied ? (
        <><Check size={16} /> Copied ✓</>
      ) : (
        <><Copy size={16} /> Copy the Lovable Prompt</>
      )}
    </button>
  );
}

/* ── Stripe badge ── */
function StripeBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">
      Powered by Stripe
    </span>
  );
}

/* ── Steps data ── */
const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your Stripe API keys in the setup screen.",
  "Your site takes payments and starts improving its own conversion rate automatically.",
];

/* ── Features data ── */
const features = [
  { icon: CreditCard, title: "One-time payments", desc: "Products with prices and a Buy Now button that opens a Stripe checkout session." },
  { icon: RefreshCw, title: "Subscriptions", desc: "Monthly and annual plans with automatic renewal and failed payment handling." },
  { icon: Zap, title: "Webhook handler", desc: "Listens for Stripe events and updates your database automatically." },
  { icon: Users, title: "Customer portal", desc: "Buyers manage their own subscriptions without contacting you." },
  { icon: Mail, title: "Confirmation emails", desc: "Automatic payment confirmation on every successful purchase." },
  { icon: BarChart3, title: "Revenue dashboard", desc: "MRR, total revenue, active subscribers, and recent transactions in one place." },
  { icon: RefreshCw, title: "Conversion optimiser", desc: "Monitors which products underperform, rewrites their copy automatically, and improves conversion week over week." },
  { icon: ShoppingCart, title: "Abandoned checkout recovery", desc: "Detects incomplete checkouts and sends a recovery email 24 hours later with a fresh checkout link automatically." },
];

/* ── Self-improving loop steps ── */
const loopSteps = [
  "Product listed",
  "Views & conversions tracked",
  "Underperforming copy rewritten automatically",
  "Abandoned checkouts recover automatically",
  "Conversion rate improves week over week",
];

/* ── FAQ data ── */
const faqs = [
  { q: "Do I need a paid Stripe account?", a: "Stripe is free to set up. They charge 2.9% plus 30 cents per transaction in the US. No monthly fee." },
  { q: "How does the conversion optimiser work?", a: "It monitors views and successful transactions per product weekly. When conversion falls below 3% after 30 views it uses AI to rewrite the product description and updates it in Stripe automatically." },
  { q: "What happens to abandoned checkouts?", a: "When a Stripe checkout session expires without completing, Lazy Pay logs it and sends a single recovery email 24 hours later with a fresh checkout link. You never see it happen." },
  { q: "Does it work with Lazy Store?", a: "Yes. Products listed by Lazy Store automatically get Stripe checkout attached when Lazy Pay is installed in the same project." },
  { q: "Is this PCI compliant?", a: "Yes. Stripe handles all card data. Lazy Pay never stores card numbers or sensitive payment information." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazyPayPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-pay");
  const promptText = dbPrompt?.prompt_text || LAZY_PAY_PROMPT;

  useEffect(() => {
    trackEvent("page_view", { page: "/lazy-pay" });
  }, []);

  const handleCopy = () => trackEvent("copy_prompt", { product: "lazy-pay" });

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO
        title="Lazy Pay — Self-Improving Stripe Payments for Lovable"
        description="One prompt installs Stripe payments, subscriptions, conversion optimisation, and abandoned checkout recovery into any Lovable project."
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ── HERO ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-pay" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Pay
                </h1>
                <StripeBadge />
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                One prompt installs Stripe payments, subscriptions, and a revenue dashboard that improves its own conversion rate — automatically.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handleCopy} />
                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              Stripe integrated. Self-improving. In one paste.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IT INSTALLS ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              Everything Stripe needs. Plus the part that makes it better every week.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border p-6 bg-card"
                >
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

        {/* ── SELF-IMPROVING ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              The payments page that gets better without you.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                Most pricing pages convert at whatever rate they converted on day one. Nobody runs optimisation sprints. Nobody rewrites the copy. The page just sits there performing at its original rate forever.
              </motion.div>
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
              >
                Lazy Pay monitors every product weekly. When conversion drops below 3 percent after 30 views it rewrites the product description automatically using AI and updates it in Stripe. When a checkout session expires without completing it sends a single recovery email 24 hours later with a fresh link. No intervention required. The revenue grows while you build.
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── THE LOOP ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-14"
            >
              The loop that runs every week without you.
            </motion.h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0">
              {loopSteps.map((step, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="inline-block px-4 py-2 border border-border bg-card font-body text-sm text-foreground whitespace-nowrap">
                    {step}
                  </span>
                  {i < loopSteps.length - 1 && (
                    <span className="text-muted-foreground hidden md:inline">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT IT REPLACES ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              The part of Lovable that used to break everyone.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="border border-border p-6 bg-card"
              >
                <h3 className="font-display text-sm font-bold mb-3">Before</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Hours reading Stripe docs, debugging webhooks, writing checkout logic, manually optimising copy, losing revenue to abandoned checkouts.
                </p>
              </motion.div>
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="border border-primary/40 p-6 bg-card"
              >
                <h3 className="font-display text-sm font-bold mb-3 text-primary">After Lazy Pay</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Paste one prompt, add Stripe keys, everything works and improves itself.
                </p>
              </motion.div>
              <motion.div
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="border border-primary/40 p-6 bg-card"
              >
                <h3 className="font-display text-sm font-bold mb-3 text-primary">After Lazy Pay + Lazy Store</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Your store lists products, takes payments, recovers abandoned carts, and optimises its own conversion without you.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <LazyPricingSection
          lazyFeatures={[
            "Lazy Pay setup prompt",
            "Self-hosted in your Lovable project",
            "Bring your own Stripe account",
            "Stripe standard fees apply",
          ]}
          proFeatures={[
            "Hosted version",
            "Advanced analytics",
            "Multi-currency",
            "Automatic tax handling",
          ]}
          ctaButton={<CopyPromptButton text={promptText} onCopy={handleCopy} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* ── BOTTOM CTA ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-4xl font-bold tracking-tight"
            >
              Your Lovable Site. Taking Payments. Improving Itself.
            </motion.h2>
            <motion.p
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-body text-sm md:text-base text-muted-foreground leading-relaxed"
            >
              Every other Stripe integration converts at day-one rates forever. Lazy Pay measures, rewrites, recovers, and compounds — automatically, continuously, without you running a single optimisation sprint.
            </motion.p>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <CopyPromptButton text={promptText} onCopy={handleCopy} />
              <p className="font-body text-sm text-muted-foreground/60 max-w-sm">
                Open your Lovable project, paste it into the chat, add your Stripe keys. Your site takes payments within minutes and starts improving within the first week.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
