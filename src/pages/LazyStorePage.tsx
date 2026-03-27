import { useEffect, useState, useCallback, useRef } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import {
  Copy, Check, Heart, Search, FileText, DollarSign,
  Megaphone, TrendingUp, BookOpen, Package, Download,
  ShoppingCart, ArrowRight, RefreshCw,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Store Prompt — v0.0.4 — LazyUnicorn.ai]

Add an autonomous e-commerce engine called Lazy Store to this project. It automatically discovers products, writes listings, monitors pricing, runs promotions, optimises conversion, and publishes SEO content — with no manual input required after setup. Payments are handled by Stripe checkout. All management pages are admin-only.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**store_settings**
id (uuid, primary key, default gen_random_uuid()),
brand_name (text),
business_description (text),
niche (text),
target_audience (text),
store_model (text),
brand_voice (text),
currency (text, default 'USD'),
price_range_min (integer),
price_range_max (integer),
site_url (text),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

Note: Store Stripe keys as Supabase secrets — STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY. Never store in database.

**store_products**
id (uuid, primary key, default gen_random_uuid()),
name (text),
slug (text, unique),
description (text),
excerpt (text),
price (numeric),
compare_at_price (numeric),
category (text),
tags (text),
source_url (text),
affiliate_url (text),
stripe_price_id (text),
stripe_product_id (text),
status (text, default 'published'),
views (integer, default 0),
sales (integer, default 0),
conversion_rate (numeric, default 0),
last_optimised (timestamptz),
created_at (timestamptz, default now())

**store_promotions**
id (uuid, primary key, default gen_random_uuid()),
product_id (uuid),
promotion_type (text),
discount_percent (integer),
start_date (timestamptz),
end_date (timestamptz),
active (boolean, default true),
created_at (timestamptz, default now())

**store_content**
id (uuid, primary key, default gen_random_uuid()),
title (text),
slug (text, unique),
excerpt (text),
body (text),
content_type (text),
target_keyword (text),
published_at (timestamptz, default now()),
status (text, default 'published')

**store_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-store-setup with a welcome message:
"In the next 2 minutes you will set up an autonomous store. After setup your store will discover products, write listings, set prices, and publish buying guides — automatically."

Form fields:
- Brand name
- Store niche (what products or category does this store focus on?)
- Target audience (who are your ideal customers?)
- Store model (select: Affiliate — earn commission on every sale, no inventory / Digital Products — AI generates and sells digital products, zero fulfilment / Physical / Dropshipping — list physical products, connect your own fulfilment)
- Brand voice (select: Professional / Friendly / Minimal / Bold)
- Target price range minimum ($)
- Target price range maximum ($)
- Currency (select: USD / GBP / EUR / AUD)
- Site URL
- Stripe Publishable Key (text) — stored as Supabase secret STRIPE_PUBLISHABLE_KEY
- Stripe Secret Key (password) — stored as Supabase secret STRIPE_SECRET_KEY

Submit button: Launch My Store

On submit:
1. Store Stripe keys as Supabase secrets
2. Save all other values to store_settings
3. Set setup_complete to true and prompt_version to 'v0.0.3'
4. Immediately call store-discover once
5. Show loading: "Discovering products for your store..."
6. Redirect to /admin with message: "Your store is live. Products are being discovered and listed automatically."

---

## 3. Autonomous edge functions

**store-discover**
Cron: daily at 7am UTC — 0 7 * * *

1. Read store_settings. If is_running is false or setup_complete is false exit.
2. Call the built-in Lovable AI:
"You are a product research specialist for a [store_model] store in the niche [niche] targeting [target_audience] with a price range of [price_range_min] to [price_range_max] [currency]. Identify 5 trending products this store should be selling. Return only a valid JSON array where each item has: name (string), category (string), suggested_price (number), affiliate_url (string — a plausible product search URL, or empty string if not applicable), reason (string — one sentence why this is trending). No preamble. No code fences. Valid JSON array only."
3. For each product call store-listings to generate the listing.
Log errors to store_errors with function_name store-discover.

