import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import unicornBg from "@/assets/unicorn-beach.png";
import logoNaive from "@/assets/logo-naive.jpg";
import logoPolsia from "@/assets/logo-polsia.jpg";
import CompanyCard from "@/components/CompanyCard";
import SubmitSection from "@/components/SubmitSection";
import PricingSection from "@/components/PricingSection";
import PitchDeck from "@/components/PitchDeck";
import ValuationBreakdown from "@/components/ValuationBreakdown";

import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import BlogTicker from "@/components/BlogTicker";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const Index = () => {
  useTrackVisit();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [location.hash]);

  const logoMap: Record<string, string> = {
    "Naive": logoNaive,
    "Polsia": logoPolsia
  };

  const { data: companies = [] } = useQuery({
    queryKey: ["approved-companies"],
    queryFn: async () => {
      const { data } = await supabase.
      from("submissions").
      select("name, url, tagline, is_paid, slug").
      eq("status", "approved").
      order("is_paid", { ascending: false }).
      order("created_at", { ascending: true });
      return (data || []).map((c) => ({
        name: c.name,
        url: c.url,
        description: c.tagline,
        thumbnail: logoMap[c.name],
        isPaid: c.is_paid,
        slug: c.slug
      }));
    }
  });

  const scrollToLaunch = () => {
    const el = document.querySelector("#launch");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        url="/"
        description="The solo founder's guide to building an autonomous unicorn. Discover AI tools and resources to build a startup that builds itself."
        keywords="autonomous companies, AI business tools, passive income startups, autonomous capitalism, AI agents, self-running business, solo founder tools, startup directory, Lazy Unicorn, self-building startup, one-person unicorn, Lovable, build startup with AI"
        breadcrumbs={[{ name: "Home", url: "/" }]}
        faq={[
          { question: "What is Lazy Unicorn?", answer: "Lazy Unicorn is the definitive directory of AI tools and resources for solo founders building autonomous startups — companies that design, ship, and scale themselves with AI agents." },
          { question: "What is an autonomous startup?", answer: "An autonomous startup is a company that runs itself using AI agents and automation tools. The founder provides the vision while AI handles operations, content, distribution, and scaling." },
          { question: "How do I list my startup on Lazy Unicorn?", answer: "You can submit your AI tool or autonomous company platform to the Lazy Unicorn directory for free. Your listing will be manually reviewed and approved." },
        ]}
        speakable={["h1", ".hero-description"]}
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Lazy Unicorn",
          "url": "https://www.lazyunicorn.ai",
          "description": "Discover AI tools for solo founders to build autonomous startups. The definitive directory of autonomous company builders.",
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
        }) }} />
      {companies.length > 0 &&
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Autonomous Company Directory",
          "description": "AI-powered autonomous companies directory",
          "itemListElement": companies.map((c, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": c.name,
            "url": c.url
          }))
        }) }} />
      }
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
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 w-full">
          {/* Entrance sign + Hero box wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center">
            
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-[-1px] relative z-10">
              
              <div className="bg-transparent backdrop-blur-xl border border-primary/20 border-b-0 rounded-t-2xl px-6 py-2.5 inline-block shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <p className="font-display text-[10px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] uppercase text-primary">
                  Autonomous capitalism for the rest of us
                </p>
                <p className="font-body text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-foreground/60 text-center mt-1">
                  ★  EST. 2026  ★
                </p>
              </div>
            </motion.div>

            <div className="bg-transparent backdrop-blur-xl rounded-3xl px-10 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.95] text-foreground">
                The solo founder's
                <br />
                guide to building an
                <br />
                autonomous unicorn.
              </h1>
              <p className="hero-description font-body text-sm sm:text-base md:text-lg text-foreground/60 mt-4 max-w-xl leading-relaxed">
                Discover AI tools and resources to build a startup that builds itself, and follow my journey as I attempt to build Lazy Unicorn into an autonomous unicorn, using Lovable—as a solo founder.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Link to="/guide"
                className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]">
                  See the Guide
                </Link>
              </div>
            </div>
          </motion.div>

        </div>


      </header>


      {/* Directory */}
      <main id="directory" className="relative z-10 px-8 md:px-12 pt-16 pb-32 scroll-mt-20">
        <div className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            
            Directory
          </motion.p>
          <p className="font-body text-lg text-foreground/50 leading-relaxed mb-8">
            Discover tools that help you build your startup autonomously.
          </p>
          <div className="space-y-px">
            <a
              href="#launch"
              className="group flex items-center justify-between py-5 border-b border-dashed border-primary/20 hover:pl-2 transition-all duration-300 cursor-pointer">
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-dashed border-primary/30 bg-primary/5 flex items-center justify-center shrink-0">
                  <span className="text-primary text-lg">✦</span>
                </div>
                <div>
                  <p className="font-display text-lg md:text-xl font-bold text-primary/70 group-hover:text-primary transition-colors">
                    Your startup here
                  </p>
                  <p className="font-body text-sm text-foreground/30 mt-0.5">
                    List your autonomous startup for free
                  </p>
                </div>
              </div>
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-primary/40 group-hover:text-primary/70 transition-colors shrink-0 ml-4">
                Free ↗
              </span>
            </a>
            {companies.map((company, i) =>
            <CompanyCard
              key={company.name}
              name={company.name}
              url={company.url}
              description={company.description}
              thumbnail={company.thumbnail}
              isPaid={company.isPaid}
              slug={company.slug}
              index={i} />

            )}
          </div>
          <a
            href="#launch"
            className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] mt-8">
            
            Add your startup
          </a>
        </div>
      </main>

      <SubmitSection />

      {/* Guide Preview */}
      <section className="relative z-10 px-8 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
        >
          <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            The Guide
          </p>
          <p className="font-body text-lg text-foreground/50 leading-relaxed mb-6">
            How to build an autonomous unicorn — in 6 steps. One founder, zero excuses.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
            {[
              { num: "01", label: "Idea", icon: "💡" },
              { num: "02", label: "Build", icon: "🛠" },
              { num: "03", label: "Content", icon: "✍️" },
              { num: "04", label: "Monetize", icon: "💰" },
              { num: "05", label: "Agents", icon: "🤖" },
              { num: "06", label: "Compound", icon: "📈" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-background/40 border border-foreground/10 rounded-xl p-4 text-center"
              >
                <span className="text-2xl mb-2 block">{step.icon}</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary/60 block">{step.num}</span>
                <span className="font-display text-sm font-bold text-foreground/80">{step.label}</span>
              </motion.div>
            ))}
          </div>
          <Link
            to="/guide"
            className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Explore the full guide →
          </Link>
        </motion.div>
      </section>


      {/* Blog CTA */}
      <section className="relative z-10 px-8 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
          
          <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            Blog
          </p>
          <p className="font-body text-lg text-foreground/50 leading-relaxed mb-6">
            Read our latest posts on the rise of autonomous capitalism — and why your next startup might run itself.
          </p>
          <Link
            to="/blog"
            className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity">
            
            Read the blog →
          </Link>
        </motion.div>
      </section>

      {/* Mission */}
      <section id="mission" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
        <div className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            Mission
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4">
            <p className="font-body text-lg md:text-xl text-foreground/70 leading-relaxed">
              Accelerate the future of autonomous capitalism.
            </p>
            <p className="font-body text-base text-foreground/50 leading-relaxed">
              Lazy Unicorn wants to be the first one-person unicorn built on Lovable.
            </p>
            <a
              href="https://lovable.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97] mt-4"
            >
              Start building with Lovable
            </a>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
        <div className="max-w-2xl bg-transparent backdrop-blur-xl rounded-3xl px-8 py-10 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-4">
            About
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-4">
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
                className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Follow me on 𝕏
              </a>
              <a
                href="https://www.linkedin.com/in/saadsahawneh"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-primary transition-colors border border-foreground/10 rounded-full px-4 py-1.5">
                Follow me on LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Valuation Breakdown - hidden for now */}
      {/* <section className="relative z-10 px-8 md:px-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-sm bg-transparent backdrop-blur-xl rounded-2xl px-6 py-6 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
          <ValuationBreakdown />
        </motion.div>
      </section> */}

      {/* <PitchDeck /> */}

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>);

};

export default Index;