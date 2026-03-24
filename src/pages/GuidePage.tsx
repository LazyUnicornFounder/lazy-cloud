import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Lightbulb, Hammer, Bot, TrendingUp, Compass, Rocket, ChevronDown, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const steps = [
  { num: "01", icon: Lightbulb, title: "Find Your Idea", subtitle: "One sentence. One problem.", details: ["What problem are you solving?", "Who pays for the solution?", "Write it in one sentence — if you can't, it's not clear enough yet."] },
  { num: "02", icon: Hammer, title: "Build with AI", subtitle: "Describe it. Ship it. Same day.", details: ["Go to lovable.dev, polsia.com, or usenaive.ai and describe your product.", "Database, auth, UI, deployment — all handled.", "Working prototype by end of day."] },
  { num: "03", icon: Rocket, title: "Ship Content", subtitle: "SEO is your growth loop seed.", details: ["Write 3–5 long-form posts about your space.", "Use Claude to draft. Edit for your voice.", "Or use Lazy Blogger to auto-publish up to 32 SEO posts/day. → /lazy-blogger"] },
  { num: "04", icon: TrendingUp, title: "Add Monetisation", subtitle: "Validate early. Even $1 counts.", details: ["Integrate Stripe or Polar.", "A simple paid tier proves the model.", "Revenue > vanity metrics."] },
  { num: "05", icon: Bot, title: "Deploy Agents", subtitle: "Let the robots handle ops.", details: ["Set up autonomous operations — outbound, content, support.", "Start with one agent. Expand as you calibrate.", "You review weekly, not daily."] },
  { num: "06", icon: Compass, title: "Compound", subtitle: "The system grows. You direct.", details: ["Review weekly. Let the loops do their work.", "Add features based on data, not intuition.", "Autonomy is the destination — not the starting state."] },
];

const StepCard = ({ step, index }: { step: (typeof steps)[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.08 }} className="w-full max-w-lg mx-auto">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left border border-border bg-card p-6 md:p-8 transition-all duration-300 hover:bg-secondary cursor-pointer">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{step.num}</span>
            <div className="w-12 h-12 bg-foreground/10 flex items-center justify-center"><Icon className="w-6 h-6 text-foreground/60" /></div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <h3 className="font-display text-lg md:text-xl font-bold text-foreground">{step.title}</h3>
            <p className="font-body text-sm text-muted-foreground mt-1">{step.subtitle}</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 mt-2">
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
              <div className="pt-5 mt-5 border-t border-border">
                <ul className="space-y-3">
                  {step.details.map((d, i) => {
                    const linkMatch = d.match(/^(.+?)\s*→\s*(\/\S+)$/);
                    return (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3">
                        <ArrowRight className="w-4 h-4 text-foreground/30 shrink-0 mt-0.5" />
                        {linkMatch ? <Link to={linkMatch[2]} className="font-body text-sm text-foreground hover:underline">{linkMatch[1]} →</Link> : <span className="font-body text-sm text-foreground/60">{d}</span>}
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Guide — How to Build an Autonomous Unicorn" description="A step-by-step guide to building an autonomous business as a solo founder." url="/guide" />
      <Navbar activePage="guide" />

      <div className="pt-36 pb-12 px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4 font-bold">Interactive Guide</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-4 leading-[1.05]">How to Build an<br />Autonomous Unicorn</h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md mx-auto">Six steps. One founder. Zero excuses.<br /><span className="text-foreground/30 text-base">Tap each step to explore.</span></p>
        </motion.div>
      </div>

      <div className="px-4 md:px-6 pb-20 space-y-4">
        {steps.map((step, i) => <StepCard key={step.num} step={step} index={i} />)}

        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-lg mx-auto mt-12 text-center">
          <div className="border border-border bg-card p-8 md:p-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-4 text-foreground">Now go build it.</h2>
            <p className="font-body text-sm text-muted-foreground mt-2 mb-6">The infrastructure exists. The tools are cheap. The only missing piece is you.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/launch" className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase bg-foreground text-background px-6 py-3 font-semibold hover:opacity-90 transition-opacity">
                Launch Startup <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <footer className="px-8 md:px-12 py-8 border-t border-border">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/30">Lazy Unicorn © 2026</span>
      </footer>
    </div>
  );
};

export default GuidePage;
