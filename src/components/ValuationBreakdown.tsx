import { motion } from "framer-motion";

const metrics = [
  { label: "Listings", value: "2+", note: "approved startups" },
  { label: "Content", value: "AI-gen", note: "autonomous publishing" },
  { label: "Revenue", value: "SaaS", note: "pro listings" },
  { label: "Stack", value: "AI-built", note: "zero employees" },
  { label: "Target", value: "$1B", note: "unicorn status" },
];

const ValuationBreakdown = () => (
  <>
    <p className="font-display text-lg font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-1">
      Valuation
    </p>
    <p className="font-body text-[11px] text-primary font-semibold leading-relaxed mb-4">
      On a mission to build an autonomous unicorn with Lovable.
    </p>

    <div className="space-y-1.5">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex items-center justify-between py-1.5 border-b border-dashed border-foreground/10 last:border-b-0"
        >
          <div>
            <p className="font-display text-[12px] font-bold tracking-wide uppercase text-foreground/70">
              {m.label}
            </p>
            <p className="font-body text-[11px] text-foreground/40">{m.note}</p>
          </div>
          <span className="font-display text-sm font-extrabold text-primary shrink-0 ml-3">
            {m.value}
          </span>
        </motion.div>
      ))}
    </div>

    <div className="mt-4 p-2.5 rounded-xl border border-primary/20 bg-primary/5">
      <p className="font-display text-[11px] tracking-[0.15em] uppercase text-primary/60 mb-0.5">
        Current Stage
      </p>
      <p className="font-display text-xl font-extrabold text-primary">
        Pre-revenue
      </p>
      <p className="font-body text-[12px] text-foreground/40 mt-0.5">
        Every feature adds equity.
      </p>
    </div>
  </>
);

export default ValuationBreakdown;
