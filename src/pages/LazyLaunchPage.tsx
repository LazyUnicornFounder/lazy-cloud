import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Rocket, ChevronRight, ChevronLeft, Palette, Layers, Copy, Check,
  Sparkles, Type, Globe, PenTool, Search, Brain, ShoppingCart, CreditCard,
  MessageSquare, Mail, Mic, Tv, Code, GitBranch, Shield, Bell, Send,
  RefreshCw, Radar, LayoutDashboard, Compass, Database as DbIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

/* ── Color palettes ── */
const PALETTES = [
  {
    id: "midnight",
    label: "Midnight Gold",
    desc: "Dark luxury — black canvas with gold accents",
    bg: "#0a0a08", fg: "#f0ead6", accent: "#c8a961",
    css: { background: "60 11% 3%", foreground: "45 75% 96%", primary: "43 45% 60%" },
  },
  {
    id: "ocean",
    label: "Ocean Depth",
    desc: "Deep navy with electric blue highlights",
    bg: "#0b1628", fg: "#e2eaf4", accent: "#3b82f6",
    css: { background: "220 50% 10%", foreground: "214 50% 93%", primary: "217 91% 60%" },
  },
  {
    id: "forest",
    label: "Forest Canopy",
    desc: "Rich greens on a dark woodland base",
    bg: "#0a1208", fg: "#dce8d4", accent: "#22c55e",
    css: { background: "100 30% 5%", foreground: "100 30% 88%", primary: "142 71% 45%" },
  },
  {
    id: "ember",
    label: "Ember Glow",
    desc: "Warm charcoal with fiery orange accents",
    bg: "#1a0f08", fg: "#f5e6d8", accent: "#f97316",
    css: { background: "25 45% 7%", foreground: "25 60% 91%", primary: "25 95% 53%" },
  },
  {
    id: "arctic",
    label: "Arctic Minimal",
    desc: "Clean white with sharp blue-grey accents",
    bg: "#f8fafc", fg: "#0f172a", accent: "#6366f1",
    css: { background: "210 40% 98%", foreground: "222 47% 11%", primary: "239 84% 67%" },
  },
  {
    id: "rose",
    label: "Rose Noir",
    desc: "Dark elegance with dusty pink highlights",
    bg: "#110a0e", fg: "#f0dce4", accent: "#e879a8",
    css: { background: "330 28% 5%", foreground: "330 40% 91%", primary: "336 72% 69%" },
  },
];

/* ── Agent options ── */
const AGENT_OPTIONS = [
  // Unicorn
  { key: "launch", label: "Launch", icon: Rocket, desc: "Landing page generator" },
  { key: "run", label: "Run", icon: Sparkles, desc: "Autonomous orchestrator" },
  // Content
  { key: "blogger", label: "Blogger", icon: PenTool, desc: "Autonomous blog content" },
  { key: "seo", label: "SEO", icon: Search, desc: "Search-optimised articles" },
  { key: "geo", label: "GEO", icon: Brain, desc: "AI-engine citations" },
  { key: "crawl", label: "Crawl", icon: Radar, desc: "Web scraping" },
  { key: "perplexity", label: "Perplexity", icon: Compass, desc: "AI search" },
  { key: "contentful", label: "Contentful", icon: DbIcon, desc: "CMS sync" },
  // Commerce
  { key: "store", label: "Store", icon: ShoppingCart, desc: "Product listings" },
  { key: "drop", label: "Drop", icon: ShoppingCart, desc: "Autonomous dropshipping" },
  { key: "print", label: "Print", icon: ShoppingCart, desc: "Print-on-demand merch" },
  { key: "pay", label: "Pay", icon: CreditCard, desc: "Checkout & payments" },
  { key: "sms", label: "SMS", icon: MessageSquare, desc: "Text notifications" },
  { key: "mail", label: "Mail", icon: Mail, desc: "Email automation" },
  // Media
  { key: "voice", label: "Voice", icon: Mic, desc: "Text-to-podcast" },
  { key: "stream", label: "Stream", icon: Tv, desc: "Twitch → content" },
  { key: "youtube", label: "YouTube", icon: Tv, desc: "Video content" },
  // Dev
  { key: "github", label: "GitHub", icon: Code, desc: "Repo-to-blog" },
  { key: "gitlab", label: "GitLab", icon: GitBranch, desc: "GitLab docs" },
  { key: "linear", label: "Linear", icon: GitBranch, desc: "Issue tracking" },
  { key: "design", label: "Design", icon: LayoutDashboard, desc: "UI generation" },
  { key: "auth", label: "Auth", icon: Shield, desc: "User authentication" },
  { key: "granola", label: "Granola", icon: PenTool, desc: "Meeting intel" },
  // Ops
  { key: "admin", label: "Admin", icon: LayoutDashboard, desc: "Unified dashboard" },
  { key: "alert", label: "Alert", icon: Bell, desc: "Slack alerts" },
  { key: "telegram", label: "Telegram", icon: Send, desc: "Bot notifications" },
  { key: "supabase", label: "Supabase", icon: DbIcon, desc: "Database reports" },
  { key: "security", label: "Security", icon: Shield, desc: "Vuln scanning" },
  // Agents
  { key: "watch", label: "Watch", icon: Radar, desc: "Error monitoring" },
  { key: "fix", label: "Fix", icon: RefreshCw, desc: "Prompt improvement" },
  { key: "build", label: "Build", icon: Code, desc: "Agent writing" },
  { key: "intel", label: "Intel", icon: Brain, desc: "Content strategy" },
  { key: "repurpose", label: "Repurpose", icon: RefreshCw, desc: "Content repurposing" },
  { key: "trend", label: "Trend", icon: Radar, desc: "Trend detection" },
  { key: "churn", label: "Churn", icon: CreditCard, desc: "Churn prevention" },
];

