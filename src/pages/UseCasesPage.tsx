import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard, MessageSquare, Mic, Globe, GitBranch, Search,
  Hash, Send, Tv, Database, FileText, Shield, Code, Zap,
  ArrowRight, CheckCircle2,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type Category = "All" | "Payments" | "Communication" | "Media" | "Content" | "Developer" | "Commerce" | "Security";

const filters: Category[] = ["All", "Content", "Commerce", "Payments", "Communication", "Developer", "Media", "Security"];

interface Integration {
  name: string;
  category: Category;
  description: string;
  unlocks: string[];
  engine: string;
  engineHref: string;
  icon: React.ReactNode;
  note?: string;
}

const integrations: Integration[] = [
  {
    name: "Stripe",
    category: "Payments",
    description: "Handle one-time payments and subscriptions in your Lovable site using chat-driven setup with no manual coding.",
    unlocks: [
      "Accept payments for products, services, or digital downloads.",
      "Offer monthly and annual subscription plans.",
      "Build a self-improving checkout that rewrites underperforming product copy automatically.",
      "Recover abandoned checkouts with personalised emails 24 hours later.",
      "Give customers a self-service portal to manage their subscriptions without contacting you.",
    ],
    engine: "Lazy Pay",
    engineHref: "/lazy-pay",
    icon: <CreditCard size={20} />,
  },
  {
    name: "Twilio",
    category: "Communication",
    description: "Send SMS and MMS messages, make voice calls, and add phone-based communication to your Lovable site.",
    unlocks: [
      "Send payment confirmation texts instantly when a customer pays.",
      "Send subscription renewal reminders 3 days before billing.",
      "Text customers who abandoned checkout with a fresh link 1 hour later.",
      "Handle two-way SMS conversations with AI-generated replies.",
      "Manage opt-outs automatically to stay compliant.",
      "Run message sequences that rewrite themselves when response rates drop.",
    ],
    engine: "Lazy SMS",
    engineHref: "/lazy-sms",
    icon: <MessageSquare size={20} />,
  },
  {
    name: "ElevenLabs",
    category: "Media",
    description: "Generate high-quality audio and text-to-speech in your Lovable site using any voice — including a clone of your own.",
    unlocks: [
      "Narrate every blog post in your voice automatically.",
      "Build a podcast that publishes itself from your written content.",
      "Add a Listen to this article audio player to every post.",
      "Generate an RSS feed submitted to Apple Podcasts and Spotify automatically.",
      "Clone your own voice once and have it narrate content you never recorded.",
    ],
    engine: "Lazy Voice",
    engineHref: "/lazy-voice",
    icon: <Mic size={20} />,
  },
  {
    name: "Firecrawl",
    category: "Content",
    description: "Scrape, crawl, and extract structured content from any website directly inside your Lovable project.",
    unlocks: [
      "Monitor competitor websites weekly for pricing changes and new features.",
      "Extract trending topics from industry news sites and feed them into your blog queue.",
      "Discover what keywords your competitors are ranking for.",
      "Find and extract leads from directories and public databases.",
      "Build a live industry intelligence feed that updates automatically.",
      "Feed real current data into your blog posts instead of AI guesswork.",
    ],
    engine: "Lazy Crawl",
    engineHref: "/",
    icon: <Globe size={20} />,
  },
  {
    name: "GitLab",
    category: "Developer",
    description: "Back up, sync, and collaborate on your Lovable code with GitLab — and turn every commit into published content.",
    unlocks: [
      "Publish a plain-English changelog automatically every time you push code.",
      "Generate release notes for every tagged version without writing them yourself.",
      "Write developer blog posts for significant features automatically.",
      "Maintain a public roadmap that updates from your GitLab issues.",
      "Summarise every merge request in plain English for non-technical stakeholders.",
    ],
    engine: "Lazy GitLab",
    engineHref: "/lazy-gitlab",
    icon: <GitBranch size={20} />,
  },
  {
    name: "Linear",
    category: "Developer",
    description: "Import your Linear issues and specs to inform app creation — and turn completed cycles into published product updates.",
    unlocks: [
      "Publish a cycle summary automatically every time a sprint completes.",
      "Generate a changelog from every batch of closed issues.",
      "Write product update posts when significant features ship.",
      "Maintain a public roadmap that reflects your Linear milestones in real time.",
      "Produce weekly velocity reports without writing them manually.",
    ],
    engine: "Lazy Linear",
    engineHref: "/lazy-linear",
    icon: <CheckCircle2 size={20} />,
  },
  {
    name: "Perplexity",
    category: "Content",
    description: "Answer questions and run web-backed research inside your Lovable project using live search results with citations.",
    unlocks: [
      "Research your niche daily with live web data and feed findings into your blog queue.",
      "Generate citation-rich blog posts grounded in what is actually happening on the web today.",
      "Discover the real questions people are asking AI assistants about your industry.",
      "Test whether your brand is being cited by AI engines when people ask relevant questions.",
      "Improve underperforming posts by updating them with current research automatically.",
    ],
    engine: "Lazy Perplexity",
    engineHref: "/lazy-perplexity",
    icon: <Search size={20} />,
  },
  {
    name: "Slack",
    category: "Communication",
    description: "Send alerts, read channels, and post updates from your Lovable site to any Slack workspace.",
    unlocks: [
      "Get an instant Slack message every time a payment comes in.",
      "Receive alerts when any engine encounters an error.",
      "Get a morning briefing in Slack showing everything your autonomous site did overnight.",
      "Control your engines with slash commands without opening a dashboard.",
      "Route different events to different Slack channels — payments to one channel, errors to another.",
    ],
    engine: "Lazy Alert",
    engineHref: "/lazy-alert",
    icon: <Hash size={20} />,
  },
  {
    name: "Telegram",
    category: "Communication",
    description: "Send messages and receive commands through bots — connecting your Lovable site to Telegram.",
    unlocks: [
      "Get real-time Telegram messages for every significant engine event.",
      "Control your engines with bot commands from your phone.",
      "Receive a daily morning briefing in Telegram.",
      "Get instant alerts for critical security vulnerabilities.",
      "Use /lazy publish, /lazy pause, /lazy status from any device without opening a browser.",
    ],
    engine: "Lazy Telegram",
    engineHref: "/lazy-telegram",
    icon: <Send size={20} />,
  },
  {
    name: "Twitch",
    category: "Media",
    description: "Connect your Lovable site to Twitch to monitor streams and turn live content into published articles.",
    unlocks: [
      "Publish a stream recap blog post automatically every time you go offline.",
      "Generate an SEO article from every stream targeting the keywords your audience searches.",
      "Extract top clips and publish them as a highlights page.",
      "Show a live banner on your site automatically when you go live.",
      "Build a growing archive of indexed stream content without writing anything manually.",
    ],
    engine: "Lazy Stream",
    engineHref: "/lazy-stream",
    icon: <Tv size={20} />,
  },
  {
    name: "Supabase",
    category: "Developer",
    description: "Authenticate users and store data — the backbone of every Lovable project, now with autonomous milestone monitoring.",
    unlocks: [
      "Publish a celebration post automatically when you hit 100, 500, or 1,000 users.",
      "Get alerted when edge function error rates spike.",
      "Track which database tables are growing fastest.",
      "Monitor storage usage and get alerts before hitting limits.",
      "Generate weekly growth reports showing signup trends and database health automatically.",
    ],
    engine: "Lazy Supabase",
    engineHref: "/lazy-supabase",
    icon: <Database size={20} />,
  },
  {
    name: "Contentful",
    category: "Content",
    description: "Sync content between your Lovable site and Contentful in both directions — automatically, continuously.",
    unlocks: [
      "Pull published Contentful entries into your Lovable site automatically.",
      "Push every blog post Lazy Blogger publishes into Contentful for distribution across all connected channels.",
      "Sync SEO articles and GEO content to Contentful without manual copying.",
      "Handle real-time sync via webhooks when content is published or unpublished.",
      "Distribute your autonomous content to every channel at once.",
    ],
    engine: "Lazy Contentful",
    engineHref: "/lazy-contentful",
    icon: <FileText size={20} />,
  },
  {
    name: "Aikido",
    category: "Security",
    description: "Run penetration tests against your live Lovable app and get audit-ready security reports automatically.",
    unlocks: [
      "Run a full pentest automatically on a configurable schedule — weekly, monthly, or quarterly.",
      "Get instant alerts when critical vulnerabilities are found.",
      "Generate a shareable security report before every enterprise sales call or investor meeting.",
      "Track your security score over time and see the trend.",
      "Detect regressions when previously fixed vulnerabilities reappear.",
      "Show a public security posture page that builds enterprise trust.",
    ],
    engine: "Lazy Security",
    engineHref: "/lazy-security",
    icon: <Shield size={20} />,
    note: "Powered by Aikido — available via Lazy Security",
  },
  {
    name: "GitHub",
    category: "Developer",
    description: "Turn every GitHub commit into changelogs, release notes, and developer blog posts automatically.",
    unlocks: [
      "Publish a plain-English changelog automatically every time you push code.",
      "Generate comprehensive release notes for every tagged release.",
      "Write developer-facing SEO articles for significant features.",
      "Maintain a public roadmap that updates from your GitHub issues and milestones.",
      "Build a growing developer blog from the work you are already doing.",
    ],
    engine: "Lazy Code",
    engineHref: "/lazy-github",
    icon: <Code size={20} />,
  },
];

