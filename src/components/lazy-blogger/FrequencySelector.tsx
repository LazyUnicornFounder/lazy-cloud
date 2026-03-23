import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { frequencyTiers, type FrequencyTier } from "./frequencyData";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

interface FrequencySelectorProps {
  selected: FrequencyTier;
  onSelect: (tier: FrequencyTier) => void;
}

export default function FrequencySelector({ selected, onSelect }: FrequencySelectorProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-24">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-4"
      >
        How fast do you want to publish?
      </motion.h2>
      <p className="font-body text-sm text-muted-foreground text-center mb-10">
        Pick your publishing frequency. The prompt adjusts automatically.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {frequencyTiers.map((tier, i) => {
          const isSelected = tier.postsPerDay === selected.postsPerDay;
          return (
            <motion.button
              key={tier.postsPerDay}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.08 }}
              onClick={() => onSelect(tier)}
              className={`rounded-2xl border p-6 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(var(--primary-rgb),0.15)]"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-primary" : "bg-primary/10"}`}>
                  <Zap size={14} className={isSelected ? "text-primary-foreground" : "text-primary"} />
                </div>
                <span className="font-display text-2xl font-extrabold text-foreground">{tier.postsPerDay}</span>
              </div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">{tier.label}</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">{tier.description}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