/* ── Font options ── */
const FONT_OPTIONS = [
  { id: "space-grotesk", label: "Space Grotesk", family: "'Space Grotesk', sans-serif", desc: "Technical & clean" },
  { id: "inter", label: "Inter", family: "'Inter', sans-serif", desc: "Neutral & readable" },
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', serif", desc: "Editorial & elegant" },
  { id: "jetbrains", label: "JetBrains Mono", family: "'JetBrains Mono', monospace", desc: "Developer-focused" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif", desc: "Friendly & modern" },
];

/* ── Section options ── */
const SECTION_OPTIONS = [
  { key: "hero", label: "Hero Section", default: true },
  { key: "features", label: "Features Grid", default: true },
  { key: "how-it-works", label: "How It Works", default: true },
  { key: "pricing", label: "Pricing Table", default: true },
  { key: "testimonials", label: "Testimonials", default: false },
  { key: "faq", label: "FAQ Accordion", default: true },
  { key: "blog", label: "Blog Section", default: false },
  { key: "cta", label: "Bottom CTA", default: true },
  { key: "newsletter", label: "Newsletter Signup", default: false },
  { key: "stats", label: "Stats / Social Proof", default: false },
];

const STEPS = [
  { label: "Business", icon: Globe },
  { label: "Colors", icon: Palette },
  { label: "Agents", icon: Layers },
  { label: "Customise", icon: Type },
  { label: "Launch", icon: Rocket },
];

function generatePrompt(state: WizardState): string {
  const palette = PALETTES.find(p => p.id === state.palette) || PALETTES[0];
  const font = FONT_OPTIONS.find(f => f.id === state.font) || FONT_OPTIONS[0];
  const selectedAgents = AGENT_OPTIONS.filter(a => state.agents.includes(a.key));
  const selectedSections = SECTION_OPTIONS.filter(s => state.sections.includes(s.key));

  return `# Lazy Launch — Autonomous Landing Page for Lovable

## Business
- **Name**: ${state.businessName || "[Your Business]"}
- **Tagline**: ${state.tagline || "[Your Tagline]"}
- **Description**: ${state.description || "[Describe what your business does]"}
- **Target Audience**: ${state.audience || "[Who is this for]"}

## Design System

### Color Palette: ${palette.label}
Update \`src/index.css\` with these CSS variables:
\`\`\`css
:root {
  --background: ${palette.css.background};
  --foreground: ${palette.css.foreground};
  --primary: ${palette.css.primary};
}
\`\`\`

### Typography
- Display font: ${font.label} (\`${font.family}\`)
- Body font: ${font.label} (\`${font.family}\`)

## Page Sections
Build the landing page with these sections in order:
${selectedSections.map((s, i) => `${i + 1}. **${s.label}**`).join("\n")}

## Agents to Install
${selectedAgents.length > 0
    ? selectedAgents.map(a => `- **Lazy ${a.label}**: ${a.desc}`).join("\n")
    : "- No agents selected — pure landing page only"}

${selectedAgents.length > 0 ? `
## Agent Integration
For each selected agent above, install the corresponding Lazy prompt from https://lazyunicorn.app to add autonomous capabilities.

### Recommended install order:
${selectedAgents.map((a, i) => `${i + 1}. Lazy ${a.label}`).join("\n")}
` : ""}

## Technical Requirements
- Built with React + Vite + Tailwind CSS + TypeScript
- Use shadcn/ui components
- Responsive design (mobile-first)
- SEO meta tags on every page
- Framer Motion animations
- All colors via CSS custom properties (no hardcoded colors)
${state.customNotes ? `\n## Additional Notes\n${state.customNotes}` : ""}
`;
}

interface WizardState {
  businessName: string;
  tagline: string;
  description: string;
  audience: string;
  palette: string;
  font: string;
  agents: string[];
  sections: string[];
  customNotes: string;
}

const initialState: WizardState = {
  businessName: "",
  tagline: "",
  description: "",
  audience: "",
  palette: "midnight",
  font: "space-grotesk",
  agents: [],
  sections: SECTION_OPTIONS.filter(s => s.default).map(s => s.key),
  customNotes: "",
};

export default function LazyLaunchPage() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(initialState);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const update = (partial: Partial<WizardState>) => setState(prev => ({ ...prev, ...partial }));

  const toggleAgent = (key: string) => {
    setState(prev => ({
      ...prev,
      agents: prev.agents.includes(key) ? prev.agents.filter(k => k !== key) : [...prev.agents, key],
    }));
  };

  const toggleSection = (key: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.includes(key) ? prev.sections.filter(k => k !== key) : [...prev.sections, key],
    }));
  };

  const canProceed = step === 0
    ? state.businessName.trim().length > 0
    : true;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatePrompt(state));
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    setTimeout(() => setCopied(false), 2000);
  }, [state]);

  const prompt = generatePrompt(state);

  return (
    <>
      <SEO
        title="Lazy Launch — Build Your Landing Page in 60 Seconds"
        description="Describe your business, pick your style, select agents, and get a ready-to-paste prompt for Lovable."
      />
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 border border-border px-3 py-1 mb-4">
              <Rocket size={12} className="text-foreground/60" />
              <span className="font-body text-xs text-foreground/60 tracking-widest uppercase">Lazy Launch</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Lazy Launch
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
              Describe your business, pick your style, choose your agents — get a prompt you paste into Lovable.
            </p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {STEPS.map((s, i) => (
              <button
                key={s.label}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-body text-xs transition-colors ${
                  i === step
                    ? "bg-foreground text-background"
                    : i < step
                    ? "text-foreground/70 hover:text-foreground"
                    : "text-foreground/25 cursor-default"
                }`}
              >
                <s.icon size={12} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="border border-border bg-card p-6 md:p-8"
            >
              {/* ── Step 0: Business ── */}
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Tell us about your business</h2>
                    <p className="font-body text-xs text-muted-foreground">This shapes the copy and structure of your landing page.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="font-body text-xs text-foreground/70 block mb-1">Business name *</label>
                      <input
                        value={state.businessName}
                        onChange={e => update({ businessName: e.target.value })}
                        placeholder="Acme Inc."
                        className="w-full bg-background border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-foreground/70 block mb-1">Tagline</label>
                      <input
                        value={state.tagline}
                        onChange={e => update({ tagline: e.target.value })}
                        placeholder="Ship faster with AI"
                        className="w-full bg-background border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-foreground/70 block mb-1">What does your business do?</label>
                      <textarea
                        value={state.description}
                        onChange={e => update({ description: e.target.value })}
                        rows={3}
                        placeholder="We help developers build and ship products 10x faster using autonomous AI agents..."
                        className="w-full bg-background border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 resize-none"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-foreground/70 block mb-1">Target audience</label>
                      <input
                        value={state.audience}
                        onChange={e => update({ audience: e.target.value })}
                        placeholder="Solo founders, indie hackers, small dev teams"
                        className="w-full bg-background border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Colors ── */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Choose your palette</h2>
                    <p className="font-body text-xs text-muted-foreground">Sets the entire design system for your project.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PALETTES.map(p => (
                      <button
                        key={p.id}
                        onClick={() => update({ palette: p.id })}
                        className={`border p-4 text-left transition-all ${
                          state.palette === p.id
                            ? "border-foreground ring-1 ring-foreground"
                            : "border-border hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex gap-1.5 mb-3">
                          <div className="w-6 h-6 rounded-full border border-foreground/10" style={{ background: p.bg }} />
                          <div className="w-6 h-6 rounded-full border border-foreground/10" style={{ background: p.accent }} />
                          <div className="w-6 h-6 rounded-full border border-foreground/10" style={{ background: p.fg }} />
                        </div>
                        <p className="font-body text-xs font-medium text-foreground">{p.label}</p>
                        <p className="font-body text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="font-body text-xs text-foreground/70 mb-3">Typography</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {FONT_OPTIONS.map(f => (
                        <button
                          key={f.id}
                          onClick={() => update({ font: f.id })}
                          className={`border px-3 py-2 text-left transition-all ${
                            state.font === f.id
                              ? "border-foreground"
                              : "border-border hover:border-foreground/30"
                          }`}
                        >
                          <p className="text-sm text-foreground" style={{ fontFamily: f.family }}>{f.label}</p>
                          <p className="font-body text-[10px] text-muted-foreground">{f.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Agents ── */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Select your agents</h2>
                    <p className="font-body text-xs text-muted-foreground">
                      Pick which autonomous agents you want included. You can always add more later.
                    </p>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setState(prev => ({ ...prev, agents: AGENT_OPTIONS.map(a => a.key) }))}
                      className="font-body text-[11px] text-foreground/60 hover:text-foreground border border-border px-2 py-1 transition-colors"
                    >
                      Select all
                    </button>
                    <button
                      onClick={() => setState(prev => ({ ...prev, agents: [] }))}
                      className="font-body text-[11px] text-foreground/60 hover:text-foreground border border-border px-2 py-1 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AGENT_OPTIONS.map(a => {
                      const selected = state.agents.includes(a.key);
                      return (
                        <button
                          key={a.key}
                          onClick={() => toggleAgent(a.key)}
                          className={`flex items-center gap-2.5 border px-3 py-2.5 text-left transition-all ${
                            selected
                              ? "border-foreground bg-foreground/5"
                              : "border-border hover:border-foreground/20"
                          }`}
                        >
                          <a.icon size={14} className={selected ? "text-foreground" : "text-foreground/35"} />
                          <div className="min-w-0">
                            <p className={`font-body text-xs ${selected ? "text-foreground" : "text-foreground/60"}`}>
                              {a.label}
                            </p>
                            <p className="font-body text-[10px] text-muted-foreground truncate">{a.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground">
                    {state.agents.length} agent{state.agents.length !== 1 ? "s" : ""} selected
                  </p>
                </div>
              )}

              {/* ── Step 3: Customise ── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Customise your page</h2>
                    <p className="font-body text-xs text-muted-foreground">Choose which sections to include and add any extra notes.</p>
                  </div>

                  <div>
                    <h3 className="font-body text-xs text-foreground/70 mb-2">Page sections</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {SECTION_OPTIONS.map(s => {
                        const selected = state.sections.includes(s.key);
                        return (
                          <button
                            key={s.key}
                            onClick={() => toggleSection(s.key)}
                            className={`border px-3 py-2 text-left font-body text-xs transition-all ${
                              selected
                                ? "border-foreground text-foreground"
                                : "border-border text-foreground/45 hover:border-foreground/20"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-xs text-foreground/70 block mb-1">
                      Additional notes <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <textarea
                      value={state.customNotes}
                      onChange={e => update({ customNotes: e.target.value })}
                      rows={3}
                      placeholder="Dark mode only, include a demo video section, use animations on scroll..."
                      className="w-full bg-background border border-border px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 4: Launch ── */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground mb-1">Your prompt is ready 🚀</h2>
                    <p className="font-body text-xs text-muted-foreground">
                      Copy this prompt and paste it into a new Lovable project to generate your landing page.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Palette", value: PALETTES.find(p => p.id === state.palette)?.label },
                      { label: "Font", value: FONT_OPTIONS.find(f => f.id === state.font)?.label },
                      { label: "Agents", value: `${state.agents.length} selected` },
                      { label: "Sections", value: `${state.sections.length} sections` },
                    ].map(item => (
                      <div key={item.label} className="border border-border p-3">
                        <p className="font-body text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                        <p className="font-body text-xs text-foreground mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Prompt preview */}
                  <div className="relative">
                    <pre className="bg-background border border-border p-4 font-mono text-[11px] text-foreground/80 max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                      {prompt}
                    </pre>
                    <button
                      onClick={handleCopy}
                      className="absolute top-3 right-3 flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 font-body text-xs hover:bg-foreground/90 transition-colors"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? "Copied!" : "Copy prompt"}
                    </button>
                  </div>

                  <div className="bg-secondary/50 border border-border p-4">
                    <p className="font-body text-xs text-foreground/80">
                      <Sparkles size={12} className="inline mr-1.5 text-primary/60" />
                      <strong>Next step:</strong> Open <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline">lovable.dev</a>,
                      create a new project, paste this prompt, and watch your landing page build itself.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1.5 font-body text-xs text-foreground/60 hover:text-foreground disabled:opacity-20 disabled:cursor-default transition-colors"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed}
                className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2 font-body text-xs hover:bg-foreground/90 disabled:opacity-30 transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-foreground text-background px-4 py-2 font-body text-xs hover:bg-foreground/90 transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy & Launch"}
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
