import { motion } from "framer-motion";
import { ReactNode } from "react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

interface LazyPricingSectionProps {
  lazyFeatures: string[];
  proFeatures: string[];
  proPrice?: string;
  ctaButton: ReactNode;
}

export default function LazyPricingSection({
  lazyFeatures,
  proFeatures,
  proPrice = "$19",
  ctaButton,
}: LazyPricingSectionProps) {
  return (
    <section className="py-20 md:py-28 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14"
        >
          Pricing
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lazy (Free) */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="border border-border p-8 bg-card flex flex-col"
          >
            <h3 className="font-display text-lg font-bold mb-1">Lazy</h3>
            <p className="font-body text-2xl font-bold mb-4">Free</p>
            <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
              {lazyFeatures.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
            <div className="mt-6">{ctaButton}</div>
          </motion.div>

          {/* Pro */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="border-2 border-foreground/30 p-8 bg-card flex flex-col relative"
          >
            <span className="absolute top-4 right-4 bg-foreground/20 text-foreground/50 text-[13px] font-display font-bold uppercase tracking-wider px-3 py-1">
              Coming Soon
            </span>
            <h3 className="font-display text-lg font-bold mb-1">Pro</h3>
            <p className="font-body text-2xl font-bold mb-4">
              {proPrice}
              <span className="text-sm text-muted-foreground font-normal">/month</span>
            </p>
            <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
              {proFeatures.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
            <button
              disabled
              className="mt-6 w-full inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-muted-foreground cursor-not-allowed opacity-50"
            >
              Coming Soon
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