**store-listings**
Cron: every 2 hours — 0 */2 * * *

1. Read store_settings. If is_running is false exit.
2. Find all store_products where description is null or empty.
3. For each product call the built-in Lovable AI:
"You are a product copywriter for [brand_name] in [brand_voice] voice. Write a compelling listing for this product in the [niche] niche for [target_audience]. Product name: [name]. Category: [category]. Price: [price] [currency]. Return only a valid JSON object: description (string, 100 to 150 words), excerpt (string, one punchy sentence under 160 characters), slug (lowercase hyphenated string). No preamble. No code fences."
4. Update the product with the generated description, excerpt, and slug.
5. If Stripe keys exist create the product in Stripe and store stripe_product_id and stripe_price_id.
Log errors to store_errors with function_name store-listings.

**store-prices**
Cron: daily at 9am UTC — 0 9 * * *

1. Read store_settings. If is_running is false exit.
2. For all published products call the built-in Lovable AI:
"You are a pricing strategist for a [store_model] store in the [niche] niche targeting [target_audience]. Price range: [price_range_min] to [price_range_max] [currency]. Review these products and suggest competitive prices: [list of product names and current prices]. Return only a valid JSON array where each item has: product_id (string), suggested_price (number), compare_at_price (number — the original price to show as crossed out, must be higher than suggested_price). No preamble. No code fences."
3. Update price and compare_at_price in store_products where the suggested price differs by more than 5%.
Log errors to store_errors with function_name store-prices.

**store-promote**
Cron: every Monday at 8am UTC — 0 8 * * 1

1. Read store_settings. If is_running is false exit.
2. Query store_products where status is published and sales < 2 and created_at is older than 7 days.
3. Call the built-in Lovable AI:
"You are a promotions manager for [brand_name] selling [niche] products. These products are underperforming: [list of product names]. Suggest a promotion for each. Return only a valid JSON array where each item has: product_id (string), promotion_type (string — flash-sale, bundle-deal, or limited-time), discount_percent (integer 10 to 40), duration_days (integer). No preamble. No code fences."
4. Insert promotions into store_promotions with active true and calculated end_date.
Log errors to store_errors with function_name store-promote.

**store-optimise**
Cron: every Sunday at 10am UTC — 0 10 * * 0

1. Read store_settings. If is_running is false exit.
2. Query store_products where views > 20 and conversion_rate < 2 and (last_optimised is null or older than 14 days).
3. For each underperforming product call the built-in Lovable AI:
"You are a conversion rate specialist for [brand_name] in [brand_voice] voice. This product page has a [conversion_rate]% conversion rate from [views] views. Rewrite the description to be more compelling. Product: [name]. Current description: [description]. Target audience: [target_audience]. Return only a valid JSON object with two fields: description (string, 100 to 150 words) and excerpt (string, under 160 characters). No preamble. No code fences."
4. Update description and excerpt in store_products.
5. If stripe_product_id exists update the product description in Stripe.
6. Set last_optimised to now.
Log errors to store_errors with function_name store-optimise.

**store-content**
Cron: Tuesday and Friday at 8am UTC — 0 8 * * 2,5

1. Read store_settings. If is_running is false exit.
2. Call the built-in Lovable AI:
"You are an SEO content writer for [brand_name] selling [niche] products to [target_audience]. Write one piece of SEO content that attracts shoppers before they are ready to buy. Choose from: a buying guide, a product comparison, or a product review. Pick a fresh angle every time. Return only a valid JSON object: title (string), slug (lowercase hyphenated), excerpt (one sentence under 160 characters), content_type (string — buying-guide, comparison, or review), target_keyword (string), body (clean markdown — no HTML, no bullet points in prose, ## for headers, 800 to 1200 words, ends with a CTA linking to /store, then exactly: Discover more autonomous business tools at LazyUnicorn.ai — link LazyUnicorn.ai to https://lazyunicorn.ai). No preamble. No code fences."
3. Check for duplicate slug — append random 4-digit number if exists.
4. Insert into store_content.
Log errors to store_errors with function_name store-content.

