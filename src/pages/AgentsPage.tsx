import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Rocket, Database, ListEnd, Clock, FileText, Search, Globe, Radar, Compass, Layers,
  ShoppingCart, Package, Printer, CreditCard, MessageSquare, Mail, Mic, MonitorPlay,
  Youtube, Code, GitBranch, BarChart3, Paintbrush, Lock, Calendar, LayoutDashboard,
  Bell, Send, Shield, Eye, Wrench, Hammer, Brain, RefreshCw, TrendingUp, UserCheck,
  ArrowRight, type LucideIcon,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

interface Agent {
  name: string;
  slug: string;
  tagline: string;
  icon: LucideIcon;
  category: string;
}

const agents: Agent[] = [
  // Platform
  { name: "Lazy Launch", slug: "/lazy-launch", tagline: "Autonomous project launcher", icon: Rocket, category: "Platform" },
  { name: "Lazy Cloud", slug: "/lazy-cloud", tagline: "Autonomous cloud hosting", icon: Database, category: "Platform" },
  { name: "Lazy Run", slug: "/lazy-run", tagline: "Autonomous everything", icon: Clock, category: "Platform" },
  { name: "Lazy Admin", slug: "/lazy-admin", tagline: "Autonomous ops control", icon: LayoutDashboard, category: "Platform" },
  { name: "Lazy Waitlist", slug: "/lazy-waitlist", tagline: "Autonomous pre-launch capture", icon: ListEnd, category: "Platform" },
  // Content
  { name: "Lazy Blogger", slug: "/lazy-blogger", tagline: "Autonomous blog publishing", icon: FileText, category: "Content" },
  { name: "Lazy SEO", slug: "/lazy-seo", tagline: "Autonomous keyword targeting", icon: Search, category: "Content" },
  { name: "Lazy GEO", slug: "/lazy-geo", tagline: "Autonomous AI citation farming", icon: Globe, category: "Content" },
  { name: "Lazy Crawl", slug: "/lazy-crawl", tagline: "Autonomous web scraping", icon: Radar, category: "Content" },
  { name: "Lazy Perplexity", slug: "/lazy-perplexity", tagline: "Autonomous AI research", icon: Compass, category: "Content" },
  { name: "Lazy Contentful", slug: "/lazy-contentful", tagline: "Autonomous CMS sync", icon: Layers, category: "Content" },
  // Commerce
  { name: "Lazy Store", slug: "/lazy-store", tagline: "Autonomous directory listings", icon: ShoppingCart, category: "Commerce" },
  { name: "Lazy Drop", slug: "/lazy-drop", tagline: "Autonomous product drops", icon: Package, category: "Commerce" },
  { name: "Lazy Print", slug: "/lazy-print", tagline: "Autonomous print-on-demand", icon: Printer, category: "Commerce" },
  { name: "Lazy Pay", slug: "/lazy-pay", tagline: "Autonomous payments", icon: CreditCard, category: "Commerce" },
  { name: "Lazy SMS", slug: "/lazy-sms", tagline: "Autonomous text campaigns", icon: MessageSquare, category: "Commerce" },
  { name: "Lazy Mail", slug: "/lazy-mail", tagline: "Autonomous email outreach", icon: Mail, category: "Commerce" },
  // Media
  { name: "Lazy Voice", slug: "/lazy-voice", tagline: "Autonomous podcast generation", icon: Mic, category: "Media" },
  { name: "Lazy Stream", slug: "/lazy-stream", tagline: "Autonomous stream content", icon: MonitorPlay, category: "Media" },
  { name: "Lazy YouTube", slug: "/lazy-youtube", tagline: "Autonomous video publishing", icon: Youtube, category: "Media" },
  { name: "Lazy Design", slug: "/lazy-design", tagline: "Autonomous visual creation", icon: Paintbrush, category: "Media" },
  // Dev
  { name: "Lazy GitHub", slug: "/lazy-github", tagline: "Autonomous repo management", icon: Code, category: "Dev" },
  { name: "Lazy GitLab", slug: "/lazy-gitlab", tagline: "Autonomous CI/CD pipelines", icon: GitBranch, category: "Dev" },
  { name: "Lazy Linear", slug: "/lazy-linear", tagline: "Autonomous issue tracking", icon: BarChart3, category: "Dev" },
  { name: "Lazy Supabase", slug: "/lazy-supabase", tagline: "Autonomous backend ops", icon: Database, category: "Dev" },
  { name: "Lazy Auth", slug: "/lazy-auth", tagline: "Autonomous authentication", icon: Lock, category: "Dev" },
  { name: "Lazy Granola", slug: "/lazy-granola", tagline: "Autonomous meeting intelligence", icon: Calendar, category: "Dev" },
  // Ops
  { name: "Lazy Alert", slug: "/lazy-alert", tagline: "Autonomous error alerting", icon: Bell, category: "Ops" },
  { name: "Lazy Telegram", slug: "/lazy-telegram", tagline: "Autonomous Telegram updates", icon: Send, category: "Ops" },
  { name: "Lazy Security", slug: "/lazy-security", tagline: "Autonomous vulnerability scanning", icon: Shield, category: "Ops" },
  { name: "Lazy Watch", slug: "/lazy-watch", tagline: "Autonomous error monitoring", icon: Eye, category: "Ops" },
  { name: "Lazy Fix", slug: "/lazy-fix", tagline: "Autonomous prompt improvement", icon: Wrench, category: "Ops" },
  { name: "Lazy Build", slug: "/lazy-build", tagline: "Autonomous agent creation", icon: Hammer, category: "Ops" },
  { name: "Lazy Intel", slug: "/lazy-intel", tagline: "Autonomous strategy briefs", icon: Brain, category: "Ops" },
  { name: "Lazy Repurpose", slug: "/lazy-repurpose", tagline: "Autonomous content recycling", icon: RefreshCw, category: "Ops" },
  { name: "Lazy Trend", slug: "/lazy-trend", tagline: "Autonomous trend detection", icon: TrendingUp, category: "Ops" },
  { name: "Lazy Churn", slug: "/lazy-churn", tagline: "Autonomous churn prevention", icon: UserCheck, category: "Ops" },
];

