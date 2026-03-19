import { useState } from "react";
import { motion } from "framer-motion";
import CompanyCard from "@/components/CompanyCard";
import SubmitForm from "@/components/SubmitForm";
import { companies } from "@/data/companies";

const Index = () => {
  const [submitOpen, setSubmitOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-[200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <span className="font-display text-lg font-bold tracking-tight text-gradient-primary">
          Lazy CEO
        </span>
        <button
          onClick={() => setSubmitOpen(true)}
          className="bg-gradient-primary text-primary-foreground font-body font-medium px-4 py-1.5 rounded-full text-xs tracking-wide hover:opacity-90 transition-opacity"
        >
          Submit
        </button>
      </nav>

      {/* Hero */}
      <header className="relative z-10 text-center px-6 pt-16 pb-12 md:pt-28 md:pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.95] text-gradient-hero">
            Lazy CEO
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed"
        >
          A curated directory of the companies building AI that starts, runs, and scales businesses autonomously.
        </motion.p>
      </header>

      {/* Directory */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 pb-24">
        <div className="space-y-3">
          {companies.map((company, i) => (
            <CompanyCard
              key={company.name}
              name={company.name}
              url={company.url}
              description={company.description}
              index={i}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center font-body text-xs text-muted-foreground tracking-wider">
        Lazy CEO © 2026
      </footer>

      {/* Submit Modal */}
      <SubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default Index;
