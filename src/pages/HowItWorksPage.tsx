import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen, Cloud } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const agentGroups = [
  {
    label: "Lazy Unicorn",
    description: "Unified runtime for the entire stack.",
    agents: [
      { name: "Lazy Launch", tagline: "Launch your Lovable website", href: "/lazy-launch" },
      { name: "Lazy Waitlist", tagline: "Autonomous pre-launch capture", href: "/lazy-waitlist" },
      { name: "Lazy Run", tagline: "Autonomous everything", href: "/lazy-run" },
    ],
  },
  {
    label: "Lazy Content",
    description: "Autonomous content creation, SEO, and AI citation.",
    agents: [
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
    agents: [
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
    agents: [
      { name: "Lazy Voice", tagline: "Autonomous podcasts", href: "/lazy-voice" },
      { name: "Lazy Stream", tagline: "Autonomous stream content", href: "/lazy-stream" },
      { name: "Lazy YouTube", tagline: "Autonomous video content", href: "/lazy-youtube" },
    ],
  },
  {
    label: "Lazy Dev",
    description: "Turn commits, issues, and cycles into public content.",
    agents: [
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
    description: "Monitoring, alerts, security, autonomous improvement, and database observability.",
    agents: [
      { name: "Lazy Admin", tagline: "Autonomous ops control", href: "/lazy-admin" },
      { name: "Lazy Alert", tagline: "Autonomous Slack alerts", href: "/lazy-alert" },
      { name: "Lazy Telegram", tagline: "Autonomous Telegram updates", href: "/lazy-telegram" },
      { name: "Lazy Supabase", tagline: "Autonomous database reports", href: "/lazy-supabase" },
      { name: "Lazy Security", tagline: "Autonomous pentesting", href: "/lazy-security" },
      { name: "Lazy Watch", tagline: "Monitors errors and opens GitHub issues", href: "/lazy-watch" },
      { name: "Lazy Fix", tagline: "Reads performance data and opens PRs with prompt improvements", href: "/lazy-fix" },
      { name: "Lazy Build", tagline: "Writes complete new agent prompts from a brief", href: "/lazy-build" },
      { name: "Lazy Intel", tagline: "Reads all your data and fills your SEO and GEO queues", href: "/lazy-intel" },
      { name: "Lazy Repurpose", tagline: "Turns top posts into Twitter threads, LinkedIn posts, newsletters, and video scripts", href: "/lazy-repurpose" },
      { name: "Lazy Trend", tagline: "Scans for trending topics every 6 hours and queues urgent content", href: "/lazy-trend" },
      { name: "Lazy Churn", tagline: "Monitors subscribers daily and sends re-engagement before cancellation", href: "/lazy-churn" },
    ],
  },
];

const heroHeading = { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95 as number, letterSpacing: "-0.01em" };
const sectionHeading = { fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" };

export default function HowItWorksPage() {
  return (
    <>
      <SEO
        title="How It Works — Lazy Unicorn"
        description="Every Lazy agent explained. See how autonomous content, commerce, code, messaging, and security agents work together to run your business."
        url="/how-it-works"
      />
      <Navbar />
      <main className="min-h-screen" className="bg-background text-foreground">
        {/* Hero */}
        <section className="px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <span className="font-body text-[14px] tracking-[0.2em] uppercase mb-6 block" style={{ color: "#c8a961", opacity: 0.6 }}>
                The autonomous layer for <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">Lovable</a>
              </span>
              <h1 style={heroHeading}>
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">Lovable</a> gave everyone a website. Lazy Unicorn makes it work while you sleep.
              </h1>
              <p className="mt-6 font-body text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
                Every agent is a self-contained prompt you paste into your{" "}
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">Lovable</a>{" "}
                project. Each one installs its own database tables, edge functions, and UI — then runs itself autonomously. Or let Lazy Cloud manage everything for you.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Two paths */}
        <section className="px-6 md:px-12 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 style={sectionHeading} className="font-bold mb-10">Two ways to run your stack.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-white/10">
                <div className="border-b md:border-b-0 md:border-r border-white/10 p-6 md:p-8">
                  <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "#f0ead6" }}>Self-hosted (free)</h3>
                  <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "#f0ead6", opacity: 0.5 }}>
                    Copy any agent prompt, paste it into your Lovable project, configure, and run. You manage your own API keys, updates, and monitoring. Always free, always open source.
                  </p>
                  <div className="space-y-2">
                    {["Copy prompt from agent page", "Paste into Lovable project", "Add API keys and configure", "You manage updates manually"].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-display text-xs font-bold mt-0.5" style={{ color: "#c8a961", opacity: 0.4 }}>{i + 1}</span>
                        <p className="font-body text-[13px]" style={{ color: "#f0ead6", opacity: 0.5 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-6 md:p-8" style={{ backgroundColor: "rgba(200,169,97,0.03)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud size={16} style={{ color: "#c8a961" }} />
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase" style={{ color: "#c8a961" }}>Lazy Cloud (managed)</h3>
                  </div>
                  <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "#f0ead6", opacity: 0.5 }}>
                    Lazy Cloud runs your entire agent stack for you — automatic prompt updates, volume API pricing, 24/7 monitoring, daily backups, and breaking-change fixes. You paste the prompts once. We handle everything after.
                  </p>
                  <div className="space-y-2">
                    {["Automatic prompt updates overnight", "Volume API keys included", "24/7 monitoring with Lazy Watch", "Breaking changes handled for you"].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-display text-xs font-bold mt-0.5" style={{ color: "#c8a961", opacity: 0.6 }}>✓</span>
                        <p className="font-body text-[13px]" style={{ color: "#f0ead6", opacity: 0.5 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                  <Link to="/lazy-cloud" className="inline-flex items-center gap-2 mt-4 font-body text-[12px] tracking-[0.12em] uppercase font-semibold hover:opacity-80 transition-opacity" style={{ color: "#c8a961" }}>
                    Learn more about Lazy Cloud <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Steps (self-hosted) */}
        <section className="px-6 md:px-12 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 style={sectionHeading} className="font-bold mb-10">Self-hosted: three steps, any agent.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Copy the prompt", desc: "Every agent page has a Copy Prompt button. One click copies the full installation instructions." },
                  { step: "2", title: "Paste into Lovable", desc: "Open your Lovable project, paste the prompt into the chat. Lovable builds the agent into your project." },
                  { step: "3", title: "Configure and run", desc: "Fill in any API keys the agent needs. Toggle it on. It runs itself from there." },
                ].map((s) => (
                  <div key={s.step} className="border border-white/10 p-6">
                    <span className="font-display text-3xl font-bold mb-3 block" style={{ color: "#c8a961", opacity: 0.3 }}>{s.step}</span>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "#f0ead6" }}>{s.title}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Agents Section Header */}
        <section className="px-6 md:px-12 py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 style={heroHeading}>
                35 agents run your Lovable business.
              </h2>
              <h3 style={{ ...heroHeading, marginTop: "0.1em" }}>
                One prompt each.
              </h3>
              <p className="mt-6 font-body text-base max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
                Each agent is a self-contained prompt you paste into your Lovable project. It installs its own tables, edge functions, and UI — then runs itself autonomously.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Agent Groups */}
        {agentGroups.map((group) => (
          <section key={group.label} className="py-16 px-6 md:px-12 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fade}>
                <p className="font-body text-[14px] tracking-[0.2em] uppercase mb-2" style={{ color: "#c8a961", opacity: 0.6 }}>{group.label}</p>
                <h2 style={sectionHeading} className="font-bold mb-2">{group.label}</h2>
                <p className="font-body text-sm mb-8" style={{ color: "#f0ead6", opacity: 0.5 }}>{group.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.agents.map((agent) => (
                    <Link
                      key={agent.name}
                      to={agent.href}
                      className="group border border-white/10 p-5 flex items-start justify-between gap-4 hover:border-white/25 transition-colors"
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1 transition-colors" style={{ color: "#f0ead6" }}>
                          <span className="group-hover:text-[#c8a961] transition-colors">{agent.name}</span>
                        </h3>
                        <p className="font-body text-[13px] leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>{agent.tagline}</p>
                      </div>
                      <ArrowRight size={14} className="flex-shrink-0 mt-1 opacity-15 group-hover:opacity-50 transition-opacity" style={{ color: "#f0ead6" }} />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Resources */}
        <section className="py-20 px-6 md:px-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 style={sectionHeading} className="font-bold mb-8">Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/upgrade-guide"
                  className="group border border-white/10 p-6 hover:border-white/25 transition-colors flex items-start gap-4"
                >
                  <BookOpen size={20} className="flex-shrink-0 mt-0.5 opacity-50" style={{ color: "#f0ead6" }} />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors" style={{ color: "#f0ead6" }}>Upgrade Guide</h3>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>Step-by-step instructions for upgrading every agent to the latest prompt version.</p>
                  </div>
                </Link>
                <Link
                  to="/changelog"
                  className="group border border-white/10 p-6 hover:border-white/25 transition-colors flex items-start gap-4"
                >
                  <FileText size={20} className="flex-shrink-0 mt-0.5 opacity-50" style={{ color: "#f0ead6" }} />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors" style={{ color: "#f0ead6" }}>Changelog</h3>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>Every prompt release, version history, and what changed across all agents.</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 md:px-12 py-24 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
          <h2 style={heroHeading}>Pick an agent. Paste the prompt. Watch it run.</h2>
          <p className="mt-6 font-body text-base leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>Or install everything at once with Lazy Run. Want it fully managed? Try Lazy Cloud.</p>
          <div className="flex flex-wrap items-start gap-4 mt-8">
            <Link
              to="/lazy-run"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-display text-sm tracking-[0.08em] uppercase font-bold px-8 py-4 hover:opacity-90 transition-opacity"
            >
              Get Lazy Run
            </Link>
            <Link
              to="/lazy-cloud"
              className="inline-flex items-center justify-center gap-2 font-display text-sm tracking-[0.08em] uppercase font-bold px-8 py-4 border border-white/15 hover:border-white/30 transition-colors"
              style={{ color: "#f0ead6" }}
            >
              Explore Lazy Cloud
            </Link>
          </div>
          </div>
        </section>
      </main>
    </>
  );
}
