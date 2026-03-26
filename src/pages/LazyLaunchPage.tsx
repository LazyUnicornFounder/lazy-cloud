import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ChevronDown, Copy, ExternalLink, RotateCcw, AlertCircle } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const TONE_OPTIONS = ["Professional", "Conversational", "Bold", "Minimal"] as const;

const EXAMPLES = [
  {
    title: "SaaS Time Tracker",
    description:
      "I built a Lovable app that helps freelancers track their time and invoice clients automatically. It has a free tier and a $12/month pro plan. My target customers are designers and developers who hate admin.",
  },
  {
    title: "Lovable Agency",
    description:
      "We're a two-person agency that builds MVPs for startups using Lovable. We go from idea to deployed product in 48 hours. We charge $2,500 per build and target non-technical founders who need to validate fast.",
  },
  {
    title: "Newsletter Product",
    description:
      "I run a weekly newsletter about AI tools for content creators. It has 4,000 subscribers and I monetise through a $9/month premium tier with exclusive tool reviews and templates. My audience is marketers and solopreneurs.",
  },
];

export default function LazyLaunchPage() {
  const trackEvent = useTrackEvent();
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [pricing, setPricing] = useState("");
  const [cta, setCta] = useState("");
  const [tone, setTone] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shake, setShake] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("page_view", { page: "/lazy-launch" });
  }, []);

  const autoExpand = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.max(ta.scrollHeight, 168) + "px";
    }
  };

  const handleGenerate = async () => {
    if (!description.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setLoading(true);
    setError(null);
    trackEvent("lazy_launch_generate", { chars: description.length });

    try {
      const { data, error: fnError } = await supabase.functions.invoke("lazy-launch-generate", {
        body: {
          description: description.slice(0, 500),
          targetAudience: targetAudience || undefined,
          pricing: pricing || undefined,
          cta: cta || undefined,
          tone: tone || undefined,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      if (!data?.prompt) throw new Error("No prompt returned");

      setGeneratedPrompt(data.prompt);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPrompt) return;
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    trackEvent("lazy_launch_copy");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedPrompt(null);
    setError(null);
    setCopied(false);
  };

  const handleExampleClick = (desc: string) => {
    setDescription(desc);
    setGeneratedPrompt(null);
    setError(null);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(autoExpand, 50);
  };

  const charsRemaining = 500 - description.length;

  return (
    <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6]">
      <SEO
        title="Lazy Launch — Free Lovable Landing Page Prompt Generator"
        description="Describe your business. Get a Lovable prompt that builds a beautiful landing page — free, instantly, no account needed."
        url="https://auto-directory-showcase.lovable.app/lazy-launch"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase text-[#c8a961]/60 border border-[#c8a961]/20 rounded-full px-4 py-1.5 mb-6">
            Powered by Lazy Unicorn 🦄
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
            Your landing page.<br />One prompt.
          </h1>
          <p className="font-body text-base md:text-lg text-[#f0ead6]/50 max-w-xl mx-auto leading-relaxed">
            Describe your business. Get a Lovable prompt that builds a beautiful landing page — free, instantly, no account needed.
          </p>
        </motion.div>
      </section>

      {/* Tool Card */}
      <section className="px-6 pb-16">
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[720px] mx-auto rounded-xl border border-[#c8a961]/30 bg-[#111110] p-6 md:p-8"
        >
          <AnimatePresence mode="wait">
            {!generatedPrompt ? (
              <motion.div key="input" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                {/* Textarea */}
                <label className="block font-mono text-[11px] tracking-[0.15em] uppercase text-[#c8a961]/70 mb-3">
                  Describe your business
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) setDescription(e.target.value);
                      autoExpand();
                    }}
                    placeholder="e.g. I built a Lovable app that helps freelancers track their time and invoice clients automatically. It has a free tier and a $12/month pro plan. My target customers are designers and developers who hate admin."
                    rows={6}
                    className={`w-full bg-[#0a0a08] border rounded-lg px-4 py-3 text-[#f0ead6] font-body text-sm placeholder:text-[#f0ead6]/20 focus:outline-none focus:border-[#c8a961]/60 resize-none transition-colors ${
                      shake ? "animate-[shake_0.4s_ease-in-out] border-[#c8a961]" : "border-[#f0ead6]/10"
                    }`}
                    style={{ minHeight: 168 }}
                  />
                  {shake && !description.trim() && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#c8a961] text-[#0a0a08] font-body text-xs px-3 py-1 rounded whitespace-nowrap">
                      Describe your business first.
                    </span>
                  )}
                  <span
                    className={`absolute bottom-3 right-3 font-mono text-[10px] ${
                      charsRemaining < 100 ? "text-[#c8a961]" : "text-[#f0ead6]/20"
                    }`}
                  >
                    {charsRemaining}
                  </span>
                </div>

                {/* Optional Details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1.5 mt-4 font-body text-[11px] tracking-[0.1em] uppercase text-[#f0ead6]/30 hover:text-[#f0ead6]/50 transition-colors"
                >
                  <ChevronDown size={12} className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
                  Add details (optional)
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/30 mb-1.5">Target audience</label>
                          <input
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g. solo founders, freelancers, Lovable users"
                            className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 rounded-lg px-3 py-2 text-[#f0ead6] font-body text-sm placeholder:text-[#f0ead6]/20 focus:outline-none focus:border-[#c8a961]/40"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/30 mb-1.5">Pricing</label>
                          <input
                            value={pricing}
                            onChange={(e) => setPricing(e.target.value)}
                            placeholder="e.g. free tier + $29/month pro"
                            className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 rounded-lg px-3 py-2 text-[#f0ead6] font-body text-sm placeholder:text-[#f0ead6]/20 focus:outline-none focus:border-[#c8a961]/40"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/30 mb-1.5">Primary CTA</label>
                          <input
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                            placeholder="e.g. Start free, Get early access, Join waitlist"
                            className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 rounded-lg px-3 py-2 text-[#f0ead6] font-body text-sm placeholder:text-[#f0ead6]/20 focus:outline-none focus:border-[#c8a961]/40"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/30 mb-1.5">Tone</label>
                          <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="w-full bg-[#0a0a08] border border-[#f0ead6]/10 rounded-lg px-3 py-2 text-[#f0ead6] font-body text-sm focus:outline-none focus:border-[#c8a961]/40 appearance-none"
                          >
                            <option value="">Select tone...</option>
                            {TONE_OPTIONS.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                {error && (
                  <div className="mt-4 flex items-center gap-2 text-red-400 font-body text-sm">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full mt-6 bg-[#c8a961] text-[#0a0a08] font-display text-sm tracking-[0.1em] uppercase font-bold py-4 rounded-lg hover:brightness-110 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Generating your prompt…
                    </>
                  ) : (
                    "Generate Prompt"
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#c8a961]/70 mb-3">
                  Your Lovable prompt — ready to paste
                </p>
                <div className="bg-[#0a0a08] border-l-2 border-[#c8a961]/40 rounded-r-lg p-4 md:p-5 max-h-[420px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-[13px] text-[#f0ead6]/90 leading-relaxed select-all">
                    {generatedPrompt}
                  </pre>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-[#c8a961] text-[#0a0a08] font-display text-xs tracking-[0.1em] uppercase font-bold py-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Copy size={14} />
                    {copied ? "Copied ✓" : "Copy Prompt"}
                  </button>
                  <a
                    href="https://lovable.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-[#c8a961]/40 text-[#c8a961] font-display text-xs tracking-[0.1em] uppercase font-bold py-3 rounded-lg hover:bg-[#c8a961]/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    Open Lovable
                  </a>
                  <button
                    onClick={handleReset}
                    className="flex-1 text-[#f0ead6]/30 font-display text-xs tracking-[0.1em] uppercase font-bold py-3 rounded-lg hover:text-[#f0ead6]/60 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={14} />
                    Generate Another
                  </button>
                </div>

                <p className="font-body text-[11px] text-[#f0ead6]/25 mt-4 text-center">
                  Paste this prompt into any Lovable project to build your landing page. For best results paste it into a fresh project.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Examples */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-xl md:text-2xl font-bold text-center mb-8">What it generates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EXAMPLES.map((ex) => (
              <div key={ex.title} className="border border-[#f0ead6]/8 rounded-xl p-5 bg-[#111110]">
                <p className="font-display text-sm font-bold text-[#c8a961] mb-2">{ex.title}</p>
                <p className="font-body text-[12px] text-[#f0ead6]/40 leading-relaxed mb-4 line-clamp-4">
                  {ex.description}
                </p>
                <button
                  onClick={() => handleExampleClick(ex.description)}
                  className="w-full bg-[#c8a961]/10 border border-[#c8a961]/20 text-[#c8a961] font-display text-[10px] tracking-[0.1em] uppercase font-bold py-2.5 rounded-lg hover:bg-[#c8a961]/20 transition-all"
                >
                  Generate for my business
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <section className="border-t border-[#f0ead6]/5 py-12 px-6 text-center">
        <p className="font-body text-[12px] text-[#f0ead6]/25 mb-2">
          Lazy Launch is a free tool from{" "}
          <a href="/" className="text-[#c8a961]/50 hover:text-[#c8a961] transition-colors">
            LazyUnicorn.ai
          </a>{" "}
          — the autonomous operations layer for Lovable sites.
        </p>
        <p className="font-body text-[12px] text-[#f0ead6]/25">
          Want your Lovable site to run itself after launch?{" "}
          <a href="/#products" className="text-[#c8a961]/50 hover:text-[#c8a961] transition-colors">
            Browse the Lazy Stack →
          </a>
        </p>
      </section>

      <Footer />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}
