import { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Search, FileText, DollarSign, Megaphone, TrendingUp, BookOpen, Package, Download, ShoppingCart, RefreshCw, Truck, BarChart3, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

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

const PLACEHOLDER_PROMPT = `You are building Lazy Shop — an autonomous dropshipping engine for Lovable. This prompt sets up the full system.`;

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Connect your Shopify store and choose a supplier.",
  "Your shop goes live and starts selling autonomously.",
];

const features = [
  { icon: Search, title: "Product Discovery", desc: "Finds trending products from supplier catalogues daily and adds them to your Shopify store automatically." },
  { icon: FileText, title: "Listing Writer", desc: "Writes SEO-optimised product titles, descriptions, and pages for every new product in your brand voice." },
  { icon: DollarSign, title: "Pricing Engine", desc: "Monitors competitor prices and adjusts yours automatically to stay competitive and profitable." },
  { icon: Truck, title: "Order Routing", desc: "Routes orders to your supplier for fulfilment automatically — you never touch inventory." },
  { icon: Megaphone, title: "Promotion Engine", desc: "Identifies slow-moving products and creates discount offers and homepage banners automatically." },
  { icon: TrendingUp, title: "Conversion Optimiser", desc: "Monitors which product pages convert, rewrites underperforming ones, and improves the store week over week." },
];

const loopSteps = [
  "Lovable builds the storefront",
  "Shopify handles checkout & payments",
  "Supplier ships the product",
  "Lazy Unicorn optimises everything",
  "Better listings, better prices",
  "More sales, repeat",
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
      <RefreshCw size={32} className="text-primary/40 animate-spin" style={{ animationDuration: "12s" }} />
    </div>
  );
}

const faqs = [
  { q: "Do I need products to start?", a: "No. The product discovery engine finds trending products from your supplier's catalogue automatically." },
  { q: "Which suppliers does it work with?", a: "Any supplier with a product feed API — CJ Dropshipping, Printful, Printify, Spocket, or your own custom source." },
  { q: "Do I need a Shopify account?", a: "Yes. Shopify handles checkout, payments, and order management. Lazy Shop handles everything else." },
  { q: "Does it handle fulfilment?", a: "Orders are routed to your supplier automatically. They ship directly to your customer." },
  { q: "Will the listings sound generic?", a: "You set the brand voice, niche, and tone in setup. Every listing is written in your brand voice." },
  { q: "How does it improve over time?", a: "The conversion optimiser detects underperforming pages weekly and rewrites them automatically. Pricing adjusts to market changes daily." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project." },
];

const threeActors = [
  {
    icon: Zap,
    label: "Lovable",
    role: "Builds your store",
    desc: "Lovable creates the storefront, product pages, and entire frontend from a single prompt.",
    color: "text-primary",
  },
  {
    icon: ShoppingCart,
    label: "Shopify",
    role: "Runs your store",
    desc: "Shopify handles checkout, payments, inventory tracking, and order management.",
    color: "text-primary",
  },
  {
    icon: RefreshCw,
    label: "Lazy Unicorn",
    role: "Automates your store",
    desc: "Lazy Unicorn finds the products, writes the listings, sets the prices, and optimises conversions — forever.",
    color: "text-primary",
  },
];

const LazyShopPage = () => {
  const trackEvent = useTrackEvent();
  const howItWorksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackEvent("lazy_shop_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_shop_prompt_copy");
  }, [trackEvent]);

  const scrollToHow = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Shop — Autonomous Dropshipping Engine for Lovable"
        description="Lovable builds your store. Shopify runs your store. Lazy Unicorn automates your store. One prompt installs a fully autonomous dropshipping business."
        url="/lazy-shop"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* ── Hero ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>
                  Introducing
                </p>
                <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">
                  BETA
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap mb-2">
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Shop
                </h1>
                <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase text-foreground/30 border border-border px-3 py-1">
                  Powered by Shopify
                </span>
              </div>

              {/* Three-part headline */}
              <div className="mt-8 space-y-1">
                <p className="font-display text-lg md:text-2xl font-bold tracking-tight text-foreground/90">
                  Lovable builds your store.
                </p>
                <p className="font-display text-lg md:text-2xl font-bold tracking-tight text-foreground/60">
                  Shopify runs your store.
                </p>
                <p className="font-display text-lg md:text-2xl font-bold tracking-tight" style={{ color: "#c8a961" }}>
                  Lazy Unicorn automates your store.
                </p>
              </div>

              <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
                One prompt installs a fully autonomous dropshipping business into your Lovable project. Product sourcing, listing creation, pricing, fulfilment routing, and conversion optimisation — all on autopilot.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handlePromptCopy} promptText={PLACEHOLDER_PROMPT} />
                <button
                  onClick={scrollToHow}
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Three Actors ── */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-12">
            Three tools. One autonomous business.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {threeActors.map((actor, i) => (
              <motion.div
                key={actor.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="border border-border bg-card p-8 text-center"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <actor.icon size={22} className={actor.color} />
                </div>
                <h3 className="font-display text-base font-bold text-foreground mb-1">{actor.label}</h3>
                <p className="font-body text-sm font-semibold text-foreground/70 mb-3">{actor.role}</p>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{actor.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section ref={howItWorksRef} className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            One prompt. Then your shop runs itself.
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
            Everything a dropshipping business needs — automated.
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
            The shop that gets better every week without you.
          </motion.h2>
          <SelfImprovingLoop />
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto mt-8 leading-relaxed"
          >
            Most stores plateau. Lazy Shop compounds. Every week it knows more about what converts in your niche and applies that knowledge to everything it publishes next.
          </motion.p>
        </section>

        {/* ── The Stack ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Your full dropshipping stack.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Package, title: "Supplier Sourcing", desc: "Connect CJ Dropshipping, Printful, Spocket, or any supplier with an API. Products sync automatically." },
              { icon: BarChart3, title: "Analytics & Insights", desc: "See which products sell, which listings convert, and where traffic comes from — all in your admin dashboard." },
              { icon: BookOpen, title: "SEO Content Engine", desc: "Publishes buying guides and product comparisons targeting the keywords shoppers search before buying." },
            ].map((item, i) => (
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
            "Lazy Shop setup prompt",
            "Self-hosted in your Lovable project",
            "Product discovery & AI listings",
            "Automated order routing",
          ]}
          proFeatures={[
            "Hosted version",
            "Multi-store management",
            "Advanced conversion analytics",
            "Automatic inventory sync",
          ]}
          ctaButton={<CopyPromptButton onCopy={handlePromptCopy} promptText={PLACEHOLDER_PROMPT} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              The autonomous dropshipping business.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              Lovable builds it. Shopify runs it. Lazy Unicorn automates it. One prompt installs everything into your existing Lovable project.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={PLACEHOLDER_PROMPT} />
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-md mx-auto">
              Paste it into your Lovable project chat, connect Shopify, pick a supplier, and your shop starts selling today.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyShopPage;
