import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Clock, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { frequencyTiers, buildPrompt, type FrequencyTier } from "@/components/lazy-blogger/frequencyData";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function FrequencyModal({ open, onClose, onCopy, template }: { open: boolean; onClose: () => void; onCopy: (tier: FrequencyTier) => void; template?: string }) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = useCallback(async (tier: FrequencyTier) => {
    await navigator.clipboard.writeText(buildPrompt(tier, template));
    setCopied(tier.postsPerDay);
    onCopy(tier);
    toast.success(`Copied! Paste this into your Lovable project chat.`);
    setTimeout(() => setCopied(null), 2500);
  }, [onCopy, template]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border p-12 sm:p-16 max-w-3xl w-full"
      >
        <h3 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">How many posts per day?</h3>
        <p className="font-body text-lg text-muted-foreground mb-10">Pick one. The prompt adjusts automatically.</p>
        <div className="grid grid-cols-2 gap-5">
          {frequencyTiers.map((tier) => {
            const isCopied = copied === tier.postsPerDay;
            return (
              <button
                key={tier.postsPerDay}
                onClick={() => handleCopy(tier)}
                className={`border p-8 text-left transition-all cursor-pointer ${
                  isCopied
                    ? "border-foreground bg-foreground/5"
                    : "border-border hover:border-foreground/30 bg-card"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-5xl font-extrabold text-foreground">{tier.postsPerDay}</span>
                  <span className="font-body text-lg text-muted-foreground">/ day</span>
                </div>
                <p className="font-body text-base text-muted-foreground">{tier.description}</p>
                <div className="mt-5 flex items-center gap-2 text-base font-display font-bold text-foreground">
                  {isCopied ? (
                    <><Check size={16} /> Copied!</>
                  ) : (
                    <><Copy size={16} /> Copy prompt</>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full text-center font-body text-base text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

function CopyPromptButton({ className = "", onCopy, template }: { className?: string; onCopy: (tier: FrequencyTier) => void; template?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
      >
        <Copy size={16} /> Copy the Lovable Prompt
      </button>
      <FrequencyModal open={open} onClose={() => setOpen(false)} onCopy={onCopy} template={template} />
    </>
  );
}

const steps = [
  "Click the button above and pick how many posts you want per day.",
  "Paste the prompt into your Lovable project chat.",
  "Answer five quick questions about your business.",
  "Your blog starts publishing automatically.",
];

const LazyBloggerPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-blogger");
  const template = dbPrompt?.prompt_text || undefined;

  useEffect(() => {
    trackEvent("lazy_blogger_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback((tier: FrequencyTier) => {
    trackEvent("lazy_blogger_prompt_copy", { postsPerDay: tier.postsPerDay, label: tier.label });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Blogger — Autonomous Blog Agent for Lovable"
        description="One prompt installs an autonomous blog publishing agent inside your Lovable project. Up to 32 SEO posts a day, zero effort."
        url="/lazy-blogger"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-blogger" />

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Blogger
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Paste one prompt into your <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/90 transition-colors">Lovable</a> project. Your website starts publishing blog posts every day — automatically, forever, for free. No API keys needed.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handlePromptCopy} template={template} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What You Get */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Sparkles, title: "Auto-publishing", desc: "AI writes and publishes blog posts on a schedule you choose." },
              { icon: Clock, title: "Up to 32 posts/day", desc: "Pick 4, 8, 16, or 32 posts per day. Change anytime." },
              { icon: Zap, title: "Zero effort", desc: "No writing. No editing. No scheduling. It just runs." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center"
              >
                <item.icon size={18} className="text-foreground/65 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy Blogger setup prompt", "Self-hosted in your Lovable project", "Up to 32 posts per day", "No API keys needed"]}
          proFeatures={["Hosted version", "Advanced analytics dashboard", "Custom brand voice training", "Priority content generation"]}
          ctaButton={<CopyPromptButton onCopy={handlePromptCopy} template={template} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={[
          { q: "Is it really free?", a: "Yes. Lazy Blogger runs inside your existing Lovable project at zero additional cost. No API keys needed." },
          { q: "Do I need to know how to code?", a: "No. Paste the prompt, answer five questions, done." },
          { q: "Will the posts sound like me?", a: "You tell it your business, your audience, your topics, and your tone. The more specific you are, the better it writes." },
          { q: "Can I change settings later?", a: "Yes. Visit /lazy-blogger-setup on your site anytime to update topics, tone, or frequency." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Start publishing today.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every post builds your SEO. Every day you wait is a day your competitors get ahead.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} template={template} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyBloggerPage;
