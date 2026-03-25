import { motion } from "framer-motion";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

interface LazyFaqSectionProps {
  faqs: { q: string; a: string }[];
}

export default function LazyFaqSection({ faqs }: LazyFaqSectionProps) {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-12"
        >
          FAQ
        </motion.h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-border p-6 bg-card"
            >
              <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
              <p className="font-body text-sm text-foreground/50 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
