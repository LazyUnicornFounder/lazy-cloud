import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FloatingProductCTA = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="hidden lg:block fixed right-8 top-32 z-40"
    >
      <Link
        to="/#launch"
        className="group block bg-transparent backdrop-blur-xl rounded-2xl px-5 py-4 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] hover:border-primary/30 transition-all duration-300 w-52"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-primary" />
          <p className="font-display text-xs font-bold text-foreground/80">
            Get your own product page
          </p>
        </div>
        <p className="font-body text-[10px] text-foreground/40 leading-relaxed mb-3">
          Feature your startup with a Pro listing — your own page, screenshots, and a Pro badge.
        </p>
        <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/70 group-hover:text-primary transition-colors font-semibold">
          $5/mo → Learn more
        </span>
      </Link>
    </motion.div>
  );
};

export default FloatingProductCTA;
