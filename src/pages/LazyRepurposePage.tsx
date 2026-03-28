import { useState, useCallback, useEffect } from "react";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { motion } from "framer-motion";
import { Copy, Check, Repeat, Twitter, Linkedin, Mail, Video } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `[Lazy Repurpose Prompt — v0.0.1 — LazyUnicorn.ai]

Add an autonomous content repurposing agent called Lazy Repurpose to this project. Every Sunday it reads your top performing blog posts, SEO articles, and GEO content and automatically produces a Twitter thread, a LinkedIn post, a newsletter section, and a short-form video script for each one — published to a queue for scheduling or posted directly. One piece of content becomes five. Every week. Automatically.`;

const outputCards = [
  { emoji: "🐦", title: "Twitter Thread", desc: "6 to 10 tweets. Hook in the first tweet that stops the scroll. One idea per tweet. Ends with a follow CTA. No hashtag spam. Generated to match your tone — conversational, educational, bold, or founder voice.", border: "border-[#c8a961]" },
  { emoji: "💼", title: "LinkedIn Post", desc: "Under 1300 characters. Opening line designed to stop the scroll — no \"I am excited to share\" openers. Short paragraphs with white space. Ends with a question that drives comments. 3 to 5 relevant hashtags.", border: "border-blue-500/50" },
  { emoji: "📧", title: "Newsletter Section", desc: "Short subject line. 2 to 3 paragraph summary that delivers the key value. Read more link back to the full post. Written like a recommendation from a trusted friend — not a marketing email.", border: "border-purple-500/50" },
  { emoji: "🎬", title: "Video Script", desc: "60 to 90 seconds. Hook in the first 3 seconds — no intro, no \"hey guys\". Conversational and direct. Clear call to action at the end. Ready to record for TikTok, Reels, or Shorts.", border: "border-teal-500/50" },
];

const steps = [
  { icon: "📊", title: "Every Sunday", desc: "Lazy Repurpose fetches your top performing posts from the last week — blog posts, SEO articles, GEO pieces." },
  { icon: "✍️", title: "Four formats generated", desc: "Claude writes a Twitter thread, LinkedIn post, newsletter section, and video script for each. Matched to your brand tone." },
  { icon: "✅", title: "You review and post", desc: "All four formats appear in your admin queue. Edit if you want, copy and paste to your channels, or connect the APIs for direct posting." },
];

const faqs = [
  { question: "How does it know which posts to repurpose?", answer: "It reads your blog_posts, seo_posts, and geo_posts tables and selects the most viewed or most recent — you control how many per week in setup (1, 3, 5, or all new posts)." },
  { question: "Can I edit the content before posting?", answer: "Yes. Every piece appears in your admin queue as an editable text area. Change anything before copying or posting." },
  { question: "Does it post automatically?", answer: "Only if you connect your Twitter or LinkedIn API keys and turn on auto-post. By default everything goes to a queue for your review first." },
  { question: "What if a post has already been repurposed?", answer: "Lazy Repurpose tracks which posts have been processed. It never repurposes the same post twice." },
];

const problemCards = [
  { emoji: "📉", text: "You publish a great blog post. 200 people read it. 50,000 people on LinkedIn would have engaged with it if it existed there. It never does." },
  { emoji: "✍️", text: "Turning one post into a Twitter thread, a LinkedIn post, a newsletter section, and a video script takes 2 hours. You do it zero times." },
  { emoji: "📅", text: "Your newsletter goes out when you remember to write it. Your social is posted when you have energy. Consistency is the gap between you and compounding." },
];

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  }, [text]);
  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-2 px-8 py-3.5 font-display text-sm tracking-[0.15em] uppercase font-bold transition-all active:scale-[0.97]" style={{ backgroundColor: "#c8a961", color: "#0a0a08" }}>
      {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
    </button>
  );
}

export default function LazyRepurposePage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_repurpose_page_view"); }, [trackEvent]);
  const { prompt } = useCurrentPrompt("lazy-repurpose");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Repurpose — Autonomous Content Repurposing Agent for Lovable"
        description="Every blog post becomes a Twitter thread, LinkedIn post, newsletter section, and video script — automatically every Sunday. One piece of content. Five formats. Zero extra writing."
        url="/lazy-repurpose"
        keywords="content repurposing, autonomous social media, Twitter thread generator, LinkedIn post generator, Lovable agent"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-32 md:pb-40" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="inline-block font-display text-[11px] tracking-[0.25em] uppercase font-bold mb-6 px-4 py-1.5 border border-[#c8a961]/30 text-[#c8a961]">Lazy Agents 🔄</p>
              <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-6" style={{ color: "#f0ead6" }}>
                You already wrote it.<br />Now let it work five times harder.
              </h1>
              <p className="font-body text-base md:text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed mb-8">
                Every blog post, SEO article, and GEO piece you publish automatically becomes a Twitter thread, a LinkedIn post, a newsletter section, and a short-form video script — generated every Sunday and queued for your approval. One piece of content. Five formats. Zero extra writing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <CopyPromptButton text={promptText} />
                <a href="#outputs" className="inline-flex items-center gap-2 px-8 py-3.5 font-display text-sm tracking-[0.15em] uppercase font-bold border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-colors">
                  See What Gets Created
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-4xl mx-auto px-6 mt-16 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Your best content reaches 3% of the people it could.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {problemCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-3">{card.emoji}</p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-6 font-body text-sm text-foreground/60 max-w-xl mx-auto leading-relaxed">
            Your content is only working on the channel it was written for. Lazy Repurpose makes it work on all of them.
          </motion.p>
        </section>

        {/* Outputs */}
        <section id="outputs" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            One post. Four formats. Every Sunday.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {outputCards.map((card, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 border-b sm:odd:border-r last:border-b-0 sm:[&:nth-child(3)]:border-b-0 border-border`}>
                <div className={`inline-block px-3 py-1 border ${card.border} rounded-sm mb-3`}>
                  <span className="text-lg mr-2">{card.emoji}</span>
                  <span className="font-display text-sm font-bold">{card.title}</span>
                </div>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
            {steps.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`bg-card p-6 ${i < 2 ? "border-b md:border-b-0 md:border-r border-border" : ""}`}>
                <p className="text-2xl mb-3">{s.icon}</p>
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                <p className="font-body text-sm text-foreground/50 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <LazyPricingSection />

        <section className="max-w-2xl mx-auto px-6 text-center mb-16">
          <p className="font-body text-sm text-foreground/40">
            No API keys required for content generation. Optional: connect Twitter and LinkedIn APIs for direct posting from the dashboard.
          </p>
        </section>

        {/* FAQ */}
        <LazyFaqSection faqs={faqs} />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 mt-20">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-2 border-[#c8a961]/30 bg-card p-10 text-center">
            <p className="font-body text-sm text-foreground/50 mb-4 leading-relaxed max-w-lg mx-auto">
              Your best content is sitting on one channel. It should be on all of them.
            </p>
            <CopyPromptButton text={promptText} />
          </motion.div>
        </section>

        <AutopilotHeadline />
      </main>
    </div>
  );
}
