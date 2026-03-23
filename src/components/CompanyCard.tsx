import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface CompanyCardProps {
  name: string;
  url: string;
  description: string;
  index: number;
  thumbnail?: string;
  isPaid?: boolean;
  slug?: string;
}

const CUSTOM_PAGES: Record<string, string> = {
  naive: "/company/naive",
  polsia: "/company/polsia",
  "lazy-blogger": "/lazy-blogger",
};

const CompanyCard = ({ name, url, description, index, thumbnail, isPaid, slug }: CompanyCardProps) => {
  const customPage = slug ? CUSTOM_PAGES[slug] : undefined;
  const hasDetailPage = customPage || (isPaid && slug);
  const detailUrl = customPage || `/company/${slug}`;

  const content = (
    <>
      <div className="flex items-center gap-4">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={`${name} logo`}
            className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border"
          />
        )}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            {isPaid && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-0.5 font-body text-[10px] tracking-wider uppercase font-semibold">
                <Star size={10} className="fill-primary" />
                Pro
              </span>
            )}
          </div>
          <p className="font-body text-lg text-foreground/40 mt-2 max-w-xl leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <span className="font-body text-[10px] tracking-[0.15em] uppercase text-foreground/30 group-hover:text-foreground/60 transition-colors shrink-0 ml-4">
        {hasDetailPage ? "View ↗" : "Visit ↗"}
      </span>
    </>
  );

  const className = "group flex items-center justify-between py-5 border-b border-foreground/10 cursor-pointer hover:pl-2 transition-all duration-300";

  if (hasDetailPage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.06 }}
      >
        <Link to={detailUrl} className={className}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className={className}
    >
      {content}
    </motion.a>
  );
};

export default CompanyCard;
