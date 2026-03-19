import { motion } from "framer-motion";

interface CompanyCardProps {
  name: string;
  category: string;
  description: string;
  index: number;
}

const CompanyCard = ({ name, category, description, index }: CompanyCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      className="group border-b border-border py-6 px-2 cursor-pointer hover:bg-secondary/40 transition-colors duration-300"
    >
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg md:text-xl font-medium text-foreground group-hover:text-accent transition-colors tracking-wide">
            {name}
          </h3>
          <p className="font-body text-sm text-muted-foreground mt-1 leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
        <span className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground shrink-0">
          {category}
        </span>
      </div>
    </motion.div>
  );
};

export default CompanyCard;