const categories = ["All", "Platform", "Content", "Commerce", "Media", "Dev", "Ops"];

export default function AgentsPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? agents : agents.filter((a) => a.category === active);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="All Agents — Lazy Unicorn"
        description="Browse all 34 Lazy agents that run your Lovable business autonomously. Content, commerce, media, dev, and ops — one prompt each."
      />
      <Navbar />

      <section className="px-6 md:px-12 pt-32 pb-16 max-w-5xl mx-auto">
        <motion.div variants={fade} initial="hidden" animate="show">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            Every agent.
          </h1>
          <p className="mt-6 font-body text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
            34 autonomous agents that run your entire Lovable business. One prompt each.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`font-body text-sm tracking-[0.12em] uppercase font-semibold px-4 py-2 border transition-colors ${
                active === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-foreground/30 text-foreground/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.name}
                variants={fade}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={agent.slug}
                  className="flex items-start gap-4 p-5 border border-border hover:border-foreground/20 bg-card transition-colors group"
                >
                  <span className="text-foreground/50 group-hover:text-foreground/80 transition-colors mt-0.5">
                    <Icon size={18} strokeWidth={1.5} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold tracking-wide">{agent.name}</p>
                    <p className="font-body text-xs text-foreground/45 mt-1 leading-relaxed">{agent.tagline}</p>
                  </div>
                  <ArrowRight size={14} className="text-foreground/20 group-hover:text-foreground/50 transition-colors mt-1 shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-24">
          <motion.h2 variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            All of them. One prompt.
          </motion.h2>
          <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
            <Link to="/lazy-run" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity">
              Install Lazy Run <ArrowRight size={14} />
            </Link>
            <Link to="/use-cases" className="inline-flex items-center gap-2 border border-border font-body text-sm font-semibold tracking-[0.1em] uppercase px-6 py-2.5 text-foreground/50 hover:border-foreground/30 hover:text-foreground transition-colors">
              View use cases
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
