import { useState } from "react";
import { motion } from "framer-motion";
import CompanyCard from "@/components/CompanyCard";
import { companies } from "@/data/companies";

const categories = ["All", ...Array.from(new Set(companies.map((c) => c.category)))];

const Index = () => {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? companies : companies.filter((c) => c.category === active);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-center gap-6 md:gap-8 py-6 px-4 border-b border-border font-body text-sm text-muted-foreground flex-wrap">
        {["Directory", "About", "Submit", "Newsletter"].map((item) => (
          <a key={item} href="#" className="hover:text-foreground transition-colors tracking-wide">
            {item}
          </a>
        ))}
      </nav>

      {/* Hero */}
      <header className="text-center px-6 pt-20 pb-16 md:pt-32 md:pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-medium tracking-wide leading-[0.95]"
          style={{ fontVariant: "small-caps" }}
        >
          Self-Building<br />Companies.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-body text-base md:text-lg text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed"
        >
          A curated directory of the companies building AI that starts, runs, and scales businesses autonomously.
        </motion.p>
      </header>

      {/* Filter */}
      <div className="flex items-center justify-center gap-3 px-4 pb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`font-body text-xs uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border transition-all duration-200 ${
              active === cat
                ? "border-accent text-accent bg-accent/10"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Directory */}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        <div className="border-t border-border">
          {filtered.map((company, i) => (
            <CompanyCard
              key={company.name}
              name={company.name}
              category={company.category}
              description={company.description}
              index={i}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="font-body text-muted-foreground text-center py-16">No companies in this category yet.</p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center font-body text-xs text-muted-foreground tracking-wider uppercase">
        Autonomous Companies © 2026
      </footer>
    </div>
  );
};

export default Index;
