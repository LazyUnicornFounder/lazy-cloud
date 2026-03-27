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

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_MAIL_PROMPT = `[Lazy Mail Prompt — v0.0.1 — LazyUnicorn.ai]

Add a complete autonomous email engine called Lazy Mail to this project. It connects Resend to your Lovable site and handles subscriber capture, welcome sequences, automated newsletter broadcasts from your blog content, transactional emails, and self-improving open rates — without you writing or sending a single email manually.

Note: Store the Resend API key as Supabase secret RESEND_API_KEY. Never store in the database.`;

const ResendBadge = () => (
  <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase text-foreground/30 border border-border px-3 py-1">
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
      className="inline-flex items-center justify-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-8 py-4 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97]"
      style={{ backgroundColor: "#f0ead6", color: "#0a0a08" }}
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
  { icon: Clock, title: "Scheduled delivery", desc: "Daily, weekly, or biweekly newsletters. Pick the day. The engine handles the rest." },
  { icon: BarChart3, title: "Self-improving open rates", desc: "Rewrites underperforming subject lines using AI when open rates drop below 20%." },
  { icon: Zap, title: "Zero manual work", desc: "After setup you never write, schedule, or send another email. The engine does everything." },
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
        title="Lazy Mail — Autonomous Email Engine for Lovable"
        description="One prompt adds subscriber capture, welcome sequences, and AI-written newsletters to your Lovable project. Powered by Resend."
        url="/lazy-mail"
        keywords="autonomous email, Resend integration, Lovable email engine, newsletter automation, subscriber management"
      />
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="px-6 md:px-12 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex justify-center mb-6">
              <ResendBadge />
            </motion.div>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "#f0ead6", opacity: 0.4 }}>
              Lazy Mail
            </motion.p>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.8 }} className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.1 }}>
              Your emails send themselves.
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6 font-body text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed">
              One prompt adds subscriber capture, welcome sequences, and AI-written newsletters to your Lovable project. Powered by Resend. No emails to write. No campaigns to schedule. Ever.
            </motion.p>

            <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <CopyPromptButton text={promptText} />
              <a href="/pricing" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/30 hover:text-foreground/60 transition-colors">
                See pricing →
              </a>
            </motion.div>

            {/* Works with tags */}
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap justify-center gap-2">
              {["Lazy Blogger", "Lazy SEO", "Lazy GEO", "Lazy Alert"].map(tag => (
                <span key={tag} className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/20 border border-border px-3 py-1">
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="mt-28 px-6 md:px-12 max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#f0ead6", textAlign: "center", marginBottom: "2.5rem" }}>
            Four steps. Then it runs forever.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-card p-8">
                <span className="font-display text-2xl font-bold text-foreground/10">{s.num}</span>
                <p className="mt-2 font-body text-sm text-foreground/60 leading-relaxed">{s.title}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-28 px-6 md:px-12 max-w-5xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#f0ead6", textAlign: "center", marginBottom: "2.5rem" }}>
            What it does
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }} className="bg-card p-8">
                <f.icon size={20} className="text-foreground/20 mb-4" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Email lifecycle */}
        <section className="mt-28 px-6 md:px-12 max-w-3xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "#f0ead6", marginBottom: "1.5rem" }}>
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
                <Check size={14} className="text-foreground/20 mt-1 shrink-0" />
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{line}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Pricing */}
        <section className="mt-28 px-6 md:px-12 max-w-4xl mx-auto">
          <LazyPricingSection
            freeFeatures={[
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
        </section>

        {/* FAQ */}
        <section className="mt-28 px-6 md:px-12 max-w-3xl mx-auto">
          <LazyFaqSection faqs={faqs} />
        </section>

        {/* Bottom CTA */}
        <section className="mt-28 px-6 md:px-12 max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#f0ead6", lineHeight: 1.2 }}>
              Your blog publishes itself. Now your emails send themselves too.
            </p>
            <div className="mt-6">
              <CopyPromptButton text={promptText} />
            </div>
            <p className="mt-4 font-body text-xs text-foreground/25">
              Works with any Lovable project. Bring your own Resend API key.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
