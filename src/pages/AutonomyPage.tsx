import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import {
  LEVEL_LABELS,
  LEVEL_COLORS,
  LEVEL_BG_TINTS,
  ENGINE_CATEGORIES,
  type EngineData,
} from "@/data/autonomyData";

/* ── Level Scale ── */
function LevelScale() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <p className="text-[14px] font-mono uppercase tracking-widest text-foreground/65 mb-3 text-center">
        The Autonomy Scale
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-0 border border-border">
        {LEVEL_LABELS.map((label, i) => (
          <div
            key={i}
            className="p-3 border-b sm:border-b-0 sm:border-r last:border-r-0 text-center"
            style={{ backgroundColor: LEVEL_BG_TINTS[i] }}
          >
            <span
              className="text-lg font-bold font-display block"
              style={{ color: LEVEL_COLORS[i] }}
            >
              {i}
            </span>
            <span
              className="text-[14px] font-mono block mt-1"
              style={{ color: LEVEL_COLORS[i], opacity: 0.8 }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Agent Card ── */
function EngineCard({ agent }: { agent: EngineData }) {
  const [selectedLevel, setSelectedLevel] = useState(agent.currentLevel);
  const trackRef = useRef<HTMLDivElement>(null);

  const color = LEVEL_COLORS[selectedLevel];
  const currentColor = LEVEL_COLORS[agent.currentLevel];
  const currentPct = (agent.currentLevel / 5) * 100;

  // Determine glow intensity for the fixed dot
  const glowClass =
    agent.currentLevel === 5
      ? "animate-pulse shadow-[0_0_12px_3px]"
      : agent.currentLevel === 4
        ? "animate-pulse shadow-[0_0_8px_2px]"
        : "";

  return (
    <div className="border border-border p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {agent.link ? (
              <Link to={agent.link} className="hover:underline">
                {agent.name}
              </Link>
            ) : (
              agent.name
            )}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {agent.description}
          </p>
        </div>
        <span
          className="text-[14px] font-mono whitespace-nowrap px-2 py-0.5 border"
          style={{
            color: currentColor,
            borderColor: currentColor + "44",
          }}
        >
          L{agent.currentLevel}
        </span>
      </div>

      {/* Slider Track */}
      <div className="space-y-1">
        <div className="relative" ref={trackRef}>
          {/* Background track – gradient */}
          <div
            className="w-full h-[3px] relative"
            style={{
              background: `linear-gradient(to right, ${LEVEL_COLORS[0]}, ${LEVEL_COLORS[2]}, ${LEVEL_COLORS[3]}, ${LEVEL_COLORS[4]}, ${LEVEL_COLORS[5]})`,
              opacity: 0.25,
            }}
          />

          {/* Active fill */}
          <div
            className="absolute top-0 left-0 h-[3px] transition-all duration-200"
            style={{
              width: `${(selectedLevel / 5) * 100}%`,
              background: `linear-gradient(to right, ${LEVEL_COLORS[0]}, ${color})`,
            }}
          />

          {/* Fixed "current level" dot */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10 ${glowClass}`}
            style={{
              left: `${currentPct}%`,
              transform: `translate(-50%, -50%)`,
              backgroundColor: currentColor,
              boxShadow: glowClass ? `0 0 10px ${currentColor}` : undefined,
            }}
          >
            <span
              className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono whitespace-nowrap"
              style={{ color: currentColor }}
            >
              today
            </span>
          </div>
        </div>

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={5}
          step={1}
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(Number(e.target.value))}
          className="w-full autonomy-slider"
          style={
            {
              "--thumb-color": color,
              accentColor: color,
            } as React.CSSProperties
          }
        />

        {/* Level labels */}
        <div className="flex justify-between">
          {LEVEL_LABELS.map((_, i) => (
            <span
              key={i}
              className="text-[13px] font-mono cursor-pointer"
              style={{
                color: i === selectedLevel ? LEVEL_COLORS[i] : "rgba(240,234,214,0.2)",
              }}
              onClick={() => setSelectedLevel(i)}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Dynamic text block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLevel}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="p-5 md:p-6 border border-border rounded-sm"
          style={{
            backgroundColor: LEVEL_BG_TINTS[selectedLevel],
            borderLeft: `3px solid ${color}`,
          }}
        >
          <span
            className="text-sm font-mono block mb-2 tracking-wide"
            style={{ color }}
          >
            Level {selectedLevel} — {LEVEL_LABELS[selectedLevel]}
            {selectedLevel === agent.currentLevel && " ← today"}
          </span>
          <p
            className="text-base md:text-lg leading-relaxed font-medium"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {agent.levels[selectedLevel]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Main Page ── */
export default function AutonomyPage() {
  return (
    <>
      <SEO
        title="Autonomy Levels — Lazy Unicorn"
        description="Explore what each Lazy agent does at every level of autonomy — from fully manual to self-improving."
      />
      <Navbar />

      {/* Hero */}
      <section
        className="max-w-4xl mx-auto px-4 min-h-screen flex flex-col items-center justify-center text-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-foreground mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How autonomous is your business?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Most tools automate tasks. Lazy Unicorn agent automate outcomes.
          Drag the slider on any agent to see what autonomy looks like at each
          level — and where each agent sits today.
        </motion.p>
        <LevelScale />
      </section>

      {/* Agent Cards by Category */}
      <section className="max-w-6xl mx-auto px-4 pb-24 space-y-20">
        {ENGINE_CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <h2 className="text-[14px] font-mono uppercase tracking-widest text-muted-foreground mb-6">
              {cat.label}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              {cat.agents.map((agent) => (
                <EngineCard key={agent.name} agent={agent} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer CTA */}
      <section
        className="border-t border-border py-20 px-4"
        style={{ backgroundColor: "#0a0a08" }}
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Every agent starts at Level 3. The self-improving ones reach
            Level 5.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Most automation tools live at Level 2 — they run on a schedule you
            set and never change. Lazy Unicorn agent are generative at minimum
            and self-improving at their best. They do not just execute tasks.
            They measure results, rewrite what does not work, and compound over
            time. That is the difference between a tool and an agent.
          </p>
          <Link
            to="/lazy-run"
            className="inline-block text-sm font-mono px-5 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
          >
            Install Lazy Run — all twenty-five agent in one prompt
          </Link>
        </div>
      </section>

      {/* Slider CSS */}
      <style>{`
        .autonomy-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          background: transparent;
          outline: none;
          margin-top: -13px;
          position: relative;
          z-index: 5;
          cursor: pointer;
        }
        .autonomy-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 0;
          background: var(--thumb-color, hsl(45 80% 55%));
          cursor: grab;
          border: 2px solid rgba(240,234,214,0.4);
        }
        .autonomy-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 0;
          background: var(--thumb-color, hsl(45 80% 55%));
          cursor: grab;
          border: 2px solid rgba(240,234,214,0.4);
        }
        .autonomy-slider:active::-webkit-slider-thumb {
          cursor: grabbing;
          transform: scale(1.15);
        }
        .autonomy-slider:active::-moz-range-thumb {
          cursor: grabbing;
          transform: scale(1.15);
        }
      `}</style>
    </>
  );
}
