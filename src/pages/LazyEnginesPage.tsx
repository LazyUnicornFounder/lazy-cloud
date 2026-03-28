import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const engineGroups = [
  {
    label: "Lazy Unicorn",
    emoji: "🦄",
    description: "The unified runtime. One prompt installs the entire stack.",
    engines: [
      { name: "Lazy Run", tagline: "Autonomous everything — installs and orchestrates all engines from a single prompt", href: "/lazy-run" },
    ],
  },
  {
    label: "Lazy Content",
    emoji: "✍️",
    description: "Autonomous content creation, SEO, AI citation optimisation, and deep research.",
    engines: [
      { name: "Lazy Blogger", tagline: "Publishes blog posts on a schedule using AI — topic selection, writing, formatting, and posting", href: "/lazy-blogger" },
      { name: "Lazy SEO", tagline: "Writes SEO-optimised long-form articles targeting your keywords automatically", href: "/lazy-seo" },
      { name: "Lazy GEO", tagline: "Creates content designed to get cited by AI models like ChatGPT and Perplexity", href: "/lazy-geo" },
      { name: "Lazy Crawl", tagline: "Crawls competitor sites and extracts content intelligence using Firecrawl", href: "/lazy-crawl" },
      { name: "Lazy Perplexity", tagline: "Runs deep research queries via Perplexity and turns findings into content", href: "/lazy-perplexity" },
      { name: "Lazy Contentful", tagline: "Syncs your content to Contentful CMS automatically", href: "/lazy-contentful" },
    ],
  },
  {
    label: "Lazy Commerce",
    emoji: "🛒",
    description: "Autonomous storefronts, payments, fulfilment, and customer messaging.",
    engines: [
      { name: "Lazy Store", tagline: "Builds and manages a Shopify-connected storefront inside your Lovable project", href: "/lazy-store" },
      { name: "Lazy Drop", tagline: "Autonomous dropshipping with AutoDS — product import, pricing, and order routing", href: "/lazy-drop" },
      { name: "Lazy Print", tagline: "Print-on-demand storefronts powered by Printful — design, list, fulfil", href: "/lazy-print" },
      { name: "Lazy Pay", tagline: "Stripe payment flows — checkout, subscriptions, and webhook handling", href: "/lazy-pay" },
      { name: "Lazy SMS", tagline: "Automated text campaigns and transactional messages via Twilio", href: "/lazy-sms" },
      { name: "Lazy Mail", tagline: "Automated email sequences and transactional emails via Resend", href: "/lazy-mail" },
    ],
  },
  {
    label: "Lazy Media",
    emoji: "🎙️",
    description: "Autonomous audio, video, and live stream content.",
    engines: [
      { name: "Lazy Voice", tagline: "Converts blog posts into podcast episodes using ElevenLabs text-to-speech", href: "/lazy-voice" },
      { name: "Lazy Stream", tagline: "Monitors Twitch streams and generates recaps, highlights, and SEO content", href: "/lazy-stream" },
      { name: "Lazy YouTube", tagline: "Tracks YouTube channels and turns videos into blog posts, summaries, and SEO articles", href: "/lazy-youtube" },
    ],
  },
  {
    label: "Lazy Dev",
    emoji: "⚡",
    description: "Turn commits, issues, meetings, and design changes into public content.",
    engines: [
      { name: "Lazy GitHub", tagline: "Generates changelogs, release notes, and developer blog posts from GitHub activity", href: "/lazy-github" },
      { name: "Lazy GitLab", tagline: "Same as Lazy GitHub but for GitLab repositories", href: "/lazy-gitlab" },
      { name: "Lazy Linear", tagline: "Turns Linear issues and project cycles into public content and roadmaps", href: "/lazy-linear" },
      { name: "Lazy Design", tagline: "Autonomous UI upgrades using 21st.dev component library", href: "/lazy-design" },
      { name: "Lazy Auth", tagline: "Installs Google OAuth login flows with Supabase Auth", href: "/lazy-auth" },
      { name: "Lazy Granola", tagline: "Extracts meeting notes from Granola and turns them into blog posts, issues, and Slack summaries", href: "/lazy-granola" },
    ],
  },
  {
    label: "Lazy Ops",
    emoji: "🔒",
    description: "Monitoring, alerts, security scanning, and database observability.",
    engines: [
      { name: "Lazy Admin", tagline: "Unified admin dashboard for controlling all engines from one place", href: "/lazy-admin" },
      { name: "Lazy Alert", tagline: "Sends Slack notifications when engines fail, publish, or hit thresholds", href: "/lazy-alert" },
      { name: "Lazy Telegram", tagline: "Same as Lazy Alert but delivers updates via Telegram bot", href: "/lazy-telegram" },
      { name: "Lazy Supabase", tagline: "Generates weekly database health reports and table usage analytics", href: "/lazy-supabase" },
      { name: "Lazy Security", tagline: "Runs autonomous security scans using Aikido and reports vulnerabilities", href: "/lazy-security" },
    ],
  },
];

