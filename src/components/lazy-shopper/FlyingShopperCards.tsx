import { motion } from "framer-motion";
import { ShoppingBag, Tag, CreditCard, Package, Star, Truck } from "lucide-react";

const shopItems = [
  { title: "Vintage Leather Bag", price: "$89", icon: ShoppingBag },
  { title: "Organic Face Cream", price: "$24", icon: Star },
  { title: "Wireless Earbuds", price: "$49", icon: Package },
  { title: "Handmade Candle Set", price: "$32", icon: Tag },
  { title: "Running Shoes Pro", price: "$129", icon: Truck },
  { title: "Minimalist Watch", price: "$199", icon: CreditCard },
  { title: "Plant-Based Protein", price: "$38", icon: ShoppingBag },
  { title: "Silk Pillowcase", price: "$55", icon: Star },
  { title: "Ceramic Coffee Mug", price: "$18", icon: Package },
  { title: "Essential Oil Kit", price: "$42", icon: Tag },
  { title: "Yoga Mat Premium", price: "$65", icon: Truck },
  { title: "Bluetooth Speaker", price: "$79", icon: CreditCard },
];

interface FloatingCardProps {
  item: typeof shopItems[0];
  index: number;
  total: number;
}

function FloatingCard({ item, index, total }: FloatingCardProps) {
  const angle = (index / total) * Math.PI * 2;
  const radiusX = 420 + (index % 3) * 80;
  const radiusY = 200 + (index % 2) * 60;
  const startX = Math.cos(angle) * radiusX;
  const startY = Math.sin(angle) * radiusY;
  const duration = 18 + (index % 5) * 4;
  const delay = (index / total) * -duration;
  const Icon = item.icon;

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
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    >
      <div
        className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm px-4 py-3 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] flex items-center gap-3 whitespace-nowrap"
        style={{ opacity: 0.5 + (index % 3) * 0.15 }}
      >
        <Icon size={12} className="text-primary shrink-0" />
        <span className="font-body text-[11px] text-foreground/70 tracking-wide">{item.title}</span>
        <span className="font-display text-[10px] font-bold text-primary">{item.price}</span>
      </div>
    </motion.div>
  );
}

function ConveyorRow({ direction, speed, yOffset }: { direction: 1 | -1; speed: number; yOffset: number }) {
  const items = direction === 1 ? shopItems : [...shopItems].reverse();
  const doubled = [...items, ...items];

  return (
    <div
      className="absolute w-full overflow-hidden pointer-events-none"
      style={{ top: `calc(50% + ${yOffset}px)` }}
    >
      <motion.div
        className="flex gap-4"
        animate={{ x: direction === 1 ? [0, -(items.length * 240)] : [-(items.length * 240), 0] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.title}-${i}`}
              className="shrink-0 rounded-xl border border-primary/15 bg-card/40 backdrop-blur-sm px-4 py-2.5 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)] flex items-center gap-2"
            >
              <Icon size={11} className="text-primary/60 shrink-0" />
              <span className="font-body text-[10px] text-foreground/50 tracking-wide whitespace-nowrap">{item.title}</span>
              <span className="font-display text-[9px] font-bold text-primary/60">{item.price}</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

export default function FlyingShopperCards() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shopItems.slice(0, 8).map((item, i) => (
        <FloatingCard key={item.title} item={item} index={i} total={8} />
      ))}
      <ConveyorRow direction={1} speed={40} yOffset={-220} />
      <ConveyorRow direction={-1} speed={35} yOffset={220} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px]" />
    </div>
  );
}
