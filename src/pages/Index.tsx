import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import { useTrackVisit } from "@/hooks/useTrackVisit";
import TotalVisitorCount from "@/components/TotalVisitorCount";

const NEW_TITLE = "Drive Traffic Automatically to Your Lovable Website or App";
const NEW_DESCRIPTION = "We build autonomous engines for Lovable that turn your website into a self-growing asset.";

const products = [
  { cursive: "Lazy", name: "Blogger", link: "/lazy-blogger" },
  { cursive: "Lazy", name: "SEO", link: "/lazy-seo" },
  { cursive: "Lazy", name: "GEO", link: "/lazy-geo" },
  { cursive: "Lazy", name: "Store", link: "/lazy-store" },
  { cursive: "Lazy", name: "Voice", link: "/lazy-voice" },
  { cursive: "Lazy", name: "Pay", link: "/lazy-pay" },
  { cursive: "Lazy", name: "SMS", link: "/lazy-sms" },
  { cursive: "Lazy", name: "Coming Soon", link: "" },
];

/* ── Sketch SVG icons ── */
const sketches: Record<string, JSX.Element> = {
  Blogger: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="20" width="50" height="70" rx="3" />
      <line x1="40" y1="38" x2="70" y2="38" />
      <line x1="40" y1="48" x2="65" y2="48" />
      <line x1="40" y1="58" x2="70" y2="58" />
      <line x1="40" y1="68" x2="55" y2="68" />
      <path d="M82 90 L90 20 L94 22 L86 92 Z" />
    </svg>
  ),
  SEO: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="55" r="22" />
      <line x1="66" y1="71" x2="85" y2="90" />
      <rect x="25" y="70" width="8" height="20" rx="1" />
      <rect x="38" y="60" width="8" height="30" rx="1" />
      <rect x="51" y="50" width="8" height="40" rx="1" />
    </svg>
  ),
  GEO: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 75 Q25 30 60 30 Q95 30 95 75 Q95 85 60 95 Q25 85 25 75Z" />
      <circle cx="60" cy="58" r="12" />
      <path d="M54 55 L58 62 L66 54" />
      <circle cx="55" cy="52" r="2" />
      <circle cx="65" cy="52" r="2" />
    </svg>
  ),
  Store: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M35 45 L40 25 L80 25 L85 45" />
      <rect x="35" y="45" width="50" height="50" rx="3" />
      <path d="M55 25 L55 35" />
      <path d="M65 25 L65 35" />
      <rect x="72" y="28" width="12" height="8" rx="1" transform="rotate(25, 78, 32)" />
      <line x1="78" y1="30" x2="78" y2="34" />
    </svg>
  ),
  Voice: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="50" y="25" width="20" height="40" rx="10" />
      <path d="M40 55 Q40 80 60 80 Q80 80 80 55" />
      <line x1="60" y1="80" x2="60" y2="95" />
      <line x1="48" y1="95" x2="72" y2="95" />
      <path d="M85 45 Q92 50 92 60 Q92 70 85 75" />
      <path d="M90 38 Q100 48 100 60 Q100 72 90 82" />
    </svg>
  ),
  Pay: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="35" width="80" height="50" rx="5" />
      <line x1="20" y1="50" x2="100" y2="50" />
      <line x1="30" y1="65" x2="55" y2="65" />
      <line x1="30" y1="72" x2="45" y2="72" />
      <circle cx="85" cy="70" r="8" />
      <path d="M81 70 L84 73 L89 67" />
    </svg>
  ),
  SMS: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="38" y="18" width="44" height="84" rx="8" />
      <line x1="52" y1="24" x2="68" y2="24" />
      <circle cx="60" cy="92" r="4" />
      <path d="M75 50 Q95 50 95 65 Q95 80 75 80 L70 88 L68 80" />
      <line x1="78" y1="62" x2="90" y2="62" />
      <line x1="78" y1="68" x2="86" y2="68" />
    </svg>
  ),
  "Coming Soon": (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="55" r="25" />
      <path d="M60 40 L60 58 L72 64" />
      <circle cx="60" cy="55" r="3" />
      <line x1="50" y1="88" x2="70" y2="88" />
      <line x1="55" y1="94" x2="65" y2="94" />
    </svg>
  ),
};

