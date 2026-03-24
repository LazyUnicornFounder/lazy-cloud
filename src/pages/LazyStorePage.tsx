import { useEffect, useState, useCallback, useRef } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
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

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `Install Lazy Store — an autonomous e-commerce engine that runs itself — into my existing Lovable project.

---

## Step 1: Ask me five setup questions

Before building anything, ask me these five questions one at a time. Store my answers in a store_settings table so every engine can reference them:

1. What niche or industry is your store in? (e.g. fitness gear, home office, pet supplies)
2. Which store model do you want?
   - Dropshipping — connect a supplier, products sync automatically, orders route to fulfilment
   - Digital Products — AI generates and lists digital products, zero inventory
   - Affiliate — no inventory, list affiliate products, earn commission on every sale
3. What is your brand voice and tone? (e.g. friendly and casual, premium and minimal, bold and energetic)
4. Do you have existing product sources (paste URLs or API endpoints) or should the engine discover products for you?
5. What is your target price range? (e.g. $10-$50, $50-$200, premium $200+)

---

## Step 2: Create the database

Create these Supabase tables with RLS enabled:

**store_settings** — one row, stores the five setup answers plus site_url, is_running boolean
**store_products** — id, title, slug, description, price, compare_at_price, images (text[]), category, tags (text[]), source_url, status (draft/published), variant_data (jsonb), inventory_count, created_at, updated_at, conversion_rate, page_views, last_optimised_at
**store_orders** — id, product_id (references store_products), customer_email, status, total, created_at
**store_analytics** — id, product_id, event (view/add_to_cart/purchase), created_at
**store_content** — id, title, slug, body, content_type (buying_guide/comparison/review), target_keywords (text[]), status, published_at
**store_errors** — id, engine_name, error_message, created_at

---

## Step 3: Build the storefront pages

Create these pages matching my existing site's design system (fonts, colors, spacing, components):

- **/store** — product catalog with grid layout, category filters, search, sort by price/newest/popular
- **/store/:slug** — individual product page with image gallery, variant selector, add-to-cart button, AI-written description, related products
- **/store/cart** — shopping cart with quantity controls, price totals, checkout button
- **/store/guides** — SEO content hub listing all buying guides and product comparisons
- **/store/guides/:slug** — individual guide/comparison page

Add a slide-out cart component accessible from any page. Track every product view and add-to-cart as analytics events.

---

## Step 4: Connect Shopify checkout

Use the Lovable Shopify integration for secure checkout and payments. When a user clicks checkout, redirect them to Shopify checkout with their cart contents. Create a development store if I don't have one.

---

## Step 5: Build the autonomous engines

Create these Supabase edge functions. Each one should log errors to store_errors and be callable on a schedule:

### 5a. Product Discovery Engine (store-discover-products)
- Read my niche and model from store_settings
- Use Lovable AI (google/gemini-3-flash-preview) to research trending products in my niche
- For each discovered product, generate: title, description, price suggestion, category, tags
- Insert new products into store_products with status 'draft'
- Run daily via pg_cron

### 5b. Listing Writer Engine (store-write-listings)
- Find all products in store_products with status 'draft'
- Use Lovable AI to write an SEO-optimised title, a compelling product description (in my brand voice from store_settings), and meta description
- Update the product to status 'published'
- Run every 2 hours via pg_cron

### 5c. Pricing Engine (store-update-prices)
- For each published product, use Lovable AI to analyse the product category and suggest competitive pricing based on the niche and price range from store_settings
- Update compare_at_price and price fields
- Run daily via pg_cron

### 5d. Promotion Engine (store-run-promotions)
- Query store_analytics to find products with high views but low conversion (views > 50, conversion_rate < 2%)
- Use Lovable AI to generate a discount offer or promotional banner copy for slow-moving products
- Store the promotion data in the product's variant_data jsonb field
- Run weekly via pg_cron

### 5e. Conversion Optimiser (store-optimise-conversions)
- Query store_products for items where last_optimised_at is older than 7 days and page_views > 20
- Use Lovable AI to rewrite the product description based on conversion data, keeping the same brand voice
- Update the product description and set last_optimised_at to now
- Run weekly via pg_cron

### 5f. SEO Content Engine (store-publish-content)
- Use Lovable AI to identify buying-intent keywords in my niche (e.g. "best [product] for [use case]", "[product] vs [product]")
- Generate a buying guide or product comparison article targeting that keyword
- Insert into store_content with status 'published'
- Run 3x per week via pg_cron

---

## Step 6: Create the setup wizard page

Create a **/lazy-store-setup** page that:
- Walks through the five setup questions with a clean step-by-step UI
- Saves answers to store_settings
- On completion, triggers the first run of the product discovery engine
- Shows a success screen: "Your store is live. The engines are running."

---

## Step 7: Wire up the autonomous loop

Set up pg_cron schedules for all six engines so they run automatically without any manual intervention. The store should discover products, write listings, adjust prices, create promotions, optimise conversions, and publish SEO content — all on autopilot.

---

## Design rules

- Match my existing site's design system exactly — read my tailwind.config, index.css, and existing components
- Use my existing fonts, colors, spacing, border radius, and component patterns
- The store should feel like it was always part of my site, not a bolt-on
- Use shadcn/ui components where appropriate
- All pages must be fully responsive

---

## Important

- Use Lovable AI (via the Lovable AI Gateway) for all AI tasks — do not ask me for an API key
- Use Lovable Cloud (Supabase) for all database and edge function needs
- Use the Lovable Shopify integration for checkout and payments
- Every engine must handle errors gracefully and log to store_errors
- The entire system should run autonomously after the initial five-question setup`;

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
      ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
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
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground font-display text-xs font-bold mb-1">
              {i + 1}
            </span>
            <p className="font-body text-xs text-foreground/80 leading-tight">{step}</p>
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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Store — Autonomous E-Commerce Engine for Lovable"
        description="One prompt installs a self-running store into your Lovable project. Product discovery, AI listings, pricing, promotions, and conversion optimisation — automatically, forever."
        url="/lazy-store"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-4xl mx-auto text-center px-6 mb-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy Store
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1">Beta</span>
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-8 max-w-3xl mx-auto">
              The Autonomous<br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">Shopify Store</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              One prompt installs a full Shopify store into your Lovable project. It finds the products, writes the listings, sets the prices, and improves its own conversion rate — automatically, forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
              <button
                onClick={scrollToHow}
                className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground hover:bg-muted transition-colors"
              >
                See How It Works <ArrowRight size={14} />
              </button>
            </div>
            <p className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground">
              <Heart size={14} className="text-lovable fill-lovable" />
              Built exclusively for Lovable projects.
            </p>
          </motion.div>
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
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
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

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

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
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-md mx-auto">
              Then open your Lovable project, paste it into the chat, and answer five questions. Your store starts running today.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyStorePage;
