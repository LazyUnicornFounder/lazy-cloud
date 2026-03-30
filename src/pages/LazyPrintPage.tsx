import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Palette, Package, Globe, Tag, ShoppingBag, Printer } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Print Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete autonomous print-on-demand agent called Lazy Print to this project. It connects your Lovable site to Printful — giving you access to 475+ customisable products printed and shipped from fulfillment centers globally.`;

const faqs = [
  { q: "Do I need to buy inventory upfront?", a: "No. Products are only made when a customer places an order. You never hold stock." },
  { q: "What file format do I need for my designs?", a: "Printful recommends PNG files at 300 DPI or higher. SVG files also work for vector designs." },
  { q: "How long does fulfilment take?", a: "Printful typically takes 2 to 5 business days to produce, then ships. Most customers receive orders in 5 to 10 business days." },
  { q: "Can I sell on Etsy or Shopify too?", a: "Yes. Printful integrates with Etsy, Shopify, WooCommerce, and more. You can run both simultaneously." },
  { q: "What if a customer wants a refund?", a: "Printful has a quality guarantee. If there is a print defect or damage they reprint or refund at no cost to you." },
  { q: "Can I see a mockup before publishing?", a: "Yes. Lazy Print automatically generates professional mockup photos using Printful's mockup generator." },
];

const categories = [
  { emoji: "👕", name: "Apparel", examples: "T-shirts, hoodies, sweatshirts, tank tops", price: "$12" },
  { emoji: "🧢", name: "Headwear", examples: "Snapbacks, dad hats, beanies, bucket hats", price: "$15" },
  { emoji: "☕", name: "Drinkware", examples: "Mugs, travel mugs, water bottles, tumblers", price: "$9" },
  { emoji: "🖼️", name: "Wall art", examples: "Posters, framed prints, canvas prints", price: "$14" },
  { emoji: "📱", name: "Accessories", examples: "Phone cases, laptop sleeves, tote bags", price: "$8" },
  { emoji: "🏠", name: "Home", examples: "Cushion covers, blankets, towels, doormats", price: "$18" },
];

const economics = [
  { product: "Classic Unisex T-Shirt", base: "$14.00", sell: "$23.99", profit: "$9.99" },
  { product: "Premium Hoodie", base: "$32.00", sell: "$54.99", profit: "$22.99" },
  { product: "11oz Mug", base: "$9.00", sell: "$15.99", profit: "$6.99" },
  { product: "Glossy Poster 18×24\"", base: "$14.00", sell: "$23.99", profit: "$9.99" },
  { product: "Tote Bag", base: "$12.00", sell: "$19.99", profit: "$7.99" },
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

export default function LazyPrintPage() {
  const { prompt } = useCurrentPrompt("lazy-print");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Print — Autonomous Print-on-Demand"
        description="Upload your design, sell custom merch, and ship nothing yourself. Connect Printful to your Lovable site and sell products worldwide on autopilot."
        url="/lazy-print"
        keywords="print on demand Lovable, Printful integration, autonomous merch store, custom merchandise automation"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <span className="font-display text-[11px] tracking-[0.2em] uppercase font-bold text-foreground/40 mb-4 block">BETA</span>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Print
              </h1>


            <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Commerce</span>
              </div>


            <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/50 border border-border px-3 py-1">Powered by Printful</span>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
              One prompt connects <a href="https://printful.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Printful</a> to your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> site. Upload your designs, choose your products, and your store starts selling t-shirts, hoodies, mugs, posters, and more — all printed and shipped directly to your customers. Zero inventory. Pure profit.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton text={promptText} />
            </div>
            <p className="mt-6 font-body text-[12px] text-foreground/30 tracking-wider uppercase">
              475+ products · Global fulfillment · No inventory ever
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "#f0ead6" }}>
            Merch is a great idea. Running a merch operation is not
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { emoji: "📦", text: "Bulk orders tie up cash. You order 100 hoodies and sell 30. The other 70 live in your flat." },
              { emoji: "🚚", text: "Packing and shipping is a part-time job. At 20 orders a week it is a full-time one." },
              { emoji: "🎨", text: "Custom printing requires minimum order quantities, design specs, and manufacturer relationships you do not have." },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-border p-6">
                <span className="text-2xl mb-3 block">{c.emoji}</span>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{c.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 text-center font-body text-lg text-[#c8a961]/60">
            Print-on-demand removes all of this. You sell the product. Printful makes it and ships it. You collect the profit.
          </p>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12" style={{ color: "#f0ead6" }}>
            475 products. One design. Infinite combinations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="border border-border p-6">
                <span className="text-3xl mb-3 block">{c.emoji}</span>
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{c.name}</h3>
                <p className="font-body text-[13px] text-foreground/55 leading-relaxed mb-3">{c.examples}</p>
                <p className="font-body text-[12px] text-[#c8a961]/60">Starting from {c.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Economics */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-10" style={{ color: "#f0ead6" }}>
            How the numbers work
          </h2>
          <div className="border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-display text-xs tracking-[0.1em] uppercase text-foreground/50">Product</th>
                  <th className="text-right p-4 font-display text-xs tracking-[0.1em] uppercase text-foreground/50">Base cost</th>
                  <th className="text-right p-4 font-display text-xs tracking-[0.1em] uppercase text-foreground/50">Sell price</th>
                  <th className="text-right p-4 font-display text-xs tracking-[0.1em] uppercase text-[#c8a961]/60">Profit</th>
                </tr>
              </thead>
              <tbody>
                {economics.map((r, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="p-4 font-body text-foreground/50">{r.product}</td>
                    <td className="p-4 text-right font-body text-foreground/50">{r.base}</td>
                    <td className="p-4 text-right font-body text-foreground/50">{r.sell}</td>
                    <td className="p-4 text-right font-body text-[#c8a961]/80 font-semibold">{r.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-body text-[12px] text-foreground/30 text-center">
            50 t-shirts sold per month × $9.99 profit = $499.50/month passive income. Zero inventory. Zero fulfilment work.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <LazyPricingSection
            lazyFeatures={["Setup prompt included", "Printful integration", "Product catalogue sync", "AI-written descriptions", "Automatic mockup generation", "Order fulfilment"]}
            proFeatures={["Hosted version — zero config", "Multi-store management", "Advanced product analytics", "Bulk design upload"]}
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
            Your audience wants merch. Give them merch
          </h2>
          <p className="font-body text-sm mb-8 leading-relaxed">
            Upload your design. Set your price. Walk away. Lazy Print and Printful handle everything else — printing, packing, shipping, tracking. You collect the profit.
          </p>
          <CopyPromptButton text={promptText} />
          <p className="mt-4 font-body text-[11px] text-foreground/25 tracking-wider">
            Free <a href="https://printful.com" target="_blank" rel="noopener noreferrer" className="underline">Printful</a> account required. Paste this prompt into your Lovable project.
          </p>
        </div>
      </section>
    </div>
  );
}
