import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Palette, Layout, Layers, Sparkles, Eye, Zap } from "lucide-react";
import { toast } from "sonner";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_DESIGN_PROMPT = `[Lazy Design Prompt — v0.0.1 — LazyUnicorn.ai]

Add a design upgrade agent called Lazy Design to this project. It automatically improves the visual design of your Lovable site by fetching pre-built UI components from 21st.dev and upgrading your pages section by section — hero, navigation, testimonials, features, CTA, and footer — without you browsing component libraries or writing design prompts manually.

Note: Lazy Design uses the 21st.dev component library and the built-in Lovable AI. No API keys required.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const TwentyFirstBadge = () => (
  <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">
    Powered by 21st.dev
  </span>
);

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    trackEvent("copy_prompt", { product: "lazy-design" });
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
      style={{ backgroundColor: "#f0ead6", color: "#0a0a08" }}
    >
      {copied ? "Copied ✓" : "Copy the Lovable Prompt"}
    </button>
  );
}

const steps = [
  { num: "01", title: "Copy the setup prompt from this page" },
  { num: "02", title: "Paste it into your existing Lovable project" },
  { num: "03", title: "Set your brand colours, font style, and pages to upgrade" },
  { num: "04", title: "Lazy Design audits every page and suggests 21st.dev component upgrades" },
];

const features = [
  { icon: Eye, title: "Page auditing", desc: "Automatically detects every section on your pages — hero, navigation, testimonials, features, CTA, and footer." },
  { icon: Palette, title: "Brand-matched upgrades", desc: "Selects 21st.dev components that match your colour scheme, accent colour, and typography style." },
  { icon: Layout, title: "Section-by-section", desc: "Upgrades one section at a time. Each suggestion comes with a ready-to-paste Lovable prompt." },
  { icon: Sparkles, title: "AI fallback prompts", desc: "If no 21st.dev component fits, generates a complete build-from-scratch prompt using Tailwind and Framer Motion." },
  { icon: Layers, title: "Apply or reject", desc: "Review each suggestion in the dashboard. Apply instantly, preview the prompt, or reject and move on." },
  { icon: Zap, title: "No API key required", desc: "Uses the 21st.dev component library and Lovable's built-in AI. Nothing to configure." },
];

const faqs = [
  { q: "Do I need a 21st.dev account?", a: "No paid account is needed. Lazy Design generates prompts that reference 21st.dev's public component library. You browse, copy, and paste." },
  { q: "Does it change my code automatically?", a: "Only if you enable auto-apply. By default, upgrades are suggested and require your approval from the admin dashboard." },
  { q: "What sections does it upgrade?", a: "Hero, navigation, testimonials, features, CTA, footer, forms, and pricing sections. It detects what's on each page and suggests upgrades for each." },
  { q: "Can I schedule upgrades?", a: "Yes. Choose manual, weekly, or monthly. Weekly upgrades one section per week. Monthly runs a full design review." },
  { q: "Will it break my existing design?", a: "No. Every upgrade is a suggestion with a preview prompt. You control what gets applied. The fallback prompt builds from scratch using your existing brand colours." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazyDesignPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-design");
  const promptText = dbPrompt?.prompt_text || LAZY_DESIGN_PROMPT;

  useEffect(() => {
    trackEvent("page_view", { page: "lazy-design" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Design — Autonomous Design Upgrade Agent for Lovable"
        description="One prompt upgrades your Lovable site with pre-built 21st.dev components — hero, navigation, testimonials, and more — matched to your brand automatically."
        url="/lazy-design"
        keywords="autonomous design, 21st.dev integration, Lovable design agent, UI component upgrades, design automation"
        faq={faqs.map(f => ({ question: f.q, answer: f.a }))}
        softwareApp={{ name: "Lazy Design", description: "Autonomous design upgrade agent that improves your Lovable site with pre-built 21st.dev components.", category: "DesignApplication" }}
        howToSteps={steps.map(s => ({ name: s.title, text: s.title }))}
        howToName="How to use Lazy Design"
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <TwentyFirstBadge />
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-design" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Design
                </h1>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lovable builds your site. 21st.dev makes it beautiful. Lazy Design connects the two — automatically upgrading your hero, navigation, testimonials, and more with pre-built components that match your brand.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </a>
              </div>

              {/* Works with tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["21st.dev", "Lovable AI", "Tailwind CSS", "Framer Motion"].map(tag => (
                  <span key={tag} className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/60 border border-border px-3 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              Four steps. Then your site upgrades itself.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.title}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              What it does
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="border border-border p-6">
                  <f.icon size={20} className="text-foreground/60 mb-4" />
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-foreground/65 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Design upgrade lifecycle */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              The design upgrade lifecycle, automated.
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="space-y-4">
              {[
                "You set your brand colours, accent, and typography style",
                "Lazy Design audits every page and detects sections automatically",
                "For each section, it suggests a matching 21st.dev component with a ready-to-paste prompt",
                "Apply with one click, preview the prompt, or reject and move on",
                "If no component fits, a full Tailwind + Framer Motion fallback prompt is generated",
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Sparkles size={14} className="text-foreground/60 mt-1 shrink-0" />
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{line}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <LazyPricingSection
              lazyFeatures={[
                "Setup prompt included",
                "Page auditing and section detection",
                "21st.dev component suggestions",
                "AI fallback prompts",
                "No API key required",
              ]}
              proFeatures={[
                "Hosted version — zero config",
                "Automated weekly design upgrades",
                "Advanced brand matching",
                "Multi-project support",
              ]}
              proPrice="$19"
              ctaButton={<CopyPromptButton text={promptText} />}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <LazyFaqSection faqs={faqs} />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Lovable builds your site. 21st.dev makes it beautiful. Lazy Design connects the two.
              </h2>
              <div className="mt-8">
                <CopyPromptButton text={promptText} />
              </div>
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Works with any Lovable project. No API key required.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
