import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

interface PricingSectionProps {
  onSubmitClick: () => void;
}

const PricingSection = ({ onSubmitClick }: PricingSectionProps) => {
  return (
    <section id="pricing" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
      <div className="max-w-3xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-8"
        >
          Pricing
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-transparent backdrop-blur-xl-3xl rounded-2xl border border-primary/20 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] flex flex-col"
          >
            <p className="font-body text-[14px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
              Lazy
            </p>
            <p className="font-display text-4xl font-extrabold text-foreground">
              Free
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-6">
              Forever free
            </p>

            <ul className="space-y-3 flex-1">
              {[
                "Listed in the directory",
                "Basic name + tagline",
                "Link to your website",
                "Manual review & approval",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/60">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onSubmitClick}
              className="mt-6 w-full font-body text-[13px] tracking-[0.15em] uppercase border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary/40 px-6 py-2.5 rounded-full font-semibold transition-colors"
            >
              Get Started
            </button>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-transparent backdrop-blur-xl-3xl rounded-2xl border border-primary/30 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col"
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-1">
              <p className="font-body text-[14px] tracking-[0.2em] uppercase text-primary">
                Pro
              </p>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-body text-[13px] tracking-wider uppercase font-semibold">
                <Sparkles size={9} />
                Popular
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="font-display text-4xl font-extrabold text-foreground">$5</p>
              <span className="font-body text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-6">
              Cancel anytime
            </p>

            <ul className="space-y-3 flex-1">
              {[
                "Everything in Lazy",
                "Dedicated product page",
                "Full description & features list",
                "Logo & screenshot showcase",
                "⭐ Pro badge in directory",
                "Priority placement at top",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/70">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onSubmitClick}
              className="mt-6 w-full font-body text-[13px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Get listed →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
