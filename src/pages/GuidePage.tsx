import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Lightbulb, Hammer, Bot, TrendingUp, Compass, Rocket, ChevronDown, ArrowRight, Download } from "lucide-react";
import unicornBg from "@/assets/unicorn-beach.png";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

/* ─── step data ─── */
const steps = [
  {
    num: "01",
    icon: Lightbulb,
    title: "Find Your Idea",
    subtitle: "One sentence. One problem.",
    color: "from-amber-400 to-orange-500",
    bgGlow: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    details: [
      "What problem are you solving?",
      "Who pays for the solution?",
      "Write it in one sentence — if you can't, it's not clear enough yet.",
    ],
    emoji: "💡",
  },
  {
    num: "02",
    icon: Hammer,
    title: "Build with AI",
    subtitle: "Describe it. Ship it. Same day.",
    color: "from-fuchsia-400 to-purple-500",
    bgGlow: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/30",
    details: [
      "Go to lovable.dev, polsia.com, or usenaive.ai and describe your product in plain English.",
      "Database, auth, UI, deployment — all handled.",
      "Working prototype by end of day. Zero code.",
    ],
    emoji: "🔨",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Ship Content",
    subtitle: "SEO is your growth loop seed.",
    color: "from-cyan-400 to-blue-500",
    bgGlow: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    details: [
      "Write 3–5 long-form posts about your space.",
      "Use Claude to draft. Edit for your voice.",
      "This is your organic growth foundation.",
      "Or skip it all — use Lazy Blogger to auto-publish up to 32 SEO posts/day on Lovable. → /lazy-blogger",
    ],
    emoji: "🚀",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Add Monetisation",
    subtitle: "Validate early. Even $1 counts.",
    color: "from-emerald-400 to-green-500",
    bgGlow: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    details: [
      "Integrate Stripe or Polar.",
      "A simple paid tier proves the model.",
      "Revenue > vanity metrics.",
    ],
    emoji: "💰",
  },
  {
    num: "05",
    icon: Bot,
    title: "Deploy Agents",
    subtitle: "Let the robots handle ops.",
    color: "from-violet-400 to-indigo-500",
    bgGlow: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    details: [
      "Set up autonomous operations — outbound, content, support.",
      "Start with one agent. Expand as you calibrate.",
      "You review weekly, not daily.",
    ],
    emoji: "🤖",
  },
  {
    num: "06",
    icon: Compass,
    title: "Compound",
    subtitle: "The system grows. You direct.",
    color: "from-rose-400 to-pink-500",
    bgGlow: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    details: [
      "Review weekly. Let the loops do their work.",
      "Add features based on data, not intuition.",
      "Autonomy is the destination — not the starting state.",
    ],
    emoji: "🧭",
  },
];

/* ─── hand-drawn SVG arrow ─── */
const HandArrow = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 40 80"
    fill="none"
    className={`w-8 h-16 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 4 C18 20, 22 35, 20 55 C19 60, 18 62, 20 68"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="4 4"
      opacity="0.5"
    />
    <path
      d="M14 60 L20 72 L26 60"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
    />
  </svg>
);

/* ─── curved connector between cards ─── */
const CurvedConnector = ({ index }: { index: number }) => {
  const isEven = index % 2 === 0;
  return (
    <div className="flex justify-center py-2 md:py-4">
      <motion.div
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <svg
          viewBox="0 0 200 60"
          fill="none"
          className="w-32 md:w-48 h-10 md:h-14 text-foreground/20"
        >
          <motion.path
            d={
              isEven
                ? "M100 2 C120 15, 130 25, 115 35 C100 45, 90 50, 100 58"
                : "M100 2 C80 15, 70 25, 85 35 C100 45, 110 50, 100 58"
            }
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="6 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />
          <motion.path
            d="M94 52 L100 62 L106 52"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

/* ─── step card ─── */
const StepCard = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-lg mx-auto"
    >
      <motion.button
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full text-left relative group rounded-2xl border ${step.borderColor} bg-transparent backdrop-blur-xl p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] cursor-pointer`}
      >
        {/* glow */}
        <div
          className={`absolute -inset-px rounded-2xl ${step.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10`}
        />

        <div className="flex items-start gap-4">
          {/* number + icon */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span className="font-display text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              {step.num}
            </span>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* text */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{step.emoji}</span>
              <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                {step.title}
              </h3>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {step.subtitle}
            </p>
          </div>

          {/* expand indicator */}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="shrink-0 mt-2"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        {/* expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-5 mt-5 border-t border-foreground/10">
                <ul className="space-y-3">
                  {step.details.map((d, i) => {
                    const linkMatch = d.match(/^(.+?)\s*→\s*(\/\S+)$/);
                    return (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        {linkMatch ? (
                          <Link to={linkMatch[2]} className="font-body text-sm text-primary hover:underline">
                            {linkMatch[1]} →
                          </Link>
                        ) : (
                          <span className="font-body text-sm text-foreground/80">
                            {d}
                          </span>
                        )}
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

/* ─── main page ─── */
const GuidePage = () => {
  const [allExpanded, setAllExpanded] = useState(false);

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Guide — How to Build an Autonomous Unicorn"
        description="A step-by-step guide to building an autonomous business as a solo founder. Learn how to build a business with AI, replace your team with AI agents, and create a self-operating company from scratch."
        url="/guide"
        keywords="autonomous business, solo founder, build a business with AI, one person business, AI agents for business, autonomous unicorn, solo founder tools, no code startup, AI startup tools, self-building startup, build without a team, AI company builder, solo CEO, AI founder tools, vibe coding business, build on Lovable, autonomous business platform"
      />

      {/* bg */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Navbar activePage="guide" />

      {/* hero */}
      <div className="relative z-10 pt-36 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">
            Interactive Guide
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mt-4 mb-4 leading-[1.05]">
            How to Build an
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Autonomous Unicorn
            </span>
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Six steps. One founder. Zero excuses.
            <br />
            <span className="text-foreground/50 text-base md:text-lg">Tap each step to explore.</span>
          </p>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="mt-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <HandArrow className="mx-auto text-primary/40" />
        </motion.div>
      </div>

      {/* steps */}
      <div className="relative z-10 px-4 md:px-6 pb-20">
        {steps.map((step, i) => (
          <div key={step.num}>
            <StepCard step={step} index={i} />
            {i < steps.length - 1 && <CurvedConnector index={i} />}
          </div>
        ))}

        {/* final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto mt-12 text-center"
        >
          <div className="rounded-3xl border border-primary/20 bg-transparent backdrop-blur-xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
            <span className="text-4xl">🦄</span>
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-4 text-foreground">
              Now go build it.
            </h2>
            <p className="font-body text-sm text-muted-foreground mt-2 mb-6">
              The infrastructure exists. The tools are cheap.
              <br />
              The only missing piece is you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/launch"
                className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Launch Startup <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="/blog/how-to-build-autonomous-unicorn"
                className="inline-flex items-center gap-2 font-body text-xs tracking-[0.15em] uppercase border border-foreground/20 text-foreground/70 px-6 py-3 rounded-full font-semibold hover:text-primary hover:border-primary/30 transition-colors"
              >
                Read Full Essay <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 pb-20 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default GuidePage;
