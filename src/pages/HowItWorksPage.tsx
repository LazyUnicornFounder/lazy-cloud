import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const engineGroups = [
  {
    label: "Lazy Unicorn",
    description: "Unified runtime for the entire stack.",
    engines: [
      { name: "Lazy Run", tagline: "Autonomous everything", href: "/lazy-run" },
    ],
  },
  {
    label: "Lazy Content",
    description: "Autonomous content creation, SEO, and AI citation.",
    engines: [
      { name: "Lazy Blogger", tagline: "Autonomous blog posts", href: "/lazy-blogger" },
      { name: "Lazy SEO", tagline: "Autonomous SEO content", href: "/lazy-seo" },
      { name: "Lazy GEO", tagline: "Autonomous AI citations", href: "/lazy-geo" },
      { name: "Lazy Crawl", tagline: "Autonomous web research", href: "/lazy-crawl" },
      { name: "Lazy Perplexity", tagline: "Autonomous deep research", href: "/lazy-perplexity" },
      { name: "Lazy Contentful", tagline: "Autonomous CMS sync", href: "/lazy-contentful" },
    ],
  },
  {
    label: "Lazy Commerce",
    description: "Autonomous storefronts, payments, and conversion optimisation.",
    engines: [
      { name: "Lazy Store", tagline: "Autonomous storefronts", href: "/lazy-store" },
      { name: "Lazy Drop", tagline: "Autonomous dropshipping", href: "/lazy-drop" },
      { name: "Lazy Print", tagline: "Autonomous print-on-demand", href: "/lazy-print" },
      { name: "Lazy Pay", tagline: "Autonomous payments", href: "/lazy-pay" },
      { name: "Lazy SMS", tagline: "Autonomous text campaigns", href: "/lazy-sms" },
      { name: "Lazy Mail", tagline: "Autonomous email flows", href: "/lazy-mail" },
    ],
  },
  {
    label: "Lazy Media",
    description: "Autonomous audio narration, stream content, and video repurposing.",
    engines: [
      { name: "Lazy Voice", tagline: "Autonomous podcasts", href: "/lazy-voice" },
      { name: "Lazy Stream", tagline: "Autonomous stream content", href: "/lazy-stream" },
      { name: "Lazy YouTube", tagline: "Autonomous video content", href: "/lazy-youtube" },
    ],
  },
  {
    label: "Lazy Dev",
    description: "Turn commits, issues, and cycles into public content.",
    engines: [
      { name: "Lazy GitHub", tagline: "Autonomous changelogs", href: "/lazy-github" },
      { name: "Lazy GitLab", tagline: "Autonomous GitLab docs", href: "/lazy-gitlab" },
      { name: "Lazy Linear", tagline: "Autonomous issue content", href: "/lazy-linear" },
      { name: "Lazy Design", tagline: "Autonomous UI upgrades", href: "/lazy-design" },
      { name: "Lazy Auth", tagline: "Autonomous login flows", href: "/lazy-auth" },
      { name: "Lazy Granola", tagline: "Autonomous meeting content", href: "/lazy-granola" },
    ],
  },
  {
    label: "Lazy Ops",
    description: "Monitoring, alerts, security, and database observability.",
    engines: [
      { name: "Lazy Admin", tagline: "Autonomous ops control", href: "/lazy-admin" },
      { name: "Lazy Alert", tagline: "Autonomous Slack alerts", href: "/lazy-alert" },
      { name: "Lazy Telegram", tagline: "Autonomous Telegram updates", href: "/lazy-telegram" },
      { name: "Lazy Supabase", tagline: "Autonomous database reports", href: "/lazy-supabase" },
      { name: "Lazy Security", tagline: "Autonomous pentesting", href: "/lazy-security" },
    ],
  },
];

