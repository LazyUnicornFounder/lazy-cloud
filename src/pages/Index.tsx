import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const NEW_TITLE = "Add agents to your Lovable website with one prompt.";
const NEW_DESCRIPTION = "Each agent is a single prompt you paste into Lovable. It installs its own tables, edge functions, and UI — then runs itself. Blog posts, SEO, payments, voice, stores, and more, and starts to run your business autonomously.";

const rotatingWords = [
  { word: "everything", emoji: "🦄" },       // Lazy Run
  { word: "dashboards", emoji: "⚙️" },       // Lazy Admin
  { word: "design", emoji: "🎨" },            // Lazy Design
  { word: "blogs", emoji: "✍️" },             // Lazy Blogger
  { word: "SEO", emoji: "🔍" },               // Lazy SEO
  { word: "GEO", emoji: "🌐" },               // Lazy GEO
  { word: "crawling", emoji: "🕷️" },          // Lazy Crawl
  { word: "CMS sync", emoji: "🔄" },          // Lazy Contentful
  { word: "podcasts", emoji: "🎙️" },          // Lazy Voice
  { word: "streams", emoji: "🎬" },           // Lazy Stream
  { word: "research", emoji: "🔮" },          // Lazy Perplexity
  { word: "stores", emoji: "🛒" },            // Lazy Store
  { word: "dropshipping", emoji: "📦" },      // Lazy Drop
  { word: "merch", emoji: "🖨️" },             // Lazy Print
  { word: "payments", emoji: "💳" },           // Lazy Pay
  { word: "SMS", emoji: "📱" },               // Lazy SMS
  { word: "commits", emoji: "👨‍💻" },          // Lazy GitHub
  { word: "merges", emoji: "🔀" },            // Lazy GitLab
  { word: "databases", emoji: "🗄️" },         // Lazy Supabase
  { word: "sprints", emoji: "✅" },            // Lazy Linear
  { word: "emails", emoji: "📧" },            // Lazy Mail
  { word: "alerts", emoji: "🔔" },            // Lazy Alert
  { word: "Telegram", emoji: "✈️" },          // Lazy Telegram
  { word: "security", emoji: "🛡️" },          // Lazy Security
  { word: "auth", emoji: "🔐" },              // Lazy Auth
  { word: "meetings", emoji: "📝" },          // Lazy Granola
  { word: "videos", emoji: "📺" },            // Lazy YouTube
  { word: "repurposing", emoji: "🔄" },       // Lazy Repurpose
  { word: "trends", emoji: "🔥" },            // Lazy Trend
  { word: "retention", emoji: "💰" },         // Lazy Churn
  { word: "websites", emoji: "🚀" },           // Lazy Launch
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
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.9rem, 2.8vw, 2.2rem)", color: "#f0ead6", opacity: 0.7 }} className="mb-2 mt-12 whitespace-nowrap">
      {/* Hidden measurer */}
      <span
        ref={hiddenRef}
        aria-hidden="true"
        className="whitespace-nowrap invisible fixed pointer-events-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.9rem, 2.8vw, 2.2rem)", top: -9999, left: -9999 }}
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
  // Run and Admin are rendered as special blocks above
  { cursive: "Lazy", name: "Design", link: "/lazy-design", tagline: "Autonomous UI upgrades" },
  // Lazy Content
  { cursive: "Lazy", name: "Blogger", link: "/lazy-blogger", tagline: "Autonomous blog posts" },
  { cursive: "Lazy", name: "SEO", link: "/lazy-seo", tagline: "Autonomous SEO content" },
  { cursive: "Lazy", name: "GEO", link: "/lazy-geo", tagline: "Autonomous AI citations" },
  { cursive: "Lazy", name: "Crawl", link: "/lazy-crawl", tagline: "Autonomous web research" },
  { cursive: "Lazy", name: "Perplexity", link: "/lazy-perplexity", tagline: "Autonomous deep research" },
  { cursive: "Lazy", name: "Contentful", link: "/lazy-contentful", tagline: "Autonomous CMS sync" },
  // Lazy Commerce
  { cursive: "Lazy", name: "Store", link: "/lazy-store", tagline: "Autonomous storefronts" },
  { cursive: "Lazy", name: "Drop", link: "/lazy-drop", tagline: "Autonomous dropshipping" },
  { cursive: "Lazy", name: "Print", link: "/lazy-print", tagline: "Autonomous print-on-demand" },
  { cursive: "Lazy", name: "Pay", link: "/lazy-pay", tagline: "Autonomous payments" },
  { cursive: "Lazy", name: "SMS", link: "/lazy-sms", tagline: "Autonomous text campaigns" },
  { cursive: "Lazy", name: "Mail", link: "/lazy-mail", tagline: "Autonomous email flows" },
  // Lazy Media
  { cursive: "Lazy", name: "Voice", link: "/lazy-voice", tagline: "Autonomous podcasts" },
  { cursive: "Lazy", name: "Stream", link: "/lazy-stream", tagline: "Autonomous stream content" },
  { cursive: "Lazy", name: "YouTube", link: "/lazy-youtube", tagline: "Autonomous video content" },
  // Lazy Dev
  { cursive: "Lazy", name: "GitHub", link: "/lazy-github", tagline: "Autonomous changelogs" },
  { cursive: "Lazy", name: "GitLab", link: "/lazy-gitlab", tagline: "Autonomous GitLab docs" },
  { cursive: "Lazy", name: "Linear", link: "/lazy-linear", tagline: "Autonomous issue content" },
  { cursive: "Lazy", name: "Auth", link: "/lazy-auth", tagline: "Autonomous login flows" },
  { cursive: "Lazy", name: "Granola", link: "/lazy-granola", tagline: "Autonomous meeting content" },
  // Lazy Ops
  { cursive: "Lazy", name: "Alert", link: "/lazy-alert", tagline: "Autonomous Slack alerts" },
  { cursive: "Lazy", name: "Telegram", link: "/lazy-telegram", tagline: "Autonomous Telegram updates" },
  { cursive: "Lazy", name: "Supabase", link: "/lazy-supabase", tagline: "Autonomous database reports" },
  { cursive: "Lazy", name: "Security", link: "/lazy-security", tagline: "Autonomous pentesting" },
  // Lazy Launch
  { cursive: "Lazy", name: "Launch", link: "/lazy-launch", tagline: "Launch your Lovable website" },

  { cursive: "Lazy", name: "Coming Soon", link: "", tagline: "More agents loading" },
];

