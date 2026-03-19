import { motion } from "framer-motion";

interface CompanyCardProps {
  name: string;
  category: string;
  description: string;
  index: number;
}

const categoryColors: Record<string, string> = {
  "Full-Stack Automation": "bg-primary/15 text-primary",
  "Code Generation": "bg-accent/15 text-accent",
  "Sales & Outreach": "bg-[hsl(40_90%_60%)]/15 text-[hsl(40_90%_60%)]",
  "Marketing": "bg-[hsl(330_80%_60%)]/15 text-[hsl(330_80%_60%)]",
  "Customer Support": "bg-[hsl(200_90%_60%)]/15 text-[hsl(200_90%_60%)]",
  "Finance": "bg-primary/15 text-primary",
};

const CompanyCard = ({ name, category, description, index }: CompanyCardProps) => {
  const colorClass = categoryColors[category] || "bg-secondary text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 cursor-pointer hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-gradient-primary transition-colors">
            {name}
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
        <span className={`font-body text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${colorClass}`}>
          {category}
        </span>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
