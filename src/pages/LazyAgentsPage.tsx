import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

interface Agent {
  emoji: string;
  name: string;
  tagline: string;
  href: string;
}

interface Category {
  label: string;
  agents: Agent[];
}

const categories: Category[] = [
  {
    label: "Unicorn",
    agents: [
      { emoji: "🚀", name: "Lazy Launch", tagline: "Launch your Lovable website", href: "/lazy-launch" },
      { emoji: "📋", name: "Lazy Waitlist", tagline: "Autonomous pre-launch waitlist", href: "/lazy-waitlist" },
      { emoji: "▶️", name: "Lazy Run", tagline: "Autonomous everything", href: "/lazy-run" },
    ],
  },
  {
    label: "Content",
    agents: [
      { emoji: "✍️", name: "Lazy Blogger", tagline: "Autonomous blog posts", href: "/lazy-blogger" },
      { emoji: "🔍", name: "Lazy SEO", tagline: "Autonomous SEO content", href: "/lazy-seo" },
      { emoji: "🌍", name: "Lazy GEO", tagline: "Autonomous AI citations", href: "/lazy-geo" },
      { emoji: "🕷️", name: "Lazy Crawl", tagline: "Autonomous web research", href: "/lazy-crawl" },
      { emoji: "🔮", name: "Lazy Perplexity", tagline: "Autonomous deep research", href: "/lazy-perplexity" },
      { emoji: "📦", name: "Lazy Contentful", tagline: "Autonomous CMS sync", href: "/lazy-contentful" },
    ],
  },
  {
    label: "Commerce",
    agents: [
      { emoji: "🏪", name: "Lazy Store", tagline: "Autonomous storefronts", href: "/lazy-store" },
      { emoji: "📬", name: "Lazy Drop", tagline: "Autonomous dropshipping", href: "/lazy-drop" },
      { emoji: "🖨️", name: "Lazy Print", tagline: "Autonomous print-on-demand", href: "/lazy-print" },
      { emoji: "💳", name: "Lazy Pay", tagline: "Autonomous payments", href: "/lazy-pay" },
      { emoji: "📱", name: "Lazy SMS", tagline: "Autonomous text campaigns", href: "/lazy-sms" },
      { emoji: "✉️", name: "Lazy Mail", tagline: "Autonomous email flows", href: "/lazy-mail" },
    ],
  },
  {
    label: "Media",
    agents: [
      { emoji: "🎙️", name: "Lazy Voice", tagline: "Autonomous podcasts", href: "/lazy-voice" },
      { emoji: "📺", name: "Lazy Stream", tagline: "Autonomous stream content", href: "/lazy-stream" },
      { emoji: "🎬", name: "Lazy YouTube", tagline: "Autonomous video content", href: "/lazy-youtube" },
    ],
  },
  {
    label: "Dev",
    agents: [
      { emoji: "🐙", name: "Lazy GitHub", tagline: "Autonomous changelogs", href: "/lazy-github" },
      { emoji: "🦊", name: "Lazy GitLab", tagline: "Autonomous GitLab docs", href: "/lazy-gitlab" },
      { emoji: "✅", name: "Lazy Linear", tagline: "Autonomous issue content", href: "/lazy-linear" },
      { emoji: "🎨", name: "Lazy Design", tagline: "Autonomous UI upgrades", href: "/lazy-design" },
      { emoji: "🔐", name: "Lazy Auth", tagline: "Autonomous login flows", href: "/lazy-auth" },
      { emoji: "🧠", name: "Lazy Granola", tagline: "Autonomous meeting content", href: "/lazy-granola" },
    ],
  },
  {
    label: "Ops",
    agents: [
      { emoji: "⚙️", name: "Lazy Admin", tagline: "Autonomous ops control", href: "/lazy-admin" },
      { emoji: "🚨", name: "Lazy Alert", tagline: "Autonomous Slack alerts", href: "/lazy-alert" },
      { emoji: "✈️", name: "Lazy Telegram", tagline: "Autonomous Telegram updates", href: "/lazy-telegram" },
      { emoji: "🗄️", name: "Lazy Supabase", tagline: "Autonomous database reports", href: "/lazy-supabase" },
      { emoji: "🛡️", name: "Lazy Security", tagline: "Autonomous pentesting", href: "/lazy-security" },
      { emoji: "👁️", name: "Lazy Watch", tagline: "Autonomous error monitoring", href: "/lazy-watch" },
      { emoji: "🔧", name: "Lazy Fix", tagline: "Autonomous prompt improvement", href: "/lazy-fix" },
      { emoji: "🏗️", name: "Lazy Build", tagline: "Autonomous agent writing", href: "/lazy-build" },
      { emoji: "📊", name: "Lazy Intel", tagline: "Autonomous content strategy", href: "/lazy-intel" },
      { emoji: "🔄", name: "Lazy Repurpose", tagline: "Autonomous content repurposing", href: "/lazy-repurpose" },
      { emoji: "🔥", name: "Lazy Trend", tagline: "Autonomous trend detection", href: "/lazy-trend" },
      { emoji: "💰", name: "Lazy Churn", tagline: "Autonomous churn prevention", href: "/lazy-churn" },
    ],
  },
];

const totalAgents = categories.reduce((sum, c) => sum + c.agents.length, 0);

export default function LazyAgentsPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_agents_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="All 36 Agents — Autonomous Stack | Lazy Unicorn"
        description="Browse all 36 autonomous agents across content, commerce, media, dev, and ops — running inside your Lovable project."
        url="/lazy-agents"
        keywords="autonomous agents, Lovable agents, lazy unicorn agents, autonomous stack"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="font-display text-[11px] tracking-[0.25em] uppercase text-foreground/40 font-bold mb-6">{totalAgents} Agents</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Every agent. One stack.
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed">
                {totalAgents} autonomous agents across {categories.length} categories — content, commerce, media, dev, ops, and meta-agents — all running inside your Lovable project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        {categories.map((category, ci) => (
          <section key={category.label} className="max-w-5xl mx-auto px-6 mt-16 first:mt-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: ci * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="font-display text-xs tracking-[0.2em] uppercase font-bold text-foreground/40">
                  {category.label}
                </h2>
                <span className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/25">
                  {category.agents.length} agents
                </span>
                <div className="flex-1 border-t border-border/30" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border border-border">
                {category.agents.map((agent, i) => (
                  <Link
                    key={agent.name}
                    to={agent.href}
                    className="border-b last:border-b-0 sm:odd:border-r lg:odd:border-r-0 lg:[&:nth-child(3n+1)]:border-r lg:[&:nth-child(3n+2)]:border-r border-border bg-card p-5 sm:p-6 flex items-start gap-4 hover:bg-accent/5 transition-colors group"
                  >
                    <span className="text-xl mt-0.5">{agent.emoji}</span>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold text-foreground group-hover:text-[#c8a961] transition-colors">{agent.name}</h3>
                      <p className="font-body text-xs text-foreground/45 mt-0.5">{agent.tagline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </section>
        ))}

        {/* CTA */}
        <section className="text-center px-6 mt-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-body text-sm text-foreground/40 mb-4">{totalAgents} agents. Zero effort.</p>
            <Link
              to="/lazy-launch"
              className="inline-flex items-center gap-2 font-display text-xs tracking-[0.12em] uppercase font-bold px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get Started with Lazy Launch →
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
