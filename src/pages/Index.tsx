import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import CompanyCard from "@/components/CompanyCard";
import SubmitForm from "@/components/SubmitForm";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [submitOpen, setSubmitOpen] = useState(false);

  const { data: companies = [] } = useQuery({
    queryKey: ["approved-companies"],
    queryFn: async () => {
      const { data } = await supabase
        .from("submissions")
        .select("name, url, tagline")
        .eq("status", "approved")
        .order("created_at", { ascending: true });
      return (data || []).map((c) => ({ name: c.name, url: c.url, description: c.tagline }));
    },
  });

  return (
    <div className="min-h-screen text-foreground relative">
      {/* Full-bleed background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Nav — minimal, floating */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-6">
        <span className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-foreground/90">
          Lazy Unicorn
        </span>
        <div className="flex items-center gap-4">
          <a
            href="#directory"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
          >
            Directory
          </a>
          <a
            href="https://x.com/SaadSahawneh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors"
          >
            Follow on 𝕏
          </a>
          <button
            onClick={() => setSubmitOpen(true)}
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/90 border border-foreground/20 px-5 py-2 hover:bg-foreground/10 transition-colors"
          >
            Submit
          </button>
        </div>
      </nav>

      {/* Hero — full viewport, architectural feel */}
      <header className="relative z-10 min-h-screen flex flex-col justify-end px-8 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-tight leading-[0.9] text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            Lazy
            <br />
            Unicorn
          </h1>
          <div className="mt-6 max-w-md">
            <p className="font-body text-sm md:text-base text-foreground/80 leading-relaxed tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              The robots are working so you don't have to.
            </p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 right-8 md:right-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 rotate-90 origin-center"
          >
            Scroll
          </motion.div>
        </motion.div>
      </header>

      {/* Banner section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 px-8 md:px-12 py-24"
      >
        <div className="max-w-2xl">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            The future is idle
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            Autonomous
            <br />
            Capitalism
            <br />
            <span className="text-foreground/50">is here.</span>
          </h2>
          <p className="font-body text-sm text-foreground/70 mt-6 max-w-sm leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
            The robots are working so you don't have to.
          </p>
        </div>
      </motion.section>

      {/* Directory */}
      <main id="directory" className="relative z-10 px-8 md:px-12 pb-32 scroll-mt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-body text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-8"
          >
            Directory
          </motion.p>
          <div className="space-y-px">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>

      <SubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default Index;
