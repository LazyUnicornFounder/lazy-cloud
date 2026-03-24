import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, Zap, Package, Copy, Check, Palette, Globe } from "lucide-react";
import FlyingShopperCards from "@/components/lazy-shopper/FlyingShopperCards";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `Add a complete e-commerce store to my Lovable website using Shopify. I want:

1. A beautiful product catalog page that matches my existing site design
2. Individual product pages with image galleries, variants (size/color), and add-to-cart
3. A slide-out shopping cart with quantity controls
4. Shopify checkout integration for secure payments
5. A "Featured Products" section I can add to my homepage

Ask me these questions before building:
- What's my Shopify store URL? (or help me create one)
- What style should the store match? (share my existing site URL)
- Do I want featured products on the homepage?
- Should products open in a modal or a full page?
- Do I need product filtering/search?

Use the Lovable Shopify integration. Make the store feel native to my site — not like a bolt-on. Match my existing fonts, colors, and spacing exactly.`;

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Connect your Shopify store (or create a new one).",
  "Your store goes live — products, cart, checkout, done.",
];

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
      className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] ${className}`}
    >
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyShopperPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-shopper");
  const promptText = dbPrompt?.prompt_text || FALLBACK_PROMPT;

  useEffect(() => {
    trackEvent("lazy_shopper_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_shopper_prompt_copy");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Shopper — Autonomous Store Engine for Lovable"
        description="Add a full e-commerce store to your Lovable website with one prompt. Products, cart, checkout — powered by Shopify, designed to match your site."
        url="/lazy-shopper"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-5xl mx-auto text-center px-6 mb-20 min-h-[520px] flex items-center justify-center">
          <FlyingShopperCards />
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy Shopper
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 rounded-full">Beta</span>
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span>The Autonomous</span><br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">Store Engine</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              One prompt adds a complete e-commerce store to your Lovable website. Products, cart, checkout — powered by Shopify, designed to look like it was always part of your site.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
            <p className="font-body text-xs text-muted-foreground mt-4">Built for Lovable projects. Uses the native Shopify integration.</p>
          </motion.div>
        </section>

        {/* ── How It Works ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What You Get ── */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShoppingBag, title: "Full Product Catalog", desc: "Beautiful product listings with images, variants, pricing, and inventory — synced from Shopify." },
              { icon: Package, title: "Shopping Cart", desc: "Slide-out cart with quantity controls, variant display, and real-time price totals." },
              { icon: CreditCard, title: "Secure Checkout", desc: "Shopify-powered checkout handles payments, shipping, and taxes. PCI compliant out of the box." },
              { icon: Palette, title: "Design Match", desc: "The store matches your existing site's fonts, colors, and spacing. No bolt-on vibes." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Why Lazy Shopper ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">Why not just build it yourself?</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              You <em>could</em> spend hours wiring up Shopify's Storefront API, building product pages, designing a cart, handling variants, and making it all match your site. Or you could paste one prompt and have it done in minutes.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Lazy Shopper</strong> uses Lovable's native Shopify integration. That means real product management, real inventory, real checkout — not a toy demo. It creates a development store for free, and you only pay Shopify when you're ready to go live.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              Your store looks like it was custom-built because it <em>was</em> — by AI that reads your existing design system and matches it exactly.
            </p>
          </motion.div>
        </section>

        {/* ── Use Cases ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Perfect for
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Globe, title: "SaaS with Merch", desc: "Add a merch store to your SaaS landing page. Sell branded swag alongside your software." },
              { icon: Zap, title: "Creator Stores", desc: "Creators, influencers, and indie makers — sell physical products from your personal site." },
              { icon: ShoppingBag, title: "Brand Launches", desc: "Launch a product line with a beautiful storefront. From idea to live store in one conversation." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "Do I need a Shopify account?", a: "Nope. Lovable creates a free development store for you. You only need a paid Shopify plan when you're ready to start selling." },
              { q: "Can I connect my existing Shopify store?", a: "Yes. You can connect an existing production store or create a brand new one — the prompt handles both." },
              { q: "Will it match my site's design?", a: "Yes. The prompt tells Lovable to read your existing design system and match fonts, colors, and spacing exactly." },
              { q: "What about payments and shipping?", a: "Shopify handles all of it — credit cards, Apple Pay, Google Pay, shipping rates, tax calculations. PCI compliant." },
              { q: "Can I sell digital products too?", a: "Lazy Shopper is optimised for physical products. For digital products (courses, ebooks, downloads), a different approach may work better." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Your store, live today.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              One prompt. Full Shopify store. Matches your site perfectly. Start selling.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyShopperPage;
