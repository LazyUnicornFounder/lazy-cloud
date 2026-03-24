import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const NEW_TITLE = "The Autonomous Layer for Lovable — One Prompt, Everything Runs Itself";
const NEW_DESCRIPTION = "The autonomous layer for Lovable. One prompt installs the engine you need — blog posts, SEO, GEO, payments, voice, stores, streams, and more. Everything runs itself.";

const products = [
  { cursive: "Lazy", name: "Blogger", link: "/lazy-blogger", tagline: "Your blog writes itself." },
  { cursive: "Lazy", name: "SEO", link: "/lazy-seo", tagline: "Rankings on autopilot." },
  { cursive: "Lazy", name: "GEO", link: "/lazy-geo", tagline: "Get cited by AI." },
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
      <header className="relative z-10 min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center px-6 max-w-3xl"
        >
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 5vw, 4rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            The missing (autonomous 🤖) half of Lovable❤️
          </h1>
          <p className="mt-4 font-body text-base sm:text-lg tracking-wide" style={{ color: "#f0ead6", opacity: 0.5 }}>
            One prompt, everything runs itself.
          </p>
          <p className="hero-description mt-6 text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: "#f0ead6", opacity: 0.6 }}>
            Lazy Unicorn builds the autonomous layer for <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Lovable</strong>. One prompt installs the engine you need — blog posts that publish themselves, SEO that compounds, payments that optimise, SMS that converts, audio that narrates, stores that grow. Works with <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>GitHub</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Shopify</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Twitch</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Stripe</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>ElevenLabs</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Slack</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Telegram</strong>, <strong className="font-semibold" style={{ opacity: 1, color: "#f0ead6" }}>Supabase</strong>, and more. Everything your site needs to run and grow without you doing it manually.
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
          {/* Lazy Run — double width hero block */}
          <Link to="/lazy-run" className="block md:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="aspect-[1/1] md:aspect-[2/1] flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:brightness-[1.15] cursor-pointer"
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

          {products.map((product, i) => {
            const bgEven = "#0a0a08";
            const bgOdd = "#111110";
            // Offset checkerboard by 1 since Lazy Run takes the first row
            const row = Math.floor(i / 2) + 1;
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
