import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Fix Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous prompt improvement agent called Lazy Fix to this project. Every Sunday night it reads your agent performance data, identifies the two weakest-performing Lazy agents, makes targeted improvements to their prompts, and opens GitHub PRs for you to review Monday morning — all automatically.

Required secrets:
- ANTHROPIC_API_KEY — for Claude improvement calls
- GITHUB_TOKEN — personal access token with repo scope from github.com/settings/tokens
- GITHUB_REPO — your prompts repo in format username/reponame
- SLACK_WEBHOOK_URL — optional, from Lazy Alert settings`;

const steps = [
  { icon: "📊", title: "Analyse", desc: "Every Sunday night Lazy Fix reads output counts, error rates, and last activity dates across all your installed agents." },
  { icon: "🎯", title: "Identify", desc: "Claude selects the two agent most in need of improvement — high error rate, low output volume, or long inactivity." },
  { icon: "✍️", title: "Improve", desc: "Lazy Fix fetches the prompt file from GitHub, reads CLAUDE.md for your rules, and writes a targeted improvement to the specific underperforming section — not a rewrite, a precise targeted edit." },
  { icon: "📬", title: "PR", desc: "A GitHub PR opens on a new branch. The diff shows exactly what changed and why. @claude is tagged to audit it before you merge." },
];

const improvements = [
  { agent: "Lazy Blogger", problem: "Publishing 0 posts this week", fix: "AI prompt template updated with clearer output format instructions" },
  { agent: "Lazy GEO", problem: "23 JSON parse errors", fix: "Response parsing logic in geo-generate function made more robust" },
  { agent: "Lazy SMS", problem: "0 messages sent in 14 days", fix: "Cron schedule corrected and trigger condition fixed" },
  { agent: "Lazy Perplexity", problem: "High error rate", fix: "API error handling improved with retry logic" },
];

const faqs = [
  { q: "Will it change things I don't want changed?", a: "Lazy Fix makes targeted single-section edits only. It never restructures a whole file. The diff in the PR shows exactly what changed — you review and merge or reject." },
  { q: "What if it opens a bad PR?", a: "Set the PR status to Rejected in the admin dashboard. Lazy Fix will not make the same improvement again if it is marked rejected." },
  { q: "How does it know what to improve?", a: "It reads your Supabase tables. Agents that write to blog_posts, seo_posts, geo_posts give it output volume data. Error tables give it failure rate data. The more agents installed, the better the signal." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-fix" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyFixPage() {
  const { prompt } = useCurrentPrompt("lazy-fix");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_fix_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Fix — Autonomous Prompt Improvement | Lazy Unicorn" description="Every Sunday Lazy Fix reads your agent performance, identifies underperformers, and opens GitHub PRs with targeted prompt improvements." url="/lazy-fix" keywords="prompt improvement, autonomous fixing, Lovable prompt optimization, self-improving prompts" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-fix" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Fix
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Ops</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Every Sunday at 11pm Lazy Fix reads your agent performance data — output volume, error rates, last activity dates. It identifies the two weakest agents, writes targeted improvements to their prompts following your SPEC.md rules, and opens GitHub PRs. Monday morning you have two prompts ready to review and merge.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20 mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            Your prompts were good when you wrote them.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              "📉 Lazy Blogger was publishing daily. Three weeks ago it slowed to twice a week. You haven't touched the prompt. Something drifted.",
              "🐛 Lazy GEO has 40 errors in the last week. The AI prompt template stopped parsing the response correctly. You didn't notice.",
              "⏰ You know your prompts could be better. You never have time to improve them. They stay the same forever.",
            ].map((text, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6">
                <p className="font-body text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50 font-semibold">
            Lazy Fix is the part of you that would improve the prompts if you had time. It has time.
          </motion.p>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <div>
                  <p className="font-display text-sm font-bold text-foreground mb-1">{step.icon} {step.title}</p>
                  <p className="font-body text-sm text-foreground/50 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What it improves */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            Precise edits. Not rewrites.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {improvements.map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:odd:border-r last:border-b-0 sm:[&:nth-child(3)]:border-b-0 border-border bg-card p-6">
                <p className="font-display text-[11px] tracking-[0.15em] uppercase font-bold text-[#c8a961] mb-2">{item.agent}</p>
                <p className="font-body text-sm text-foreground/50 mb-1">{item.problem}</p>
                <p className="font-body text-sm">→ {item.fix}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50">
            Lazy Fix reads your CLAUDE.md rules before making any edit. Every improvement follows your architecture. Every PR increments the version number.
          </motion.p>
        </section>

        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "Weekly performance analysis", "Targeted prompt improvements", "Automatic GitHub PRs", "CLAUDE.md compliance", "Slack notifications"]}
          proFeatures={["Everything in Lazy", "Daily improvement cycles", "Custom improvement focus", "Multi-repo support", "Improvement analytics"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        <section className="text-center px-6 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-xl font-bold mb-4">Stop maintaining prompts manually.</h2>
            <p className="font-body text-sm mb-6 max-w-md mx-auto">Paste one prompt. Every Sunday your weakest agent get improved. You review the PRs Monday morning.</p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
