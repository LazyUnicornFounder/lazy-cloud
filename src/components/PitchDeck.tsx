import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: "title",
    label: "01",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary mb-6">
          Investor Deck · 2026
        </p>
        <h2 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[0.95]">
          Lazy
          <br />
          Unicorn
        </h2>
        <div className="w-16 h-px bg-primary/40 my-6" />
        <p className="font-body text-sm md:text-base text-foreground/50 max-w-sm leading-relaxed">
          The autonomous company directory.
          <br />
          Start, run & scale — agents handle everything.
        </p>
      </div>
    ),
  },
  {
    id: "problem",
    label: "02",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          The Problem
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-6">
          Building a startup
          <br />
          still requires <span className="text-destructive">you</span>.
        </h3>
        <div className="space-y-3 max-w-md">
          {["90% of founders burn out before product-market fit", "Hiring is slow, expensive, and risky at seed stage", "Operational overhead kills more startups than bad ideas"].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
              <p className="font-body text-sm text-foreground/60 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "solution",
    label: "03",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          The Solution
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-6">
          Autonomous capitalism
          <br />
          <span className="text-primary">for the rest of us.</span>
        </h3>
        <p className="font-body text-sm md:text-base text-foreground/50 max-w-lg leading-relaxed mb-6">
          Lazy Unicorn curates and surfaces the best autonomous company builders — AI platforms that let anyone launch, operate, and scale a business with zero employees.
        </p>
        <div className="grid grid-cols-3 gap-4 max-w-lg">
          {[
            { num: "1", label: "Discover" },
            { num: "2", label: "Launch" },
            { num: "3", label: "Scale" },
          ].map((step) => (
            <div key={step.num} className="bg-primary/10 rounded-xl p-4 text-center border border-primary/20">
              <p className="font-display text-2xl font-extrabold text-primary">{step.num}</p>
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50 mt-1">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "market",
    label: "04",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Market Opportunity
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          $4.4T addressable market.
        </h3>
        <div className="grid grid-cols-2 gap-6 max-w-lg">
          {[
            { value: "$4.4T", label: "Global SMB software spend by 2028" },
            { value: "72M", label: "New businesses created annually" },
            { value: "85%", label: "Want to automate operations" },
            { value: "10x", label: "AI agent market CAGR" },
          ].map((stat) => (
            <div key={stat.label} className="border-l-2 border-primary/30 pl-4">
              <p className="font-display text-2xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="font-body text-[11px] text-foreground/40 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "model",
    label: "05",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Business Model
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          Three revenue streams.
        </h3>
        <div className="space-y-4 max-w-lg">
          {[
            { title: "Featured Listings", desc: "Premium placement for autonomous builders — recurring SaaS model.", tag: "B2B" },
            { title: "Affiliate Revenue", desc: "Commission on every user who signs up through our directory.", tag: "Performance" },
            { title: "Enterprise API", desc: "Programmatic access to our curated dataset for VCs and accelerators.", tag: "Data" },
          ].map((item) => (
            <div key={item.title} className="bg-secondary/50 rounded-xl p-5 border border-border flex items-start gap-4">
              <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0 border border-primary/20">
                {item.tag}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{item.title}</p>
                <p className="font-body text-xs text-foreground/40 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "traction",
    label: "06",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Early Traction
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          Growing fast.
        </h3>
        <div className="grid grid-cols-3 gap-6 max-w-lg mb-8">
          {[
            { value: "50+", label: "Builders listed" },
            { value: "12K", label: "Monthly visitors" },
            { value: "3.2K", label: "Newsletter subs" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-extrabold text-primary">{stat.value}</p>
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 bg-primary/5 rounded-xl px-5 py-3 border border-primary/10 max-w-lg">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="font-body text-xs text-foreground/50">
            Organic growth — zero paid acquisition to date
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "ask",
    label: "07",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-6">
          The Ask
        </p>
        <h3 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-4">
          $1.5M Seed Round
        </h3>
        <div className="w-16 h-px bg-primary/40 my-4" />
        <p className="font-body text-sm text-foreground/50 max-w-md leading-relaxed mb-8">
          To expand the directory, build the enterprise API, and become the definitive platform for autonomous capitalism.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-sm">
          {[
            { pct: "40%", label: "Product" },
            { pct: "35%", label: "Growth" },
            { pct: "25%", label: "Ops" },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-display text-xl font-extrabold text-primary">{item.pct}</p>
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/40 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-primary/60 mt-10 tracking-[0.15em]">
          hello@lazyunicorn.ai
        </p>
      </div>
    ),
  },
];

const PitchDeck = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c > 0 ? c - 1 : c));
  const next = () => setCurrent((c) => (c < slides.length - 1 ? c + 1 : c));

  return (
    <section id="pitch" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-6 bg-background/60 backdrop-blur-2xl rounded-t-2xl px-8 pt-8 pb-4 border border-b-0 border-foreground/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        >
          Pitch Deck
        </motion.p>

        {/* Slide viewport */}
        <div className="bg-background/60 backdrop-blur-2xl rounded-b-3xl rounded-tr-3xl border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="relative aspect-[16/10] md:aspect-[16/9]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0"
              >
                {slides[current].content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-foreground/5">
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/30 mr-3">
                {slides[current].label} / {String(slides.length).padStart(2, "0")}
              </span>
              <button
                onClick={prev}
                disabled={current === 0}
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 disabled:opacity-20 transition-all"
              >
                <ChevronLeft className="w-4 h-4 text-foreground/60" />
              </button>
              <button
                onClick={next}
                disabled={current === slides.length - 1}
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 disabled:opacity-20 transition-all"
              >
                <ChevronRight className="w-4 h-4 text-foreground/60" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PitchDeck;
