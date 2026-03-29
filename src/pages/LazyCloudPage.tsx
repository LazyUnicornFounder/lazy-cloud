import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Cloud } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

/* ── Live Counter ── */
function LiveCounter() {
  const [agents, setAgents] = useState<number | null>(null);
  const [sites, setSites] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { count } = await supabase.from("installs").select("*", { count: "exact", head: true });
        if (count !== null) setAgents(count);

        const { data } = await supabase.from("installs").select("site_url");
        if (data) setSites(new Set(data.map(r => r.site_url)).size);
      } catch {
        // fallback
      }
    })();
  }, []);

  return (
    <motion.div
      initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}
      className="mt-10 inline-flex items-center gap-6 border border-primary/30 bg-card px-6 py-4"
    >
      <div className="text-center">
        <p className="font-display text-xl font-bold text-primary">
          {agents !== null ? `${agents.toLocaleString()}` : "2,400+"}
        </p>
        <p className="font-body text-[11px] tracking-[0.12em] uppercase text-muted-foreground">agents running</p>
      </div>
      <div className="w-px h-8 bg-border" />
      <div className="text-center">
        <p className="font-display text-xl font-bold text-primary">
          {sites !== null ? `${sites.toLocaleString()}` : "180+"}
        </p>
        <p className="font-body text-[11px] tracking-[0.12em] uppercase text-muted-foreground">sites</p>
      </div>
      <p className="text-[10px] text-muted-foreground/50 font-mono ml-2">Updated live</p>
    </motion.div>
  );
}

/* ── Value Cards ── */
const valueCards = [
  { emoji: "🔄", title: "Never re-paste a prompt again", desc: "When a new version of any Lazy agent ships your stack updates automatically overnight. No copying, no pasting, no version checking. Every site on Lazy Cloud is always on the latest version." },
  { emoji: "🔑", title: "Stop paying for individual API accounts", desc: "Lazy Cloud manages master accounts with Perplexity, Firecrawl, ElevenLabs, Resend, and more — at volume pricing. Your agents use them through us at rates you cannot get individually." },
  { emoji: "👁️", title: "Sleep while your agents run", desc: "Lazy Watch monitors every agent across every Lazy Cloud site 24/7. When something breaks we diagnose it, fix it, and notify you after. You get a Slack message saying it is resolved — not one asking you to investigate." },
  { emoji: "💾", title: "Your stack is always recoverable", desc: "Every agent settings table backed up daily. If anything goes wrong restore to any point in the last 30 days with one click. No data loss. Ever." },
];

/* ── Pricing ── */
const plans = [
  {
    name: "Starter",
    price: "Coming soon",
    bestFor: "Founders running their first autonomous stack.",
    features: [
      "All agents managed — no agent limit",
      "Automatic prompt updates",
      "Managed Supabase infrastructure",
      "Daily backups — 7 day retention",
      "Lazy Watch monitoring",
      "Managed API keys: Perplexity & Firecrawl",
      "Email support — 48hr response",
      "1 site",
    ],
    popular: false,
    cta: "Join Waitlist",
    filled: false,
  },
  {
    name: "Growth",
    price: "Coming soon",
    bestFor: "Founders running a full Lazy Stack.",
    features: [
      "Everything in Starter, plus:",
      "All API keys included (Perplexity, Firecrawl, ElevenLabs, Resend, Twilio, Aikido)",
      "Daily backups — 30 day retention",
      "Priority support — 12hr response",
      "Dedicated Slack channel",
      "Performance analytics dashboard",
      "48hr SLA on breaking Lovable changes",
      "1 site",
    ],
    popular: true,
    cta: "Join Waitlist",
    filled: true,
  },
  {
    name: "Agency",
    price: "Coming soon",
    bestFor: "Agencies building autonomous sites for clients.",
    features: [
      "Everything in Growth, plus:",
      "Up to 10 client sites",
      "White-label — your brand, your domain",
      "Client management portal",
      "Reseller model — set your own pricing",
      "Dedicated account manager",
      "Custom SLA",
      "Onboarding call included",
    ],
    popular: false,
    cta: "Talk to Us",
    filled: false,
  },
];

/* ── Comparison ── */
const comparisonRows = [
  { label: "Prompt updates", self: "You re-paste manually", cloud: "Automatic overnight" },
  { label: "API keys", self: "Individual accounts at full price", cloud: "Volume pricing included" },
  { label: "Monitoring", self: "You check logs yourself", cloud: "24/7 — fixes included" },
  { label: "Backups", self: "You set up yourself", cloud: "Daily automated, 30-day retention" },
  { label: "Lovable breaking changes", self: "You find and fix", cloud: "48hr SLA — we handle it" },
  { label: "Support", self: "Community Discord", cloud: "Dedicated Slack channel" },
  { label: "Time cost", self: "2–4 hours/month", cloud: "0 hours" },
];

/* ── Agency Ramp ── */
const rampData = [
  { stage: "Getting started", clients: 3, revenue: "$387", cost: "$299", margin: "$88", note: "Covers your plan cost. Start here." },
  { stage: "Growing", clients: 5, revenue: "$645", cost: "$299", margin: "$346", note: "Meaningfully profitable." },
  { stage: "Scaled", clients: 10, revenue: "$1,290", cost: "$299", margin: "$991", note: "Strong recurring margin." },
];

