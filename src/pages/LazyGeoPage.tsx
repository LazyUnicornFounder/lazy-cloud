import { useEffect, useState, useCallback } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Zap, Eye, Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const FALLBACK_GEO_PROMPT = "Loading prompt…";

const steps = [
  "Click the button above to copy the Lovable prompt.",
  "Paste it into your Lovable project chat.",
  "Describe your brand, audience, and niche topics.",
  "Lazy GEO discovers AI queries, publishes content, and monitors citations.",
];

function CopyPromptButton({ className = "", onCopy, promptText }: { className?: string; onCopy: () => void; promptText: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true); onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, promptText]);

  return (
    <button onClick={handleCopy} className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyGeoPage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-geo");
  const promptText = dbPrompt?.prompt_text || FALLBACK_GEO_PROMPT;

  useEffect(() => { trackEvent("lazy_geo_page_view"); }, [trackEvent]);
  const handlePromptCopy = useCallback(() => { trackEvent("lazy_geo_prompt_copy"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Lazy GEO — Autonomous Generative Engine Optimisation for Lovable" description="Get your brand cited by ChatGPT, Claude, and Perplexity. Lazy GEO discovers AI queries, publishes citable content, and monitors your brand mentions — on autopilot." url="/lazy-geo" />
      <Navbar />
      <main className="relative z-10 pb-32">
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-geo" />

              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy GEO
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/70 max-w-xl leading-relaxed">
                Lazy GEO discovers what people ask AI engines, publishes content structured to be cited, and monitors your brand mentions — on autopilot. No API keys needed.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
                <button
                  onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">How it works</motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">What you get</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {[
              { icon: Brain, title: "Query Discovery", desc: "AI finds 20 questions people are asking ChatGPT and Perplexity in your niche — twice a week." },
              { icon: Eye, title: "Citation Monitoring", desc: "Weekly checks to see if your brand is being cited in AI engine responses." },
              { icon: Zap, title: "Auto-Publishing", desc: "GEO-optimised content published daily — structured for AI engines to cite." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center">
                <item.icon size={18} className="text-foreground/65 mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What is GEO? */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8">
            <h2 className="font-display text-xl font-extrabold tracking-tight mb-4">What is GEO?</h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Generative Engine Optimisation</strong> is the next evolution of SEO. Instead of optimising for Google's link-based results, GEO optimises your content to be <em>cited by AI engines</em> — ChatGPT, Claude, Perplexity, and Gemini.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              When someone asks an AI assistant a question in your niche, GEO-optimised content is structured so the AI pulls from your site and mentions your brand in its answer. It's the difference between ranking on a page and being the answer.
            </p>
          </motion.div>
        </section>

        <LazyPricingSection lazyFeatures={["Lazy GEO setup prompt", "Self-hosted in your Lovable project", "AI citation monitoring", "No API keys needed"]} proFeatures={["Hosted version", "Multi-model citation tracking", "Competitor citation analysis", "Priority content generation"]} ctaButton={<CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} className="w-full justify-center" />} />

        <LazyFaqSection faqs={[
          { q: "How is GEO different from SEO?", a: "SEO gets you ranked in Google search results. GEO gets your brand cited in AI-generated answers. Both drive traffic, but GEO positions you as the authoritative source AI engines reference." },
          { q: "Which AI engines does this target?", a: "Content is structured to be cited by ChatGPT, Claude, Perplexity, Gemini, and any AI assistant that synthesises web content into answers." },
          { q: "How does citation monitoring work?", a: "Every week, Lazy GEO uses AI to simulate whether your brand would be cited in response to each discovered query. It tracks citation rates over time." },
          { q: "Does it work with any Lovable site?", a: "Yes. Paste the prompt, answer a few questions about your business, and it runs autonomously inside your project." },
          { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every engine update is versioned and documented with upgrade instructions." },
          { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
        ]} />

        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">Be the answer, not just a result.</h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">AI engines are replacing search. If your brand isn't being cited, you're invisible to the next generation of users.</p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyGeoPage;
