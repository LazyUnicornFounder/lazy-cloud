import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Copy, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const PLACEHOLDER_PROMPT = `You are building Lazy Shop — an autonomous dropshipping engine for Lovable. This prompt sets up the full system.`;

const cream = "#f0ead6";
const gold = "#c8a961";
const bgDark = "#0a0a08";
const bgAlt = "#111110";

function CopyPromptButton({ className = "", onCopy, promptText }: { className?: string; onCopy: () => void; promptText: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, promptText]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97] ${className}`}
      style={{ fontFamily: "'Playfair Display', serif", backgroundColor: cream, color: bgDark, borderRadius: 0 }}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Copy the Prompt</>}
    </button>
  );
}

/* ── SVG Icons ── */
const ShopIcon = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke={cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M35 45 L40 25 L80 25 L85 45" />
    <rect x="35" y="45" width="50" height="50" rx="3" />
    <path d="M50 70 L50 95" />
    <path d="M70 70 L70 95" />
    <rect x="50" y="70" width="20" height="25" rx="1" />
    <path d="M42 45 Q47 35 52 45" />
    <path d="M52 45 Q57 35 62 45" />
    <path d="M62 45 Q67 35 72 45" />
    <path d="M72 45 Q77 35 82 45" />
  </svg>
);

const LovableIcon = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke={cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="30" y="30" width="60" height="60" rx="8" />
    <path d="M50 55 Q50 45 60 45 Q70 45 70 55 Q70 65 60 75 Q50 65 50 55Z" />
  </svg>
);

const ShopifyIcon = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke={cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M70 25 L75 30 L85 28 L75 95 L55 100 L40 30 L55 27 Q58 25 62 28 Q66 30 70 25Z" />
    <path d="M58 45 L63 42 L68 50 L72 48" />
    <line x1="70" y1="30" x2="65" y2="95" strokeDasharray="3 3" opacity="0.3" />
  </svg>
);

const UnicornIcon = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke={cream} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="60" cy="60" r="28" />
    <path d="M60 32 L60 18" />
    <path d="M55 20 L60 12 L65 20" />
    <path d="M45 50 Q50 42 55 50" />
    <circle cx="48" cy="55" r="2" fill={cream} stroke="none" />
    <circle cx="72" cy="55" r="2" fill={cream} stroke="none" />
    <path d="M55 68 Q60 74 65 68" />
    <path d="M88 60 Q95 55 92 48" strokeDasharray="2 2" />
  </svg>
);

const rotatingWords = [
  { word: "products", emoji: "📦" },
  { word: "listings", emoji: "✍️" },
  { word: "pricing", emoji: "💰" },
  { word: "fulfilment", emoji: "🚚" },
  { word: "SEO", emoji: "🔍" },
  { word: "conversions", emoji: "📈" },
];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % rotatingWords.length), 2000);
    return () => clearInterval(interval);
  }, []);
  const current = rotatingWords[index];
  return (
    <span className="inline-flex relative overflow-clip" style={{ width: "10ch", height: "1.2em", verticalAlign: "text-bottom" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={current.word}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center gap-1 whitespace-nowrap"
          style={{ color: gold }}
        >
          {current.word} {current.emoji}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const threeActors = [
  { Icon: LovableIcon, label: "Lovable", role: "Builds your store", desc: "Creates the storefront, product pages, and entire frontend from a single prompt.", bg: bgDark },
  { Icon: ShopifyIcon, label: "Shopify", role: "Runs your store", desc: "Handles checkout, payments, inventory tracking, and order management.", bg: bgAlt },
  { Icon: UnicornIcon, label: "Lazy Unicorn", role: "Automates your store", desc: "Finds products, writes listings, sets prices, and optimises conversions — forever.", bg: bgDark },
];

const steps = [
  { step: "1", title: "Copy the prompt", desc: "One click copies everything. The prompt contains the full engine." },
  { step: "2", title: "Paste into Lovable", desc: "Open your project, paste the prompt. Lovable installs the engine automatically." },
  { step: "3", title: "Connect Shopify", desc: "Link your Shopify store and pick a supplier. Five questions, then you're done." },
  { step: "4", title: "It runs itself", desc: "Products found, listed, priced, promoted, and optimised — on autopilot." },
];

const features = [
  { title: "Product Discovery", desc: "Finds trending products from supplier catalogues daily." },
  { title: "AI Listing Writer", desc: "SEO-optimised titles, descriptions, and pages — in your brand voice." },
  { title: "Dynamic Pricing", desc: "Monitors competitors and adjusts prices automatically." },
  { title: "Order Routing", desc: "Routes orders to suppliers for fulfilment. You never touch inventory." },
  { title: "Promotion Engine", desc: "Creates discounts and banners for slow-moving products." },
  { title: "Conversion Optimiser", desc: "Rewrites underperforming pages weekly. The store gets better without you." },
];

const loopSteps = [
  "Lovable builds the storefront",
  "Shopify handles checkout",
  "Supplier ships the product",
  "Lazy Unicorn optimises",
  "Better listings & prices",
  "More sales, repeat",
];

const faqs = [
  { q: "Do I need products to start?", a: "No. The product discovery engine finds trending products from your supplier's catalogue automatically." },
  { q: "Which suppliers does it work with?", a: "Any supplier with a product feed API — CJ Dropshipping, Printful, Printify, Spocket, or your own custom source." },
  { q: "Do I need a Shopify account?", a: "Yes. Shopify handles checkout, payments, and order management. Lazy Shop handles everything else." },
  { q: "Does it handle fulfilment?", a: "Orders are routed to your supplier automatically. They ship directly to your customer." },
  { q: "Will the listings sound generic?", a: "You set the brand voice, niche, and tone in setup. Every listing is written in your brand voice." },
  { q: "How does it improve over time?", a: "The conversion optimiser detects underperforming pages weekly and rewrites them automatically." },
];

const LazyShopPage = () => {
  const trackEvent = useTrackEvent();
  const howRef = useRef<HTMLElement>(null);

  useEffect(() => { trackEvent("lazy_shop_page_view"); }, [trackEvent]);
  const handleCopy = useCallback(() => { trackEvent("lazy_shop_prompt_copy"); }, [trackEvent]);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen text-foreground relative" style={{ backgroundColor: bgDark }}>
      <SEO
        title="Lazy Shop — Autonomous Dropshipping Engine for Lovable"
        description="Lovable builds your store. Shopify runs your store. Lazy Unicorn automates your store. One prompt installs a fully autonomous dropshipping business."
        url="/lazy-shop"
      />
      <Navbar />

      {/* ── Hero ── */}
      <header className="relative z-10" style={{ backgroundColor: bgDark }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 pt-32 pb-16 text-center"
        >
          <ShopIcon />

          {/* Main headline */}
          <AutopilotHeadline product="lazy-shop" />
          <div className="space-y-2 mt-4">
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", color: cream, lineHeight: 1.15 }}>
              Lovable builds your store.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", color: cream, opacity: 0.55, lineHeight: 1.15 }}>
              Shopify runs your store.
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4.5vw, 3.5rem)", color: gold, lineHeight: 1.15 }}>
              Lazy Unicorn automates your store.
            </p>
          </div>

          <p className="tracking-[0.2em] uppercase mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.7rem, 1.2vw, 0.9rem)", color: cream, opacity: 0.25 }}>
            One prompt, everything runs itself.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <CopyPromptButton onCopy={handleCopy} promptText={PLACEHOLDER_PROMPT} />
            <button
              onClick={scrollToHow}
              className="text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity border"
              style={{ fontFamily: "'Playfair Display', serif", color: cream, opacity: 0.4, borderColor: "rgba(240,234,214,0.12)", borderRadius: 0 }}
            >
              See How It Works
            </button>
          </div>

          {/* Integration pills */}
          <div className="mt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ color: cream, opacity: 0.25 }}>
              Powered by
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Shopify", "Stripe", "CJ Dropshipping", "Printful", "Spocket"].map((name, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
                  className="inline-block text-[10px] tracking-[0.1em] uppercase font-medium px-3 py-1.5 border"
                  style={{ color: cream, opacity: 0.4, borderColor: "rgba(240,234,214,0.12)" }}
                >
                  {name}
                </motion.span>
              ))}
            </div>
          </div>

          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: cream, opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "2rem" }}>
            Made for Lovable
          </p>
        </motion.div>
      </header>

      {/* ── Three Actors — checkerboard tiles ── */}
      <section className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {threeActors.map((actor, i) => (
            <motion.div
              key={actor.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="aspect-square flex flex-col items-center justify-center gap-5 px-8"
              style={{ backgroundColor: i % 2 === 0 ? bgDark : bgAlt }}
            >
              <actor.Icon />
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.8rem", color: cream, lineHeight: 1.1 }}>
                  {actor.label === "Lazy Unicorn" ? "Lazy" : ""}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", color: cream, lineHeight: 1.1 }}>
                  {actor.label === "Lazy Unicorn" ? "Unicorn" : actor.label}
                </p>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: gold, opacity: 0.8 }}>
                {actor.role}
              </p>
              <p className="text-center max-w-[220px]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.75rem", color: cream, opacity: 0.35, lineHeight: 1.6 }}>
                {actor.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section ref={howRef} className="relative z-10 py-24 px-6" style={{ backgroundColor: bgDark }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: cream, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", lineHeight: 1.1 }} className="font-bold tracking-tight mb-4">
              Copy. Paste. <span style={{ color: gold }}>Sell.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xl mx-auto mb-14" style={{ color: cream, opacity: 0.4 }}>
              Lazy Shop is a single prompt. Paste it into your Lovable project and it builds the entire dropshipping system — tables, functions, UI, and a schedule that runs without you.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                className="border p-6 text-left"
                style={{ borderColor: "rgba(240,234,214,0.08)" }}
              >
                <span style={{ fontFamily: "'Playfair Display', serif", color: gold, opacity: 0.25, fontSize: "2rem" }} className="font-bold block mb-3">{s.step}</span>
                <h3 className="text-xs tracking-[0.12em] uppercase font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif", color: cream }}>{s.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: cream, opacity: 0.35 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — checkerboard grid ── */}
      <section className="relative z-10">
        <div className="max-w-3xl mx-auto text-center py-16 px-6">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontFamily: "'Playfair Display', serif", color: cream, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", lineHeight: 1.1 }} className="font-bold tracking-tight mb-4">
            Everything a dropshipping business needs — <span style={{ color: gold }}>automated.</span>
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {features.map((f, i) => {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const bg = (row + col) % 2 === 0 ? bgDark : bgAlt;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="flex flex-col items-center justify-center gap-4 py-20 px-8 text-center"
                style={{ backgroundColor: bg }}
              >
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: cream, opacity: 0.5 }}>
                  {f.title}
                </p>
                <p className="max-w-[280px]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: cream, opacity: 0.4, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Self-Improving Loop ── */}
      <section className="relative z-10 py-24 px-6" style={{ backgroundColor: bgDark }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ fontFamily: "'Playfair Display', serif", color: cream, fontSize: "clamp(2rem, 4.5vw, 3.2rem)", lineHeight: 1.1 }} className="font-bold tracking-tight mb-16">
            The shop that gets <span style={{ color: gold }}>better every week</span> without you.
          </motion.h2>
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
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold mb-1"
                    style={{ fontFamily: "'Playfair Display', serif", backgroundColor: cream, color: bgDark }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs leading-tight" style={{ color: cream, opacity: 0.6 }}>{step}</p>
                </motion.div>
              );
            })}
            <RefreshCw size={32} className="animate-spin" style={{ color: gold, opacity: 0.3, animationDuration: "12s" }} />
          </div>
          <p className="text-sm leading-relaxed max-w-xl mx-auto mt-8" style={{ color: cream, opacity: 0.35 }}>
            Most stores plateau. Lazy Shop compounds. Every week it knows more about what converts in your niche and applies that knowledge to everything it publishes next.
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
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
        ctaButton={<CopyPromptButton onCopy={handleCopy} promptText={PLACEHOLDER_PROMPT} className="w-full justify-center" />}
      />

      <LazyFaqSection faqs={faqs} />

      {/* ── Bottom CTA ── */}
      <section className="relative z-10 py-24 px-6" style={{ backgroundColor: bgDark }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <ShopIcon />
          <div className="mt-6">
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: cream, lineHeight: 1.1 }}>Lazy</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: cream, lineHeight: 1.1 }}>Shop</p>
          </div>
          <p className="mt-6 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.9rem", color: cream, opacity: 0.4 }}>
            Lovable builds it. Shopify runs it. Lazy Unicorn automates it. One prompt installs everything into your existing Lovable project.
          </p>
          <div className="mt-8">
            <CopyPromptButton onCopy={handleCopy} promptText={PLACEHOLDER_PROMPT} />
          </div>
          <p className="mt-4" style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: cream, opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Made for Lovable
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default LazyShopPage;
