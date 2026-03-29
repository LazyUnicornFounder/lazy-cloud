import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, UserMinus, Activity } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Churn Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous churn prevention agent called Lazy Churn to this project. It monitors your Stripe subscriber data daily, identifies customers at risk of cancelling based on login inactivity, usage drops, and renewal proximity, and automatically triggers personalised re-engagement sequences via SMS and email — before the cancellation happens.`;

const problemCards = [
  { emoji: "🔕", text: "Your best customer stopped logging in 18 days ago. You have no idea. They are about to cancel and you have never noticed." },
  { emoji: "📉", text: "A customer's usage dropped 60% last week. They are losing the habit. Two weeks from now they cancel because they forgot the value." },
  { emoji: "🗓️", text: "A customer renews in 4 days. They have not logged in for 3 weeks. They are going to cancel on renewal day. Nobody reached out." },
];

const signalCards = [
  { emoji: "📅", title: "Login recency", desc: "How many days since last login. The biggest single churn predictor." },
  { emoji: "📊", title: "Login frequency", desc: "Login count over the last 30 days. Declining frequency precedes cancellation." },
  { emoji: "🗓️", title: "Renewal proximity", desc: "Customers who haven't engaged close to renewal day churn at 3x the rate." },
  { emoji: "⏳", title: "Subscription age", desc: "New customers in their first 30 days churn fastest. Long-term customers get a loyalty credit." },
];

const faqs = [
  { q: "How does it know if a customer is at risk?", a: "It reads your Stripe subscription data daily and your Supabase user_profiles table (from Lazy Auth) for login activity. The risk score is calculated from four signals: login recency, login frequency, renewal proximity, and subscription age." },
  { q: "Will it spam my customers?", a: "No. Lazy Churn waits at least 7 days between messages to any single customer. It also tracks outcomes — if someone logged back in after a message it marks them as recovered and stops messaging." },
  { q: "What if I don't have Lazy Auth installed?", a: "Lazy Churn can still run using Stripe data alone — renewal proximity and subscription age signals work without login data. Install Lazy Auth for the full risk score." },
  { q: "Can I edit the messages before they send?", a: "You can preview and edit AI-generated messages from the admin dashboard. Turn off auto-send and every message goes to a queue for your approval first." },
  { q: "Does it track whether the messages worked?", a: "Yes. Lazy Churn checks whether at-risk customers logged back in or cancelled within 48 hours of receiving a message. The recovery rate is shown in your admin dashboard." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-churn" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyChurnPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_churn_page_view"); }, [trackEvent]);
  const { prompt } = useCurrentPrompt("lazy-churn");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Churn — Autonomous Churn Prevention Agent for Lovable"
        description="Monitor every subscriber daily. Identify who is drifting toward cancellation. Send personalised re-engagement before they cancel. One recovered customer pays for the agent forever."
        url="/lazy-churn"
        keywords="churn prevention, autonomous retention, subscriber monitoring, SaaS churn, Lovable agent"
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
              <AutopilotHeadline product="lazy-churn" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Churn
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy Churn monitors every subscriber daily. When someone goes quiet — stops logging in, drops their usage, approaches renewal without engaging — it sends a personalised SMS and email before they ever reach the cancel button. Written by Claude. Sent automatically. One recovered customer pays for the agent forever.
              </p>
              <div className="flex items-center gap-3 mt-4 mb-8">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Ops</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("signals")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 mt-16 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Churn is quiet. That is the problem.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {problemCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-3">{card.emoji}</p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Churn happens in the silence. Lazy Churn listens to that silence and acts before it becomes a cancellation.
          </motion.p>
        </section>

        {/* Risk Score Signals */}
        <section id="signals" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Four signals. One risk score.
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
            {signalCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className={`bg-card p-5 text-center ${i < 3 ? "border-r border-border" : ""} border-b md:border-b-0`}>
                <p className="text-2xl mb-2">{card.emoji}</p>
                <h3 className="font-display text-xs font-bold tracking-[0.1em] uppercase mb-1">{card.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-4 font-body text-sm text-foreground/40">
            Risk scores update daily. Customers move between healthy, at-risk, and critical automatically.
          </motion.p>
        </section>

        {/* What gets sent */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Personalised. Not templated.
          </motion.h2>
          <div className="space-y-4">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-5">
              <p className="font-display text-xs tracking-[0.15em] uppercase text-foreground/40 font-bold mb-2">📱 SMS</p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed italic">
                "Hey Sarah — noticed you haven't been in Lazy Unicorn for a while. Your Lazy Blogger is still publishing daily but you're missing the SEO queue that's building up. Worth 5 mins to check? lazyunicorn.ai"
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.08 }} className="border border-border bg-card p-5">
              <p className="font-display text-xs tracking-[0.15em] uppercase text-foreground/40 font-bold mb-2">📧 Email</p>
              <p className="font-body text-xs text-foreground/40 mb-1">Subject: Quick question about your stack</p>
              <p className="font-body text-sm text-foreground/70 leading-relaxed italic">
                "Hey Sarah, I noticed you haven't logged into Lazy Unicorn in a few weeks. Your Blogger agent is still running but your SEO keyword queue has 23 keywords waiting to be published — that's organic traffic sitting idle. Worth a quick check? If anything isn't working the way you expected I'd love to help. — Saad"
              </p>
            </motion.div>
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-4 font-body text-sm text-foreground/40">
            Every message is written by Claude using the customer's name, plan, and specific usage pattern. No generic templates.
          </motion.p>
        </section>

        {/* The economics */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            The math is obvious.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8 text-center space-y-3">
            <p className="font-body text-lg text-foreground/70">Average plan: <span className="font-bold text-foreground">$49/month</span></p>
            <p className="font-body text-lg text-foreground/70">One recovered customer per month: <span className="font-bold text-[#c8a961]">$588/year</span></p>
            <p className="font-body text-lg text-foreground/70">Lazy Churn costs: <span className="font-bold text-foreground">$0</span></p>
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-4 font-body text-sm text-foreground/40">
            One customer saved per month pays for every other tool in your stack.
          </motion.p>
        </section>

        {/* Pricing */}
        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "Daily subscriber monitoring", "AI risk scoring", "Personalised SMS re-engagement", "Personalised email re-engagement", "Outcome tracking"]}
          proFeatures={["Everything in Lazy", "Custom risk thresholds", "Multi-product monitoring", "Advanced recovery analytics", "Win-back sequences"]}
          ctaButton={<CopyPromptButton text={promptText} />}
        />

        <section className="max-w-2xl mx-auto px-6 text-center mb-16">
          <p className="font-body text-sm text-foreground/40">
            Requires Stripe (Lazy Pay), Twilio (Lazy SMS), and Resend (Lazy Mail). All secrets already set if those agents are installed.
          </p>
        </section>

        {/* FAQ */}
        <LazyFaqSection faqs={faqs} />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-10 text-center">
            <p className="font-body text-sm text-foreground/50 mb-4 leading-relaxed max-w-lg mx-auto">
              Your next cancellation is already in your data. Lazy Churn finds it first.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>

      </main>
    </div>
  );
}