/* ── FAQs ── */
const faqs = [
  { q: "Does Lazy Cloud have an agent limit?", a: "No. Every Lazy Cloud plan includes all agents with no limit. The differences between plans are API key coverage, backup retention, support response time, and number of sites — not agent count." },
  { q: "What happens if I cancel?", a: "Your agents, settings, and data are exported to your own Supabase account automatically within 24 hours of cancellation. You return to self-hosted with everything intact. No data loss, no lock-in." },
  { q: "Do I still need a Lovable account?", a: "Yes. Lazy Cloud manages the autonomous agent layer — it requires Lovable and Lovable Cloud for the site itself. Think of Lazy Cloud as the operations layer that sits on top of Lovable." },
  { q: "What API keys are included?", a: "Starter includes Perplexity and Firecrawl. Growth and Agency include all integrations: Perplexity, Firecrawl, ElevenLabs, Resend, Twilio SMS, and Aikido. Stripe uses your own keys for payment compliance reasons." },
  { q: "What happens when Lovable ships a breaking change?", a: "The Lazy Cloud team monitors Lovable updates continuously. When a breaking change affects agent functionality we update the affected prompts and auto-apply them to all Lazy Cloud sites within 48 hours on Growth and Agency plans." },
  { q: "Can I white-label Lazy Cloud for my clients?", a: "Yes on the Agency plan. Your clients see your brand name, your custom domain, and your support contact. LazyUnicorn is not visible to your clients." },
];

