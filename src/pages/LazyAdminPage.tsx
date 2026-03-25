import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  LayoutDashboard, Zap, Activity, AlertTriangle, Clock,
  Shield, Eye, ChevronDown, Check, Copy, Settings, Bell,
  BarChart3, Layers
} from "lucide-react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const LAZY_ADMIN_PROMPT = `[Lazy Admin Prompt — v0.0.1 — LazyUnicorn.ai]

Paste this prompt into your Lovable project to install the unified admin dashboard. It detects every installed Lazy engine automatically and builds a control panel around them.`;

const features = [
  { icon: <Zap size={18} />, title: "Auto-detection", desc: "Detects every installed Lazy engine by checking which settings tables exist in your database. Only shows panels for engines you actually have installed. Nothing to configure." },
  { icon: <Activity size={18} />, title: "Master status", desc: "One large dot tells you everything before you read a single number. Green: all running. Red: something needs attention. Gold: everything paused." },
  { icon: <BarChart3 size={18} />, title: "Engine status grid", desc: "One compact card per installed engine showing the most important metric, last run time, and a Run Now button. Never have to open a separate dashboard to trigger a manual run." },
  { icon: <Clock size={18} />, title: "Unified activity feed", desc: "Every action across every engine in the last 24 hours in one reverse-chronological feed. Filter by category or errors only." },
  { icon: <AlertTriangle size={18} />, title: "Error log", desc: "All errors from all engine error tables in one panel. Clear all with one click. Never miss a broken engine." },
  { icon: <Eye size={18} />, title: "Per-engine deep dives", desc: "Click any engine in the sidebar to see its full stats, queue, history, and settings. Edit settings without navigating away." },
  { icon: <Settings size={18} />, title: "API key management", desc: "All API keys in one Settings page with connection status badges and one-click test buttons for every service." },
  { icon: <Layers size={18} />, title: "Weekly schedule", desc: "A visual timeline showing what runs when across the entire week. The full autonomous schedule at a glance." },
];

const engineGroups = [
  { label: "Content Engines", color: "text-[#c8a961]", engines: ["Blogger", "SEO", "GEO", "Crawl", "Perplexity"] },
  { label: "Commerce Engines", color: "text-emerald-400", engines: ["Store", "Pay", "SMS"] },
  { label: "Media Engines", color: "text-blue-400", engines: ["Voice", "Stream"] },
  { label: "Developer Engines", color: "text-purple-400", engines: ["Code", "GitLab", "Linear"] },
  { label: "Channels", color: "text-foreground/50", engines: ["Alert", "Telegram", "Contentful", "Supabase"] },
  { label: "Security", color: "text-red-400", engines: ["Security"] },
];

const faqs = [
  { q: "Do I need all the Lazy engines installed first?", a: "No. Lazy Admin works with any combination. Install one engine and Lazy Admin shows one panel. Install all eighteen and it shows everything. It detects what is there." },
  { q: "Does it replace the individual setup pages?", a: "No. Each engine still has its own /lazy-[engine]-setup page for configuration. Lazy Admin is for monitoring and control, not initial setup." },
  { q: "Can I trigger engine runs from the dashboard?", a: "Yes. Every engine panel has a Run Now button that calls that engine's primary function immediately without leaving the dashboard." },
  { q: "Does it work if I do not use Lazy Run?", a: "Yes. Lazy Admin works independently of Lazy Run. Lazy Run provides the run_activity and run_performance tables that power some charts, but the dashboard detects and works without them." },
  { q: "What if I install a new engine after setting up Lazy Admin?", a: "Lazy Admin detects installed engines dynamically. Install a new engine and its panel appears in the sidebar automatically on the next page load. No prompt needed." },
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazyAdminPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_ADMIN_PROMPT);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

  return (
    <>
      <SEO title="Lazy Admin — One Dashboard for Every Engine" description="The unified control panel for your entire Lazy Stack. Paste one prompt. It detects every engine you have installed and shows everything in 60 seconds." />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="pt-36 pb-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fade}>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-6 block">Works with all Lazy engines</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                <span>One dashboard. Every engine. 60 seconds a day.</span>
              </h1>
              <p className="font-body text-foreground/50 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Lazy Admin is the unified control panel for your entire Lazy Stack. Paste one prompt. It detects every engine you have installed, builds a dashboard around them, and shows you everything your autonomous business did overnight — in one place, in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-display text-[11px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:opacity-90 transition-opacity"
                >
                  {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 border border-border text-foreground/50 font-display text-[11px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  See What It Shows
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6">Eighteen engines. Eighteen dashboards. Nobody has time for that.</h2>
              <p className="font-body text-foreground/50 leading-relaxed">
                Every Lazy engine ships with its own setup page. That is intentional — each engine installs independently into your project. But checking eighteen separate dashboards every morning is not autonomous. It is the opposite of lazy. Lazy Admin solves that by pulling everything into one place. One URL. One sidebar. One morning check.
              </p>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Paste one prompt. It figures out the rest.</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {["Install any Lazy engines into your Lovable project.", "Copy the Lazy Admin setup prompt from this page.", "Paste it into your existing Lovable project.", "Lazy Admin detects which engines are installed and builds the right dashboard automatically."].map((step, i) => (
                  <div key={i} className="border border-border p-5">
                    <span className="font-display text-2xl font-bold text-[#c8a961]/30 mb-3 block">{i + 1}</span>
                    <p className="font-body text-sm text-foreground/60">{step}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-foreground/30 text-sm text-center mt-4">No configuration. No setup questions.</p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-6 border-t border-border scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Everything your autonomous business did. In one view.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="border border-border p-5 flex gap-4">
                    <span className="text-[#c8a961]/50 flex-shrink-0 mt-0.5">{f.icon}</span>
                    <div>
                      <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1.5">{f.title}</h3>
                      <p className="font-body text-[13px] text-foreground/50 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 60-second check */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Open it. Read it. Close it. Done.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { time: "0–10 seconds", text: "Glance at the master status dot. Green means nothing needs attention. Red means something does." },
                  { time: "10–30 seconds", text: "Scan the engine status grid. Check post counts, revenue, citation rate, security score. See if any engine has an error badge." },
                  { time: "30–60 seconds", text: "Read the activity feed. See what published overnight. Check the error log. If clean, close the tab. If not, click the engine with the red dot and fix it." },
                ].map((col, i) => (
                  <div key={i} className="border border-border p-5">
                    <p className="font-display text-[10px] tracking-[0.15em] uppercase text-[#c8a961]/60 mb-3">{col.time}</p>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">{col.text}</p>
                  </div>
                ))}
              </div>
              <p className="font-body text-foreground/40 text-sm text-center mt-6 max-w-lg mx-auto">
                That is the entire daily management overhead of a fully autonomous Lovable business. Sixty seconds. Then you get on with building.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Works with */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10">One dashboard for the entire Lazy Stack.</h2>
              <div className="space-y-6">
                {engineGroups.map(g => (
                  <div key={g.label}>
                    <p className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/30 mb-2">{g.label}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {g.engines.map(e => (
                        <span key={e} className={`font-body text-[11px] tracking-[0.1em] px-3 py-1 border border-border ${g.color}`}>Lazy {e}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-body text-foreground/30 text-sm mt-8">Install any combination. Lazy Admin detects what is there and builds the right dashboard automatically.</p>
            </motion.div>
          </div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Lazy Admin setup prompt", "Self-hosted in your existing Lovable project", "Works with any combination of installed Lazy engines"]}
          proFeatures={["Hosted version", "Multi-project support", "Team access with role-based permissions", "Weekly email digest", "Mobile app"]}
          proPrice="$9"
          ctaButton={
            <button
              onClick={handleCopy}
              className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
            >
              {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
            </button>
          }
        />

        <LazyFaqSection faqs={faqs} />

        {/* Bottom CTA */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">Every engine. One dashboard. One minute a day.</h2>
            <p className="font-body text-foreground/50 mb-10 max-w-lg mx-auto">
              You built an autonomous business. Lazy Admin makes sure you can check on it without spending your morning opening twenty tabs.
            </p>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-display text-[11px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
            </button>
            <p className="font-body text-foreground/20 text-xs mt-4">Open your Lovable project, paste it into the chat. The dashboard builds itself around whatever engines you have installed.</p>
          </div>
        </section>
      </main>
    </>
  );
}
