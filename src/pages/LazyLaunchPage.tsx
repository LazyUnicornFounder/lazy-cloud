import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Copy, Check, ExternalLink, RotateCcw, ChevronLeft,
  Loader2, AlertCircle, Sparkles, X
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface EngineResult {
  engine_name: string;
  relevance: string;
  headline: string;
  description: string;
  questions: string[];
}

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const LazyLaunchPage = () => {
  const [step, setStep] = useState(1);
  const [idea, setIdea] = useState("");
  const [engines, setEngines] = useState<EngineResult[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyse = async () => {
    if (!idea.trim()) { toast.error("Describe your business idea first."); return; }
    setLoading(true); setLoadingText("Analysing your business idea..."); setError("");
    try {
      const { data, error: fnError } = await supabase.functions.invoke("lazy-launch", { body: { mode: "analyse", idea: idea.trim() } });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setEngines(data.engines || []);
      setSelected(new Set((data.engines || []).filter((e: EngineResult) => e.relevance === "high").map((e: EngineResult) => e.engine_name)));
      setStep(2);
    } catch (e: any) { setError(e?.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const generate = async () => {
    setLoading(true); setLoadingText("Building your autonomous business prompt..."); setError(""); setStep(4);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("lazy-launch", {
        body: { mode: "generate", idea: idea.trim(), brandName, audience, siteUrl, engines: Array.from(selected), answers },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setGeneratedPrompt(data.prompt || "");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
    } catch (e: any) { setError(e?.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const toggleEngine = (name: string) => {
    setSelected(prev => { const next = new Set(prev); if (next.has(name)) next.delete(name); else next.add(name); return next; });
  };
  const selectAll = () => setSelected(new Set(engines.map(e => e.engine_name)));
  const clearAll = () => setSelected(new Set());
  const setAnswer = (engine: string, question: string, value: string) => {
    setAnswers(prev => ({ ...prev, [engine]: { ...(prev[engine] || {}), [question]: value } }));
  };
  const copyPrompt = () => { navigator.clipboard.writeText(generatedPrompt); setCopied(true); toast.success("Prompt copied to clipboard"); setTimeout(() => setCopied(false), 2000); };
  const startOver = () => { setStep(1); setIdea(""); setEngines([]); setSelected(new Set()); setAnswers({}); setBrandName(""); setAudience(""); setSiteUrl(""); setGeneratedPrompt(""); setError(""); };
  const selectedEngines = engines.filter(e => selected.has(e.engine_name));

  return (
    <>
      <SEO title="Lazy Launch — Free Autonomous Business Prompt Generator" description="Describe your business idea and get a complete Lovable prompt that installs autonomous engines." url="https://lazyunicorn.ai/lazy-launch" />
      <Navbar />
      <main className="min-h-screen bg-[#0a0a08] text-[#f0ead6] pt-24 pb-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.section key="step1" initial="hidden" animate="visible" exit="hidden" variants={fadeUp} className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 border border-[#f0ead6]/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] mb-6">
                  <Sparkles className="w-3.5 h-3.5" />Free Tool
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>What are you building?</h1>
                <p className="text-[#f0ead6]/60 text-lg max-w-xl mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Describe your business idea and we will show you every way to make it autonomous.</p>
              </div>
              <Textarea value={idea} onChange={e => setIdea(e.target.value)} placeholder="e.g. A newsletter about AI tools for designers. A Twitch channel about extraction games. A SaaS tool for freelance developers. A dropshipping store selling eco-friendly products." className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 min-h-[160px] rounded-none text-base focus:border-[#f0ead6]/50 resize-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }} />
              {error && (
                <div className="flex items-center gap-2 mt-4 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" /><span>{error}</span>
                  <button onClick={analyse} className="underline ml-2">Retry</button>
                </div>
              )}
              <Button onClick={analyse} disabled={loading} className="w-full mt-6 h-14 bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90 rounded-none text-base font-semibold uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {loading ? <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />{loadingText}</span> : "Show me how to automate this →"}
              </Button>
            </motion.section>
          )}
          {step === 4 && (
            <motion.section key="step4" ref={resultRef} initial="hidden" animate="visible" exit="hidden" variants={fadeUp} className="max-w-4xl mx-auto px-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#f0ead6]/60" />
                  <p className="text-[#f0ead6]/60 text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{loadingText}</p>
                </div>
              ) : error ? (
                <div className="text-center py-32">
                  <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={generate} variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10">Retry</Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#f0ead6]/40 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your autonomous business prompt — ready to paste into Lovable</p>
                    <h2 className="font-display text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Prompt Generated</h2>
                  </div>
                  <div className="border border-[#f0ead6]/20 bg-[#0a0a08] p-6 max-h-[60vh] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-[#f0ead6]/80 select-all" style={{ fontFamily: "'Space Grotesk', monospace" }}>{generatedPrompt}</pre>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    <Button onClick={copyPrompt} className="rounded-none bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90 gap-2">
                      {copied ? <><Check className="w-4 h-4" />Copied ✓</> : <><Copy className="w-4 h-4" />Copy Prompt</>}
                    </Button>
                    <Button asChild variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10 gap-2">
                      <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4" />Open Lovable</a>
                    </Button>
                    <Button onClick={startOver} variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10 gap-2">
                      <RotateCcw className="w-4 h-4" />Start Over
                    </Button>
                  </div>
                  <p className="text-center text-[#f0ead6]/40 text-sm mt-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Paste this into your existing Lovable project. Each engine installs independently — you can add more later.</p>
                </>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Modal for steps 2 & 3 */}
        <AnimatePresence>
          {(step === 2 || step === 3) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0a0a08]/95 backdrop-blur-sm flex items-start justify-center overflow-y-auto">
              <div className="w-full max-w-4xl px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#f0ead6]/40" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Step {step} of 4 — {step === 2 ? "Select your engines" : "Configure your engines"}</p>
                  <button onClick={() => { setStep(1); setError(""); }} className="text-[#f0ead6]/40 hover:text-[#f0ead6]"><X className="w-5 h-5" /></button>
                </div>
                <Progress value={step === 2 ? 50 : 75} className="mb-8 h-1 bg-[#f0ead6]/10 rounded-none [&>div]:bg-[#f0ead6] [&>div]:rounded-none" />

                {step === 2 && (
                  <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                    <div className="text-center mb-8">
                      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Here is how to make your business autonomous.</h2>
                      <p className="text-[#f0ead6]/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Select everything you want to automate. We will build the prompt for you.</p>
                    </div>
                    <div className="flex gap-3 mb-6">
                      <button onClick={selectAll} className="text-xs uppercase tracking-[0.15em] border border-[#f0ead6]/20 px-3 py-1.5 text-[#f0ead6]/60 hover:text-[#f0ead6] hover:border-[#f0ead6]/40 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Select All</button>
                      <button onClick={clearAll} className="text-xs uppercase tracking-[0.15em] border border-[#f0ead6]/20 px-3 py-1.5 text-[#f0ead6]/60 hover:text-[#f0ead6] hover:border-[#f0ead6]/40 transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Clear All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
                      {engines.map(engine => {
                        const isSelected = selected.has(engine.engine_name);
                        return (
                          <button key={engine.engine_name} onClick={() => toggleEngine(engine.engine_name)} className={`text-left border p-5 transition-all ${isSelected ? "border-[#f0ead6] bg-[#f0ead6]/5" : "border-[#f0ead6]/15 hover:border-[#f0ead6]/30"}`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className={`text-xs uppercase tracking-[0.15em] px-2 py-0.5 border ${engine.relevance === "high" ? "border-green-500/40 text-green-400" : "border-yellow-500/40 text-yellow-400"}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{engine.relevance}</span>
                                <h3 className="text-lg font-bold mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>{engine.engine_name}</h3>
                              </div>
                              <Checkbox checked={isSelected} onCheckedChange={() => toggleEngine(engine.engine_name)} className="border-[#f0ead6]/30 data-[state=checked]:bg-[#f0ead6] data-[state=checked]:text-[#0a0a08] rounded-none mt-1" />
                            </div>
                            <p className="text-[#f0ead6]/80 text-sm font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{engine.headline}</p>
                            <p className="text-[#f0ead6]/50 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{engine.description}</p>
                          </button>
                        );
                      })}
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a08] border-t border-[#f0ead6]/10 p-4 z-50">
                      <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <p className="text-sm text-[#f0ead6]/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{selected.size} engine{selected.size !== 1 ? "s" : ""} selected</p>
                        <Button onClick={() => setStep(3)} disabled={selected.size === 0} className="rounded-none bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90 disabled:opacity-30" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Configure my automation →</Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                    <div className="text-center mb-8">
                      <h2 className="font-display text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Configure your engines</h2>
                      <p className="text-[#f0ead6]/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Answer a few questions so we can generate a precise prompt.</p>
                    </div>
                    <div className="border border-[#f0ead6]/20 p-6 mb-6">
                      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>General</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs uppercase tracking-[0.15em] text-[#f0ead6]/50 block mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What is your brand name?</label>
                          <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. Acme Labs" className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 rounded-none focus:border-[#f0ead6]/50" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-[0.15em] text-[#f0ead6]/50 block mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What is your target audience?</label>
                          <Input value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. Solo developers shipping SaaS products" className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 rounded-none focus:border-[#f0ead6]/50" />
                        </div>
                        <div>
                          <label className="text-xs uppercase tracking-[0.15em] text-[#f0ead6]/50 block mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>What is the URL of your Lovable project or site?</label>
                          <Input value={siteUrl} onChange={e => setSiteUrl(e.target.value)} placeholder="e.g. https://my-app.lovable.app" className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 rounded-none focus:border-[#f0ead6]/50" />
                        </div>
                      </div>
                    </div>
                    {selectedEngines.map(engine => (
                      <div key={engine.engine_name} className="border border-[#f0ead6]/20 p-6 mb-4">
                        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{engine.engine_name}</h3>
                        <div className="space-y-4">
                          {engine.questions.map((q, i) => (
                            <div key={i}>
                              <label className="text-xs uppercase tracking-[0.15em] text-[#f0ead6]/50 block mb-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{q}</label>
                              <Input value={answers[engine.engine_name]?.[q] || ""} onChange={e => setAnswer(engine.engine_name, q, e.target.value)} placeholder="Your answer..." className="bg-[#0a0a08] border-[#f0ead6]/20 text-[#f0ead6] placeholder:text-[#f0ead6]/30 rounded-none focus:border-[#f0ead6]/50" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 mt-8 mb-16">
                      <Button onClick={() => setStep(2)} variant="outline" className="rounded-none border-[#f0ead6]/20 text-[#f0ead6] hover:bg-[#f0ead6]/10 gap-2"><ChevronLeft className="w-4 h-4" />Back</Button>
                      <Button onClick={generate} className="flex-1 rounded-none bg-[#f0ead6] text-[#0a0a08] hover:bg-[#f0ead6]/90" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Generate my prompt →</Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default LazyLaunchPage;