import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

export default function LazyLaunchPage() {
  const trackEvent = useTrackEvent();
  const [idea, setIdea] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setPrompt("");
    trackEvent("lazy_launch_generate", { idea: idea.slice(0, 80) });

    try {
      const { data, error } = await supabase.functions.invoke("lazy-launch", {
        body: { idea: idea.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPrompt(data.prompt);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate prompt");
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied — paste it into Lovable!");
    trackEvent("lazy_launch_copy");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-foreground relative" style={{ backgroundColor: "#0a0a08" }}>
      <SEO
        title="Lazy Launch — Generate Your Landing Page Prompt"
        url="/lazy-launch"
        description="Describe your business idea and get a production-ready Lovable prompt for a stunning landing page in the Lazy Unicorn style."
      />
      <Navbar activePage="lazy-launch" />

      {/* Hero */}
      <header className="relative z-10" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 pt-32 pb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Rocket className="w-8 h-8 mx-auto mb-4" style={{ color: "#f0ead6", opacity: 0.4 }} />
          </motion.div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              color: "#f0ead6",
              lineHeight: 1.1,
            }}
          >
            Launch Your Idea.
          </h1>

          <p
            className="tracking-[0.2em] uppercase max-w-xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
              color: "#f0ead6",
              opacity: 0.45,
            }}
          >
            Describe your business. Get a production-ready Lovable prompt.
          </p>

          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-2xl mt-8"
          >
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="e.g. An AI-powered resume builder for junior developers that creates tailored CVs in seconds…"
              rows={4}
              disabled={loading}
              className="w-full px-5 py-4 text-base resize-none focus:outline-none focus:ring-1 transition-colors disabled:opacity-50"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                backgroundColor: "#111110",
                color: "#f0ead6",
                border: "1px solid rgba(240,234,214,0.12)",
                borderRadius: 0,
              }}
            />

            <button
              onClick={generate}
              disabled={loading || !idea.trim()}
              className="mt-4 w-full text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                fontFamily: "'Playfair Display', serif",
                backgroundColor: "#f0ead6",
                color: "#0a0a08",
                borderRadius: 0,
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating…
                </>
              ) : (
                "Generate Prompt"
              )}
            </button>
          </motion.div>

          {/* Result */}
          {prompt && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl mt-12 text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[10px] tracking-[0.2em] uppercase font-semibold"
                  style={{ color: "#f0ead6", opacity: 0.4 }}
                >
                  Your Lovable Prompt
                </p>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase font-semibold px-3 py-1.5 border hover:opacity-80 transition-opacity"
                  style={{
                    color: "#f0ead6",
                    borderColor: "rgba(240,234,214,0.2)",
                    borderRadius: 0,
                  }}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed p-6 overflow-auto max-h-[60vh]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  backgroundColor: "#111110",
                  color: "#f0ead6",
                  opacity: 0.85,
                  border: "1px solid rgba(240,234,214,0.08)",
                  borderRadius: 0,
                }}
              >
                {prompt}
              </pre>

              <div className="mt-6 text-center">
                <a
                  href="https://lovable.dev/projects/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97]"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    backgroundColor: "#f0ead6",
                    color: "#0a0a08",
                    borderRadius: 0,
                  }}
                >
                  Open Lovable & Paste
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </header>
    </div>
  );
}
