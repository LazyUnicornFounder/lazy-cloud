import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Check, Brain, Rocket, Clock, Eye } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import FloatingProductCTA from "@/components/FloatingProductCTA";
import unicornBg from "@/assets/unicorn-beach.png";
import logoPolsia from "@/assets/logo-polsia.jpg";
import screenshotPolsia from "@/assets/screenshot-polsia.jpg";

const features = [
  "Fully autonomous company operations — 24/7",
  "AI plans, codes, and ships your product",
  "Automated marketing & content promotion",
  "Self-improving agents that adapt to real data",
  "Live dashboard to watch 5,000+ companies in action",
  "No credit card required to get started",
  "Continuous deployment & iteration",
  "Works while you sleep — literally",
];

const howItWorks = [
  {
    icon: Brain,
    title: "Polsia thinks",
    desc: "Describe what you want to build. Polsia's AI analyzes the opportunity, creates a plan, and starts executing autonomously.",
  },
  {
    icon: Rocket,
    title: "Polsia builds",
    desc: "Code gets written, landing pages get deployed, marketing campaigns launch — all without human intervention.",
  },
  {
    icon: Clock,
    title: "Polsia runs 24/7",
    desc: "Your company operates continuously. Polsia adapts to data, improves itself, and keeps your business growing while you sleep.",
  },
];

const PolsiaPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Polsia — AI That Runs Your Company While You Sleep | Lazy Unicorn"
        description="Polsia thinks, builds, and markets your projects autonomously. It plans, codes, and promotes your ideas 24/7, adapting and improving without human intervention."
        url="/company/polsia"
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
                src={logoPolsia}
                alt="Polsia logo"
                className="w-16 h-16 rounded-2xl object-cover border border-foreground/10 shrink-0"
              />
              <div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95]">
                  Polsia
                </h1>
                <p className="font-body text-lg text-foreground/50 mt-2 leading-relaxed">
                  AI that runs your company while you sleep.
                </p>
              </div>
            </div>
            <p className="font-body text-base text-foreground/60 leading-relaxed mb-6">
              Polsia thinks, builds, and markets your projects autonomously. It plans, codes, and promotes your ideas continuously — operating 24/7, adapting to data, and improving itself without human intervention.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://polsia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Get started free <ExternalLink size={12} />
              </a>
              <a
                href="https://polsia.com/live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-[11px] tracking-[0.15em] uppercase border border-foreground/20 text-foreground/60 hover:text-primary hover:border-primary/40 px-6 py-2.5 rounded-full font-semibold transition-colors"
              >
                <Eye size={12} /> Watch live ↗
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
            <img src={screenshotPolsia} alt="Polsia platform interface" className="w-full object-cover" />
          </motion.div>

          {/* Live stat banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary/10 backdrop-blur-2xl rounded-2xl px-8 py-6 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-8 text-center"
          >
            <p className="font-display text-3xl md:text-4xl font-extrabold text-primary">5,000+</p>
            <p className="font-body text-sm text-foreground/50 mt-1">companies running autonomously on Polsia right now</p>
            <a
              href="https://polsia.com/live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 font-body text-[10px] tracking-[0.15em] uppercase text-primary/70 hover:text-primary transition-colors"
            >
              Watch live ↗
            </a>
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

          {/* Pricing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-8"
          >
            <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
              Pricing
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <p className="font-display text-2xl font-extrabold text-foreground">Free to start</p>
              <p className="font-body text-sm text-foreground/50 mt-1 leading-relaxed">
                No credit card required. Sign up and let Polsia start building your company today. Pricing scales as you grow.
              </p>
              <a
                href="https://polsia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Get started <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-3xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <p className="font-display text-lg font-bold text-foreground/60 mb-4">Links</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://polsia.com" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Website ↗
              </a>
              <a href="https://polsia.com/live" target="_blank" rel="noopener noreferrer" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Live Dashboard ↗
              </a>
              <a href="mailto:contact@polsia.com" className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Contact ↗
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

export default PolsiaPage;