---

## 4. Checkout edge function

**store-checkout** — handles POST requests
- Accept product_id (uuid) and customer_email (text)
- Read matching product from store_products, increment views
- Read STRIPE_SECRET_KEY from Supabase secrets
- Create Stripe checkout session using stripe_price_id with mode payment
- Set success_url to site_url/store/success, cancel_url to site_url/store
- Return checkout URL
- Log errors to store_errors with function_name store-checkout

---

## 5. Public pages

**/store**
Show all store_products where status is published ordered by created_at descending. Grid layout. Each card shows name, excerpt, formatted price. If an active promotion exists in store_promotions show compare_at_price crossed out and the discounted price with a badge. Each card links to /store/[slug].

**/store/[slug]**
Show full product: name, description, price, promotion badge if active, and a Buy Now button. On click show email input modal then call store-checkout and redirect to Stripe checkout URL. Track page views by incrementing views on each visit. At the bottom add: "🦄 Powered by Lazy Store — autonomous e-commerce for Lovable sites. Built by LazyUnicorn.ai" — link to https://lazyunicorn.ai.

**/store/guides**
Show all store_content where status is published ordered by published_at descending. Each shows title, content_type tag, target_keyword, published date. Each links to /store/guides/[slug].

**/store/guides/[slug]**
Show full content with title, content type, published date, full body rendered from markdown to HTML.

**/store/success**
Show payment success message and link to /store.

---

## 6. Admin

Do not build a standalone dashboard page for this engine. The dashboard lives at /admin/store as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This engine only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all engines in one place." and a link to /lazy-store-setup.

## 7. Navigation

