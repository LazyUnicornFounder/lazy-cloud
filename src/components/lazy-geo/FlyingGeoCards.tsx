import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const geoQueries = [
  "what is the best ai tool for solo founders",
  "how to automate my business with ai",
  "best autonomous company builder",
  "ai tools for content marketing",
  "how to rank in chatgpt answers",
  "generative engine optimisation guide",
  "ai citation optimisation strategy",
  "best ai directory for startups",
  "how to get mentioned by perplexity",
  "autonomous seo tools comparison",
  "ai powered business automation",
  "how to appear in ai search results",
];

interface FloatingCardProps {
  title: string;
  index: number;
  total: number;
}

function FloatingCard({ title, index, total }: FloatingCardProps) {
  const angle = (index / total) * Math.PI * 2;
  const radiusX = 420 + (index % 3) * 80;
  const radiusY = 200 + (index % 2) * 60;
  const startX = Math.cos(angle) * radiusX;
  const startY = Math.sin(angle) * radiusY;
  const duration = 22 + (index % 5) * 3;
  const delay = (index / total) * -duration;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ x: startX, y: startY }}
      animate={{
        x: [startX, Math.cos(angle + Math.PI * 0.5) * radiusX, Math.cos(angle + Math.PI) * radiusX, Math.cos(angle + Math.PI * 1.5) * radiusX, startX],
        y: [startY, Math.sin(angle + Math.PI * 0.5) * radiusY, Math.sin(angle + Math.PI) * radiusY, Math.sin(angle + Math.PI * 1.5) * radiusY, startY],
        rotate: [0, 5, -3, 2, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    >
      <div
        className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] flex items-center gap-2 whitespace-nowrap"
        style={{ opacity: 0.5 + (index % 3) * 0.15 }}
      >
        <Brain size={12} className="text-primary shrink-0" />
        <span className="font-body text-[11px] text-foreground/70 tracking-wide">{title}</span>
      </div>
    </motion.div>
  );
}

function ConveyorRow({ direction, speed, yOffset }: { direction: 1 | -1; speed: number; yOffset: number }) {
  const titles = direction === 1 ? geoQueries : [...geoQueries].reverse();
  const doubled = [...titles, ...titles];

  return (
    <div className="absolute w-full overflow-hidden pointer-events-none" style={{ top: `calc(50% + ${yOffset}px)` }}>
      <motion.div
        className="flex gap-4"
        animate={{ x: direction === 1 ? [0, -(titles.length * 260)] : [-(titles.length * 260), 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((title, i) => (
          <div
            key={`${title}-${i}`}
            className="shrink-0 rounded-xl border border-primary/15 bg-card/40 backdrop-blur-sm px-4 py-2.5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)] flex items-center gap-2"
          >
            <Brain size={11} className="text-primary/60 shrink-0" />
            <span className="font-body text-[10px] text-foreground/50 tracking-wide whitespace-nowrap">{title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function FlyingGeoCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {geoQueries.slice(0, 8).map((title, i) => (
        <FloatingCard key={title} title={title} index={i} total={8} />
      ))}
      <ConveyorRow direction={1} speed={50} yOffset={-220} />
      <ConveyorRow direction={-1} speed={42} yOffset={220} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
