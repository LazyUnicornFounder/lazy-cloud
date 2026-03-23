import { motion } from "framer-motion";
import { Search } from "lucide-react";

const seoKeywords = [
  "best ai tools for founders",
  "autonomous business software",
  "seo automation platform",
  "ai content marketing",
  "rank higher on google",
  "automated blog writing",
  "keyword gap analysis",
  "solo founder seo strategy",
  "ai seo optimisation",
  "organic traffic growth",
  "long-tail keyword tool",
  "content that ranks itself",
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
  const duration = 20 + (index % 5) * 4;
  const delay = (index / total) * -duration;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none"
      style={{ x: startX, y: startY }}
      animate={{
        x: [
          startX,
          Math.cos(angle + Math.PI * 0.5) * radiusX,
          Math.cos(angle + Math.PI) * radiusX,
          Math.cos(angle + Math.PI * 1.5) * radiusX,
          startX,
        ],
        y: [
          startY,
          Math.sin(angle + Math.PI * 0.5) * radiusY,
          Math.sin(angle + Math.PI) * radiusY,
          Math.sin(angle + Math.PI * 1.5) * radiusY,
          startY,
        ],
        rotate: [0, 6, -4, 2, 0],
      }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    >
      <div
        className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] flex items-center gap-2 whitespace-nowrap"
        style={{ opacity: 0.5 + (index % 3) * 0.15 }}
      >
        <Search size={12} className="text-primary shrink-0" />
        <span className="font-body text-[11px] text-foreground/70 tracking-wide">{title}</span>
      </div>
    </motion.div>
  );
}

function ConveyorRow({ direction, speed, yOffset }: { direction: 1 | -1; speed: number; yOffset: number }) {
  const titles = direction === 1 ? seoKeywords : [...seoKeywords].reverse();
  const doubled = [...titles, ...titles];

  return (
    <div
      className="absolute w-full overflow-hidden pointer-events-none"
      style={{ top: `calc(50% + ${yOffset}px)` }}
    >
      <motion.div
        className="flex gap-4"
        animate={{ x: direction === 1 ? [0, -(titles.length * 240)] : [-(titles.length * 240), 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((title, i) => (
          <div
            key={`${title}-${i}`}
            className="shrink-0 rounded-xl border border-primary/15 bg-card/40 backdrop-blur-sm px-4 py-2.5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)] flex items-center gap-2"
          >
            <Search size={11} className="text-primary/60 shrink-0" />
            <span className="font-body text-[10px] text-foreground/50 tracking-wide whitespace-nowrap">{title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function FlyingSeoCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {seoKeywords.slice(0, 8).map((title, i) => (
        <FloatingCard key={title} title={title} index={i} total={8} />
      ))}
      <ConveyorRow direction={1} speed={45} yOffset={-220} />
      <ConveyorRow direction={-1} speed={38} yOffset={220} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
