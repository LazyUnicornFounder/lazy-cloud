import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const NEW_TITLE = "The Autonomous Layer for Lovable — One Prompt, Everything Runs Itself";
const NEW_DESCRIPTION = "The autonomous layer for Lovable. One prompt, everything runs itself.";

const products = [
  { cursive: "Lazy", name: "Blogger", link: "/lazy-blogger", tagline: "Your blog writes itself." },
  { cursive: "Lazy", name: "SEO", link: "/lazy-seo", tagline: "Rankings on autopilot." },
  { cursive: "Lazy", name: "GEO", link: "/lazy-geo", tagline: "Get cited by AI." },
  { cursive: "Lazy", name: "Store", link: "/lazy-store", tagline: "A store that runs itself." },
  { cursive: "Lazy", name: "Voice", link: "/lazy-voice", tagline: "Every post, narrated." },
  { cursive: "Lazy", name: "Pay", link: "/lazy-pay", tagline: "Payments that optimise." },
  { cursive: "Lazy", name: "SMS", link: "/lazy-sms", tagline: "Texts that convert." },
  { cursive: "Lazy", name: "Stream", link: "/lazy-stream", tagline: "Streams become content." },
  { cursive: "Lazy", name: "Code", link: "/lazy-code", tagline: "Commits become changelogs." },
  { cursive: "Lazy", name: "Coming Soon", link: "", tagline: "More engines loading." },
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
  Stream: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="30" width="70" height="45" rx="3" />
      <circle cx="60" cy="52" r="10" />
      <path d="M56 49 L66 52 L56 55 Z" fill="#f0ead6" stroke="none" />
      <line x1="40" y1="85" x2="80" y2="85" />
      <line x1="50" y1="75" x2="50" y2="85" />
      <line x1="70" y1="75" x2="70" y2="85" />
      <circle cx="85" cy="35" r="4" fill="#f0ead6" stroke="none" />
    </svg>
  ),
  Code: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M45 40 L25 60 L45 80" />
      <path d="M75 40 L95 60 L75 80" />
      <line x1="65" y1="30" x2="55" y2="90" />
      <circle cx="60" cy="60" r="30" strokeDasharray="4 4" />
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


      <Navbar activePage="home" />

      {/* Hero */}
      <header className="relative z-10 aspect-square md:aspect-auto md:min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center px-6 max-w-3xl"
        >
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            The Autonomous Layer
            <br />
            for Lovable.
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg tracking-wide" style={{ color: "#f0ead6", opacity: 0.5 }}>
            One prompt, everything runs itself.
          </p>
          <p className="hero-description mt-6 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: "#f0ead6", opacity: 0.6 }}>
            Lazy Unicorn builds the autonomous layer for Lovable. One prompt installs the engine you need — blog posts that publish themselves, SEO that compounds, payments that optimise, SMS that converts, audio that narrates, stores that grow. Everything your site needs to run and grow without you doing it manually.
          </p>

          {/* Integration logos */}
          <div className="flex items-center justify-center gap-7 sm:gap-9 mt-10 flex-wrap">
            {/* Lovable — flame/heart mark */}
            <svg width="20" height="24" viewBox="0 0 256 308" fill="#f0ead6" opacity="0.35" aria-label="Lovable">
              <path d="M128 0C93.9 0 66.5 27.4 66.5 61.5c0 22.3 11.8 41.8 29.5 52.6L128 308l32-193.9c17.7-10.8 29.5-30.3 29.5-52.6C189.5 27.4 162.1 0 128 0z"/>
            </svg>
            {/* GitHub — octocat mark */}
            <svg width="24" height="24" viewBox="0 0 98 96" fill="#f0ead6" opacity="0.35" aria-label="GitHub">
              <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0112.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
            </svg>
            {/* Shopify — shopping bag mark */}
            <svg width="21" height="24" viewBox="0 0 109 124" fill="#f0ead6" opacity="0.35" aria-label="Shopify">
              <path d="M95.8 28.2c-.1-.6-.6-1-1.1-1-.5 0-10.2-1.1-10.2-1.1s-8.1-7.9-9-8.8c-.9-.9-2.6-.6-3.3-.4-.1 0-1.8.5-4.7 1.4-2.8-8.1-7.7-15.5-16.4-15.5h-.7C48.4.9 46.1 0 44.1 0 21.9 0 11.2 27.7 7.9 41.8c-8.6 2.7-14.7 4.6-15.4 4.8C-3.7 48.1-3.9 48.3-4.2 52.4-4.4 55.5-24 124 -24 124l80.8 14L109 124S96 28.8 95.8 28.2zM67.5 21.4l-7.6 2.4c0-4.1-.6-9.8-2.3-14.7C63.5 10.5 66.4 16.9 67.5 21.4zM53.7 25.3l-16.4 5.1c1.6-6.1 4.6-12.2 8.3-16.2 1.4-1.5 3.3-3.1 5.5-4.1C53.3 14.8 53.8 21.2 53.7 25.3zM44.2 3.6c1.8 0 3.3.6 4.6 1.9-7.3 3.4-15.1 12.1-18.4 29.4l-13 4C20.7 27.3 30 3.6 44.2 3.6z"/>
              <path d="M94.7 27.2c-.5 0-10.2-1.1-10.2-1.1s-8.1-7.9-9-8.8c-.3-.3-.7-.5-1.2-.5l-11.1 117.2 45.8-9.9S96 28.8 95.8 28.2c-.1-.6-.6-1-1.1-1z"/>
              <path d="M58.1 43.4l-4.8 14.4s-5.3-2.8-11.7-2.8c-9.5 0-10 6-10 7.5 0 8.2 21.4 11.3 21.4 30.5 0 15.1-9.6 24.8-22.5 24.8-15.5 0-23.5-9.6-23.5-9.6l4.2-13.8s8.2 7 15.1 7c4.5 0 6.3-3.5 6.3-6.1 0-10.7-17.6-11.2-17.6-28.7C15 47.9 27.7 30.3 51.3 30.3c9.1 0 6.8 13.1 6.8 13.1z"/>
            </svg>
            {/* Twitch — glitch mark */}
            <svg width="22" height="24" viewBox="0 0 256 268" fill="#f0ead6" opacity="0.35" aria-label="Twitch">
              <path d="M17.458 0L0 46.556v185.262h63.981V268h46.555l36.121-36.121h54.388L256 177.48V0H17.458zm23.259 23.471H232.53v142.136l-42.106 42.106h-65.333l-36.121 36.121v-36.121H40.717V23.471zm69.413 104.227h23.471V69.578h-23.471v58.12zm63.769 0h23.471V69.578h-23.471v58.12z"/>
            </svg>
            {/* Stripe — "S" mark approximation */}
            <svg width="20" height="24" viewBox="0 0 60 80" fill="#f0ead6" opacity="0.35" aria-label="Stripe">
              <path d="M13.3 28.8C13.3 26.2 15.5 25 19 25c4.7 0 10.7 1.4 15.4 4V13.5C29.5 11.5 24.7 10.5 19 10.5 7.6 10.5 0 16.7 0 26.2c0 14.8 20.4 12.4 20.4 18.8 0 3.1-2.7 4.1-6.5 4.1-5.6 0-12.8-2.3-18.5-5.4v15.8c6.3 2.7 12.6 3.9 18.5 3.9 11.7 0 19.8-5.8 19.8-15.5C33.7 31.9 13.3 34.7 13.3 28.8z" transform="translate(13,5)"/>
            </svg>
            {/* ElevenLabs — "XI" mark */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#f0ead6" opacity="0.35" aria-label="ElevenLabs">
              <rect x="8" y="3" width="3" height="18" rx="1.5"/>
              <rect x="13" y="3" width="3" height="18" rx="1.5"/>
            </svg>
          </div>
          <p className="mt-3 font-body text-[9px] tracking-[0.2em] uppercase" style={{ color: "#f0ead6", opacity: 0.15 }}>
            Works with Lovable · GitHub · Shopify · Twitch · Stripe · ElevenLabs
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <a
              href="#engines"
              className="inline-block font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold hover:opacity-90 transition-opacity active:scale-[0.97]"
              style={{ backgroundColor: "#f0ead6", color: "#0a0a08", borderRadius: 0 }}
            >
              See the Engines
            </a>
          </div>
        </motion.div>
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
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#f0ead6", opacity: 0.4, marginTop: "0.5rem" }}>
                  {product.tagline}
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1.5rem" }}>
                  Made for Lovable
                </p>
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
