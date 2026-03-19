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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group block rounded-xl border border-border bg-card/50 backdrop-blur-sm p-5 cursor-pointer hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
    >
      <h3 className="font-display text-base md:text-lg font-bold text-foreground group-hover:text-gradient-primary transition-colors">
        {name}
      </h3>
      <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed">
        {description}
      </p>
    </motion.a>
  );
};

export default CompanyCard;
