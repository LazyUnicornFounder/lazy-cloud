import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const FALLBACK_PROMPT = "Lazy YouTube prompt — paste this into your Lovable project to install the autonomous YouTube content engine.";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function CopyPromptButton({ text, label = "Copy the Lovable Prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    trackEvent("prompt_copy", { product: "lazy-youtube" });
    setTimeout(() => setCopied(false), 2000);
  }, [text, trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
      style={{ backgroundColor: "#c8a961", color: "#0a0a08" }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

const outputs = [
  { emoji: "📄", title: "Full transcript", border: "#c8a961", desc: "Every video gets a clean, formatted, readable transcript published to your site. Timestamped sections. Searchable by Google. Accessible to people who prefer reading. Automatically linked back to your YouTube video." },
  { emoji: "🔍", title: "SEO article", border: "#3b82f6", desc: "A long-form article targeting the keywords your video covers — written from the transcript but structured as an independent piece. Drives search traffic to your site from people who have never seen your channel." },
  { emoji: "🤖", title: "GEO article", border: "#14b8a6", desc: "Content structured specifically to be cited by ChatGPT, Claude, and Perplexity when someone asks a question your video answers. Factual. Specific. Citable." },
  { emoji: "✏️", title: "Video summary", border: "#a855f7", desc: "A tight summary post covering the key takeaways, structured as a scannable article. Great for newsletters, social sharing, and people who want the substance without watching." },
  { emoji: "📌", title: "Chapter markers", border: "#f97316", desc: "Lazy YouTube reads your transcript and generates chapter timestamps automatically. They get added to your video description via the YouTube API — better chapters improve watch time and retention." },
];

const steps = [
  { emoji: "🔑", title: "Connect", desc: "Add your YouTube API key and Supadata API key during setup. Paste your channel ID. Two minutes of configuration." },
  { emoji: "📹", title: "Upload a video", desc: "Film and upload as you normally would. Lazy YouTube polls your channel every 30 minutes and detects new uploads automatically." },
  { emoji: "📝", title: "Content generates", desc: "Within an hour of your video going live Lazy YouTube has fetched the transcript, written four content pieces, generated chapters, and published everything to your site." },
  { emoji: "📈", title: "Intelligence compounds", desc: "Comment questions become SEO keyword targets. High-performing video topics feed back into Lazy Blogger. Your YouTube content strategy and your site content strategy start talking to each other." },
];

const integrations = [
  { name: "Lazy Blogger", desc: "High-performing video topics feed into the blog queue automatically." },
  { name: "Lazy SEO", desc: "Comment questions become keyword targets. New keywords added weekly." },
  { name: "Lazy GEO", desc: "GEO articles from your videos get your channel cited by ChatGPT and Perplexity." },
  { name: "Lazy Voice", desc: "Video summaries get narrated automatically and added to your podcast RSS feed." },
  { name: "Lazy Alert", desc: "Slack notification every time a video is processed and content is published." },
  { name: "Lazy Mail", desc: "New video summaries go into your weekly newsletter automatically." },
];

const faqs = [
  { q: "What if my video has no captions?", a: "Lazy YouTube tries Supadata first which works on most public videos with auto-generated captions. If captions are unavailable it generates content from the video title, description, and metadata." },
  { q: "Do I need to give Lazy YouTube access to my YouTube channel?", a: "For reading video data and fetching transcripts you only need a YouTube API key. For automatically updating video descriptions with chapters you need to authorise with OAuth 2.0." },
  { q: "How long after uploading does content appear?", a: "Lazy YouTube checks for new videos every 30 minutes. The full cycle takes between 30 minutes and 90 minutes from upload to published content." },
  { q: "Can I control which videos get processed?", a: "Yes. You can pause specific videos from processing in the admin dashboard. You can also set content to draft mode instead of auto-publish." },
  { q: "Does it work with old videos?", a: "Yes. Lazy YouTube can backfill your existing video catalogue. From the admin dashboard click Sync All Videos to process your last 50 uploads." },
  { q: "What happens to site content if I delete a video from YouTube?", a: "Nothing automatically. The content stays on your site. You would need to manually remove it from your admin. Most creators keep the content since it has independent SEO value." },
];

export default function LazyYouTubePage() {
  const { prompt } = useCurrentPrompt("lazy-youtube");
  const promptText = prompt?.prompt_text || FALLBACK_PROMPT;
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("page_view", { page: "/lazy-youtube" });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy YouTube — Autonomous YouTube Content Engine | Lazy Unicorn"
        description="Every video you upload triggers five content pieces — a transcript, SEO article, GEO article, summary, and chapter markers. Published automatically."
        url="/lazy-youtube"
        keywords="YouTube content engine, autonomous YouTube, video to blog post, YouTube SEO, YouTube transcript, Lovable YouTube"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}
            className="font-body text-[13px] tracking-[0.2em] uppercase mb-6"
            style={{ color: "#c8a961", opacity: 0.7 }}
          >
            Powered by YouTube Data API + Supadata 📺
          </motion.p>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            You film it once. Lazy YouTube works it forever.
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/50 max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Every video you upload triggers five content pieces on your Lovable site — a full transcript, an SEO article, a GEO article structured for AI citation, a key takeaways summary, and auto-generated chapter markers. Published automatically within an hour of your video going live.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <CopyPromptButton text={promptText} />
            <a href="#outputs" className="inline-flex items-center justify-center font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-foreground/20 text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors">
              See What Gets Created
            </a>
          </motion.div>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
            className="font-body text-sm text-foreground/30"
          >
            Five content pieces per video · Chapters generated automatically · Comments become SEO keywords
          </motion.p>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            You spent three hours making that video. It should work harder.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { emoji: "🔍", text: "Your video ranks on YouTube search but not on Google. Your SEO is missing the audience that reads instead of watches." },
              { emoji: "🤖", text: "ChatGPT and Perplexity cannot watch your videos. You have zero AI search presence from your best content." },
              { emoji: "✍️", text: "Every video deserves a blog post, a transcript, and a summary. You never have time to write them." },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-6"
              >
                <span className="text-2xl block mb-3">{card.emoji}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{card.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-sm text-foreground/40 text-center leading-relaxed max-w-2xl mx-auto">
            Your video took three hours to make. The blog post that would have driven organic traffic forever takes twenty minutes you never found.
          </p>
        </div>
      </section>

      {/* Outputs */}
      <section id="outputs" className="py-20 px-6 md:px-12 border-t border-border scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            One upload. Five autonomous outputs.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outputs.map((o, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border p-6" style={{ borderColor: o.border + "44", borderLeftWidth: 3, borderLeftColor: o.border }}
              >
                <span className="text-xl block mb-2">{o.emoji}</span>
                <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-2">{o.title}</h3>
                <p className="font-body text-sm text-foreground/55 leading-relaxed">{o.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            Upload. Done. Everything else is automatic.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-6"
              >
                <span className="text-xl block mb-2">{s.emoji}</span>
                <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-2">{s.title}</h3>
                <p className="font-body text-sm text-foreground/55 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transcript section */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-8"
          >
            Your transcript is a goldmine. You were leaving it buried.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-body text-sm text-foreground/55 leading-relaxed"
            >
              Every word you said in every video is sitting in YouTube as auto-generated captions. Nobody can search it. Google cannot index it. Lazy YouTube fetches every transcript via Supadata, cleans it up, structures it with headers and timestamps, and publishes it as a readable article on your site. Now Google indexes every word you have ever said on camera.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-border p-5 font-mono text-xs text-foreground/50 leading-relaxed"
              style={{ backgroundColor: "#111110" }}
            >
              <p className="text-foreground/70 font-bold mb-3">How I Built a SaaS in a Weekend</p>
              <p className="mb-2"><span className="text-foreground/30">[0:00]</span> So the first thing I did was open Lovable and start with a blank project...</p>
              <p className="font-display text-foreground/60 text-sm font-bold mb-2 mt-4">## Setting Up the Database</p>
              <p className="mb-2"><span className="text-foreground/30">[2:30]</span> I connected Supabase and created three tables — users, products, and orders...</p>
              <p className="mt-4 text-foreground/40">Watch at 4:32 →</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comment intelligence */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-6"
          >
            Your comments section is your content strategy. You were ignoring it.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-body text-sm text-foreground/50 leading-relaxed max-w-2xl mx-auto mb-8"
          >
            Every week Lazy YouTube scans the comments on your most-discussed videos. It extracts every question your audience asked, every topic they mentioned that you did not cover, every complaint or request. These become SEO keyword targets, blog post ideas, and GEO query topics — automatically fed into Lazy Blogger and Lazy SEO.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block border border-border p-5 text-left max-w-md"
            style={{ backgroundColor: "#111110" }}
          >
            <span className="inline-block text-[10px] tracking-[0.1em] uppercase font-bold px-2 py-0.5 mb-2" style={{ backgroundColor: "#f97316", color: "#0a0a08" }}>question-asked</span>
            <p className="font-body text-sm text-foreground/60 leading-relaxed mb-2">What tool do you use to build the database layer? Several commenters asking about Supabase setup. Added to SEO keyword queue.</p>
            <p className="font-body text-xs text-foreground/30">Source: How I built a SaaS in a weekend</p>
          </motion.div>
        </div>
      </section>

      {/* Compounding */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            The longer you run it, the smarter it gets.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { month: "Month 1", desc: "Videos upload. Transcripts publish. SEO articles target your keywords. GEO articles appear in AI search results." },
              { month: "Month 3", desc: "Comment questions become new SEO targets. High-performing topics feed back into Lazy Blogger. Your YouTube strategy and site strategy align automatically." },
              { month: "Month 6", desc: "Your site has 60+ indexed articles from your videos. You rank for dozens of keywords your videos never touched. AI engines cite you regularly." },
            ].map((stage, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border p-6"
              >
                <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-2" style={{ color: "#c8a961" }}>{stage.month}</h3>
                <p className="font-body text-sm text-foreground/55 leading-relaxed">{stage.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack integration */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            YouTube is the input. The Lazy Stack handles the rest.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {integrations.map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="border border-border p-5"
              >
                <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1">→ {item.name}</h3>
                <p className="font-body text-sm text-foreground/55 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two APIs */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-12"
          >
            Built on two best-in-class services.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-border p-6">
              <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-2">YouTube Data API v3</h3>
              <p className="font-body text-sm text-foreground/55 leading-relaxed">Google's official YouTube API. Detects new uploads, fetches video metadata, retrieves comments, and updates video descriptions with chapters. Free up to 10,000 quota units per day.</p>
            </div>
            <div className="border border-border p-6">
              <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-2">Supadata.ai</h3>
              <p className="font-body text-sm text-foreground/55 leading-relaxed">The fastest and cleanest way to get YouTube transcripts. Handles auto-generated captions without OAuth complexity. Works on any public video. Returns timestamped segments ready for AI processing.</p>
            </div>
          </div>
          <p className="font-body text-sm text-foreground/40 text-center">Both services are free at the volumes most creators operate at. You pay nothing to Lazy YouTube beyond your Lovable hosting.</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-8"
          >
            One prompt. Five content pieces per video. Forever.
          </motion.h2>
          <div className="border p-8 inline-block" style={{ borderColor: "#c8a961" }}>
            <p className="font-display text-3xl font-bold mb-2">$0</p>
            <p className="font-body text-sm text-foreground/50 mb-4">Free — included with any Lazy Stack install</p>
            <p className="font-body text-xs text-foreground/40 mb-6 max-w-md leading-relaxed">Both APIs have free tiers sufficient for most creators. YouTube Data API: free up to 10,000 units/day. Supadata: free tier available.</p>
            <CopyPromptButton text={promptText} />
            <p className="font-body text-xs text-foreground/30 mt-4 max-w-sm mx-auto">Requires a Google Cloud account for the YouTube API key and a Supadata.ai account for transcripts. Both are free to start.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <LazyFaqSection faqs={faqs} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 md:px-12 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="border p-8" style={{ borderColor: "#c8a961", backgroundColor: "#111110" }}>
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Every video you have ever made deserves a blog post.
            </h2>
            <p className="font-body text-sm text-foreground/50 leading-relaxed max-w-md mx-auto mb-6">
              You already did the work. You filmed it. You edited it. You uploaded it. Lazy YouTube makes sure the internet can find it — on Google, on ChatGPT, on Perplexity — not just on YouTube.
            </p>
            <CopyPromptButton text={promptText} />
            <p className="font-body text-xs text-foreground/30 mt-4">Paste into your Lovable project. Connect your YouTube API key and Supadata key. Your first video is processed automatically.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
