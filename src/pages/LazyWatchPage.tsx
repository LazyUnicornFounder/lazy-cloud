import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Eye, Search, FileText, Bell } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Watch Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous error monitoring agent called Lazy Watch to this project. It reads every Lazy engine error table in your Supabase project every hour, diagnoses issues using Claude, opens GitHub issues with full diagnosis and fix recommendations, and pings Slack — all automatically with no manual input required after setup.

Required secrets:
- ANTHROPIC_API_KEY — for Claude diagnosis calls
- GITHUB_TOKEN — personal access token with repo scope from github.com/settings/tokens
- GITHUB_REPO — your prompts repo in format username/reponame
- SLACK_WEBHOOK_URL — optional, from Lazy Alert settings

---

1. Database

Create these Supabase tables with RLS enabled:

watch_settings: id (uuid, primary key, default gen_random_uuid()), github_repo (text), error_threshold (integer, default 3), slack_webhook_url (text), is_running (boolean, default true), setup_complete (boolean, default false), prompt_version (text, nullable), created_at (timestamptz, default now())

watch_runs: id (uuid, primary key, default gen_random_uuid()), status (text — one of running, completed, failed), engines_checked (integer, default 0), issues_opened (integer, default 0), summary (text), started_at (timestamptz, default now()), completed_at (timestamptz), created_at (timestamptz, default now())

watch_issues: id (uuid, primary key, default gen_random_uuid()), engine_name (text), issue_title (text), issue_url (text), severity (text — one of critical, high, medium), error_count (integer), resolved (boolean, default false), created_at (timestamptz, default now())

watch_errors: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now())`;

const steps = [
  { icon: "🔍", title: "Scan", desc: "Every hour Lazy Watch queries all 26 Lazy engine error tables in your Supabase project." },
  { icon: "🧠", title: "Diagnose", desc: "When errors hit your threshold Claude reads the logs, identifies the root cause, and writes a fix recommendation." },
  { icon: "📋", title: "Issue", desc: "A GitHub issue opens automatically with the full diagnosis, the affected function, numbered fix steps, and @claude tagged to investigate." },
  { icon: "📣", title: "Alert", desc: "A Slack notification fires with the engine name, error count, severity level, and a direct link to the issue." },
];

const engines = [
  "Lazy Blogger", "Lazy SEO", "Lazy GEO", "Lazy Crawl", "Lazy Perplexity", "Lazy Contentful",
  "Lazy Store", "Lazy Drop", "Lazy Print", "Lazy Pay", "Lazy SMS", "Lazy Mail",
  "Lazy Voice", "Lazy Stream", "Lazy YouTube",
  "Lazy GitHub", "Lazy GitLab", "Lazy Linear", "Lazy Design", "Lazy Auth", "Lazy Granola",
  "Lazy Admin", "Lazy Alert", "Lazy Telegram", "Lazy Supabase", "Lazy Security",
];

const faqs = [
  { q: "What counts as an error?", a: "Any row written to an engine's _errors table. Lazy engines log to their error table when an edge function fails, an API call returns an error, or content generation fails." },
  { q: "Will it spam me with GitHub issues?", a: "No. Lazy Watch checks for existing open issues before creating a new one. If the issue is already open it skips it. Set your error threshold higher (5 or 10) if you want less noise." },
  { q: "What if my GitHub token expires?", a: "The watch-monitor function will log an error to watch_errors and continue checking other engines. You'll see it in the admin error log." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-watch" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyWatchPage() {
  const { prompt } = useCurrentPrompt("lazy-watch");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_watch_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Watch — Autonomous Error Monitor | Lazy Unicorn" description="Monitors every Lazy engine error table hourly, diagnoses issues with Claude, and opens GitHub issues automatically." url="/lazy-watch" keywords="error monitoring, autonomous monitoring, Lovable error detection, GitHub issues automation" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-watch" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Your stack watches itself.
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy Watch reads every Lazy engine error table every hour. When errors spike it sends them to Claude for diagnosis, opens a GitHub issue with a specific fix recommendation, tags @claude to investigate, and pings your Slack. You find out about broken engines before your users do.
              </p>
              <div className="flex items-center gap-3 mt-4 mb-8">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Agents 👁️</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-3xl mx-auto px-6 mb-20 mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            A broken engine is silent until it isn't.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              "🔕 Lazy Blogger stops publishing. You don't notice for three days. Your SEO compounds in reverse.",
              "🔕 An edge function starts failing at 2am. You wake up to 47 errors and no content published.",
              "🔕 The error is in the logs. You never check the logs. The engine is broken and the site looks fine.",
            ].map((text, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6">
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/60 font-semibold">
            Lazy Watch checks every engine every hour. You get notified before the damage compounds.
          </motion.p>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-display text-sm font-bold text-foreground mb-1">{step.icon} {step.title}</p>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Engine coverage */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Monitors every engine in your stack.
          </motion.h2>
          <div className="flex flex-wrap justify-center gap-2">
            {engines.map((e) => (
              <span key={e} className="font-display text-[11px] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border border-[#c8a961]/30 text-[#c8a961]">{e}</span>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50">
            Lazy Watch silently skips engines that aren't installed. No noise, no false alarms — just monitoring the engines you actually use.
          </motion.p>
        </section>

        {/* Pricing */}
        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "Hourly error monitoring", "Claude-powered diagnosis", "Automatic GitHub issues", "Slack alerts", "26 engine coverage"]}
          proFeatures={["Everything in Lazy", "Custom diagnosis rules", "Priority severity routing", "Multi-repo support", "Webhook integrations"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* Final CTA */}
        <section className="text-center px-6 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-xl font-bold mb-4">Stop checking logs manually.</h2>
            <p className="font-body text-sm text-foreground/50 mb-6 max-w-md mx-auto">Paste one prompt. Lazy Watch monitors everything, diagnoses issues, and opens GitHub issues — every hour.</p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