export default function UseCasesPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? integrations : integrations.filter((i) => i.category === active);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO
        title="Use Cases — What Your Lovable Site Can Do | Lazy Unicorn"
        description="Real use cases for every Lovable integration. See what becomes possible when you connect Stripe, Twilio, ElevenLabs, and more through Lazy engines."
      />
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.h1
          variants={fade}
          initial="hidden"
          animate="show"
          className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight"
        >
          What your Lovable site can do when it is connected to everything.
        </motion.h1>
        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.1 }}
          className="mt-6 font-body text-base md:text-lg text-foreground/50 max-w-3xl mx-auto leading-relaxed"
        >
          Every Lazy engine connects your Lovable site to a real service. Here is what each connection makes possible — based on what Lovable's integrations actually support.
        </motion.p>
        <motion.p
          variants={fade}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.2 }}
          className="mt-4 font-body text-xs text-foreground/30 max-w-2xl mx-auto"
        >
          All integrations on this page are official Lovable shared connectors. Each one installs into your existing Lovable project with one Lazy prompt.
        </motion.p>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-body text-xs tracking-[0.12em] uppercase font-semibold px-4 py-2 border transition-colors ${
                active === f
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-foreground/40 hover:text-foreground/60 hover:border-foreground/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Cards */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.name}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05 }}
              className="border border-border bg-card p-6 flex flex-col gap-4"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-foreground/30">{item.icon}</span>
                  <h2 className="font-display text-lg font-bold">{item.name}</h2>
                </div>
                <Badge variant="outline" className="text-[10px] tracking-[0.15em] uppercase shrink-0">
                  {item.category}
                </Badge>
              </div>

              {/* Description */}
              <p className="font-body text-sm text-foreground/50 leading-relaxed">{item.description}</p>

              {/* Unlocks */}
              <div>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/30 font-semibold mb-3">
                  What it unlocks
                </p>
                <ul className="space-y-2">
                  {item.unlocks.map((u, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Zap size={12} className="text-accent mt-0.5 shrink-0" />
                      <span className="font-body text-xs text-foreground/40 leading-relaxed">{u}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Note */}
              {item.note && (
                <p className="font-body text-[10px] text-foreground/25 italic">{item.note}</p>
              )}

              {/* Engine badge */}
              <div className="mt-auto pt-3 border-t border-border">
                <Link
                  to={item.engineHref}
                  className="inline-flex items-center gap-2 font-body text-xs tracking-[0.1em] uppercase font-semibold text-foreground/40 hover:text-foreground transition-colors"
                >
                  <span className="text-[10px] text-foreground/20">Lazy engine →</span>
                  {item.engine}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-card">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-24 text-center">
          <motion.h2
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold"
          >
            All of these. One prompt.
          </motion.h2>
          <motion.p
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-body text-sm text-foreground/45 leading-relaxed max-w-2xl mx-auto"
          >
            Lazy Run installs every integration your site needs in a single setup wizard. Select the services you want, add your API keys, and your Lovable site connects to all of them at once. Every integration runs autonomously after setup — no ongoing configuration required.
          </motion.p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/lazy-run"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-body text-sm font-semibold tracking-[0.1em] uppercase px-8 py-3 hover:bg-accent/90 transition-colors"
            >
              Install Lazy Run <ArrowRight size={14} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 border border-border font-body text-sm font-semibold tracking-[0.1em] uppercase px-8 py-3 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              Browse all engines
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