const integrations = [
  "Firecrawl", "Perplexity", "Contentful", "Stripe", "Shopify", "Twilio", "Resend",
  "ElevenLabs", "Twitch", "YouTube", "Supadata", "GitHub", "GitLab", "Linear",
  "21st.dev", "Granola", "Slack", "Telegram", "Supabase", "Google OAuth", "Aikido",
  "AutoDS", "Printful",
];

const totalEngines = engineGroups.reduce((sum, g) => sum + g.engines.length, 0);

export default function LazyEnginesPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_engines_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="All Engines — 27 Autonomous Engines for Lovable | Lazy Unicorn"
        description="Every Lazy engine explained. Content, commerce, media, dev tools, and ops — 27 autonomous engines that run your Lovable site while you sleep."
        url="/lazy-engines"
        keywords="Lovable engines, autonomous engines, Lazy Unicorn engines, content automation, commerce automation"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="font-display text-[11px] tracking-[0.25em] uppercase text-foreground/40 font-bold mb-6">Lazy Engines</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f0ead6", lineHeight: 1, letterSpacing: "-0.02em" }}>
                27 engines run your Lovable business.
              </h1>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f0ead6", lineHeight: 1, letterSpacing: "-0.02em", marginTop: "0.1em" }}>
                One prompt each.
              </h2>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Every engine is a self-contained prompt you paste into your Lovable project. Each one installs its own database tables, edge functions, and UI — then runs itself autonomously. Pick the ones you need or install everything with Lazy Run.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="max-w-4xl mx-auto px-6 -mt-10 mb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-3 gap-0 border border-border">
            {[
              { label: "Engines", value: String(totalEngines) },
              { label: "Categories", value: String(engineGroups.length) },
              { label: "Integrations", value: String(integrations.length) },
            ].map((stat, i) => (
              <div key={stat.label} className={`bg-card p-6 text-center ${i < 2 ? "border-r border-border" : ""}`}>
                <p className="font-display text-3xl font-extrabold text-foreground mb-1">{stat.value}</p>
                <p className="font-body text-xs tracking-[0.15em] uppercase text-foreground/40 font-semibold">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Engine groups */}
        {engineGroups.map((group, gi) => (
          <section key={group.label} className="max-w-4xl mx-auto px-6 mb-16">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{group.emoji}</span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">{group.label}</h2>
              </div>
              <p className="font-body text-sm text-foreground/50 mb-6 ml-10">{group.description}</p>
              <div className="border border-border">
                {group.engines.map((engine, ei) => (
                  <motion.div
                    key={engine.name}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ delay: ei * 0.04 }}
                  >
                    <Link
                      to={engine.href}
                      className={`group flex items-start justify-between gap-4 p-6 hover:bg-card transition-colors ${ei < group.engines.length - 1 ? "border-b border-border" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">
                          {engine.name}
                        </h3>
                        <p className="font-body text-sm text-foreground/50 leading-relaxed">{engine.tagline}</p>
                      </div>
                      <ArrowRight size={14} className="text-foreground/15 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-1" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        ))}

        {/* Integrations */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            {integrations.length} integrations. Zero lock-in.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-wrap justify-center gap-2">
            {integrations.map((name) => (
              <span key={name} className="font-display text-[11px] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border border-border text-foreground/50">
                {name}
              </span>
            ))}
          </motion.div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/40">
            Every integration uses your own API keys stored as secrets. No middleman. No vendor lock-in.
          </motion.p>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Three steps. Any engine.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {[
              { step: "1", title: "Copy the prompt", desc: "Every engine page has a Copy Prompt button. One click copies the full installation instructions." },
              { step: "2", title: "Paste into Lovable", desc: "Open your Lovable project, paste the prompt into the chat. Lovable builds the engine into your project." },
              { step: "3", title: "Configure and run", desc: "Fill in any API keys the engine needs. Toggle it on. It runs itself from there." },
            ].map((s, i) => (
              <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <span className="font-display text-3xl font-bold text-[#c8a961]/30 mb-3 block">{s.step}</span>
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Agents callout */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-8 text-center">
            <p className="font-display text-[11px] tracking-[0.25em] uppercase text-[#c8a961] font-bold mb-3">Next level</p>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight mb-3">
              Engines run your business. Agents run your engines.
            </h3>
            <p className="font-body text-sm text-foreground/50 max-w-lg mx-auto leading-relaxed mb-6">
              Once your engines are running, install the Lazy Agents — four autonomous agents that monitor errors, improve prompts, write new engines, and generate your weekly content strategy.
            </p>
            <Link
              to="/lazy-agents"
              className="inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              View Lazy Agents →
            </Link>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="text-center px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">Pick an engine. Paste the prompt. Watch it run.</h2>
            <p className="font-body text-sm text-foreground/50 mb-8">Or install everything at once with Lazy Run.</p>
            <Link
              to="/lazy-run"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-display text-[13px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              Get Lazy Run
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
