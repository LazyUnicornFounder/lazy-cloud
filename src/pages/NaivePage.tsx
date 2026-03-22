import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check, Zap, Bot, BarChart3, Plug, DollarSign } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import FloatingProductCTA from "@/components/FloatingProductCTA";
import unicornBg from "@/assets/unicorn-beach.png";
import logoNaive from "@/assets/logo-naive.jpg";
import screenshotNaive from "@/assets/screenshot-naive.jpg";

const features = [
  "Autonomous AI employees that learn & improve daily",
  "Launch a full company from a single chat prompt",
  "Outbound sales automation with AI SDRs",
  "SEO content engine on autopilot",
  "LinkedIn ghostwriting & scheduling",
  "Landing page deployment & A/B testing",
  "30+ integrations — Slack, Stripe, HubSpot, Shopify, and more",
  "Real-time activity feed & revenue dashboard",
  "Team workspace with role-based access",
  "Custom domains & white-label options",
];

const pricingTiers = [
  {
    name: "Free Trial",
    price: "Free",
    period: "7 days",
    description: "Try Naïve free. No card required.",
    highlights: ["20 free credits", "1 business", "Unlimited collaborators", "AI agents"],
  },
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for side projects and early experiments.",
    highlights: ["50 monthly credits", "Custom domains", "Remove Naïve badge", "Credit rollovers"],
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Stronger compute. For serious builders.",
    highlights: ["200 monthly credits", "Team workspace", "SSO & role-based access", "Design templates"],
    featured: true,
  },
  {
    name: "Pay as you go",
    price: "$0.50",
    period: "/credit",
    description: "Scale beyond your plan.",
    highlights: ["Flexible credits", "Scale on demand", "No monthly cap", "All Pro features"],
  },
];

const howItWorks = [
  {
    icon: Zap,
    title: "Start with an idea",
    desc: "Describe the company you want to build. Naïve creates your HQ, hires AI agents, and launches your first campaigns — all from a single chat.",
  },
  {
    icon: Bot,
    title: "Watch it come to life",
    desc: "Your agents deploy landing pages, send outbound, publish SEO content, and post on LinkedIn — all autonomously from one dashboard.",
  },
  {
    icon: BarChart3,
    title: "Grow on autopilot",
    desc: "Every agent measures results, learns what works, and improves itself. Your company compounds — open rates go up, conversions climb, revenue grows.",
  },
];

const NaivePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Naïve — Build & Run Your Company with AI Agents | Lazy Unicorn"
        description="Naïve lets you describe your company and autonomous AI employees build, sell, and operate it for you. Explore features, pricing, and get started."
        url="/company/naive"
      />
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="home" />
      <FloatingProductCTA />

      <main className="relative z-10 pt-28 pb-32 px-6 md:px-12">
        <div className="max-w-3xl">
          <Link
            to="/#directory"
            className="inline-flex items-center gap-1.5 font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to directory
          </Link>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <div className="flex items-start gap-5 mb-6">
              <img
                src={logoNaive}
                alt="Naïve logo"
                className="w-16 h-16 rounded-2xl object-cover border border-foreground/10 shrink-0"
              />
              <div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
                  Naïve
                </h1>
                <p className="font-body text-lg text-foreground/50 mt-2 leading-relaxed">
                  Describe your company. Naïve builds it.
                </p>
              </div>
            </div>
            <p className="font-body text-base text-foreground/60 leading-relaxed mb-6">
              Create & run your company with autonomous employees. Naïve gives you a team of AI agents that recursively learn over time, adapting to your data and getting better at running your business every single day.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://app.usenaive.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Get started free <ExternalLink size={12} />
              </a>
              <a
                href="https://usenaive.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.15em] uppercase border border-foreground/20 text-foreground/60 hover:text-primary hover:border-primary/40 px-6 py-2.5 rounded-full font-semibold transition-colors"
              >
                Visit website <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>

          {/* Screenshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <img src={screenshotNaive} alt="Naïve platform dashboard" className="w-full object-cover" />
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-8">
              How it works
            </p>
            <div className="space-y-6">
              {howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <step.icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground mb-1">{step.title}</p>
                    <p className="font-body text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-6">
              Features
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check size={16} className="text-primary mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/60">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Integrations callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Plug size={20} className="text-primary" />
              <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60">
                Integrations
              </p>
            </div>
            <p className="font-body text-sm text-foreground/50 leading-relaxed mb-4">
              Naïve connects seamlessly with your entire stack — CRMs, analytics, design tools, databases, and more.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Slack", "Stripe", "HubSpot", "Shopify", "Gmail", "GitHub", "Figma", "Notion", "Linear", "Vercel", "WordPress", "Discord", "Zoom", "Google Analytics", "Supabase", "SendGrid"].map((name) => (
                <span
                  key={name}
                  className="font-body text-[10px] tracking-[0.1em] uppercase text-foreground/40 border border-foreground/10 rounded-full px-3 py-1"
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={20} className="text-primary" />
              <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60">
                Pricing
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-5 ${
                    tier.featured
                      ? "border-primary/30 bg-primary/5"
                      : "border-foreground/10 bg-background/30"
                  }`}
                >
                  <p className="font-display text-sm font-bold text-foreground/70 mb-1">{tier.name}</p>
                  <p className="font-display text-2xl font-extrabold text-foreground">
                    {tier.price}
                    <span className="text-sm font-normal text-foreground/40">{tier.period}</span>
                  </p>
                  <p className="font-body text-xs text-foreground/40 mt-1 mb-3">{tier.description}</p>
                  <ul className="space-y-1.5">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2">
                        <Check size={12} className="text-primary shrink-0" />
                        <span className="font-body text-xs text-foreground/50">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <a
              href="https://app.usenaive.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-6 font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Start free trial <ExternalLink size={12} />
            </a>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <p className="font-display text-lg font-bold text-foreground/60 mb-4">Links</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://usenaive.ai" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Website ↗
              </a>
              <a href="https://app.usenaive.ai" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Launch App ↗
              </a>
              <a href="https://x.com/usenaive" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                𝕏 ↗
              </a>
            </div>
          </motion.div>

          <Link
            to="/#directory"
            className="inline-block mt-8 font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-6 py-2.5"
          >
            ← Discover other products
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NaivePage;