const agentGroup = {
  label: "Lazy Agents",
  description: "Four autonomous agents that monitor, fix, build, and strategise across your entire engine stack.",
  agents: [
    { name: "Lazy Watch", tagline: "Monitors every engine error table and opens GitHub issues", href: "/lazy-watch" },
    { name: "Lazy Fix", tagline: "Reads performance data and opens PRs with prompt improvements", href: "/lazy-fix" },
    { name: "Lazy Build", tagline: "Writes complete new engine prompts from a brief", href: "/lazy-build" },
    { name: "Lazy Intel", tagline: "Reads all your data and fills your SEO and GEO queues", href: "/lazy-intel" },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <SEO
        title="How It Works — Lazy Unicorn"
        description="Every Lazy engine explained. See how autonomous content, commerce, code, messaging, and security engines work together to run your business."
        url="/how-it-works"
      />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fade}>
              <span className="font-body text-[14px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-6 block">
                The autonomous layer for <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#c8a961]/90 transition-colors">Lovable</a>
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="hover:text-[#c8a961] transition-colors">Lovable</a> gave everyone a website. Lazy Unicorn makes it work while you sleep.
              </h1>
              <p className="font-body text-foreground/50 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
                Every engine is a self-contained prompt you paste into your{" "}
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/70 transition-colors">Lovable</a>{" "}
                project. Each one installs its own database tables, edge functions, and UI — then runs itself autonomously.
              </p>
              <p className="font-body text-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
                Integrates with <strong className="text-foreground/50">Stripe</strong>, <strong className="text-foreground/50">Shopify</strong>, <strong className="text-foreground/50">AutoDS</strong>, <strong className="text-foreground/50">Printful</strong>, <strong className="text-foreground/50">Twilio</strong>, <strong className="text-foreground/50">Resend</strong>, <strong className="text-foreground/50">ElevenLabs</strong>, <strong className="text-foreground/50">Twitch</strong>, <strong className="text-foreground/50">YouTube</strong>, <strong className="text-foreground/50">Supadata</strong>, <strong className="text-foreground/50">GitHub</strong>, <strong className="text-foreground/50">GitLab</strong>, <strong className="text-foreground/50">Linear</strong>, <strong className="text-foreground/50">21st.dev</strong>, <strong className="text-foreground/50">Google OAuth</strong>, <strong className="text-foreground/50">Granola</strong>, <strong className="text-foreground/50">Slack</strong>, <strong className="text-foreground/50">Telegram</strong>, <strong className="text-foreground/50">Supabase</strong>, <strong className="text-foreground/50">Aikido</strong>, <strong className="text-foreground/50">Contentful</strong>, <strong className="text-foreground/50">Firecrawl</strong>, and <strong className="text-foreground/50">Perplexity</strong>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Three steps. Any engine.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Copy the prompt", desc: "Every engine page has a Copy Prompt button. One click copies the full installation instructions." },
                  { step: "2", title: "Paste into Lovable", desc: "Open your Lovable project, paste the prompt into the chat. Lovable builds the engine into your project." },
                  { step: "3", title: "Configure and run", desc: "Fill in any API keys the engine needs. Toggle it on. It runs itself from there." },
                ].map((s) => (
                  <div key={s.step} className="border border-border p-6">
                    <span className="font-display text-3xl font-bold text-[#c8a961]/30 mb-3 block">{s.step}</span>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                    <p className="font-body text-sm text-foreground/50 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Engines Section Header */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fade}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                27 engines run your Lovable business.
              </h2>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                One prompt each.
              </h3>
              <p className="font-body text-foreground/50 text-base max-w-2xl mx-auto leading-relaxed">
                Each engine is a self-contained prompt you paste into your Lovable project. It installs its own tables, edge functions, and UI — then runs itself autonomously.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Engine Groups */}
        {engineGroups.map((group, gi) => (
          <section key={group.label} className="py-16 px-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fade}>
                <p className="font-body text-[14px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-2">{group.label}</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">{group.label}</h2>
                <p className="font-body text-foreground/65 text-sm mb-8">{group.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.engines.map((engine) => (
                    <Link
                      key={engine.name}
                      to={engine.href}
                      className="group border border-border p-5 flex items-start justify-between gap-4 hover:border-foreground/20 transition-colors"
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">
                          {engine.name}
                        </h3>
                        <p className="font-body text-[13px] text-foreground/65 leading-relaxed">{engine.tagline}</p>
                      </div>
                      <ArrowRight size={14} className="text-foreground/15 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Agents Section Header */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fade}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
                Engines run your Lovable business.
              </h2>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                Agents run your engines.
              </h3>
              <p className="font-body text-foreground/50 text-base max-w-2xl mx-auto leading-relaxed">
                Four autonomous agents that monitor, fix, build, and strategise across your entire engine stack — so every engine keeps improving without you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Agent Cards */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <p className="font-body text-[14px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-2">{agentGroup.label}</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">{agentGroup.label}</h2>
              <p className="font-body text-foreground/65 text-sm mb-8">{agentGroup.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agentGroup.agents.map((agent) => (
                  <Link
                    key={agent.name}
                    to={agent.href}
                    className="group border border-border p-5 flex items-start justify-between gap-4 hover:border-foreground/20 transition-colors"
                  >
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">
                        {agent.name}
                      </h3>
                      <p className="font-body text-[13px] text-foreground/65 leading-relaxed">{agent.tagline}</p>
                    </div>
                    <ArrowRight size={14} className="text-foreground/15 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-1" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resources */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/upgrade-guide"
                  className="group border border-border p-6 hover:border-foreground/20 transition-colors flex items-start gap-4"
                >
                  <BookOpen size={20} className="text-foreground/60 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">Upgrade Guide</h3>
                    <p className="font-body text-[13px] text-foreground/65 leading-relaxed">Step-by-step instructions for upgrading every engine to the latest prompt version.</p>
                  </div>
                </Link>
                <Link
                  to="/changelog"
                  className="group border border-border p-6 hover:border-foreground/20 transition-colors flex items-start gap-4"
                >
                  <FileText size={20} className="text-foreground/60 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">Changelog</h3>
                    <p className="font-body text-[13px] text-foreground/65 leading-relaxed">Every prompt release, version history, and what changed across all engines.</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">Pick an engine. Paste the prompt. Watch it run.</h2>
            <p className="font-body text-foreground/65 mb-8">Or install everything at once with Lazy Run.</p>
            <Link
              to="/lazy-run"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-display text-[13px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              Get Lazy Run
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
