import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import unicornBg from "@/assets/unicorn-beach.png";
import CompanyCard from "@/components/CompanyCard";
import SubmitSection from "@/components/SubmitSection";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import BlogTicker from "@/components/BlogTicker";

const Index = () => {

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
      <SEO
        url="/"
        breadcrumbs={[{ name: "Home", url: "/" }]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Lazy Unicorn",
        "url": "https://www.lazyunicorn.ai",
        "description": "The definitive directory of AI-powered autonomous companies that let you start, run, and scale businesses while you sleep.",
        "image": "https://www.lazyunicorn.ai/og-image.png",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.lazyunicorn.ai/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Lazy Unicorn",
          "url": "https://www.lazyunicorn.ai",
          "logo": { "@type": "ImageObject", "url": "https://www.lazyunicorn.ai/og-image.png" },
          "sameAs": ["https://x.com/SaadSahawneh"]
        }
      })}} />
      {companies.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Autonomous Company Directory",
          "description": "AI-powered autonomous companies directory",
          "itemListElement": companies.map((c, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": c.name,
            "url": c.url,
          })),
        })}} />
      )}
      {/* Full-bleed background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Nav — centered, frosted pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="flex items-center gap-6 bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="font-display text-sm font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Lazy Unicorn
          </a>
          <span className="w-px h-4 bg-foreground/20" />
          <a
            href="#directory"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Directory
          </a>
          <a
            href="/blog"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Blog
          </a>
          <a
            href="#mission"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Mission
          </a>
          <a
            href="#submit"
            className="font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Submit
          </a>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <a
            href="https://x.com/SaadSahawneh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          >
            Follow on 𝕏
          </a>
          <a
            href="https://www.linkedin.com/in/saadsahawneh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
          >
            Follow on LinkedIn
          </a>
        </div>
      </nav>

      {/* Hero — full viewport, architectural feel */}
      <header className="relative z-10 min-h-screen flex flex-col justify-center items-start px-8 md:px-12 pb-16">
        {/* Entrance sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-[-0.5rem] ml-2 md:ml-4"
        >
          <svg viewBox="0 0 500 80" className="w-[300px] sm:w-[420px] md:w-[540px] h-auto overflow-visible drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <defs>
              <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="200" height="200">
                <rect width="200" height="200" fill="hsl(28, 50%, 25%)" />
                <line x1="0" y1="15" x2="200" y2="18" stroke="hsl(28, 40%, 20%)" strokeWidth="1.5" opacity="0.6" />
                <line x1="0" y1="35" x2="200" y2="32" stroke="hsl(28, 45%, 22%)" strokeWidth="1" opacity="0.4" />
                <line x1="0" y1="55" x2="200" y2="58" stroke="hsl(28, 40%, 20%)" strokeWidth="2" opacity="0.3" />
                <line x1="0" y1="80" x2="200" y2="77" stroke="hsl(28, 35%, 18%)" strokeWidth="1" opacity="0.5" />
              </pattern>
            </defs>

            {/* Horizontal plank */}
            <rect x="0" y="15" width="500" height="14" rx="3" fill="url(#woodGrain)" />
            <rect x="0" y="15" width="500" height="14" rx="3" fill="hsl(28, 55%, 30%)" opacity="0.5" />
            <line x1="0" y1="15" x2="500" y2="15" stroke="hsl(35, 60%, 45%)" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="29" x2="500" y2="29" stroke="hsl(20, 40%, 12%)" strokeWidth="0.5" opacity="0.5" />

            {/* Left post */}
            <rect x="10" y="10" width="10" height="70" rx="2" fill="url(#woodGrain)" />
            <rect x="10" y="10" width="10" height="70" rx="2" fill="hsl(28, 55%, 28%)" opacity="0.5" />

            {/* Right post */}
            <rect x="480" y="10" width="10" height="70" rx="2" fill="url(#woodGrain)" />
            <rect x="480" y="10" width="10" height="70" rx="2" fill="hsl(28, 55%, 28%)" opacity="0.5" />

            {/* Main text */}
            <text x="250" y="26" fill="hsl(40, 90%, 65%)" fontSize="13" fontWeight="800" letterSpacing="0.18em" textAnchor="middle" style={{ fontFamily: "'Syne', system-ui, sans-serif" }}>
              AUTONOMOUS CAPITALISM FOR THE REST OF US
            </text>

            {/* Sub text */}
            <text x="250" y="58" fill="hsl(40, 70%, 50% / 0.6)" fontSize="8" letterSpacing="0.25em" textAnchor="middle" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              ★  EST. 2026  ★
            </text>
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-block bg-background/60 backdrop-blur-2xl rounded-3xl px-10 py-8 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
           <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.9] text-foreground">
            Never work
            <br />
            again.
          </h1>
          <p className="font-body text-sm sm:text-base md:text-lg text-foreground/60 mt-4 max-w-md leading-relaxed">
            A directory of AI companies that let you start, run, and scale businesses while you sleep.
          </p>
        </motion.div>

        {/* Blog Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 left-0 right-0"
        >
          <BlogTicker />
        </motion.div>
      </header>


      {/* Directory */}
      <main id="directory" className="relative z-10 px-8 md:px-12 pt-16 pb-32 scroll-mt-20">
        <div className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-8"
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

      <SubmitSection />

      {/* Blog CTA */}
      <section className="relative z-10 px-8 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            Blog
          </p>
          <p className="font-body text-lg text-foreground/50 leading-relaxed mb-6">
            Read our latest post on the rise of autonomous capitalism — and why your next startup might run itself.
          </p>
          <Link
            to="/blog"
            className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Read the blog →
          </Link>
        </motion.div>
      </section>

      {/* Mission */}
      <section id="mission" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
        <div className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4"
          >
            Mission
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-body text-lg md:text-xl text-foreground/70 leading-relaxed"
          >
            Accelerate the future of autonomous capitalism.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default Index;
