import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Clock, Sparkles, Zap } from "lucide-react";
import FlyingBlogCards from "@/components/lazy-blogger/FlyingBlogCards";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { frequencyTiers, buildPrompt, type FrequencyTier } from "@/components/lazy-blogger/frequencyData";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function FrequencyModal({ open, onClose, onCopy }: { open: boolean; onClose: () => void; onCopy: (tier: FrequencyTier) => void }) {
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = useCallback(async (tier: FrequencyTier) => {
    await navigator.clipboard.writeText(buildPrompt(tier));
    setCopied(tier.postsPerDay);
    onCopy(tier);
    toast.success(`Copied! Paste this into your Lovable project chat.`);
    setTimeout(() => setCopied(null), 2500);
  }, [onCopy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border rounded-3xl p-12 sm:p-16 max-w-3xl w-full shadow-2xl"
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
                className={`rounded-2xl border p-8 text-left transition-all cursor-pointer ${
                  isCopied
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display text-5xl font-extrabold text-foreground">{tier.postsPerDay}</span>
                  <span className="font-body text-lg text-muted-foreground">/ day</span>
                </div>
                <p className="font-body text-base text-muted-foreground">{tier.description}</p>
                <div className="mt-5 flex items-center gap-2 text-base font-display font-bold text-primary">
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

function CopyPromptButton({ className = "", onCopy }: { className?: string; onCopy: (tier: FrequencyTier) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] ${className}`}
      >
        <Copy size={16} /> Copy the Lovable Prompt
      </button>
      <FrequencyModal open={open} onClose={() => setOpen(false)} onCopy={onCopy} />
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

  useEffect(() => {
    trackEvent("lazy_blogger_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback((tier: FrequencyTier) => {
    trackEvent("lazy_blogger_prompt_copy", { postsPerDay: tier.postsPerDay, label: tier.label });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Blogger — Autonomous Blog Engine for Lovable"
        description="One prompt installs an autonomous blog publishing engine inside your Lovable project. Up to 32 SEO posts a day, zero effort."
        url="/lazy-blogger"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-5xl mx-auto text-center px-6 mb-20 min-h-[520px] flex items-center justify-center">
          <FlyingBlogCards />
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold"
            >
              Introducing
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span>The Autonomous</span><br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">Blog Engine</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Paste one prompt into your Lovable project. Your website starts publishing blog posts every day — automatically, forever, for free.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} />
            <p className="font-body text-xs text-muted-foreground mt-4">Built for Lovable projects. No API keys needed.</p>
          </motion.div>
        </section>

        {/* ── How It Works — 4 simple steps ── */}
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
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        {/* ── FAQ — only the essentials ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "Is it really free?", a: "Yes. Lazy Blogger runs inside your existing Lovable project at zero additional cost. No API keys needed." },
              { q: "Do I need to know how to code?", a: "No. Paste the prompt, answer five questions, done." },
              { q: "Will the posts sound like me?", a: "You tell it your business, your audience, your topics, and your tone. The more specific you are, the better it writes." },
              { q: "Can I change settings later?", a: "Yes. Visit /lazy-blogger-setup on your site anytime to update topics, tone, or frequency." },
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
              Start publishing today.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every post builds your SEO. Every day you wait is a day your competitors get ahead.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyBloggerPage;
