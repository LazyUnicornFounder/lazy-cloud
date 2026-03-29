import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Clock, Zap, BarChart3, Users, Check } from "lucide-react";
import { toast } from "sonner";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_MAIL_PROMPT = `[Lazy Mail Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete autonomous email agent called Lazy Mail to this project. It connects Resend to your Lovable site and handles subscriber capture, welcome sequences, automated newsletter broadcasts from your blog content, transactional emails, and self-improving open rates — without you writing or sending a single email manually.

Note: Store the Resend API key as Supabase secret RESEND_API_KEY. Never store in the database.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const ResendBadge = () => (
  <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/50 border border-border px-3 py-1">
    Powered by Resend
  </span>
);

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    trackEvent("copy_prompt", { product: "lazy-mail" });
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent, text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] bg-primary text-primary-foreground"
    >
      {copied ? "Copied ✓" : "Copy the Lovable Prompt"}
    </button>
  );
}

const steps = [
  { num: "01", title: "Copy the setup prompt from this page" },
  { num: "02", title: "Paste it into your existing Lovable project" },
  { num: "03", title: "Add your Resend API key in the setup screen" },
  { num: "04", title: "Subscribers, welcome emails, and newsletters run autonomously" },
];

const features = [
  { icon: Users, title: "Subscriber capture", desc: "Embeddable subscribe form on every page. Double opt-in for GDPR compliance." },
  { icon: Send, title: "Welcome sequences", desc: "AI-written welcome emails sent the moment someone confirms. Multi-step sequences with delays." },
  { icon: Mail, title: "Newsletter broadcasts", desc: "Picks your latest blog post, writes a newsletter, and sends it to every subscriber automatically." },
  { icon: Clock, title: "Scheduled delivery", desc: "Daily, weekly, or biweekly newsletters. Pick the day. The agent handles the rest." },
  { icon: BarChart3, title: "Self-improving open rates", desc: "Rewrites underperforming subject lines using AI when open rates drop below 20%." },
  { icon: Zap, title: "Zero manual work", desc: "After setup you never write, schedule, or send another email. The agent does everything." },
];

const faqs = [
  { q: "Do I need a Resend account?", a: "Yes. Resend offers a generous free tier of 3,000 emails per month. Create an account at resend.com and generate an API key." },
  { q: "Does it support double opt-in?", a: "Yes. Double opt-in is enabled by default for GDPR compliance. Subscribers receive a confirmation email before being added to your audience." },
  { q: "What content does it send?", a: "Lazy Mail automatically picks your latest published blog post, SEO post, or GEO post and writes a newsletter around it using AI." },
  { q: "Can I customise the emails?", a: "The welcome sequence and broadcast templates are AI-generated for your brand. You can edit them in the admin dashboard." },
  { q: "Will it spam my subscribers?", a: "No. It respects the frequency you set (daily, weekly, or biweekly) and never sends more than one broadcast per period." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazyMailPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-mail");
  const promptText = dbPrompt?.prompt_text || LAZY_MAIL_PROMPT;

  useEffect(() => {
    trackEvent("page_view", { page: "lazy-mail" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Mail — Autonomous Email Agent for Lovable"
        description="One prompt adds subscriber capture, welcome sequences, and AI-written newsletters to your Lovable project. Powered by Resend."
        url="/lazy-mail"
        keywords="autonomous email, Resend integration, Lovable email agent, newsletter automation, subscriber management"
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <ResendBadge />
              </div>
              <AutopilotHeadline product="lazy-mail" />

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Mail
                </h1>


              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Commerce</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Subscriber capture, welcome sequences, and AI-written newsletters — running automatically. Lazy Mail handles the entire Resend integration with no code required.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </a>
              </div>

              {/* Works with tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {["Lazy Blogger", "Lazy SEO", "Lazy GEO", "Lazy Alert"].map(tag => (
                  <span key={tag} className="font-body text-[13px] tracking-[0.2em] uppercase text-foreground/50 border border-border px-3 py-1">
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
              Four steps. Then it runs forever.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                  <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                  <p className="font-body text-sm leading-relaxed">{s.title}</p>
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
                  <f.icon size={20} className="text-foreground/50 mb-4" />
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-foreground/50 leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Email lifecycle */}
        <section className="py-20 md:py-28 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
              The full email lifecycle, automated.
            </motion.h2>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} className="space-y-4">
              {[
                "Visitor lands on your site → subscribe form captures their email",
                "Double opt-in confirmation email sent automatically",
                "Welcome sequence triggers on confirmation — AI writes it for your brand",
                "New blog post publishes → newsletter written and sent to all subscribers",
                "Open rates drop below 20% → AI rewrites subject lines automatically",
              ].map((line, i) => (
                <div key={i} className="flex items-start gap-3 text-left">
                  <Check size={14} className="text-foreground/50 mt-1 shrink-0" />
                  <p className="font-body text-sm leading-relaxed">{line}</p>
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
                "Subscriber capture with double opt-in",
                "AI-written welcome sequences",
                "Automated newsletter broadcasts",
                "Self-improving subject lines",
              ]}
              proFeatures={[
                "Hosted version — zero config",
                "Multi-list segmentation",
                "A/B testing on subject lines",
                "Advanced open & click analytics",
                "Priority Resend API access",
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
                Your blog publishes itself. Now your emails send themselves too.
              </h2>
              <div className="mt-8">
                <CopyPromptButton text={promptText} />
              </div>
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Works with any Lovable project. Bring your own Resend API key.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
