import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-[200px] right-[-150px] w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <span className="font-display text-lg font-bold tracking-tight text-gradient-primary">
          Lazy Unicorn
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
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body text-sm md:text-base font-medium tracking-wide text-accent mb-4"
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Built with Lovable by someone who couldn't be bothered.
          </motion.span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.95] text-gradient-hero">
            Lazy Unicorn
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-body text-base md:text-lg text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed"
        >
          A directory of every company making sure you never have to work again.
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
        Lazy Unicorn © 2026
      </footer>

      {/* Submit Modal */}
      <SubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default Index;
