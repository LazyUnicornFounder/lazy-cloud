import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, FileText, CheckSquare, MessageSquare, BarChart3, Brain, Calendar, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const LAZY_GRANOLA_FALLBACK = `[Lazy Granola Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous meeting-to-content agent called Lazy Granola to this project...`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  variant = "primary",
  text,
}: {
  className?: string;
  onCopy: () => void;
  variant?: "primary" | "ghost";
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, text]);

  const base =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${base} ${className}`}
    >
      {copied ? (
        <><Check size={16} /> Copied ✓</>
      ) : (
        <><Copy size={16} /> Copy the Lovable Prompt</>
      )}
    </button>
  );
}

/* ── Output cards ── */
const outputs = [
  { icon: FileText, title: "Blog post", desc: "Every customer discovery call, planning session, and product review becomes a build-in-public blog post. Customer calls become insight posts. Planning sessions become weekly updates. All published automatically — names and sensitive details removed.", border: "border-primary" },
  { icon: CheckSquare, title: "Linear issues", desc: "Every action item in your Granola notes becomes a Linear issue. Title, description, assignee, and priority all extracted from the meeting context. Your board is updated before you have closed Granola.", border: "border-blue-500" },
  { icon: MessageSquare, title: "Slack summary", desc: "A plain-English summary of every meeting posts to your Slack channel automatically — key decisions, action items with owners, and next steps. The team knows what happened without attending or asking.", border: "border-purple-500" },
  { icon: BarChart3, title: "Product update", desc: "Planning sessions and product reviews become published product update posts. What was reviewed, what was decided, what is coming next — all written and published automatically.", border: "border-teal-500" },
  { icon: Brain, title: "Customer intelligence", desc: "Discovery calls are parsed for signals — problems mentioned, features requested, competitors named, budget signals. These feed directly into Lazy Blogger and Lazy Perplexity as research context so your content is grounded in real customer voice.", border: "border-orange-500" },
];

/* ── Meeting types ── */
const meetingTypes = [
  { type: "Customer Discovery", outputs: "Blog post (insight post) + Customer intelligence feed", emoji: "🔍" },
  { type: "Planning Session", outputs: "Blog post + Linear issues + Product update + Slack summary", emoji: "📋" },
  { type: "Product Review", outputs: "Blog post (what shipped) + Linear issues + Product update + Slack summary", emoji: "🚀" },
  { type: "1-on-1", outputs: "Linear issues from action items + Slack summary (optional)", emoji: "👥" },
  { type: "Pitch Meeting", outputs: "Blog post (investor learnings) + Slack summary", emoji: "💰" },
  { type: "Standup", outputs: "Slack summary", emoji: "⚡" },
];

/* ── FAQ ── */
const faqs = [
  { q: "Do I need a paid Granola account?", a: "Granola is free to start. Lazy Granola uses the Granola MCP server which is available on all Granola plans. Check granola.ai for current plan details." },
  { q: "Does Lazy Granola publish private meeting content?", a: "No. You control which meeting types are processed in setup. 1-on-1s are excluded by default. Customer names and company details are never published — Lazy Granola writes about the insights and decisions, not the people." },
  { q: "What if I do not have Lazy Linear installed?", a: "Lazy Granola still works. It creates action items in its own internal table and shows them in the admin. When you install Lazy Linear later they sync automatically." },
  { q: "How does the customer intelligence feed work?", a: "Lazy Granola parses customer discovery calls for signals — problems, feature requests, competitors, budget signals. These appear in a private intelligence feed in your admin and feed into Lazy Blogger and Lazy Perplexity as research context. They are never published publicly." },
  { q: "Can I choose which meetings get processed?", a: "Yes. During setup you choose which meeting types to process. You can change this any time from the admin dashboard. You can also manually exclude specific meetings from the admin." },
];

/* ── Lazy Stack connections ── */
const stackConnections = [
  { name: "Lazy Blogger", desc: "blog posts" },
  { name: "Lazy Linear", desc: "action items as issues" },
  { name: "Lazy Alert", desc: "Slack summaries" },
  { name: "Lazy Perplexity", desc: "customer intel as research context" },
  { name: "/blog or /meetings", desc: "published content" },
];

export default function LazyGranolaPage() {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-granola");
  const promptText = dbPrompt?.prompt_text || LAZY_GRANOLA_FALLBACK;

  const handleCopy = useCallback(() => {
    trackEvent("granola_prompt_copied");
  }, [trackEvent]);

  return (
    <>
      <SEO
        title="Lazy Granola — Autonomous Meeting-to-Content Agent"
        description="Connect Granola to the Lazy Stack. Every meeting becomes blog posts, Linear issues, Slack summaries, and customer intelligence — automatically."
        url="https://lazyunicorn.ai/lazy-granola"
      />
      <Navbar />

      <main className="min-h-screen bg-background text-foreground">
        {/* ── Hero ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-primary text-primary-foreground text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-granola" />
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Granola
              </h1>
              <div className="flex items-center gap-3 mt-4 mb-4">
                <span className="font-display text-[11px] tracking-[0.15em] uppercase font-bold px-3 py-1 border border-[#c8a961]/30 text-[#c8a961]">Lazy Dev</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-xl leading-relaxed">
                Connect your Granola meeting notes to the Lazy Stack. Every meeting becomes blog posts, Linear issues, Slack summaries, and customer intelligence — on autopilot. No API keys needed.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} onCopy={handleCopy} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("outputs")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See What Gets Created
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Problem ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="text-center mb-12"
            >
              You take the notes. Nothing happens with them.
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { emoji: "📋", text: "Action items from the meeting never make it to Linear. They live in your notes and die there." },
                { emoji: "💡", text: "Customer insights from discovery calls never reach your blog or your content queue. They disappear." },
                { emoji: "📢", text: "Your team missed the meeting. The summary you meant to write never got written." },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="border border-border bg-card p-6"
                >
                  <span className="text-2xl mb-3 block">{card.emoji}</span>
                  <p className="font-body text-foreground/50 text-[15px] leading-relaxed">{card.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center font-body text-foreground/50 text-lg"
            >
              Most meetings produce one output: a Granola note that nobody reads twice.
            </motion.p>
          </div>
        </section>

        {/* ── Outputs ── */}
        <section id="outputs" className="py-20 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="text-center mb-12"
            >
              One meeting. Five outputs. Zero effort after you hang up.
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {outputs.slice(0, 2).map((o, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className={`border ${o.border} bg-card p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <o.icon size={20} className="text-foreground/50" />
                    <h3 className="font-display text-[16px] tracking-[0.1em] uppercase font-bold text-foreground">{o.title}</h3>
                  </div>
                  <p className="font-body text-foreground/50 text-[14px] leading-relaxed">{o.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {outputs.slice(2).map((o, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className={`border ${o.border} bg-card p-6`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <o.icon size={20} className="text-foreground/50" />
                    <h3 className="font-display text-[16px] tracking-[0.1em] uppercase font-bold text-foreground">{o.title}</h3>
                  </div>
                  <p className="font-body text-foreground/50 text-[14px] leading-relaxed">{o.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Weekly digest card */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={20} className="text-foreground/50" />
                <h3 className="font-display text-[16px] tracking-[0.1em] uppercase font-bold text-foreground">Weekly digest</h3>
              </div>
              <p className="font-body text-foreground/50 text-[14px] leading-relaxed">
                Every Monday Lazy Granola pulls the past week's meetings, writes a build-in-public weekly digest, and publishes it. What happened, what was decided, what you learned. The best build-in-public content comes from real work — and all your real work is in Granola.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="text-center mb-12"
            >
              Three steps. Then nothing.
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { emoji: "🔗", title: "Connect Granola", desc: "Go to Settings → Connectors → Personal connectors in your Lovable project. Connect your Granola account. Takes 30 seconds." },
                { emoji: "⚡", title: "Paste the prompt", desc: "Copy the Lazy Granola prompt from this page. Paste it into your Lovable project. Choose which meeting types to process and which outputs to create." },
                { emoji: "🎙️", title: "Have your meetings", desc: "That is it. Lazy Granola checks for new meetings every 30 minutes. When your meeting ends the outputs start generating automatically." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <span className="text-3xl mb-4 block">{step.emoji}</span>
                  <h3 className="font-display text-[14px] tracking-[0.12em] uppercase font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-foreground/50 text-[14px] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Meeting types ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="text-center mb-12"
            >
              Works with every meeting type.
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {meetingTypes.map((m, i) => (
                <motion.div
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  transition={{ delay: i * 0.08 }}
                  className="border border-border bg-card p-5"
                >
                  <span className="text-xl mb-2 block">{m.emoji}</span>
                  <h3 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-foreground mb-2">{m.type}</h3>
                  <p className="font-body text-foreground/50 text-[13px] leading-relaxed">{m.outputs}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center font-body text-foreground/40 text-sm">
              You choose which meeting types to process during setup. Standups and 1-on-1s can be excluded if you prefer.
            </p>
          </div>
        </section>

        {/* ── Customer intelligence ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="text-center mb-12"
            >
              Your customer calls are your best content. You just never had time to write it.
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-6">
                <h3 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-foreground/50 mb-4">The problem</h3>
                <p className="font-body text-foreground/50 text-[15px] leading-relaxed">
                  You spend 45 minutes on a customer discovery call. You learn what problems they face, what tools they use, what they wish existed. You write some notes in Granola. Then you go to your next meeting. The insights sit in Granola forever.
                </p>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.1 }} className="border border-primary bg-card p-6">
                <h3 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-primary mb-4">What Lazy Granola does</h3>
                <p className="font-body text-foreground/50 text-[15px] leading-relaxed">
                  Lazy Granola reads those notes and extracts every signal — problems mentioned, features requested, competitors named. It feeds them directly into Lazy Blogger as research context so your next blog post is grounded in real customer voice. It also builds a running intelligence feed in your admin so you can see every customer signal across all calls in one place.
                </p>
              </motion.div>
            </div>

            {/* Mock intel card */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="border border-border bg-card p-5 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block bg-orange-500/20 text-orange-400 font-display text-[11px] tracking-[0.12em] uppercase font-bold px-2 py-0.5">
                  problem-mentioned
                </span>
                <span className="font-body text-foreground/40 text-[12px]">Today</span>
              </div>
              <p className="font-body text-foreground/50 text-[14px] leading-relaxed mb-1">
                "Their current tool requires too much manual data entry for non-technical team members"
              </p>
              <p className="font-body text-foreground/40 text-[12px]">
                Customer Discovery — Series B SaaS
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Works with the Lazy Stack ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="mb-12"
            >
              Granola is the input. The Lazy Stack is the output.
            </motion.h2>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="flex flex-col items-center gap-3 mb-10"
            >
              <div className="border border-primary bg-card px-6 py-3 font-display text-[13px] tracking-[0.12em] uppercase font-bold text-primary">
                Granola meeting notes
              </div>
              <ArrowRight size={20} className="text-foreground/30 rotate-90" />
              <div className="border border-foreground/30 bg-card px-6 py-3 font-display text-[13px] tracking-[0.12em] uppercase font-bold text-foreground">
                Lazy Granola
              </div>
              <ArrowRight size={20} className="text-foreground/30 rotate-90" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {stackConnections.map((s, i) => (
                  <div key={i} className="border border-border bg-card px-4 py-2 font-body text-[12px] text-foreground/50">
                    <span className="font-bold block text-foreground/80">{s.name}</span>
                    {s.desc}
                  </div>
                ))}
              </div>
            </motion.div>

            <p className="font-body text-foreground/50 text-[14px] leading-relaxed max-w-3xl mx-auto">
              Lazy Granola does not replace any other Lazy agent. It feeds them. If you have Lazy Blogger installed meeting posts appear on your blog automatically. If you have Lazy Linear installed action items appear in your board automatically. Install what you have. Lazy Granola connects to whatever is there.
            </p>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-lg mx-auto text-center">
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: "#f0ead6", lineHeight: 1.15 }}
              className="mb-8"
            >
              Free with the Lazy Stack.
            </motion.h2>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="border border-primary bg-card p-8 mb-4"
            >
              <h3 className="font-display text-[18px] tracking-[0.12em] uppercase font-bold text-foreground mb-4">Free</h3>
              <p className="font-body text-foreground/50 text-[14px] mb-2">Included with any Lazy Stack install.</p>
              <p className="font-body text-foreground/50 text-[13px] mb-6">
                Meeting sync every 30 minutes · Blog posts from meetings · Linear issue creation · Slack summaries · Customer intelligence extraction · Weekly digest
              </p>
              <CopyPromptButton text={promptText} onCopy={handleCopy} />
            </motion.div>
            <p className="font-body text-foreground/40 text-[13px]">
              Paste into your existing Lovable project. Requires Granola connected in Settings → Connectors → Personal connectors.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <LazyFaqSection faqs={faqs} />

        {/* ── Bottom CTA ── */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="border border-primary bg-card p-10"
            >
              <h2
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#f0ead6", lineHeight: 1.15 }}
                className="mb-4"
              >
                Stop letting your best insights die in meeting notes.
              </h2>
              <p className="font-body text-foreground/50 text-[15px] leading-relaxed mb-8">
                Every customer call you have is a blog post. Every planning session is a product update. Every action item is a Linear issue. Lazy Granola turns your meetings into momentum — automatically, the moment you hang up.
              </p>
              <CopyPromptButton text={promptText} onCopy={handleCopy} />
              <p className="font-body text-foreground/40 text-[12px] mt-4">
                Open your Lovable project and paste. Connect Granola in Settings → Connectors → Personal connectors first.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