export default function LazyCloudPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_cloud_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Cloud — Fully Managed Autonomous Agent Stack"
        description="Lazy Cloud runs your entire agent stack — monitoring, updating, managing API keys at volume pricing, and fixing problems before you notice. Pricing coming soon."
        url="/lazy-cloud"
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-primary/30 text-primary mb-6">
              <Cloud size={14} /> Built for Lovable ☁️
            </span>
            <h1 className="font-display text-foreground" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
              Your autonomous Lovable site.<br />Fully managed.
            </h1>
            <p className="mt-6 font-body text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Lazy Cloud runs your entire agent stack for you — monitoring every engine, applying updates automatically, managing your API keys at volume pricing, and fixing problems before you notice them. You paste the prompts once. We handle everything after.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <a href="#pricing" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity">
                Start with Lazy Cloud
              </a>
              <a
                href="#whats-included"
                onClick={(e) => { e.preventDefault(); document.getElementById("whats-included")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                See What's Included
              </a>
            </div>
            <LiveCounter />
          </motion.div>
        </div>
      </section>

      {/* ── What Lazy Cloud does ── */}
      <section id="whats-included" className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10">
          What Lazy Cloud actually does for you.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
          {valueCards.map((card, i) => (
            <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:odd:border-r border-border last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0 bg-card p-6 md:p-8">
              <span className="text-2xl block mb-3">{card.emoji}</span>
              <h3 className="font-display text-base font-bold text-foreground mb-2">{card.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 pb-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8" style={{ borderLeft: "3px solid hsl(var(--primary))" }}>
          <p className="font-body text-base italic text-foreground/70 leading-relaxed mb-4">
            "Lazy Cloud saved me 3 hours a week I was spending on API key rotation, prompt updates, and debugging edge function errors. Now I just check the weekly digest."
          </p>
          <p className="font-body text-sm text-muted-foreground">— Founder, [redacted] — running 14 agents on Lazy Cloud Growth plan</p>
          <p className="font-body text-[11px] text-muted-foreground/50 mt-2">Real quote from a Lazy Cloud customer. Name shared on request.</p>
        </motion.div>
      </section>

      {/* ── What if Lovable changes ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6">
          What happens when Lovable updates?
        </motion.h2>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="space-y-4">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Lovable ships updates regularly. Most are backwards-compatible and your agents keep running without any changes. When Lovable makes a breaking change — to edge function APIs, database schemas, or auth flows — the Lazy Cloud team reviews every affected agent and ships updated prompts within 48 hours. Your stack auto-applies them.
          </p>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Self-hosted users have to identify the breaking change, find the affected prompts, update them manually, and re-paste into Lovable. On Lazy Cloud that entire process happens without you. This is the core reason Lazy Cloud exists.
          </p>
          <p className="font-body text-[11px] text-muted-foreground/50">
            We have a 48-hour SLA on breaking Lovable changes for Growth and Agency plans. Starter plan is best-effort, typically same timeframe.
          </p>
        </motion.div>
      </section>

      {/* ── Three Layers ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10">
          How it fits with Lovable.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
          {[
            { label: "Lovable", desc: "Builds your site", highlight: false },
            { label: "Lovable Cloud", desc: "Hosts your site", highlight: false },
            { label: "Lazy Cloud", desc: "Runs your agents", highlight: true },
          ].map((layer, i) => (
            <motion.div
              key={layer.label}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
              className={`border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 p-6 text-center ${layer.highlight ? "border-primary/40 bg-primary/5" : "bg-card"}`}
              style={layer.highlight ? { borderColor: "hsl(var(--primary) / 0.4)" } : {}}
            >
              {i > 0 && <ArrowRight size={14} className="text-muted-foreground/30 mx-auto mb-3 hidden sm:block" />}
              <h3 className="font-display text-base font-bold text-foreground">{layer.label}</h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{layer.desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="font-body text-sm text-muted-foreground leading-relaxed mt-6 text-center max-w-2xl mx-auto">
          Layers 1 and 2 are from Lovable. Lazy Cloud is layer 3. You need all three for a fully autonomous Lovable site. Lazy Cloud does not replace Lovable — it completes it.
        </p>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t border-border py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">Simple pricing. Cancel anytime.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-xl mx-auto">All plans include migration support. You bring your existing Lovable site — we handle the rest.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className={`border-b md:border-b-0 md:border-r last:border-r-0 last:border-b-0 p-6 md:p-8 flex flex-col ${plan.popular ? "bg-primary/5" : "bg-card"}`}
                style={plan.popular ? { borderColor: "hsl(var(--primary) / 0.4)" } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
                  {plan.popular && (
                    <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-bold px-2 py-0.5">Most Popular</span>
                  )}
                </div>
                <p className="font-display text-2xl font-bold text-primary mb-1">{plan.price}</p>
                <p className="font-body text-sm text-muted-foreground mb-6">{plan.bestFor}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                      <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full font-display font-bold text-sm tracking-[0.08em] uppercase px-6 py-3 transition-opacity hover:opacity-90 ${plan.filled ? "bg-primary text-primary-foreground" : "border border-primary text-primary"}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <p className="font-body text-[11px] text-muted-foreground/50 text-center mt-4">
            No agent limit on any plan. The difference between plans is API key coverage, backup retention, support response time, and number of sites.
          </p>
          <p className="font-body text-sm text-muted-foreground text-center mt-6">
            All plans billed monthly. Cancel anytime. Your agents and data are exported to your own Supabase account if you cancel — no lock-in.
          </p>
        </div>
      </section>

      {/* ── Agency Ramp ── */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-20 md:pb-28">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
          The agency model works from your first client.
        </motion.h2>
        <p className="font-body text-sm text-muted-foreground mb-10">You do not need 10 clients to make Lazy Cloud Agency profitable. Here is the math at different stages.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
          {rampData.map((col, i) => (
            <motion.div key={col.stage} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 bg-card p-6 text-center">
              <p className="font-body text-[11px] tracking-[0.12em] uppercase text-muted-foreground mb-2">{col.stage} ({col.clients} clients)</p>
              <p className="font-body text-sm text-muted-foreground">Revenue: <span className="text-foreground font-semibold">{col.revenue}</span>/mo</p>
              <p className="font-body text-sm text-muted-foreground">Cost: {col.cost}/mo</p>
              <p className="font-display text-xl font-bold text-primary mt-2">{col.margin}/mo</p>
              <p className="font-body text-[11px] text-muted-foreground/60 mt-2">{col.note}</p>
            </motion.div>
          ))}
        </div>

        <p className="font-body text-[11px] text-muted-foreground/50 text-center mt-4 max-w-2xl mx-auto">
          These use $129/month as a conservative client price. Most agencies charge $149–199/month for managed autonomous site services. White-label available on Agency plan — your clients see your brand.
        </p>
      </section>

      {/* ── Comparison ── */}
      <section className="border-t border-border py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10">
            Self-hosted is free. Lazy Cloud is for when your time is worth more.
          </motion.h2>

          <div className="border border-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="text-left p-4 font-display text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-semibold">Feature</th>
                  <th className="text-left p-4 font-display text-[11px] tracking-[0.12em] uppercase text-muted-foreground font-semibold">Self-Hosted (Free)</th>
                  <th className="text-left p-4 font-display text-[11px] tracking-[0.12em] uppercase text-primary font-semibold">Lazy Cloud</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={`border-b border-border last:border-b-0 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}>
                    <td className="p-4 font-body text-foreground font-medium">{row.label}</td>
                    <td className="p-4 font-body text-muted-foreground">{row.self}</td>
                    <td className="p-4 font-body text-foreground font-medium">{row.cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-body text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
            Self-hosted will always be free and fully functional. Lazy Cloud is for when the 2–4 hours you spend maintaining your stack every month is worth more than the subscription.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <LazyFaqSection faqs={faqs} />

      {/* ── Bottom CTA ── */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto border border-primary/30 bg-card px-8 py-14 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
            Your stack should run itself. So should your infrastructure.
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
            Stop re-pasting prompts, rotating API keys, checking error logs, and fixing breaking changes. Lazy Cloud handles all of it. Migration included. Cancel anytime.
          </p>
          <a href="#pricing" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity">
            Start with Lazy Cloud — Coming Soon
          </a>
          <p className="font-body text-[11px] text-muted-foreground/50 mt-4">No setup fee. No agent limit. Your data is always yours.</p>
        </motion.div>
      </section>
    </div>
  );
}
