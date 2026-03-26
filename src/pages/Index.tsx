import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const NEW_TITLE = "Launch your Autonomous Business on Lovable.";
const NEW_DESCRIPTION = "The autonomous layer for Lovable. One prompt installs the engine you need — blog posts, SEO, GEO, payments, voice, stores, streams, and more. Everything runs itself.";

const rotatingWords = [
  { word: "blogs", emoji: "✍️" },
  { word: "SEO", emoji: "🔍" },
  { word: "stores", emoji: "🛒" },
  { word: "GEO", emoji: "🌐" },
  { word: "streams", emoji: "🎬" },
  { word: "voice", emoji: "🎙️" },
  { word: "security", emoji: "🛡️" },
  { word: "payments", emoji: "💳" },
  { word: "alerts", emoji: "🔔" },
  { word: "devlogs", emoji: "👨‍💻" },
  { word: "admin", emoji: "⚙️" },
  { word: "video", emoji: "🎥" },
  { word: "SMS", emoji: "📱" },
];

function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(200);
  const [ready, setReady] = useState(false);
  const hiddenRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const current = rotatingWords[index];

  // Measure using a hidden off-screen span
  useEffect(() => {
    const measure = () => {
      if (hiddenRef.current) {
        hiddenRef.current.textContent = `${current.word} ${current.emoji}`;
        const w = hiddenRef.current.offsetWidth;
        if (w > 0) {
          setWidth(w);
          setReady(true);
        }
      }
    };
    measure();
    // Re-measure after fonts load
    if (!ready) {
      document.fonts?.ready?.then(measure);
    }
  }, [current, ready]);

  return (
    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.9rem, 2.8vw, 2.2rem)", color: "#f0ead6", opacity: 0.7 }} className="mb-2 whitespace-nowrap">
      {/* Hidden measurer */}
      <span
        ref={hiddenRef}
        aria-hidden="true"
        className="whitespace-nowrap invisible fixed pointer-events-none"
        style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(0.9rem, 2.8vw, 2.2rem)", top: -9999, left: -9999 }}
      />
      Lovable<span className="ml-1 mr-0">❤️</span>
      <motion.span
        className="inline-flex justify-center relative"
        style={{ height: "1.2em", verticalAlign: "text-bottom", overflow: "clip" }}
        animate={{ width: width + 12 }}
        transition={ready ? { type: "spring", stiffness: 250, damping: 25 } : { duration: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={current.word}
            initial={ready ? { y: 16, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center gap-1 whitespace-nowrap"
            style={{ color: "#c8a961" }}
          >
            {current.word}<span>{current.emoji}</span>
          </motion.span>
        </AnimatePresence>
      </motion.span>
      on autopilot<span className="ml-1">🤖</span>
    </p>
  );
}

const products = [
  { cursive: "Lazy", name: "Blogger", link: "/lazy-blogger", tagline: "Your blog writes itself." },
  { cursive: "Lazy", name: "SEO", link: "/lazy-seo", tagline: "Rankings on autopilot." },
  { cursive: "Lazy", name: "GEO", link: "/lazy-geo", tagline: "Get cited by AI." },
  { cursive: "Lazy", name: "Crawl", link: "/lazy-crawl", tagline: "Web intelligence on autopilot." },
  { cursive: "Lazy", name: "Voice", link: "/lazy-voice", tagline: "Every post, narrated." },
  { cursive: "Lazy", name: "Contentful", link: "/lazy-contentful", tagline: "Two-way CMS sync." },
  { cursive: "Lazy", name: "Stream", link: "/lazy-stream", tagline: "Streams become content." },
  { cursive: "Lazy", name: "Perplexity", link: "/lazy-perplexity", tagline: "Research-backed content." },
  { cursive: "Lazy", name: "Store", link: "/lazy-store", tagline: "A store that runs itself." },
  { cursive: "Lazy", name: "Pay", link: "/lazy-pay", tagline: "Payments that optimise." },
  { cursive: "Lazy", name: "GitHub", link: "/lazy-github", tagline: "Commits become changelogs." },
  { cursive: "Lazy", name: "GitLab", link: "/lazy-gitlab", tagline: "Commits become changelogs." },
  { cursive: "Lazy", name: "SMS", link: "/lazy-sms", tagline: "Texts that convert." },
  { cursive: "Lazy", name: "Telegram", link: "/lazy-telegram", tagline: "Your business in Telegram." },
  { cursive: "Lazy", name: "Alert", link: "/lazy-alert", tagline: "Your business in your Slack." },
  { cursive: "Lazy", name: "Linear", link: "/lazy-linear", tagline: "Issues become changelogs." },
  { cursive: "Lazy", name: "Supabase", link: "/lazy-supabase", tagline: "Your database tells its story." },
  { cursive: "Lazy", name: "Security", link: "/lazy-security", tagline: "Ship safe, stay safe." },
  
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
  Crawl: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="55" r="25" />
      <path d="M40 45 Q60 30 80 45" />
      <path d="M40 65 Q60 80 80 65" />
      <line x1="60" y1="30" x2="60" y2="80" />
      <line x1="35" y1="55" x2="85" y2="55" />
      <circle cx="60" cy="55" r="5" fill="#f0ead6" stroke="none" />
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
  GitHub: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M45 40 L25 60 L45 80" />
      <path d="M75 40 L95 60 L75 80" />
      <line x1="65" y1="30" x2="55" y2="90" />
      <circle cx="60" cy="60" r="30" strokeDasharray="4 4" />
    </svg>
  ),
  Alert: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="28" y="30" width="64" height="50" rx="5" />
      <path d="M28 40 L60 62 L92 40" />
      <circle cx="85" cy="35" r="10" fill="#f0ead6" stroke="none" />
      <path d="M85 30 L85 37" stroke="#0a0a08" strokeWidth="2" />
      <circle cx="85" cy="40" r="1.5" fill="#0a0a08" stroke="none" />
    </svg>
  ),
  GitLab: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 95 L30 55 L38 25 L48 55 L72 55 L82 25 L90 55 Z" />
      <circle cx="60" cy="58" r="8" strokeDasharray="3 3" />
    </svg>
  ),
  Supabase: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 90 Q30 80 30 55 Q30 30 60 25 Q90 30 90 55 Q90 80 60 90Z" />
      <line x1="40" y1="50" x2="80" y2="50" />
      <line x1="40" y1="60" x2="80" y2="60" />
      <path d="M55 70 L60 78 L70 65" />
    </svg>
  ),
  Telegram: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 55 L95 30 L75 90 L55 65 Z" />
      <line x1="95" y1="30" x2="55" y2="65" />
      <line x1="55" y1="65" x2="55" y2="85" />
      <path d="M55 85 L65 72" />
    </svg>
  ),
  Linear: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="55" r="28" />
      <path d="M45 55 L55 65 L75 45" />
      <line x1="35" y1="88" x2="85" y2="88" strokeDasharray="4 4" />
    </svg>
  ),
  Contentful: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="28" width="60" height="64" rx="5" />
      <line x1="60" y1="28" x2="60" y2="92" />
      <path d="M40 50 L55 50" />
      <path d="M65 50 L80 50" />
      <path d="M40 65 L55 65" />
      <path d="M65 65 L80 65" />
      <path d="M25 55 L35 60 L25 65" />
      <path d="M95 55 L85 60 L95 65" />
    </svg>
  ),
  Perplexity: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="55" cy="50" r="22" />
      <line x1="71" y1="66" x2="90" y2="85" />
      <path d="M48 45 Q55 35 62 45" />
      <circle cx="55" cy="55" r="3" fill="#f0ead6" stroke="none" />
      <path d="M40 75 L50 85 L65 80 L80 90" strokeDasharray="3 3" />
    </svg>
  ),
  Security: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 20 L90 35 L90 60 Q90 85 60 100 Q30 85 30 60 L30 35 Z" />
      <path d="M48 58 L56 66 L74 48" />
    </svg>
  ),
  Admin: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="25" width="70" height="70" rx="5" />
      <line x1="25" y1="45" x2="95" y2="45" />
      <line x1="55" y1="45" x2="55" y2="95" />
      <circle cx="40" cy="35" r="3" fill="#f0ead6" stroke="none" />
      <circle cx="50" cy="35" r="3" fill="#f0ead6" stroke="none" />
      <rect x="32" y="55" width="16" height="12" rx="1" />
      <rect x="32" y="75" width="16" height="12" rx="1" />
      <line x1="62" y1="60" x2="88" y2="60" />
      <line x1="62" y1="68" x2="80" y2="68" />
      <line x1="62" y1="80" x2="88" y2="80" />
      <line x1="62" y1="88" x2="75" y2="88" />
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
      <header className="relative z-10" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 pt-32 pb-16 text-center"
        >
          <RotatingHeadline />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 7vw, 5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            Launch your Autonomous
            <br />
            Business on Lovable.
          </h1>
          <p className="tracking-[0.2em] uppercase" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1rem, 1.8vw, 1.3rem)", color: "#f0ead6", opacity: 0.45, letterSpacing: "0.2em" }}>
            One prompt, everything runs itself.
          </p>

          {/* Body */}

          {/* CTA */}
          <Link
            to="/lazy-run"
            className="mt-6 inline-block text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97]"
            style={{ fontFamily: "'Playfair Display', serif", backgroundColor: "#f0ead6", color: "#0a0a08", borderRadius: 0 }}
          >
            Get the Free Prompt
          </Link>

          {/* Integrations */}
          <div className="mt-8">
            <p className="text-[10px] tracking-[0.2em] uppercase font-semibold mb-4" style={{ color: "#f0ead6", opacity: 0.25 }}>
              Integrations
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { name: "Stripe", href: "/lazy-pay" },
                { name: "Twilio", href: "/lazy-sms" },
                { name: "ElevenLabs", href: "/lazy-voice" },
                { name: "Twitch", href: "/lazy-stream" },
                { name: "GitHub", href: "/lazy-github" },
                { name: "GitLab", href: "/lazy-gitlab" },
                { name: "Linear", href: "/lazy-linear" },
                { name: "Slack", href: "/lazy-alert" },
                { name: "Telegram", href: "/lazy-telegram" },
                { name: "Supabase", href: "/lazy-supabase" },
                { name: "Contentful", href: "/lazy-contentful" },
                { name: "Firecrawl", href: "/lazy-crawl" },
                { name: "Perplexity", href: "/lazy-perplexity" },
              ].map((item, i) => (
                <Link key={item.name} to={item.href}>
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + i * 0.06, duration: 0.4 }}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    className="inline-block text-[10px] tracking-[0.1em] uppercase font-medium px-3 py-1.5 border transition-colors duration-200 cursor-pointer hover:border-[rgba(240,234,214,0.35)]"
                    style={{ color: "#f0ead6", opacity: 0.4, borderColor: "rgba(240,234,214,0.12)" }}
                  >
                    {item.name}
                  </motion.span>
                </Link>
              ))}
            </div>
          </div>

      </motion.div>
      </header>

      {/* Product Grid */}
      <section id="engines" className="relative z-10 scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Lazy Run */}
          <Link to="/lazy-run" className="block">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:brightness-[1.15] cursor-pointer"
              style={{ backgroundColor: "#0a0a08" }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="60" cy="55" r="30" />
                <path d="M45 45 L55 55 L45 65" />
                <path d="M75 45 L65 55 L75 65" />
                <line x1="58" y1="40" x2="62" y2="70" />
                <circle cx="60" cy="55" r="8" />
                <circle cx="60" cy="55" r="3" fill="#f0ead6" stroke="none" />
                <path d="M35 88 Q60 95 85 88" strokeDasharray="3 3" />
              </svg>
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                  Run
                </p>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#f0ead6", opacity: 0.4, marginTop: "0.5rem" }}>
                Every engine. One prompt.
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem" }}>
                Made for Lovable
              </p>
            </motion.div>
          </Link>

          {/* Lazy Admin */}
          <Link to="/lazy-admin" className="block">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="aspect-square flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:brightness-[1.15] cursor-pointer"
              style={{ backgroundColor: "#111110" }}
            >
              {sketches["Admin"]}
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", color: "#f0ead6", lineHeight: 1.1 }}>
                  Admin
                </p>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.85rem", color: "#f0ead6", opacity: 0.4, marginTop: "0.5rem" }}>
                One dashboard to manage your entire Lazy stack.
              </p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem" }}>
                Made for Lovable
              </p>
            </motion.div>
          </Link>

          {products.map((product, i) => {
            const bgEven = "#0a0a08";
            const bgOdd = "#111110";
            // Offset by 2 since Lazy Run + Lazy Admin take the first row
            const row = Math.floor((i + 2) / 2);
            const col = (i + 2) % 2;
            const bg = (row + col) % 2 === 0 ? bgEven : bgOdd;
            const isComingSoon = product.name === "Coming Soon";
            const isLastAlone = isComingSoon && (products.length + 2) % 2 !== 0;

            const content = (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className={`${isLastAlone ? "aspect-auto py-24" : "aspect-square"} flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:brightness-[1.15] cursor-pointer`}
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

            if (isComingSoon) return <div key={i} className={isLastAlone ? "md:col-span-2" : ""}>{content}</div>;

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
