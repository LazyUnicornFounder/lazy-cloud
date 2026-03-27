import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Rocket, Copy, Check, Loader2, Store, Briefcase, Camera, Globe, ShoppingBag, Calendar, PenLine, Newspaper, Music, LayoutDashboard, Code, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { toast } from "sonner";

const TEMPLATES = [
  {
    icon: Briefcase,
    name: "SaaS Platform",
    idea: "A B2B SaaS platform that helps small businesses automate their invoicing and expense tracking with AI-powered categorisation, recurring billing, and financial reports.",
    category: "SaaS",
  },
  {
    icon: ShoppingBag,
    name: "E-Commerce Store",
    idea: "An artisan home goods e-commerce store selling handcrafted ceramics, candles, and textiles with a refined editorial aesthetic, product filtering, and Stripe checkout.",
    category: "E-commerce",
  },
  {
    icon: Camera,
    name: "Portfolio & Resume",
    idea: "A minimalist photography portfolio for a wedding photographer, featuring full-bleed image galleries, client testimonials, a booking inquiry form, and an about page.",
    category: "Portfolio",
  },
  {
    icon: Globe,
    name: "Landing Page",
    idea: "A dark, polished product launch landing page for a new AI writing tool — featuring a hero with animated demo, feature grid, pricing table, FAQ accordion, and email waitlist.",
    category: "Websites",
  },
  {
    icon: Calendar,
    name: "Event Site",
    idea: "A professional tech conference website with speaker lineup, multi-track schedule, ticket tiers with Stripe integration, venue info with embedded map, and sponsor logos.",
    category: "Events",
  },
  {
    icon: PenLine,
    name: "Blog / Newsletter",
    idea: "A magazine-style lifestyle blog with featured articles, category filtering, author bios, newsletter signup, and a clean reading experience optimised for long-form content.",
    category: "Blog",
  },
  {
    icon: Newspaper,
    name: "Editorial / News",
    idea: "A subscription-ready digital news publication with breaking news ticker, section-based navigation, premium content paywalling, and a professional editorial layout.",
    category: "Editorial",
  },
  {
    icon: Music,
    name: "Music / Artist",
    idea: "A cinematic one-page website for an indie musician — featuring an embedded music player, tour dates, merch store link, press kit download, and social media integration.",
    category: "Music",
  },
  {
    icon: LayoutDashboard,
    name: "Internal Tool",
    idea: "An internal expense reporting and approval tool with submission forms, manager approval workflows, reimbursement tracking, CSV export, and role-based access control.",
    category: "Internal Tools",
  },
  {
    icon: Store,
    name: "Local Business",
    idea: "A premium barbershop website with online booking system, service menu with pricing, staff profiles, gallery of work, Google Maps embed, and customer reviews.",
    category: "Local Business",
  },
  {
    icon: Heart,
    name: "Wedding Site",
    idea: "An elegant wedding invitation website with the couple's story timeline, event details, venue directions, RSVP form with meal preferences, photo gallery, and registry links.",
    category: "Wedding",
  },
  {
    icon: Code,
    name: "Developer Tool",
    idea: "A developer-focused micro-SaaS landing page for an API monitoring service — with live status dashboard demo, code snippets, pricing tiers, documentation link, and GitHub integration badge.",
    category: "Dev Tools",
  },
];

export default function LazyLaunchPage() {
  const trackEvent = useTrackEvent();
  const [idea, setIdea] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectTemplate = (template: typeof TEMPLATES[0]) => {
    setIdea(template.idea);
    setActiveTemplate(template.name);
    trackEvent("lazy_launch_template", { template: template.name });
    setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  };

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
        description="Pick a template or describe your business idea and get a production-ready Lovable prompt for a stunning landing page in the Lazy Unicorn style."
      />
      <Navbar activePage="home" />

      {/* Hero */}
      <header className="relative z-10" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6 px-6 pt-32 pb-16 text-center"
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
            Pick a template or describe your own. Get a Lovable prompt.
          </p>

          {/* Template Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-4xl mt-10"
          >
            <p
              className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-6"
              style={{ color: "#f0ead6", opacity: 0.25 }}
            >
              Choose a Template
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {TEMPLATES.map((t, i) => {
                const Icon = t.icon;
                const isActive = activeTemplate === t.name;
                return (
                  <motion.button
                    key={t.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                    onClick={() => selectTemplate(t)}
                    className="flex flex-col items-center gap-2 px-4 py-5 border text-center transition-all duration-200 hover:border-[rgba(240,234,214,0.35)]"
                    style={{
                      backgroundColor: isActive ? "rgba(240,234,214,0.08)" : "#111110",
                      borderColor: isActive ? "rgba(240,234,214,0.35)" : "rgba(240,234,214,0.08)",
                      borderRadius: 0,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: "#f0ead6", opacity: isActive ? 0.9 : 0.4 }}
                    />
                    <span
                      className="text-[11px] tracking-[0.1em] uppercase font-medium"
                      style={{ color: "#f0ead6", opacity: isActive ? 0.9 : 0.5 }}
                    >
                      {t.name}
                    </span>
                    <span
                      className="text-[9px] tracking-[0.05em] uppercase"
                      style={{ color: "#f0ead6", opacity: 0.2 }}
                    >
                      {t.category}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Divider */}
          <div className="w-full max-w-2xl mt-10 flex items-center gap-4">
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(240,234,214,0.08)" }} />
            <span
              className="text-[10px] tracking-[0.2em] uppercase font-semibold"
              style={{ color: "#f0ead6", opacity: 0.2 }}
            >
              or describe your own
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "rgba(240,234,214,0.08)" }} />
          </div>

          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="w-full max-w-2xl mt-4"
          >
            <textarea
              ref={inputRef}
              value={idea}
              onChange={(e) => {
                setIdea(e.target.value);
                setActiveTemplate(null);
              }}
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
