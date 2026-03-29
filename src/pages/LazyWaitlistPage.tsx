import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Users, Share2, Mail, Rocket } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";
import ProductPromoBanner from "@/components/ProductPromoBanner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Waitlist Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous pre-launch waitlist engine called Lazy Waitlist to this project. It captures emails with a viral referral system, sends automated welcome sequences via Resend, posts Slack notifications for new signups, shows a live counter and countdown, and converts waitlist subscribers to user accounts on launch day.`;

const problemCards = [
  { emoji: "📧", text: "You announced your product on Twitter. People replied 'how do I sign up?' You have no landing page. You lost them." },
  { emoji: "📊", text: "You built a waitlist page. But nobody shares it. Growth is linear. One signup per tweet. You need exponential." },
  { emoji: "🚀", text: "Launch day arrives. You have 200 emails in a spreadsheet. No welcome sequence. No referral tracking. No conversion path. Manual chaos." },
];

const featureCards = [
  { emoji: "📋", title: "Email capture", desc: "Beautiful conversion-optimised landing page with live counter and countdown timer" },
  { emoji: "🔗", title: "Viral referrals", desc: "Every subscriber gets a unique referral link. Share to move up the list and unlock priority access" },
  { emoji: "✉️", title: "Welcome sequence", desc: "Automated welcome email with referral link via Resend. Optional follow-up sequence on delay" },
  { emoji: "💬", title: "Slack notifications", desc: "Real-time Slack alerts for every new signup with position and referral source" },
  { emoji: "🏆", title: "Priority tiers", desc: "Subscribers who hit the referral threshold get priority status automatically" },
  { emoji: "🚀", title: "Launch day", desc: "One-click launch sends conversion emails to all subscribers. Priority subscribers go first" },
];

const worksWithTags = ["Lazy Mail", "Lazy Auth", "Lazy Blogger", "Lazy SMS"];

const faqs = [
  { q: "How does the referral system work?", a: "Every subscriber gets a unique 8-character referral code. When someone signs up using their link, the referrer's count increases. Once they hit the threshold (default: 3 referrals), they automatically move to 'priority' status and get early access on launch day." },
  { q: "What emails does it send?", a: "Three types: a welcome email immediately on signup (with referral link), an optional follow-up email after a configurable delay, and a launch email on launch day with a link to create an account." },
  { q: "Can I customise the waitlist page?", a: "Yes. The setup wizard lets you configure the headline, subheadline, CTA text, accent colour, countdown timer, and whether to show the live counter and position after signup." },
  { q: "What happens on launch day?", a: "You click the launch button in the admin dashboard. It sends launch emails to all subscribers — priority subscribers first if you choose. The waitlist page closes and redirects to your signup flow." },
  { q: "Does it need Resend?", a: "Yes — Resend handles all transactional emails (welcome, follow-up, launch). You'll need a Resend API key and a verified sender email. Slack notifications are optional." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-waitlist" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);
  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyWaitlistPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_waitlist_page_view"); }, [trackEvent]);
  const { prompt } = useCurrentPrompt("lazy-waitlist");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Waitlist — Autonomous Pre-Launch Email Capture for Lovable"
        description="Capture emails with viral referral mechanics, automated welcome sequences, Slack notifications, and one-click launch day conversion. One prompt installs the entire engine."
        url="/lazy-waitlist"
        keywords="waitlist, pre-launch, email capture, viral referral, Lovable agent, waitlist page"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-waitlist" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Waitlist
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Commerce</span>
              </div>

              {/* Works with tags */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="font-display text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-semibold">Works with</span>
                {worksWithTags.map((tag) => (
                  <span key={tag} className="font-display text-[10px] tracking-[0.2em] uppercase text-foreground/40 border border-border px-2 py-0.5">{tag}</span>
                ))}
              </div>

              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Capture every pre-launch email with viral referral mechanics that turn one signup into five. Automated welcome sequences via Resend. Slack alerts for every signup. Live counter. Countdown timer. One-click launch day conversion to real user accounts. One prompt installs the entire engine.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See What It Does
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 mt-16 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-10">
            Pre-launch is where you lose your audience.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {problemCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-3">{card.emoji}</p>
                <p className="font-body text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed">
            Lazy Waitlist captures every interested person, gives them a reason to share, and converts them on launch day — automatically.
          </motion.p>
        </section>

        {/* Features */}
        <section id="features" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            One prompt. Complete pre-launch engine.
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border border-border">
            {featureCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="bg-card p-5 border-b border-r border-border last:border-r-0">
                <p className="text-2xl mb-2">{card.emoji}</p>
                <h3 className="font-display text-xs font-bold tracking-[0.1em] uppercase mb-1">{card.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            How the viral loop works.
          </motion.h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Someone signs up", desc: "They enter their email on your waitlist page. They get position #42 and a unique referral link." },
              { step: "2", title: "They share their link", desc: "Twitter, LinkedIn, email — every signup through their link bumps their referral count." },
              { step: "3", title: "They hit the threshold", desc: "At 3 referrals (configurable), they automatically get 'priority' status — first in line on launch day." },
              { step: "4", title: "You launch", desc: "One click sends launch emails. Priority subscribers get access first. Everyone else follows." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.06 }} className="flex gap-4 border border-border bg-card p-5">
                <span className="font-display text-2xl font-bold text-[#c8a961] shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-[0.05em] mb-1">{item.title}</h3>
                  <p className="font-body text-sm text-foreground/50 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "Public waitlist page", "Viral referral system", "Welcome email via Resend", "Slack signup alerts", "Admin dashboard with analytics"]}
          proFeatures={["Everything in Lazy", "Follow-up email sequences", "Custom branding", "Launch day batch control", "Priority tier management"]}
          ctaButton={<CopyPromptButton text={promptText} />}
        />

        <section className="max-w-2xl mx-auto px-6 text-center mb-16">
          <p className="font-body text-sm text-foreground/40">
            Requires Resend (RESEND_API_KEY). Slack notifications optional (WAITLIST_SLACK_WEBHOOK).
          </p>
        </section>

        {/* FAQ */}
        <LazyFaqSection faqs={faqs} />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-10 text-center">
            <p className="font-body text-sm mb-4 leading-relaxed max-w-lg mx-auto">
              Every day without a waitlist is audience you're losing. One prompt. Viral from day one.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>

        <div className="mt-20">
          <ProductPromoBanner exclude="lazy-waitlist" />
        </div>
      </main>
    </div>
  );
}
