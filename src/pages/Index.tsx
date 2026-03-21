import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import unicornBg from "@/assets/unicorn-beach.png";
import CompanyCard from "@/components/CompanyCard";
import SubmitSection from "@/components/SubmitSection";
import PitchDeck from "@/components/PitchDeck";

import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import BlogTicker from "@/components/BlogTicker";
import Navbar from "@/components/Navbar";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

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
        "description": "A directory of autonomous company builders that let you start, run and scale your startup, while agents handle everything.",
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

      {/* Blog Ticker at top */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>

      <Navbar activePage="home" />

      {/* Hero — full viewport, architectural feel */}
      <header className="relative z-10 min-h-screen flex flex-col justify-center items-start px-8 md:px-12 pb-16">
        {/* Entrance sign + Hero box wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center"
        >
          <a
            href="https://www.producthunt.com/products/lazy-unicorn?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-lazy-unicorn"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3"
          >
            <img
              alt="Lazy Unicorn - Discover tools to launch your autonomous startup. | Product Hunt"
              width="250"
              height="54"
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1103538&theme=dark&t=1774065246015"
            />
          </a>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-[-1px] relative z-10"
          >
            <div className="bg-background/60 backdrop-blur-2xl border border-foreground/10 border-b-0 rounded-t-2xl px-6 py-2.5 inline-block shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
              <p className="font-display text-[10px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] uppercase text-primary">
                Autonomous capitalism for the rest of us
              </p>
              <p className="font-body text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-foreground/60 text-center mt-1">
                ★  EST. 2026  ★
              </p>
            </div>
          </motion.div>

          <div className="bg-background/60 backdrop-blur-2xl rounded-3xl px-10 py-8 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.9] text-foreground">
              Never work
              <br />
              again.
            </h1>
            <p className="font-body text-sm sm:text-base md:text-lg text-foreground/60 mt-4 max-w-xl leading-relaxed">
              Discover AI tools for solo founders to build autonomous startups.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#directory"
                className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                Directory
              </a>
              <a
                href="#submit"
                className="inline-block font-body text-[11px] tracking-[0.15em] uppercase border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary/40 px-6 py-2.5 rounded-full font-semibold transition-colors active:scale-[0.97]"
              >
                Submit your startup
              </a>
            </div>
          </div>
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

      {/* About */}
      <section id="about" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
        <div className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4"
          >
            About
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            <p className="font-body text-lg md:text-xl text-foreground/70 leading-relaxed">
              I'm obsessed with self-building startups — companies that design, ship, and scale themselves with AI agents doing the heavy lifting.
            </p>
            <p className="font-body text-base text-foreground/50 leading-relaxed">
              Lazy Unicorn exists to become the definitive, self-building directory of the best tools and platforms that help anyone launch and run a business without lifting a finger. My mission is simple: make it possible for all of us to become lazy unicorns — founders who own thriving companies without burning out building them.
            </p>
            <p className="font-body text-base text-foreground/50 leading-relaxed">
              The directory itself is a living experiment in autonomous capitalism with a goal of becoming an autonomous business.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://x.com/SaadSahawneh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5"
              >
                Follow me on 𝕏
              </a>
              <a
                href="https://www.linkedin.com/in/saadsahawneh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5"
              >
                Connect on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      <PitchDeck />


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
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4"
          >
            <p className="font-body text-lg md:text-xl text-foreground/70 leading-relaxed">
              Accelerate the future of autonomous capitalism.
            </p>
            <p className="font-body text-base text-foreground/50 leading-relaxed">
              I'm trying to build Lazy Unicorn into a $1 billion autonomous startup that runs itself, sell it, and then invest in a new project. For now I'd like to find companies similar to Polsia and Naive to grow the directory, and find cool new ways to grow Lazy Unicorn autonomously.
            </p>
          </motion.div>
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