const Index = () => {
  useTrackVisit();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen text-foreground relative bg-[#0a0a08]">
      <SEO
        title={NEW_TITLE}
        url="/"
        description={NEW_DESCRIPTION}
        keywords="autonomous blog engine, autonomous SEO engine, autonomous GEO engine, Lovable website growth, AI blog writer, AI SEO tool, AI citation engine, self-growing website, autonomous content, Lovable startup, solo founder tools, AI business automation, autonomous marketing, self-building startup"
        breadcrumbs={[{ name: "Home", url: "/" }]}
        faq={[
          { question: "What are the Autonomous Growth Engines?", answer: "They are AI-powered engines that autonomously grow your Lovable website by publishing content, optimizing for search, and getting your brand cited by AI assistants." },
          { question: "How does Lazy Blogger work?", answer: "With a single prompt, Lazy Blogger publishes high-quality blog posts every day on your Lovable website — forever, for free." },
          { question: "What does Lazy SEO do?", answer: "Lazy SEO discovers keyword opportunities, creates SEO-optimized content, and improves your search rankings on autopilot." },
          { question: "What is Lazy GEO?", answer: "Lazy GEO gets your brand cited by AI engines like ChatGPT, Claude, and Perplexity by creating citation-ready content and tracking your visibility." },
        ]}
        speakable={["h1", ".hero-description"]}
      />

      {/* Blog Ticker at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>

      <Navbar activePage="home" />

      {/* Hero */}
      <header className="relative z-10 min-h-screen flex flex-col justify-center items-start px-4 sm:px-8 md:px-12 pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:gap-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-[-1px] relative z-10 flex flex-col items-center"
            >
              <div className="mb-[-1px] relative z-10">
                <TotalVisitorCount />
              </div>
              <div className="bg-transparent backdrop-blur-xl border border-primary/20 border-b-0 rounded-t-2xl px-6 py-2.5 inline-block shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <p className="font-display text-[10px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] uppercase text-primary">
                  Autonomous growth for Lovable
                </p>
                <p className="font-body text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-foreground/60 text-center mt-1">
                  ★  EST. 2026  ★
                </p>
              </div>
            </motion.div>

            <div className="bg-transparent backdrop-blur-xl rounded-3xl px-5 sm:px-8 md:px-10 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]">
              <h1 className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] text-foreground">
                Your Lovable site.
                <br />
                Publishing every day.
                <br />
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Growing forever.</span>
              </h1>
              <p className="hero-description font-body text-sm sm:text-base md:text-lg text-foreground/60 mt-4 max-w-2xl leading-relaxed">
                One prompt turns your Lovable site into a content machine that ranks and compounds forever. <a href="/lazy-blogger" className="text-primary hover:underline">Lazy Blogger</a> publishes daily. <a href="/lazy-seo" className="text-primary hover:underline">Lazy SEO</a> targets your keywords. <a href="/lazy-geo" className="text-primary hover:underline">Lazy GEO</a> gets you into AI answers. Free at <a href="https://www.lazyunicorn.ai" className="text-primary hover:underline">LazyUnicorn.ai</a>.
              </p>
              <div className="flex items-center gap-3 mt-6">
                <a
                  href="#engines"
                  className="inline-block font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
                >
                  See the Engines
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Product Grid */}
      <section id="engines" className="relative z-10 scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {products.map((product, i) => {
            const isDark = i % 2 === 0;
            const bgEven = "#0a0a08";
            const bgOdd = "#111110";
            // Checkerboard: alternate per row on desktop
            const row = Math.floor(i / 2);
            const col = i % 2;
            const bg = (row + col) % 2 === 0 ? bgEven : bgOdd;
            const isComingSoon = product.name === "Coming Soon";

            const content = (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="aspect-square flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:brightness-[1.15] cursor-pointer"
                style={{ backgroundColor: bg }}
              >
                {sketches[product.name]}
                <div className="text-center">
                  <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                    {product.cursive}
                  </p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                    {product.name}
                  </p>
                </div>
              </motion.div>
            );

            if (isComingSoon) return <div key={i}>{content}</div>;

            return (
              <Link key={i} to={product.link} className="block">
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Index;
