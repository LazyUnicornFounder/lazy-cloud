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
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.9] text-foreground drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
            The robots
            <br />
            are working
            <br />
            so you
            <br />
            don't have to.
          </h1>
        </motion.div>

        {/* Retro sticker */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 120 }}
          className="absolute top-[18%] right-8 md:right-16 lg:right-24"
        >
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64">
            {/* Sticker body — starburst shape via SVG */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
              <path
                d="M100 0 L118 38 L158 18 L144 58 L188 58 L158 82 L188 112 L148 106 L154 148 L118 124 L100 164 L82 124 L46 148 L52 106 L12 112 L42 82 L12 58 L56 58 L42 18 L82 38 Z"
                fill="hsl(40, 95%, 55%)"
                stroke="hsl(25, 90%, 45%)"
                strokeWidth="2"
              />
              <circle cx="100" cy="88" r="58" fill="hsl(0, 85%, 55%)" />
              <circle cx="100" cy="88" r="52" fill="none" stroke="hsl(40, 95%, 55%)" strokeWidth="2" strokeDasharray="4 3" />
            </svg>
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
              <span className="font-display text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-background/60 mb-0.5">
                ★ alert ★
              </span>
              <span className="font-display text-base sm:text-lg md:text-xl font-extrabold leading-[1.1] text-center text-background px-6">
                Autonomous
                <br />
                capitalism
                <br />
                is here.
              </span>
              <span className="font-body text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-background/50 mt-1">
                est. 2026
              </span>
            </div>
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
