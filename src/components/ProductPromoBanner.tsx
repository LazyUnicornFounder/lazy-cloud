import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine, Search, Globe } from "lucide-react";

const products = [
  {
    emoji: "✍️",
    icon: PenLine,
    name: "Lazy Blogger",
    tagline: "Autonomous blog posts, every day, forever.",
    href: "/lazy-blogger",
    color: "from-orange-500 to-amber-500",
  },
  {
    emoji: "🔍",
    icon: Search,
    name: "Lazy SEO",
    tagline: "Discover keywords & publish SEO content on autopilot.",
    href: "/lazy-seo",
    color: "from-cyan-500 to-blue-500",
  },
  {
    emoji: "🌐",
    icon: Globe,
    name: "Lazy GEO",
    tagline: "Get cited by ChatGPT, Claude & Perplexity.",
    href: "/lazy-geo",
    color: "from-emerald-500 to-teal-500",
  },
];

interface ProductPromoBannerProps {
  /** Which product page we're on — hide that product from the banner */
  excludeProduct?: "blogger" | "seo" | "geo";
  /** Use the glassmorphism card style (for dark bg pages) */
  glass?: boolean;
}

const ProductPromoBanner = ({ excludeProduct, glass = true }: ProductPromoBannerProps) => {
  const filtered = products.filter((p) => {
    if (excludeProduct === "blogger" && p.name === "Lazy Blogger") return false;
    if (excludeProduct === "seo" && p.name === "Lazy SEO") return false;
    if (excludeProduct === "geo" && p.name === "Lazy GEO") return false;
    return true;
  });

  const containerClass = glass
    ? "px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
    : "bg-card px-8 py-10 border border-border";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={containerClass}
    >
      <p className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-2 text-center">
        Autonomous Agents for Lovable
      </p>
      <p className="font-body text-sm text-foreground/65 text-center mb-6 max-w-md mx-auto">
        Turn your Lovable website into a self-growing asset with a single prompt.
      </p>
      <div className={`grid grid-cols-1 ${filtered.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
        {filtered.map((product) => {
          const Icon = product.icon;
          return (
            <Link
              key={product.name}
              to={product.href}
              className="group relative overflow-hidden border border-foreground/10 hover:border-primary/40 bg-background/20 hover:bg-background/30 transition-all duration-300 p-5 text-left"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{product.emoji}</span>
                  <p className="font-display text-sm font-extrabold text-foreground">
                    {product.name}
                  </p>
                </div>
                <p className="font-body text-sm text-foreground/65 leading-relaxed mb-3">
                  {product.tagline}
                </p>
                <span className="font-body text-[14px] tracking-[0.15em] uppercase text-primary/70 group-hover:text-primary transition-colors font-semibold">
                  Learn more →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProductPromoBanner;
