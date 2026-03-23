import { motion } from "framer-motion";
import { Zap, Clock, FileText, BarChart3, Play, Pause, PenTool, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";

import unicornBg from "@/assets/unicorn-beach.png";

const TEMPLATE_URL = "#"; // TODO: replace with actual template URL

const steps = [
  { num: 1, title: "Clone the template", desc: "One click to fork it into your Lovable project." },
  { num: 2, title: "Answer five questions", desc: "Your niche, tone, audience, topics, and CTA — that's it." },
  { num: 3, title: "Add your Anthropic API key", desc: "Paste your key. Lazy Blogger handles the rest." },
  { num: 4, title: "Hit Start Publishing", desc: "Done. Posts start flowing. Walk away." },
];

const features = [
  { icon: FileText, label: "4 posts published per day" },
  { icon: Search, label: "SEO-optimised markdown" },
  { icon: PenTool, label: "Your brand voice and topics" },
  { icon: BarChart3, label: "Public blog at /blog" },
  { icon: Zap, label: "Owner dashboard at /dashboard" },
  { icon: Play, label: "Manual publish trigger" },
  { icon: Pause, label: "Pause and resume anytime" },
];

const faqs = [
  { q: "Do I need to know how to code?", a: "No. Clone the template, answer five questions, done." },
  { q: "What does it cost to run?", a: "You pay Anthropic directly — roughly $2–5 per month at 4 posts per day." },
  { q: "Will posts sound generic?", a: "You control tone, topics, and brand voice in setup." },
  { q: "Can I edit posts before they publish?", a: "Not yet — a drafts queue is coming in Pro." },
  { q: "What if I already have a blog?", a: "Lazy Blogger adds to it. It doesn't replace anything." },
];

const LazyBloggerPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Lazy Blogger — Autonomous Blog Publishing for Lovable Sites"
        description="Answer five questions. Lazy Blogger writes and publishes four SEO blog posts a day to your Lovable site — automatically, forever."
        url="/lazy-blogger"
      />
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar />
      

      <main className="relative z-10 pt-28 pb-32 px-6 md:px-12">
        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full px-5 py-2 mb-8">
              <Zap size={14} className="text-primary" />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                Built by Lazy Unicorn
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              Your Site.<br />
              Four Blog Posts a Day.<br />
              <span className="text-primary">Zero Effort.</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto leading-relaxed mb-10">
              Answer five questions about your business. Lazy Blogger writes and publishes four SEO blog posts a day to your Lovable site — automatically, forever, without you touching anything.
            </p>
            <a
              href={TEMPLATE_URL}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
            >
              Get the Template →
            </a>
          </motion.div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-5xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-transparent backdrop-blur-xl rounded-2xl border border-primary/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-display text-lg font-bold mb-4">
                  {step.num}
                </span>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="max-w-3xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            What you get
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-transparent backdrop-blur-xl rounded-3xl border border-primary/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <f.icon size={16} className="text-primary" />
                  </div>
                  <span className="font-body text-sm text-foreground/70">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <section className="max-w-3xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            Pricing
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-transparent backdrop-blur-xl rounded-3xl border border-primary/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <h3 className="font-display text-2xl font-extrabold text-foreground mb-1">Free</h3>
              <p className="font-body text-sm text-foreground/40 mb-6">Clone and self-host</p>
              <ul className="space-y-3 mb-8">
                {["Lovable template", "Self-hosted", "Bring your own Anthropic API key", "One-time clone"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="font-body text-sm text-foreground/60">{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href={TEMPLATE_URL}
                className="block text-center bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                Get the Template
              </a>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-transparent backdrop-blur-xl rounded-3xl border-2 border-yellow-500/50 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(234,179,8,0.1)]"
            >
              <div className="absolute -top-3 right-6 bg-yellow-500 text-background font-display text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-1 rounded-full">
                Coming Soon
              </div>
              <h3 className="font-display text-2xl font-extrabold text-foreground mb-1">
                Pro <span className="text-foreground/40 text-lg font-normal">$29/mo</span>
              </h3>
              <p className="font-body text-sm text-foreground/40 mb-6">Fully managed</p>
              <ul className="space-y-3 mb-8">
                {["Hosted — no setup needed", "No API key required", "Keyword targeting", "Performance dashboard"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">✓</span>
                    <span className="font-body text-sm text-foreground/60">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="block w-full text-center bg-foreground/10 text-foreground/30 font-display font-bold text-sm tracking-[0.08em] uppercase px-6 py-3 rounded-full cursor-not-allowed"
              >
                Coming Soon
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            FAQ
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-transparent backdrop-blur-xl rounded-2xl border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-display text-sm font-bold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-primary shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-40 pb-5" : "max-h-0"}`}
                >
                  <p className="font-body text-sm text-foreground/50 px-6 leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-transparent backdrop-blur-xl rounded-3xl border border-primary/20 px-8 py-16 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_30px_rgba(var(--primary-rgb),0.08)]"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Stop Writing.<br />
              <span className="text-primary">Start Compounding.</span>
            </h2>
            <a
              href={TEMPLATE_URL}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
            >
              Get the Template →
            </a>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyBloggerPage;
