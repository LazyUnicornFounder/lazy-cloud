import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  FileText, Search, Globe, ShoppingCart, Mic, CreditCard,
  MessageSquare, Video, Code, Zap, Activity, Radar, Compass,
  Layers, BarChart3, Database, Bell, Send, Shield,
  LayoutDashboard, Calendar, ArrowRight, Rocket, Clock,
  Package, Printer, Mail, MonitorPlay, Youtube, GitBranch,
  Paintbrush, Lock, Eye, Wrench, Hammer, Brain, RefreshCw,
  TrendingUp, UserCheck, Hourglass,
  type LucideIcon
} from "lucide-react";

import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackVisit } from "@/hooks/useTrackVisit";

const NEW_TITLE = "Launch, build and run your Lovable website or app with autonomous agents";
const NEW_DESCRIPTION = "Each agent is a single prompt you paste into Lovable. It installs its own tables, edge functions, and UI — then runs itself. Blog posts, SEO, payments, voice, stores, and more.";

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
    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.8rem, 2vw, 1.35rem)", color: "hsl(var(--foreground))", opacity: 0.5 }} className="mt-5 flex flex-wrap items-center justify-center gap-x-1">
      {/* Hidden measurer */}
      <span
        ref={hiddenRef}
        aria-hidden="true"
        className="whitespace-nowrap invisible fixed pointer-events-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.8rem, 2vw, 1.35rem)", top: -9999, left: -9999 }}
      />
      Lovable<span className="ml-1 mr-0">❤️</span>
      <motion.span
        className="inline-flex justify-center relative"
        style={{ height: "1.2em", verticalAlign: "text-bottom", overflow: "clip" }}
        animate={{ width: width + 10 }}
        transition={ready ? { type: "spring", stiffness: 250, damping: 25 } : { duration: 0 }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={current.word}
            initial={ready ? { y: 14, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex items-center justify-center gap-1 whitespace-nowrap"
            style={{ color: "hsl(var(--primary))" }}
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
  { cursive: "Lazy", name: "Design", link: "/lazy-design", tagline: "Autonomous UI upgrades" },
  { cursive: "Lazy", name: "Auth", link: "/lazy-auth", tagline: "Autonomous login flows" },
  { cursive: "Lazy", name: "Granola", link: "/lazy-granola", tagline: "Autonomous meeting content" },
  // Lazy Ops
  { cursive: "Lazy", name: "Admin", link: "/lazy-admin", tagline: "Autonomous ops control" },
  { cursive: "Lazy", name: "Alert", link: "/lazy-alert", tagline: "Autonomous Slack alerts" },
  { cursive: "Lazy", name: "Telegram", link: "/lazy-telegram", tagline: "Autonomous Telegram updates" },
  { cursive: "Lazy", name: "Supabase", link: "/lazy-supabase", tagline: "Autonomous database reports" },
  { cursive: "Lazy", name: "Security", link: "/lazy-security", tagline: "Autonomous pentesting" },
  { cursive: "Lazy", name: "Watch", link: "/lazy-watch", tagline: "Autonomous error monitoring" },
  { cursive: "Lazy", name: "Fix", link: "/lazy-fix", tagline: "Autonomous prompt improvement" },
  { cursive: "Lazy", name: "Build", link: "/lazy-build", tagline: "Autonomous agent writing" },
  { cursive: "Lazy", name: "Intel", link: "/lazy-intel", tagline: "Autonomous content strategy" },
  { cursive: "Lazy", name: "Repurpose", link: "/lazy-repurpose", tagline: "Autonomous content repurposing" },
  { cursive: "Lazy", name: "Trend", link: "/lazy-trend", tagline: "Autonomous trend detection" },
  { cursive: "Lazy", name: "Churn", link: "/lazy-churn", tagline: "Autonomous churn prevention" },

  { cursive: "Lazy", name: "Coming Soon", link: "", tagline: "More agents loading" },
];

/* ── Lucide icon map ── */
const iconMap: Record<string, LucideIcon> = {
  Launch: Rocket,
  Run: Clock,
  Blogger: FileText,
  SEO: Search,
  GEO: Globe,
  Crawl: Radar,
  Perplexity: Compass,
  Contentful: Layers,
  Store: ShoppingCart,
  Drop: Package,
  Print: Printer,
  Pay: CreditCard,
  SMS: MessageSquare,
  Mail: Mail,
  Voice: Mic,
  Stream: MonitorPlay,
  YouTube: Youtube,
  GitHub: Code,
  GitLab: GitBranch,
  Linear: BarChart3,
  Design: Paintbrush,
  Auth: Lock,
  Granola: Calendar,
  Admin: LayoutDashboard,
  Alert: Bell,
  Telegram: Send,
  Supabase: Database,
  Security: Shield,
  Watch: Eye,
  Fix: Wrench,
  Build: Hammer,
  Intel: Brain,
  Repurpose: RefreshCw,
  Trend: TrendingUp,
  Churn: UserCheck,
  "Coming Soon": Hourglass,
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
    <div className="min-h-screen text-foreground relative bg-background">
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
      <header className="relative z-10" style={{ backgroundColor: "hsl(var(--background))" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col items-center justify-center px-6 md:px-8 pt-48 pb-20 text-center"
        >
          {/* Headline */}
          <h1
            className="max-w-[900px]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)",
              color: "hsl(var(--foreground))",
              lineHeight: 1.08,
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Launch, build and run<br className="hidden md:inline" />
            {" "}your Lovable<span style={{ color: "hsl(var(--accent))" }}>❤️</span>website<br className="hidden md:inline" />
            {" "}with autonomous agents<span className="ml-1">🤖</span>
          </h1>

          {/* Rotating subtitle */}
          <RotatingHeadline />

          {/* Description */}
          <p
            className="max-w-2xl mt-6"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)",
              color: "hsl(var(--foreground))",
              opacity: 0.35,
              lineHeight: 1.7,
            }}
          >
            Each agent is a single prompt you paste into Lovable. It installs its own tables,<br className="hidden md:inline" /> edge functions, and UI — then runs itself, so you can build your autonomous business.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to="/lazy-launch"
              className="text-xs tracking-[0.2em] uppercase px-7 py-2.5 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97]"
              style={{ fontFamily: "'Space Grotesk', sans-serif", backgroundColor: "hsl(var(--primary))", color: "#0a0a08", borderRadius: 0 }}
            >
              Launch your Lovable website
            </Link>
            <Link
              to="/lazy-agents"
              className="text-xs tracking-[0.2em] uppercase px-7 py-2.5 font-semibold hover:opacity-80 transition-opacity active:scale-[0.97] border border-foreground/15"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "hsl(var(--foreground))", borderRadius: 0 }}
            >
              Explore Agents
            </Link>
          </div>

          {/* Integrations marquee — pushed to bottom */}
          <div className="mt-auto pt-16 w-full max-w-3xl overflow-hidden">
            <p className="text-[10px] tracking-[0.3em] uppercase font-semibold mb-4 text-center" style={{ color: "hsl(var(--foreground))", opacity: 0.2 }}>
              Integrates with
            </p>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <motion.div
                className="flex gap-10 items-center whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 45, ease: "linear", repeat: Infinity }}
              >
                {[...Array(2)].map((_, dupeIdx) => (
                  <div key={dupeIdx} className="flex gap-10 items-center shrink-0">
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
                      { name: "GitHub", href: "/lazy-github" },
                      { name: "GitLab", href: "/lazy-gitlab" },
                      { name: "Linear", href: "/lazy-linear" },
                      { name: "Slack", href: "/lazy-alert" },
                      { name: "Telegram", href: "/lazy-telegram" },
                      { name: "Supabase", href: "/lazy-supabase" },
                      { name: "Aikido", href: "/lazy-security" },
                    ].map((item) => (
                      <Link
                        key={`${dupeIdx}-${item.name}`}
                        to={item.href}
                        className="text-[11px] tracking-[0.15em] uppercase font-medium shrink-0 transition-opacity duration-200 hover:opacity-60"
                        style={{ color: "hsl(var(--foreground))", opacity: 0.25 }}
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
      <section className="relative z-10" style={{ backgroundColor: "hsl(var(--background))" }}>
        <div className="px-6 pt-20 pb-8 text-center max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "hsl(var(--foreground))", fontWeight: 800, lineHeight: 1 }}>
            35 agents run your Lovable business.
          </h2>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "hsl(var(--foreground))", fontWeight: 800, lineHeight: 1, marginTop: "0.1em" }}>
            One prompt each.
          </h2>
          <p className="mt-6 mx-auto max-w-2xl" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.9rem, 1.3vw, 1.1rem)", color: "hsl(var(--foreground))", opacity: 0.45, lineHeight: 1.7 }}>
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
          {/* Lazy Launch */}
          <Link to="/lazy-launch" className="block">
            <div
              className="aspect-square flex flex-col items-center justify-center gap-4 transition-colors duration-300 hover:brightness-[1.15] cursor-pointer p-4"
              style={{ backgroundColor: "hsl(var(--background))" }}
            >
              {(() => { const Icon = iconMap["Launch"]; return Icon ? <Icon size={24} strokeWidth={1.5} /> : null; })()}
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                  Launch
                </p>
              </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "hsl(var(--foreground))", opacity: 0.65 }}>
                 Launch your Lovable website
              </p>
            </div>
          </Link>

          {/* Lazy Run */}
          <Link to="/lazy-run" className="block">
            <div
              className="aspect-square flex flex-col items-center justify-center gap-4 transition-colors duration-300 hover:brightness-[1.15] cursor-pointer p-4"
              style={{ backgroundColor: "hsl(var(--card))" }}
            >
              {(() => { const Icon = iconMap["Run"]; return Icon ? <Icon size={24} strokeWidth={1.5} /> : null; })()}
              <div className="text-center">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                  Lazy
                </p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                  Run
                </p>
              </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "hsl(var(--foreground))", opacity: 0.65 }}>
                 Autonomous everything
              </p>
            </div>
          </Link>

          {products.map((product, i) => {
            const bgEven = "hsl(var(--background))";
            const bgOdd = "hsl(var(--card))";
            const cellIndex = i + 2;
            const row = Math.floor(cellIndex / 4);
            const col = cellIndex % 4;
            const bg = (row + col) % 2 === 0 ? bgEven : bgOdd;
            const isComingSoon = product.name === "Coming Soon";

            const content = (
              <div
                className="aspect-square flex flex-col items-center justify-center gap-4 transition-colors duration-300 hover:brightness-[1.15] cursor-pointer p-4"
                style={{ backgroundColor: bg }}
              >
                {(() => { const Icon = iconMap[product.name]; return Icon ? <Icon size={24} strokeWidth={1.5} /> : null; })()}
                <div className="text-center">
                  <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                    {product.cursive}
                  </p>
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "hsl(var(--foreground))", lineHeight: 1.1 }}>
                    {product.name}
                  </p>
                </div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "hsl(var(--foreground))", opacity: 0.65 }}>
                  {product.tagline}
                </p>
              </div>
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
