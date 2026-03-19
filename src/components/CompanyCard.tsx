import { motion } from "framer-motion";

interface CompanyCardProps {
  name: string;
  url: string;
  description: string;
  index: number;
}

const CompanyCard = ({ name, url, description, index }: CompanyCardProps) => {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="group flex items-baseline justify-between py-5 border-b border-foreground/10 cursor-pointer hover:pl-2 transition-all duration-300"
    >
      <div>
        <h3 className="font-display text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="font-body text-xs text-foreground/40 mt-1 max-w-sm leading-relaxed">
          {description}
        </p>
      </div>
      <span className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/30 group-hover:text-foreground/60 transition-colors shrink-0 ml-4">
        Visit ↗
      </span>
    </motion.a>
  );
};

export default CompanyCard;