Add a Shop link to the main site navigation pointing to /store.
Add an Admin link to the main site navigation pointing to /admin.
Do not add /lazy-store-setup to public navigation.`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  promptText,
  variant = "primary",
}: {
  className?: string;
  onCopy: () => void;
  promptText: string;
  variant?: "primary" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, promptText]);

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
        <><Check size={16} /> Copied to clipboard ✓</>
      ) : (
        <><Copy size={16} /> Copy the Lovable Prompt</>
      )}
    </button>
  );
}

/* ── Loop visual ── */
const loopSteps = [
  "Product discovered",
  "Listing written & published",
  "Traffic arrives via SEO",
  "Conversion data collected",
  "Underperforming pages rewritten",
  "New products discovered",
];

function SelfImprovingLoop() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {loopSteps.map((step, i) => {
        const angle = (i / loopSteps.length) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const r = 42;
        const x = 50 + r * Math.cos(rad);
        const y = 50 + r * Math.sin(rad);
        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="absolute w-28 text-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground font-display text-sm font-bold mb-1">
              {i + 1}
            </span>
            <p className="font-body text-sm text-foreground/80 leading-tight">{step}</p>
          </motion.div>
        );
      })}
      {/* centre arrow loop icon */}
      <RefreshCw size={32} className="text-primary/40 animate-spin" style={{ animationDuration: "12s" }} />
    </div>
  );
}

/* ── Page ── */
const LazyStorePage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-store");
  const promptText = dbPrompt?.prompt_text || FALLBACK_PROMPT;
  const howItWorksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackEvent("lazy_store_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_store_prompt_copy");
  }, [trackEvent]);

  const scrollToHow = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    "Copy the setup prompt from this page.",
    "Paste it into your existing Lovable project chat.",
    "Visit /lazy-store-setup on your site and answer five questions.",
    "Your store goes live and starts improving itself automatically.",
  ];

  const features = [
    { icon: Search, title: "Product Discovery", desc: "Finds trending products in your niche daily and adds them to your store automatically." },
    { icon: FileText, title: "Listing Writer", desc: "Writes SEO-optimised product titles, descriptions, and pages for every new product." },
    { icon: DollarSign, title: "Pricing Engine", desc: "Monitors competitor prices and adjusts yours automatically to stay competitive." },
    { icon: Megaphone, title: "Promotion Engine", desc: "Identifies slow-moving products and creates discount offers and homepage banners automatically." },
    { icon: TrendingUp, title: "Conversion Optimiser", desc: "Monitors which product pages convert, rewrites underperforming ones, and improves the store week over week." },
    { icon: BookOpen, title: "SEO Content Engine", desc: "Publishes buying guides and product comparisons targeting the keywords shoppers search before buying." },
  ];

  const models = [
    { icon: Package, title: "Dropshipping", desc: "Connect a supplier API, products sync automatically, orders route to fulfilment, you never touch inventory." },
    { icon: Download, title: "Digital Products", desc: "AI generates and lists digital products in your niche — zero inventory, zero fulfilment, fully autonomous revenue." },
    { icon: ShoppingCart, title: "Affiliate Store", desc: "No inventory at all. The store lists affiliate products, writes SEO content to drive traffic, earns commission on every sale." },
  ];

  const faqs = [
    { q: "Do I need products to start?", a: "No. The product discovery engine finds them for you based on your niche. You can also add your own." },
    { q: "Does it actually fulfil orders?", a: "Not yet. Lazy Store manages the store front, listings, pricing, and content. Order fulfilment connects to your existing supplier or digital delivery setup." },
    { q: "Will the listings sound generic?", a: "You set the brand voice, niche, and tone in the five-question setup. The AI writes every listing in your brand voice." },
    { q: "What if a product page is not converting?", a: "The conversion optimiser detects underperforming pages weekly and rewrites them automatically. You do not need to identify or fix them manually." },
    { q: "Can I add my own products?", a: "Yes. Manually added products get the same AI-written listings, pricing monitoring, and conversion optimisation as auto-discovered ones." },
    { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
    { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Store — Autonomous E-Commerce Engine for Lovable"
        description="One prompt installs a self-running store into your Lovable project. Product discovery, AI listings, pricing, promotions, and conversion optimisation — automatically, forever."
        url="/lazy-store"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* ── Hero ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-store" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Store
                </h1>
                <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">Powered by Shopify</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                One prompt installs a full Shopify store into your Lovable project. It finds the products, writes the listings, sets the prices, and improves its own conversion rate — automatically, forever.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
                <button
                  onClick={scrollToHow}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section ref={howItWorksRef} className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            One prompt. Then your store runs itself.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border border-border bg-card p-5 text-center"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 bg-primary text-primary-foreground font-display text-sm font-bold mb-3">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What It Does ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Everything a store needs to run and grow — done for you.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
                className="border border-border bg-card p-6"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Self-Improving Loop ── */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            The store that gets better every week without you.
          </motion.h2>
          <SelfImprovingLoop />
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto mt-8 leading-relaxed"
          >
            Most stores plateau. Lazy Store compounds. Every week it knows more about what converts in your niche and applies that knowledge to everything it publishes next.
          </motion.p>
        </section>

        {/* ── Three Models ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Pick your model. The engine runs the same.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {models.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border border-border bg-card p-6 text-center"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>




        {/* ── PRICING ── */}
        <LazyPricingSection
          lazyFeatures={[
            "Lazy Store setup prompt",
            "Self-hosted in your Lovable project",
            "Product discovery & AI listings",
            "Bring your own Shopify or custom store",
          ]}
          proFeatures={[
            "Hosted version",
            "Multi-store management",
            "Advanced conversion analytics",
            "Automatic inventory sync",
          ]}
          ctaButton={<CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              The store that builds and runs itself.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              Every other store requires you to find the products, write the copy, manage the pricing, run the promotions, and optimise the conversions. Lazy Store does all of that automatically. One prompt installs everything into your existing Lovable project.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
            <p className="font-body text-sm text-muted-foreground mt-4 max-w-md mx-auto">
              Then open your Lovable project, paste it into the chat, and answer five questions. Your store starts running today.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyStorePage;
