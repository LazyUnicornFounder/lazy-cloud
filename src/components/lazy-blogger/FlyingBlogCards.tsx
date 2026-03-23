import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const blogTitles = [
  "10 Ways AI Runs Your Business",
  "The Future of Autonomous SEO",
  "Why Lazy Founders Win",
  "Content That Writes Itself",
  "Scaling Without a Team",
  "Zero-Effort Marketing Guide",
  "AI Blogging Revolution",
  "Passive Traffic Playbook",
  "Autonomous Growth Hacks",
  "The Post-Human Blog Era",
  "SEO on Autopilot",
  "From Zero to 1000 Posts",
];

interface FloatingCardProps {
  title: string;
  index: number;
  total: number;
}

function FloatingCard({ title, index, total }: FloatingCardProps) {
  // Distribute cards in orbiting paths around the hero
  const angle = (index / total) * Math.PI * 2;
  const radiusX = 420 + (index % 3) * 80;
  const radiusY = 200 + (index % 2) * 60;
  const startX = Math.cos(angle) * radiusX;
  const startY = Math.sin(angle) * radiusY;
  const duration = 18 + (index % 5) * 4;
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
        rotate: [0, 8, -5, 3, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    >
      <div
        className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] flex items-center gap-2 whitespace-nowrap"
        style={{ opacity: 0.5 + (index % 3) * 0.15 }}
      >
        <FileText size={12} className="text-primary shrink-0" />
        <span className="font-body text-[11px] text-foreground/70 tracking-wide">{title}</span>
      </div>
    </motion.div>
  );
}

// Conveyor belt row of blog cards scrolling horizontally
function ConveyorRow({ direction, speed, yOffset }: { direction: 1 | -1; speed: number; yOffset: number }) {
  const titles = direction === 1 ? blogTitles : [...blogTitles].reverse();
  const doubled = [...titles, ...titles];

  return (
    <div
      className="absolute w-full overflow-hidden pointer-events-none"
      style={{ top: `calc(50% + ${yOffset}px)` }}
    >
      <motion.div
        className="flex gap-4"
        animate={{ x: direction === 1 ? [0, -(titles.length * 220)] : [-(titles.length * 220), 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((title, i) => (
          <div
            key={`${title}-${i}`}
            className="shrink-0 rounded-xl border border-primary/15 bg-card/40 backdrop-blur-sm px-4 py-2.5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)] flex items-center gap-2"
          >
            <FileText size={11} className="text-primary/60 shrink-0" />
            <span className="font-body text-[10px] text-foreground/50 tracking-wide whitespace-nowrap">{title}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function FlyingBlogCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Orbiting cards */}
      {blogTitles.slice(0, 8).map((title, i) => (
        <FloatingCard key={title} title={title} index={i} total={8} />
      ))}

      {/* Conveyor belt rows */}
      <ConveyorRow direction={1} speed={40} yOffset={-220} />
      <ConveyorRow direction={-1} speed={35} yOffset={220} />

      {/* Radial glow behind center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
