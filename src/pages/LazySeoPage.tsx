import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const FALLBACK_SEO_PROMPT = "Loading prompt…";

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Answer five quick questions about your business.",
  "Lazy SEO discovers keywords and starts publishing daily.",
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
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazySeoPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-seo");
  const promptText = dbPrompt?.prompt_text || FALLBACK_SEO_PROMPT;

  useEffect(() => { trackEvent("lazy_seo_page_view"); }, [trackEvent]);
  const handlePromptCopy = useCallback(() => { trackEvent("lazy_seo_prompt_copy"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy SEO — Autonomous SEO Engine for Lovable" description="Set up once and watch your Google rankings climb. Lazy SEO analyses competitors, finds keyword gaps, and publishes SEO-optimised content on autopilot." url="/lazy-seo" />
      <Navbar />
      <main className="relative z-10 pt-28 pb-32">
        <section className="max-w-4xl mx-auto text-center px-6 mb-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-bold">Made for Lovable</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span style={{ fontFamily: "'Dancing Script', cursive" }}>Lazy</span> SEO
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Paste one prompt into your Lovable project. It discovers keyword opportunities, writes SEO-optimised content, and publishes daily — on autopilot.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
            <p className="font-body text-xs text-muted-foreground mt-4">No API keys needed.</p>
          </motion.div>
        </section>

        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">How it works</motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">What you get</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: BarChart3, title: "Keyword Discovery", desc: "AI finds 20 high-opportunity keywords from your competitors every week." },
              { icon: TrendingUp, title: "Auto-Publishing", desc: "SEO articles targeting your keywords — written and published daily." },
              { icon: Zap, title: "Zero Effort", desc: "No writing. No keyword research. No scheduling. It just ranks." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center">
                <item.icon size={18} className="text-foreground/40 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection lazyFeatures={["Lazy SEO setup prompt", "Self-hosted in your Lovable project", "Autonomous keyword discovery", "No API keys needed"]} proFeatures={["Hosted version", "Google Search Console integration", "Advanced ranking analytics", "Multi-site support"]} ctaButton={<CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} className="w-full justify-center" />} />

        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">Questions</motion.h2>
          <div className="space-y-0 border border-border">
            {[
              { q: "How does it find keywords?", a: "Lazy SEO uses AI to analyse your business description, target keywords, and competitor URLs to identify keyword gaps you should be ranking for." },
              { q: "What kind of content does it write?", a: "Long-form, SEO-optimised articles (1000–1500 words) with proper headings, internal links, and natural keyword placement." },
              { q: "Can I control what gets published?", a: "Yes. Use the admin dashboard to pause, resume, or manually trigger posts. You can also edit settings anytime." },
              { q: "Does it work with any Lovable site?", a: "Yes. Lazy SEO runs as part of your Lovable project with no external tools or API keys needed." },
            ].map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }} className="border-b last:border-b-0 border-border bg-card p-5">
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Start ranking today.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">Every day you wait is a day your competitors publish content that outranks you.</p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazySeoPage;
