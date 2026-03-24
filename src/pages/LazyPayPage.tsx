import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import { motion } from "framer-motion";
import { Copy, Check, CreditCard, RefreshCw, BarChart3, Mail, ShieldCheck, Users, Zap, ShoppingCart } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_PAY_PROMPT = `Install Lazy Pay — a self-improving Stripe payments engine — into my existing Lovable project.

---

## Step 1: Ask me two setup questions

Before building anything, ask me these two questions one at a time:

1. What is your Stripe Secret Key? (Get one at dashboard.stripe.com/apikeys)
2. What is your Stripe Publishable Key?

---

## Step 2: Create the database

Create these Supabase tables with RLS enabled:

**pay_settings** — id, stripe_secret_key (stored as secret), stripe_publishable_key, is_running boolean default true, setup_complete boolean default false, created_at
**pay_products** — id, stripe_product_id, stripe_price_id, name, description, price_cents, currency (default 'usd'), product_type (one_time/subscription), interval (month/year/null), is_active boolean default true, views integer default 0, conversions integer default 0, last_optimised_at timestamptz, created_at
**pay_checkouts** — id, stripe_session_id, product_id, customer_email, status (pending/completed/abandoned/recovered), created_at, completed_at
**pay_errors** — id, error_message, context text, created_at

---

## Step 3: Build the checkout flow

Create a Supabase edge function called pay-checkout that:
- Accepts a product_id
- Looks up the Stripe price ID from pay_products
- Creates a Stripe Checkout Session
- Returns the checkout URL
- Increments the product's view count
- On successful payment (via webhook), updates the checkout status to 'completed' and increments conversions

Create a Supabase edge function called pay-webhook that:
- Listens for Stripe webhook events
- Handles checkout.session.completed — marks checkout as completed, increments product conversions
- Handles checkout.session.expired — marks checkout as abandoned
- Handles customer.subscription.updated and customer.subscription.deleted
- Logs errors to pay_errors

---

## Step 4: Build the conversion optimiser

Create a Supabase edge function called pay-optimise that runs weekly:
- Query all active products from pay_products
- For each product with more than 30 views and a conversion rate below 3%:
  - Use AI to rewrite the product description based on the product name and current description
  - Update the description in Stripe via the API
  - Update the description in pay_products
  - Set last_optimised_at to now()
- Log any errors to pay_errors

---

## Step 5: Build abandoned checkout recovery

Create a Supabase edge function called pay-recover that runs every hour:
- Query pay_checkouts where status is 'abandoned' and created_at is between 23 and 25 hours ago
- For each abandoned checkout with a customer_email:
  - Send a recovery email with a fresh checkout link
  - Update status to 'recovered'
- Log errors to pay_errors

---

## Step 6: Build the revenue dashboard

Create a page at /pay-dashboard showing:
- MRR (monthly recurring revenue) calculated from active subscriptions
- Total revenue from completed checkouts
- Active subscribers count
- Recent transactions table
- Product performance table with views, conversions, and conversion rate
- A toggle to pause/resume the optimiser
- Error log showing last 10 errors

---

## Step 7: Build the customer portal

Add a Stripe Customer Portal link that lets customers manage their own subscriptions.

---

## Design rules

- Match my existing site's design system exactly
- Use my existing fonts, colors, spacing, and component patterns
- Use shadcn/ui components where appropriate
- All pages must be fully responsive

---

## Important

- Store Stripe keys as Supabase secrets, never in client code
- Use Lovable Cloud (Supabase) for all database, storage, and edge function needs
- Every engine must handle errors gracefully and log to pay_errors
- The entire system should run autonomously after the initial setup
- Lazy Pay never stores card numbers — Stripe handles all PCI compliance`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  variant = "primary",
}: {
  className?: string;
  onCopy: () => void;
  variant?: "primary" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(LAZY_PAY_PROMPT);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy]);

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
    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border bg-muted/40 text-muted-foreground text-xs font-body tracking-wide">
      <CreditCard size={14} />
      Powered by Stripe
    </div>
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
];

export default function LazyPayPage() {
  const trackEvent = useTrackEvent();

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
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
                <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Pay
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                One prompt installs Stripe payments, subscriptions, and a revenue dashboard that improves its own conversion rate — automatically.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handleCopy} />
                <button
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
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
                  <span className="inline-block px-4 py-2 border border-border bg-card font-body text-xs text-foreground whitespace-nowrap">
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
          ctaButton={<CopyPromptButton onCopy={handleCopy} className="w-full justify-center" />}
        />

        {/* ── FAQ ── */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <motion.h2
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
            >
              FAQ
            </motion.h2>

            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border p-6 bg-card"
                >
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
              <CopyPromptButton onCopy={handleCopy} />
              <p className="font-body text-xs text-muted-foreground/60 max-w-sm">
                Open your Lovable project, paste it into the chat, add your Stripe keys. Your site takes payments within minutes and starts improving within the first week.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