/* ── Sketch SVG icons ── */
const sketches: Record<string, JSX.Element> = {
  Run: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="60" cy="55" r="28" />
      <path d="M60 27 L60 55 L78 55" />
      <path d="M40 88 L50 78" />
      <path d="M80 88 L70 78" />
      <path d="M25 65 L35 60" />
      <path d="M95 65 L85 60" />
      <circle cx="60" cy="55" r="3" fill="#f0ead6" stroke="none" />
    </svg>
  ),
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
  Drop: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 25 Q40 55 40 70 Q40 90 60 90 Q80 90 80 70 Q80 55 60 25Z" />
      <path d="M50 70 Q55 78 65 72" />
      <line x1="30" y1="50" x2="20" y2="45" />
      <line x1="90" y1="50" x2="100" y2="45" />
      <line x1="60" y1="15" x2="60" y2="22" />
    </svg>
  ),
  Print: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="45" width="60" height="30" rx="3" />
      <rect x="38" y="25" width="44" height="20" rx="2" />
      <rect x="38" y="75" width="44" height="20" rx="2" />
      <circle cx="80" cy="58" r="3" fill="#f0ead6" stroke="none" />
      <line x1="45" y1="82" x2="65" y2="82" />
      <line x1="45" y1="88" x2="58" y2="88" />
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
  Auth: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="35" y="50" width="50" height="40" rx="4" />
      <path d="M45 50 L45 38 Q45 22 60 22 Q75 22 75 38 L75 50" />
      <circle cx="60" cy="68" r="5" />
      <line x1="60" y1="73" x2="60" y2="80" />
    </svg>
  ),
  Mail: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="25" y="35" width="70" height="50" rx="3" />
      <path d="M25 40 L60 65 L95 40" />
      <line x1="25" y1="82" x2="45" y2="62" />
      <line x1="95" y1="82" x2="75" y2="62" />
    </svg>
  ),
  Design: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="25" width="60" height="70" rx="4" />
      <line x1="30" y1="45" x2="90" y2="45" />
      <rect x="38" y="55" width="20" height="15" rx="2" />
      <rect x="62" y="55" width="20" height="15" rx="2" />
      <rect x="38" y="75" width="44" height="10" rx="2" />
      <circle cx="40" cy="35" r="3" fill="#f0ead6" stroke="none" />
      <circle cx="50" cy="35" r="3" fill="#f0ead6" stroke="none" />
      <circle cx="60" cy="35" r="3" fill="#f0ead6" stroke="none" />
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
  Granola: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="30" y="25" width="60" height="70" rx="4" />
      <line x1="42" y1="40" x2="78" y2="40" />
      <line x1="42" y1="50" x2="72" y2="50" />
      <line x1="42" y1="60" x2="75" y2="60" />
      <line x1="42" y1="70" x2="65" y2="70" />
      <circle cx="75" cy="75" r="12" />
      <path d="M72 75 L75 78 L80 72" />
    </svg>
  ),
  YouTube: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="30" width="80" height="60" rx="12" />
      <path d="M52 48 L52 82 L78 65 Z" fill="#f0ead6" stroke="none" />
    </svg>
  ),
  Launch: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M60 20 Q50 50 40 70 L60 60 L80 70 Q70 50 60 20Z" />
      <path d="M40 70 L30 85" />
      <path d="M80 70 L90 85" />
      <path d="M50 80 L60 75 L70 80" />
      <path d="M45 90 L55 85 L65 90 L75 85" />
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
        keywords="autonomous blog agent, autonomous SEO agent, autonomous GEO agent, Lovable website growth, AI blog writer, AI SEO tool, AI citation agent, self-growing website, autonomous content, Lovable startup, solo founder tools, AI business automation, autonomous marketing, self-building startup"
        breadcrumbs={[{ name: "Home", url: "/" }]}
        faq={[
          { question: "What are the Autonomous Agents?", answer: "They are AI-powered agent that autonomously grow your Lovable website by publishing content, optimizing for search, and getting your brand cited by AI assistants." },
          { question: "How does Lazy Blogger work?", answer: "With a single prompt, Lazy Blogger publishes high-quality blog posts every day on your Lovable website — forever, for free." },
          { question: "What does Lazy SEO do?", answer: "Lazy SEO discovers keyword opportunities, creates SEO-optimized content, and improves your search rankings on autopilot." },
          { question: "What is Lazy GEO?", answer: "Lazy GEO gets your brand cited by AI agent like ChatGPT, Claude, and Perplexity by creating citation-ready content and tracking your visibility." },
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
          className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 pt-8 pb-16 text-center"
        >
          <RotatingHeadline />
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(3rem, 7vw, 5rem)", color: "#f0ead6", lineHeight: 1.1, fontWeight: 800 }}>
            Add agents to your Lovable
            <br />
            website with one prompt.
          </h1>
          <p className="max-w-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)", color: "#f0ead6", opacity: 0.45, lineHeight: 1.6 }}>
            Each agent is a single prompt you paste into Lovable. It installs its own tables, edge functions, and UI — then runs itself. Blog posts, SEO, payments, voice, stores, and more.
          </p>

          {/* Body */}

          {/* CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/lazy-launch"
              className="text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundColor: "#c8a961", color: "#0a0a08", borderRadius: 0 }}
            >
              Launch your Lovable website
            </Link>
            <Link
              to="/lazy-agents"
              className="text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundColor: "#f0ead6", color: "#0a0a08", borderRadius: 0 }}
            >
              Explore Agents
            </Link>
          </div>

          {/* Integrations marquee */}
          <div className="mt-10 overflow-hidden">
            <p className="text-[11px] tracking-[0.25em] uppercase font-semibold mb-5 text-center" style={{ color: "#f0ead6", opacity: 0.3 }}>
              Integrates with
            </p>
            <div className="relative">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <motion.div
                className="flex gap-8 items-center whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
              >
                {[...Array(2)].map((_, dupeIdx) => (
                  <div key={dupeIdx} className="flex gap-8 items-center shrink-0">
                    {[
                      { name: "Firecrawl", href: "/lazy-crawl" },
                      { name: "Perplexity", href: "/lazy-perplexity" },
                      { name: "Contentful", href: "/lazy-contentful" },
                      { name: "Shopify", href: "/lazy-store" },
                      { name: "AutoDS", href: "/lazy-drop" },
                      { name: "Printful", href: "/lazy-print" },
                      { name: "Stripe", href: "/lazy-pay" },
                      { name: "Twilio", href: "/lazy-sms" },
                      { name: "Resend", href: "/lazy-mail" },
                      { name: "ElevenLabs", href: "/lazy-voice" },
                      { name: "Twitch", href: "/lazy-stream" },
                      { name: "YouTube", href: "/lazy-youtube" },
                      { name: "Supadata", href: "/lazy-youtube" },
                      { name: "GitHub", href: "/lazy-github" },
                      { name: "GitLab", href: "/lazy-gitlab" },
                      { name: "Linear", href: "/lazy-linear" },
                      { name: "21st.dev", href: "/lazy-design" },
                      { name: "Google OAuth", href: "/lazy-auth" },
                      { name: "Granola", href: "/lazy-granola" },
                      { name: "Slack", href: "/lazy-alert" },
                      { name: "Telegram", href: "/lazy-telegram" },
                      { name: "Supabase", href: "/lazy-supabase" },
                      { name: "Aikido", href: "/lazy-security" },
                    ].map((item) => (
                      <Link
                        key={`${dupeIdx}-${item.name}`}
                        to={item.href}
                        className="text-[13px] tracking-[0.1em] uppercase font-medium shrink-0 transition-opacity duration-200 hover:opacity-80"
                        style={{ color: "#f0ead6", opacity: 0.35 }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

      </motion.div>
      </header>

      {/* Agents label */}
      <section className="relative z-10" style={{ backgroundColor: "#0a0a08" }}>
        <div className="px-6 pt-20 pb-8 text-center max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#f0ead6", fontWeight: 800, lineHeight: 1 }}>
            35 agents run your Lovable business.
          </h2>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#f0ead6", fontWeight: 800, lineHeight: 1, marginTop: "0.1em" }}>
            One prompt each.
          </h2>
          <p className="mt-6 mx-auto max-w-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", color: "#f0ead6", opacity: 0.45, lineHeight: 1.7 }}>
            Each agent is a self-contained prompt you paste into your Lovable project. It installs its own tables, edge functions, and UI — then runs itself autonomously.
          </p>
          <Link
            to="/lazy-agents"
            className="inline-block mt-6 text-sm tracking-[0.15em] uppercase px-8 py-3 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97] bg-primary text-primary-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Explore Agents
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section id="agent" className="relative z-10 scroll-mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {/* Lazy Run */}
          <Link to="/lazy-run" className="block">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-square flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:brightness-[1.15] cursor-pointer p-4"
              style={{ backgroundColor: "#0a0a08" }}
            >
              {sketches["Run"]}
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                  Run
                </p>
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "#f0ead6", opacity: 0.4 }}>
                Autonomous everything
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
              className="aspect-square flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:brightness-[1.15] cursor-pointer p-4"
              style={{ backgroundColor: "#111110" }}
            >
              {sketches["Admin"]}
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                  Admin
                </p>
              </div>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "#f0ead6", opacity: 0.4 }}>
                Autonomous ops control
              </p>
            </motion.div>
          </Link>

          {products.map((product, i) => {
            const bgEven = "#0a0a08";
            const bgOdd = "#111110";
            const cellIndex = i + 2;
            const row = Math.floor(cellIndex / 4);
            const col = cellIndex % 4;
            const bg = (row + col) % 2 === 0 ? bgEven : bgOdd;
            const isComingSoon = product.name === "Coming Soon";

            const content = (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.08 }}
                className="aspect-square flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:brightness-[1.15] cursor-pointer p-4"
                style={{ backgroundColor: bg }}
              >
                {sketches[product.name]}
                <div className="text-center">
                  <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                    {product.cursive}
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                    {product.name}
                  </p>
                </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "#f0ead6", opacity: 0.4 }}>
                  {product.tagline}
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


      {/* Agents Grid */}
      <section id="agents" className="relative z-10 scroll-mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { cursive: "Lazy", name: "Watch", tagline: "Autonomous error monitoring", link: "/lazy-watch", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="60" cy="55" r="28" />
                <circle cx="60" cy="55" r="12" />
                <circle cx="60" cy="55" r="5" fill="#f0ead6" stroke="none" />
                <path d="M30 55 L20 55" /><path d="M100 55 L90 55" />
                <path d="M60 25 L60 15" /><path d="M60 95 L60 85" />
              </svg>
            )},
            { cursive: "Lazy", name: "Fix", tagline: "Autonomous prompt improvement", link: "/lazy-fix", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M75 30 L90 45 L50 85 L35 85 L35 70 Z" />
                <path d="M65 40 L80 55" />
                <line x1="35" y1="95" x2="85" y2="95" strokeDasharray="4 4" />
              </svg>
            )},
            { cursive: "Lazy", name: "Build", tagline: "Autonomous agent writer", link: "/lazy-build", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="30" y="35" width="60" height="55" rx="3" />
                <path d="M45 25 L45 35" /><path d="M75 25 L75 35" />
                <line x1="42" y1="52" x2="78" y2="52" />
                <line x1="42" y1="62" x2="70" y2="62" />
                <line x1="42" y1="72" x2="75" y2="72" />
                <path d="M55 80 L60 85 L70 75" />
              </svg>
            )},
            { cursive: "Lazy", name: "Intel", tagline: "Autonomous content strategist", link: "/lazy-intel", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="25" y="30" width="70" height="60" rx="3" />
                <rect x="32" y="55" width="10" height="25" rx="1" />
                <rect x="47" y="45" width="10" height="35" rx="1" />
                <rect x="62" y="50" width="10" height="30" rx="1" />
                <rect x="77" y="38" width="10" height="42" rx="1" />
                <path d="M32 52 L47 42 L62 47 L87 35" strokeDasharray="3 3" />
              </svg>
            )},
            { cursive: "Lazy", name: "Repurpose", tagline: "Autonomous content repurposing", link: "/lazy-repurpose", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M40 40 L80 40 L80 60 L90 50 L70 30" />
                <path d="M80 80 L40 80 L40 60 L30 70 L50 90" />
                <rect x="45" y="50" width="30" height="20" rx="2" />
                <line x1="50" y1="57" x2="70" y2="57" />
                <line x1="50" y1="63" x2="65" y2="63" />
              </svg>
            )},
            { cursive: "Lazy", name: "Trend", tagline: "Autonomous trend detection", link: "/lazy-trend", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M25 85 L45 65 L60 72 L80 40 L95 35" />
                <circle cx="95" cy="35" r="5" fill="#f0ead6" stroke="none" />
                <path d="M85 40 L95 35 L90 25" />
                <line x1="25" y1="90" x2="95" y2="90" />
                <line x1="25" y1="30" x2="25" y2="90" />
              </svg>
            )},
            { cursive: "Lazy", name: "Churn", tagline: "Autonomous churn prevention", link: "/lazy-churn", sketch: (
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" stroke="#f0ead6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="60" cy="45" r="15" />
                <path d="M60 30 L60 45 L70 45" />
                <path d="M35 75 Q35 65 60 60 Q85 65 85 75 L85 90 L35 90 Z" />
                <path d="M48 80 L55 87 L72 72" />
              </svg>
            )},
          ].map((agent, i) => {
            const bgEven = "#0a0a08";
            const bgOdd = "#111110";
            const bg = i % 2 === 0 ? bgEven : bgOdd;

            return (
              <Link key={agent.name} to={agent.link} className="block">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="aspect-square flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:brightness-[1.15] cursor-pointer p-4"
                  style={{ backgroundColor: bg }}
                >
                  {agent.sketch}
                  <div className="text-center">
                    <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                      {agent.cursive}
                    </p>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.1 }}>
                      {agent.name}
                    </p>
                  </div>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "#f0ead6", opacity: 0.4 }}>
                    {agent.tagline}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Index;
