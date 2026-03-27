import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, Check, ExternalLink, RotateCcw, Loader2, AlertCircle, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const LazyLaunchPage = () => {
  const [idea, setIdea] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!idea.trim()) { toast.error("Describe your idea first."); return; }
    setLoading(true); setError(""); setPrompt("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("lazy-launch", { body: { mode: "analyse", idea: idea.trim() } });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      // Use the engines to auto-generate a prompt in one step
      const engineNames = (data.engines || []).map((e: any) => e.engine_name);
      const { data: d2, error: e2 } = await supabase.functions.invoke("lazy-launch", {
        body: { mode: "generate", idea: idea.trim(), brandName: "", audience: "", siteUrl: "", engines: engineNames, answers: {} },
      });
      if (e2) throw e2;
      if (d2?.error) throw new Error(d2.error);
      setPrompt(d2.prompt || "");
    } catch (e: any) { setError(e?.message || "Something went wrong."); }
    finally { setLoading(false); }
  };

  const copyPrompt = () => { navigator.clipboard.writeText(prompt); setCopied(true); toast.success("Copied"); setTimeout(() => setCopied(false), 2000); };

  return (
    <>
      <SEO title="Lazy Launch — Free Prompt Generator" description="Turn any business idea into an autonomous Lovable prompt." url="https://lazyunicorn.ai/lazy-launch" />
      <Navbar />
      <main className="min-h-screen bg-[#0a0a08] text-[#f0ead6] pt-24 pb-16">
        <motion.section initial="hidden" animate="visible" variants={fadeUp} className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 border border-[#f0ead6]/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] mb-6">
              <Sparkles className="w-3.5 h-3.5" />Free
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Describe it. We automate it.
            </h1>
            <p className="text-[#f0ead6]/50 text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              One idea → a complete autonomous business prompt for Lovable.
            </p>
          </div>

          <Textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="e.g. AI newsletter for designers, Twitch gaming channel, freelancer SaaS, eco dropshipping store…"
            className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 min-h-[120px] rounded-none text-base focus:border-[#f0ead6]/50 resize-none"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />

          {error && (
            <div className="flex items-center gap-2 mt-4 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" /><span>{error}</span>
              <button onClick={generate} className="underline ml-2">Retry</button>
            </div>
          )}

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full mt-5 h-13 bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90 rounded-none text-base font-semibold uppercase tracking-wider"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Generating…</span> : "Generate prompt →"}
          </Button>

          {/* Result */}
          {prompt && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mt-10">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f0ead6]/40 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Your prompt — paste into Lovable
              </p>
              <div className="border border-[#f0ead6]/20 bg-[#0a0a08] p-6 max-h-[50vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-[#f0ead6]/80 select-all" style={{ fontFamily: "'Space Grotesk', monospace" }}>{prompt}</pre>
              </div>
              <div className="flex flex-wrap gap-3 mt-5">
                <Button onClick={copyPrompt} className="rounded-none bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90 gap-2">
                  {copied ? <><Check className="w-4 h-4" />Copied</> : <><Copy className="w-4 h-4" />Copy</>}
                </Button>
                <Button asChild variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10 gap-2">
                  <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />Open Lovable</a>
                </Button>
                <Button onClick={() => { setPrompt(""); setIdea(""); setError(""); }} variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10 gap-2">
                  <RotateCcw className="w-4 h-4" />Reset
                </Button>
              </div>
            </motion.div>
          )}
        </motion.section>
      </main>
    </>
  );
};

export default LazyLaunchPage;