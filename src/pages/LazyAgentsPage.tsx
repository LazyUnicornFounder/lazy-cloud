import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, Wrench, HardHat, BarChart3, Github, Key, Bot } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const agents = [
  { emoji: "👁️", name: "Lazy Watch", tagline: "Your stack watches itself.", desc: "Monitors every engine error table hourly and opens GitHub issues automatically.", href: "/lazy-watch", icon: Eye },
  { emoji: "🔧", name: "Lazy Fix", tagline: "Your prompts improve while you sleep.", desc: "Reads performance data every Sunday and opens PRs with targeted prompt improvements.", href: "/lazy-fix", icon: Wrench },
  { emoji: "🏗️", name: "Lazy Build", tagline: "Describe it. Claude builds it.", desc: "Writes complete new engine prompts from a one-paragraph brief and opens a draft GitHub PR.", href: "/lazy-build", icon: HardHat },
  { emoji: "📊", name: "Lazy Intel", tagline: "Your strategy writes itself.", desc: "Reads all your engine data every Monday and fills your SEO and GEO queues automatically.", href: "/lazy-intel", icon: BarChart3 },
];

const prerequisites = [
  { icon: Github, title: "GitHub repo", desc: "Your LazyUnicorn prompts live in a GitHub repo. The agents read and write to it. You need GITHUB_TOKEN as a Supabase secret with repo scope." },
  { icon: Bot, title: "At least 3 Lazy engines installed", desc: "Agents need performance data to analyse. Install Lazy Blogger, Lazy SEO, and Lazy GEO as a minimum before running Lazy Fix or Lazy Intel." },
  { icon: Key, title: "ANTHROPIC_API_KEY", desc: "All four agents use Claude for diagnosis, writing, and strategy. Set this as a Supabase secret if not already done." },
];

export default function LazyAgentsPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_agents_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Agents — Autonomous Stack Intelligence | Lazy Unicorn"
        description="Four autonomous agents that monitor your engines, fix broken prompts, improve performance, and write new engines — running inside your Lovable project."
        url="/lazy-agents"
        keywords="autonomous agents, self-improving stack, Lovable agents, prompt improvement, error monitoring"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-32 md:pb-40" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="font-display text-[11px] tracking-[0.25em] uppercase text-foreground/40 font-bold mb-6">Lazy Agents</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Engines run your Lovable business.<br />Agents run your engines.
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                The Lazy Stack automates your content, commerce, and operations. The Lazy Agents automate the stack itself — monitoring for errors, improving prompts, writing new engines, and generating your weekly strategy. Your business runs. Your stack improves. You do less every week.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Agent cards */}
        <section className="max-w-4xl mx-auto px-6 mt-8 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:odd:border-r last:border-b-0 sm:[&:nth-child(3)]:border-b-0 border-border bg-card p-8 flex flex-col"
              >
                <p className="text-2xl leading-[1.2] mb-3 pt-1">{agent.emoji}</p>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{agent.name}</h3>
                <p className="font-body text-sm font-semibold text-[#c8a961] mb-2">{agent.tagline}</p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed mb-6 flex-1">{agent.desc}</p>
                <Link
                  to={agent.href}
                  className="inline-flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase font-bold text-foreground/60 hover:text-foreground transition-colors"
                >
                  View Product →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How agents are different */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Engines automate tasks. Agents automate your stack.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-b sm:border-b-0 sm:border-r border-border bg-card p-8">
              <h3 className="font-display text-sm tracking-[0.15em] uppercase font-bold text-foreground/65 mb-4">Lazy Engines</h3>
              <ul className="font-body text-sm text-foreground/50 leading-relaxed space-y-2">
                <li>Run on a schedule.</li>
                <li>Publish content, process orders, send messages.</li>
                <li>Do one specific thing well.</li>
                <li>You paste the prompt and they go.</li>
              </ul>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.08 }} className="bg-card p-8">
              <h3 className="font-display text-sm tracking-[0.15em] uppercase font-bold text-[#c8a961] mb-4">Lazy Agents</h3>
              <ul className="font-body text-sm text-foreground/50 leading-relaxed space-y-2">
                <li>Watch the engines.</li>
                <li>Fix what breaks.</li>
                <li>Improve what underperforms.</li>
                <li>Write new engines when you need them.</li>
                <li className="text-foreground/70 font-semibold">Compound over time.</li>
              </ul>
            </motion.div>
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50 max-w-xl mx-auto leading-relaxed">
            Install the engines first. Then install the agents. The agents need data to work with — the more engines running, the smarter the agents get.
          </motion.p>
        </section>

        {/* Prerequisites */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            What you need before installing agents
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {prerequisites.map((req, i) => (
              <motion.div
                key={req.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center"
              >
                <req.icon size={18} className="text-[#c8a961] mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{req.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{req.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-body text-sm text-foreground/40 mb-6">Pick an agent and get started.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {agents.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className="inline-flex items-center gap-2 font-display text-xs tracking-[0.12em] uppercase font-bold px-5 py-3 border border-border text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {a.emoji} {a.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
