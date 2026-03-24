import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Copy, ExternalLink, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const platforms = [
  { name: "Lovable", url: "https://lovable.dev", description: "Build apps and websites by chatting with AI" },
  { name: "Polsia", url: "https://polsia.com", description: "AI that runs your company while you sleep" },
  { name: "Naïve", url: "https://usenaive.ai", description: "Describe your company. Naïve builds it." },
];

const LaunchPage = () => {
  const [prompt, setPrompt] = useState("");
  const [redirecting, setRedirecting] = useState<typeof platforms[number] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLaunch = async (platform: typeof platforms[number]) => {
    let didCopy = false;
    if (prompt.trim()) {
      try { await navigator.clipboard.writeText(prompt.trim()); didCopy = true; } catch {}
    }
    setCopied(didCopy);
    setRedirecting(platform);
    setTimeout(() => { window.open(platform.url, "_blank", "noopener,noreferrer"); setRedirecting(null); }, 3000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Launch Your Autonomous Startup | Lazy Unicorn" description="Describe your startup idea and launch it instantly with Lovable, Polsia, or Naïve." url="/launch" />
      <Navbar activePage="home" />

      <main className="pt-28 pb-32 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-bold">Launch Pad</p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] mb-4">What will you build?</h1>
          </motion.div>

          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center">1</span>
            <span className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/40">Describe your idea</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="border border-border bg-card px-8 py-8 mb-6">
            <label className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/40 mb-3 block">Your startup idea</label>
            <Textarea
              value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. An AI-powered marketplace that matches freelance designers with startups..."
              className="min-h-[140px] bg-background border-border text-foreground placeholder:text-foreground/20 focus-visible:ring-foreground/20 resize-none text-base"
            />
            <p className="font-body text-xs text-foreground/20 mt-2">Be as detailed as you want.</p>
          </motion.div>

          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center">2</span>
            <span className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/40">Pick a platform</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="border border-border bg-card px-8 py-8">
            <p className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/40 mb-5 text-center">Choose your launchpad</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button key={platform.name} onClick={() => handleLaunch(platform)} className="group border border-border hover:border-foreground/30 bg-background hover:bg-secondary transition-all duration-300 p-6 text-left">
                  <p className="font-display text-lg font-extrabold text-foreground mb-1">{platform.name}</p>
                  <p className="font-body text-xs text-foreground/30 mb-4 leading-relaxed">{platform.description}</p>
                  <span className="inline-flex items-center justify-center gap-1.5 w-full font-body text-[10px] tracking-[0.15em] uppercase bg-foreground text-background px-4 py-2 group-hover:opacity-90 transition-all">
                    {prompt.trim() ? <><Copy size={10} /> Copy & Go</> : <><ExternalLink size={10} /> Start</>}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {redirecting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="border border-border bg-card px-10 py-10 text-center max-w-md mx-6">
              <Loader2 size={32} className="text-foreground animate-spin mx-auto mb-5" />
              <p className="font-display text-2xl font-extrabold text-foreground mb-2">{copied ? "Prompt copied!" : `Heading to ${redirecting.name}`}</p>
              {copied && <p className="font-body text-sm text-foreground/40 mb-3">Paste it into {redirecting.name} to get started.</p>}
              <p className="font-body text-sm text-foreground/30">Redirecting to <span className="text-foreground font-semibold">{redirecting.name}</span>…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchPage;
