import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Copy, ExternalLink, Loader2 } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import FloatingProductCTA from "@/components/FloatingProductCTA";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import unicornBg from "@/assets/unicorn-beach.png";

const platforms = [
  {
    name: "Lovable",
    url: "https://lovable.dev",
    description: "Build apps and websites by chatting with AI",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Polsia",
    url: "https://polsia.com",
    description: "AI that runs your company while you sleep",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Naïve",
    url: "https://usenaive.ai",
    description: "Describe your company. Naïve builds it.",
    color: "from-emerald-500 to-teal-500",
  },
];

const LaunchPage = () => {
  const [prompt, setPrompt] = useState("");
  const [redirecting, setRedirecting] = useState<typeof platforms[number] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleLaunch = async (platform: typeof platforms[number]) => {
    let didCopy = false;
    if (prompt.trim()) {
      try {
        await navigator.clipboard.writeText(prompt.trim());
        didCopy = true;
      } catch {
        // silent
      }
    }
    setCopied(didCopy);
    setRedirecting(platform);

    setTimeout(() => {
      window.open(platform.url, "_blank", "noopener,noreferrer");
      setRedirecting(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Launch Your Autonomous Startup | Lazy Unicorn"
        description="Describe your startup idea and launch it instantly with Lovable, Polsia, or Naïve."
        url="/launch"
      />
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="home" />
      <FloatingProductCTA />

      <main className="relative z-10 pt-28 pb-32 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-4xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full px-5 py-2 mb-6">
              <Rocket size={16} className="text-primary" />
              <span className="font-body text-xs tracking-[0.15em] uppercase text-primary">
                Launch pad
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] mb-4">
              What will you build?
            </h1>
          </motion.div>

          {/* Step 1 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold">1</span>
            <span className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">Describe your idea</span>
          </div>

          {/* Chat box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-6"
          >
            <label className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-3 block">
              Your startup idea
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. An AI-powered marketplace that matches freelance designers with startups needing brand identity work, handling contracts, payments, and revisions autonomously..."
              className="min-h-[140px] bg-background/30 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/40 rounded-xl resize-none text-base"
            />
            <p className="font-body text-xs text-foreground/30 mt-2">
              Be as detailed as you want — the more context, the better.
            </p>
          </motion.div>

          {/* Step 2 */}
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold">2</span>
            <span className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60">Pick a platform</span>
          </div>

          {/* Platform buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <p className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-5 text-center">
              Choose your launchpad
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleLaunch(platform)}
                  className="group relative overflow-hidden rounded-2xl border border-foreground/10 hover:border-primary/40 bg-background/20 hover:bg-background/30 transition-all duration-300 p-6 text-left"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <p className="font-display text-lg font-extrabold text-foreground mb-1">
                      {platform.name}
                    </p>
                    <p className="font-body text-xs text-foreground/40 mb-4 leading-relaxed">
                      {platform.description}
                    </p>
                    <span className="inline-flex items-center justify-center gap-1.5 w-full font-body text-[10px] tracking-[0.15em] uppercase bg-primary text-primary-foreground rounded-full px-4 py-2 group-hover:opacity-90 transition-all">
                      {prompt.trim() ? (
                        <>
                          <Copy size={10} /> Copy your prompt & Go
                        </>
                      ) : (
                        <>
                          <ExternalLink size={10} /> Copy prompt and start
                        </>
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {prompt.trim() && (
              <p className="font-body text-xs text-foreground/30 mt-4 text-center">
                Your prompt will be copied to clipboard when you click a platform.
              </p>
            )}
          </motion.div>

          {/* Lazy Blogger CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 bg-transparent backdrop-blur-xl rounded-3xl px-8 py-8 border border-accent/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">✍️</span>
              <div className="flex-1">
                <p className="font-display text-lg md:text-xl font-extrabold text-foreground mb-1">
                  Need content too?
                </p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed mb-4">
                  Once you've launched your startup, use <span className="text-primary font-semibold">Lazy Blogger</span> to auto-publish up to 32 SEO-optimized blog posts per day — fully autonomous, built for Lovable.
                </p>
                <a
                  href="/lazy-blogger"
                  className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
                >
                  Set up Lazy Blogger →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Redirect overlay */}
      <AnimatePresence>
        {redirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-transparent backdrop-blur-xl rounded-3xl px-10 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] text-center max-w-md mx-6"
            >
              <Loader2 size={32} className="text-primary animate-spin mx-auto mb-5" />
              <p className="font-display text-2xl font-extrabold text-foreground mb-2">
                {copied ? "Prompt copied to clipboard!" : `Heading to ${redirecting.name}`}
              </p>
              {copied && (
                <p className="font-body text-sm text-foreground/50 mb-3">
                  Paste it into {redirecting.name} to get started.
                </p>
              )}
              <p className="font-body text-sm text-foreground/40">
                Shortly redirecting you to{" "}
                <span className="text-primary font-semibold">{redirecting.name}</span>…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchPage;
