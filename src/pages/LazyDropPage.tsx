import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Package, Search, DollarSign, TrendingUp, RefreshCw, ShoppingCart } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import AutopilotHeadline from "@/components/AutopilotHeadline";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Drop Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete autonomous dropshipping agent called Lazy Drop to this project. It connects your Lovable site to AutoDS — giving you access to 800M+ products from 25+ global suppliers, automatic price and stock monitoring, one-click product import, and fully automated order fulfilment.`;

const faqs = [
  { q: "Do I need an AutoDS account?", a: "Yes. Sign up at autods.com. Plans start from $26.90/month. Lazy Drop handles the API connection from the Lovable side." },
  { q: "Do I need a Shopify store?", a: "No. Lazy Drop works with a Lovable site directly. Your product catalogue, checkout (via Lazy Pay / Stripe), and customer communications (via Lazy SMS) all run inside your Lovable project." },
  { q: "What suppliers does AutoDS support?", a: "AutoDS connects to 25+ global suppliers including AliExpress, Amazon, Walmart, CJDropshipping, Zendrop, Spocket, and AutoDS's own warehouse." },
  { q: "What happens when a supplier runs out of stock?", a: "Lazy Drop monitors stock levels hourly via AutoDS. When a product hits zero stock it is automatically paused in your store." },
  { q: "Can I approve products before they go live?", a: "Yes. During setup you can turn off auto-import. Products go into a review queue in your admin." },
  { q: "How does automatic fulfilment work?", a: "When a customer completes checkout, Lazy Drop sends the order details to AutoDS via API. AutoDS places the order with the supplier and handles shipping." },
];

const features = [
  { icon: <Search size={20} />, title: "Product discovery", desc: "Queries AutoDS product research daily. Filters by your niche, price range, minimum margin, and shipping preference.", color: "border-[#c8a961]" },
  { icon: <Package size={20} />, title: "AI-written listings", desc: "Every imported product gets a new description written by AI — benefit-focused, specific, conversion-optimised.", color: "border-blue-500/40" },
  { icon: <DollarSign size={20} />, title: "Hourly price monitoring", desc: "AutoDS scans supplier prices every hour. Lazy Drop recalculates your sell price to maintain your target margin.", color: "border-green-500/40" },
  { icon: <ShoppingCart size={20} />, title: "Automatic fulfilment", desc: "Orders go straight to AutoDS for fulfilment. No copy-paste. No manual supplier orders.", color: "border-purple-500/40" },
  { icon: <RefreshCw size={20} />, title: "Stock monitoring", desc: "When a supplier runs out of stock Lazy Drop pauses the product automatically. When stock returns it re-activates.", color: "border-teal-500/40" },
  { icon: <TrendingUp size={20} />, title: "Weekly optimisation", desc: "Every Sunday it identifies worst-performing products and generates three specific recommendations.", color: "border-orange-500/40" },
];

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity bg-primary text-primary-foreground">
      {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyDropPage() {
  const { prompt } = useCurrentPrompt("lazy-drop");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Drop — Autonomous Dropshipping Agent for Lovable"
        description="800 million products. Zero manual work. Connect AutoDS to your Lovable store and automate product discovery, pricing, and fulfilment."
        url="/lazy-drop"
        keywords="autonomous dropshipping, AutoDS Lovable, dropshipping automation, AI dropshipping store"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
              <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <AutopilotHeadline product="lazy-drop" />

            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Drop
              </h1>


            <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Commerce</span>
              </div>


            <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">Powered by AutoDS</span>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
              One prompt connects your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> store to <a href="https://autods.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">AutoDS</a> — 800M+ products from 25+ global suppliers. It finds trending products, imports them with AI-written listings, monitors prices every hour, and fulfils every order automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton text={promptText} />
            </div>
            <p className="mt-6 font-body text-[12px] text-foreground/30 tracking-wider uppercase">
              800M+ products · 25+ global suppliers · Fully automated fulfilment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "#f0ead6" }}>
            Dropshipping works. Managing a dropshipping store does not
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { emoji: "🔍", text: "Finding trending products takes hours. You do not have hours." },
              { emoji: "✍️", text: "Writing 50 product listings is a full-time job. Supplier descriptions are terrible." },
              { emoji: "📉", text: "Supplier prices change daily. One price spike wipes your margin. You miss it." },
              { emoji: "📦", text: "Every order requires manual work. At 20 orders a day that is a part-time job." },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border p-6">
                <span className="text-2xl mb-3 block">{c.emoji}</span>
                <p className="font-body text-sm text-foreground/65 leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center font-body text-lg text-[#c8a961]/60">
            You started a store to make money. Not to become a full-time operations manager.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "#f0ead6" }}>
            AutoDS automates your store. Lazy Drop automates AutoDS
          </motion.h2>
          <p className="font-body text-sm text-foreground/50 max-w-2xl mx-auto text-center mb-12 leading-relaxed">
            AutoDS is already the most powerful dropshipping automation platform — 800M+ products, hourly price monitoring, automatic order fulfilment, 25+ global suppliers. Lazy Drop connects all of that to your Lovable site with one prompt.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className={`border ${f.color} p-6`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-foreground/50">{f.icon}</span>
                  <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase">{f.title}</h3>
                </div>
                <p className="font-body text-sm text-foreground/55 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <LazyPricingSection
            lazyFeatures={["Setup prompt included", "AutoDS integration", "Product discovery & import", "AI-written listings", "Hourly price monitoring", "Automatic fulfilment"]}
            proFeatures={["Hosted version — zero config", "Multi-store management", "Advanced product analytics", "Priority AI model access"]}
            proPrice="$29"
            ctaButton={<CopyPromptButton text={promptText} />}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <LazyFaqSection faqs={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: "#f0ead6" }}>
            800 million products. Your store sells them. You do nothing
          </h2>
          <p className="font-body text-sm text-foreground/50 mb-8 leading-relaxed">
            Lazy Drop is the fastest way to add a fully automated dropshipping operation to any Lovable site. One prompt. Your niche. Your margins. Everything else runs itself.
          </p>
          <CopyPromptButton text={promptText} />
          <p className="mt-4 font-body text-[11px] text-foreground/25 tracking-wider">
            You need an <a href="https://autods.com" target="_blank" rel="noopener noreferrer" className="underline">AutoDS</a> account. Lovable site with backend connected.
          </p>
        </div>
      </section>
    </div>
  );
}
