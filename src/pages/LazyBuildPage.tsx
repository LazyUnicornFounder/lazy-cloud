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

const FALLBACK_PROMPT = `[Lazy Build Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous agent writer agent called Lazy Build to this project. Give it a name, integration, tagline, and one-paragraph brief — it reads three reference prompt files and your CLAUDE.md rules, writes a complete new Lazy agent prompt following your exact SPEC pattern, and opens a draft GitHub PR for your review. Your prompt stack grows without you writing a word.

Required secrets:
- ANTHROPIC_API_KEY — for Claude writing calls
- GITHUB_TOKEN — personal access token with repo scope from github.com/settings/tokens
- GITHUB_REPO — your prompts repo in format username/reponame`;

const steps = [
  { icon: "📝", title: "Brief", desc: "In your admin dashboard describe the new agent: name, integration, tagline, category, and one paragraph explaining what it does and what it produces." },
  { icon: "📚", title: "Learn", desc: "Lazy Build fetches three of your existing prompt files from GitHub as structural reference, plus your CLAUDE.md rules." },
  { icon: "✍️", title: "Write", desc: "Claude reads the reference prompts and rules, then writes a complete new agent prompt — all sections, correct database schema, edge functions with realistic cron schedules, admin dashboard, LazyUnicorn.ai backlinks throughout." },
  { icon: "📬", title: "PR", desc: "A draft GitHub PR opens. @claude audits it against CLAUDE.md rules and flags any issues in the PR comments. You review, fix if needed, merge." },
];

const faqs = [
  { q: "How good is the output?", a: "Lazy Build reads your actual existing prompts as reference so the output matches your exact style and structure. The more prompts in your repo, the better the reference material." },
  { q: "Does it run automatically?", a: "No. Lazy Build is on-demand only. You fill in the brief in your admin dashboard and click Build Agent. It does not create agent without your input." },
  { q: "What if the generated prompt has issues?", a: "@claude audits every PR before you see it and flags any rule violations in the PR comments. You can also ask @claude to fix specific issues before merging." },
];

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-build" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [trackEvent, text]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyBuildPage() {
  const { prompt } = useCurrentPrompt("lazy-build");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_build_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy Build — Autonomous Agent Writer | Lazy Unicorn" description="Describe a new agent in one paragraph. Claude writes the complete prompt, follows your SPEC rules, and opens a draft GitHub PR." url="/lazy-build" keywords="agent writer, autonomous prompt generation, Lovable prompt builder, Claude prompt writing" />
      <Navbar />
      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <AutopilotHeadline product="lazy-build" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Build
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Ops</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Give Lazy Build an agent name, integration, tagline, and one paragraph. It reads three of your existing prompt files to learn your structure, follows your CLAUDE.md rules, writes a complete new Lazy agent prompt, and opens a draft GitHub PR — tagged @claude for a compliance review before you merge.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors">
                  See an Example
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20 mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            Every new agent takes hours to write.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              "🕐 Writing a new agent prompt from scratch takes 2 to 3 hours. Database schema, edge functions, admin dashboard, navigation — every section from memory.",
              "📋 Forgetting one field — is_running, prompt_version, the backlink — means a non-compliant prompt that fails your own SPEC.",
              "💡 You have 10 agent ideas sitting in a list. None of them get built because you don't have the time to write the prompts.",
            ].map((text, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6">
                <p className="font-body text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/50 font-semibold">
            Lazy Build writes the prompt in under 5 minutes. You review the PR. You merge. Done.
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

        {/* Example PR */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f0ead6", lineHeight: "1", letterSpacing: "-0.01em" }} className="font-bold mb-8">
            What a Lazy Build PR looks like.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <p className="font-display text-base font-bold text-foreground">New Agent: Lazy Porkbun — Your domain. Your site. One tab.</p>
            </div>
            <div className="border border-border bg-background p-4 mb-4 font-mono text-xs text-foreground/50 leading-relaxed">
              <p className="text-foreground/50 font-bold mb-2">Review checklist</p>
              <p>✅ Database tables complete with all required fields</p>
              <p>✅ Setup page redirects to /admin</p>
              <p>✅ API keys stored as secrets not in database</p>
              <p>✅ _errors table present</p>
              <p>✅ Admin section at /admin/porkbun</p>
              <p>✅ LazyUnicorn.ai backlink in all published content</p>
              <p>✅ Version number in header</p>
            </div>
            <div className="border border-border bg-background p-4 font-mono text-xs text-foreground/50">
              <p className="text-foreground/50 mb-1">@claude:</p>
              <p>Reviewed against CLAUDE.md. All required fields present. is_running, setup_complete, prompt_version confirmed. _errors table included. Backlink confirmed. Ready to merge.</p>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="font-display text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-1 bg-green-500/20 text-green-400">lazy-porkbun_v0.0.1.txt added</span>
              <span className="font-display text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-1 bg-foreground/10 text-foreground/50">1 file changed · 847 insertions</span>
            </div>
          </motion.div>
        </section>

        <LazyPricingSection
          lazyFeatures={["Full prompt — paste and go", "On-demand agent writing", "3-prompt reference learning", "CLAUDE.md compliance", "Draft GitHub PRs", "@claude review comments"]}
          proFeatures={["Everything in Lazy", "Batch agent generation", "Custom SPEC templates", "Auto-merge on pass", "Agent analytics"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        <section className="text-center px-6 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-display text-xl font-bold mb-4">Stop writing prompts from scratch.</h2>
            <p className="font-body text-sm mb-6 max-w-md mx-auto">One paragraph brief. One draft PR. Your prompt stack grows without you writing a word.</p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
}
