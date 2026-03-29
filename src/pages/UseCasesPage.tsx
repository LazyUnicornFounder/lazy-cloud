import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CreditCard, MessageSquare, Mic, Globe, GitBranch, Search,
  Bell, Send, MonitorPlay, Database, FileText, Shield, Code,
  ArrowRight, Paintbrush, Eye, Wrench, Hammer,
  Brain, RefreshCw, TrendingUp, UserCheck, LayoutDashboard, BarChart3,
  Radar, Compass, Layers, ShoppingCart, Package, Printer, Mail,
  Youtube, Lock, Calendar,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type Category = "All" | "Lazy Content" | "Lazy Commerce" | "Lazy Media" | "Lazy Dev" | "Lazy Ops";

const filters: Category[] = ["All", "Lazy Content", "Lazy Commerce", "Lazy Media", "Lazy Dev", "Lazy Ops"];

interface Integration {
  name: string;
  category: Category;
  description: string;
  unlocks: string[];
  agent: string;
  agentHref: string;
  icon: React.ReactNode;
  note?: string;
}

const integrations: Integration[] = [
  // Lazy Content
  {
    name: "Firecrawl",
    category: "Lazy Content",
    description: "Scrape, crawl, and extract structured content from any website directly inside your Lovable project.",
    unlocks: [
      "Monitor competitor websites weekly for pricing changes and new features.",
      "Extract trending topics from industry news sites and feed them into your blog queue.",
      "Discover what keywords your competitors are ranking for.",
      "Find and extract leads from directories and public databases.",
      "Build a live industry intelligence feed that updates automatically.",
      "Feed real current data into your blog posts instead of AI guesswork.",
    ],
    agent: "Lazy Crawl",
    agentHref: "/lazy-crawl",
    icon: <Radar size={20} />,
  },
  {
    name: "Perplexity",
    category: "Lazy Content",
    description: "Answer questions and run web-backed research inside your Lovable project using live search results with citations.",
    unlocks: [
      "Research your niche daily with live web data and feed findings into your blog queue.",
      "Generate citation-rich blog posts grounded in what is actually happening on the web today.",
      "Discover the real questions people are asking AI assistants about your industry.",
      "Test whether your brand is being cited by AI agent when people ask relevant questions.",
      "Improve underperforming posts by updating them with current research automatically.",
    ],
    agent: "Lazy Perplexity",
    agentHref: "/lazy-perplexity",
    icon: <Compass size={20} />,
  },
  {
    name: "Contentful",
    category: "Lazy Content",
    description: "Sync content between your Lovable site and Contentful in both directions — automatically, continuously.",
    unlocks: [
      "Pull published Contentful entries into your Lovable site automatically.",
      "Push every blog post Lazy Blogger publishes into Contentful for distribution across all connected channels.",
      "Sync SEO articles and GEO content to Contentful without manual copying.",
      "Handle real-time sync via webhooks when content is published or unpublished.",
      "Distribute your autonomous content to every channel at once.",
    ],
    agent: "Lazy Contentful",
    agentHref: "/lazy-contentful",
    icon: <Layers size={20} />,
  },
  // Lazy Commerce
  {
    name: "Stripe",
    category: "Lazy Commerce",
    description: "Handle one-time payments and subscriptions in your Lovable site using chat-driven setup with no manual coding.",
    unlocks: [
      "Accept payments for products, services, or digital downloads.",
      "Offer monthly and annual subscription plans.",
      "Build a self-improving checkout that rewrites underperforming product copy automatically.",
      "Recover abandoned checkouts with personalised emails 24 hours later.",
      "Give customers a self-service portal to manage their subscriptions without contacting you.",
    ],
    agent: "Lazy Pay",
    agentHref: "/lazy-pay",
    icon: <CreditCard size={20} />,
  },
  {
    name: "Twilio",
    category: "Lazy Commerce",
    description: "Send SMS and MMS messages, make voice calls, and add phone-based communication to your Lovable site.",
    unlocks: [
      "Send payment confirmation texts instantly when a customer pays.",
      "Send subscription renewal reminders 3 days before billing.",
      "Text customers who abandoned checkout with a fresh link 1 hour later.",
      "Handle two-way SMS conversations with AI-generated replies.",
      "Manage opt-outs automatically to stay compliant.",
      "Run message sequences that rewrite themselves when response rates drop.",
    ],
    agent: "Lazy SMS",
    agentHref: "/lazy-sms",
    icon: <MessageSquare size={20} />,
  },
  {
    name: "Resend",
    category: "Lazy Commerce",
    description: "Send transactional and marketing emails from your Lovable site with high deliverability and a generous free tier.",
    unlocks: [
      "Capture subscribers with a double opt-in flow that handles GDPR automatically.",
      "Send AI-written welcome sequences the moment someone confirms their subscription.",
      "Broadcast a newsletter every time you publish a new blog post — no manual work.",
      "Self-improve subject lines using AI when open rates drop below 20%.",
      "Manage subscriber lists and unsubscribes without third-party email marketing tools.",
    ],
    agent: "Lazy Mail",
    agentHref: "/lazy-mail",
    icon: <Mail size={20} />,
  },
  // Lazy Media
  {
    name: "ElevenLabs",
    category: "Lazy Media",
    description: "Generate high-quality audio and text-to-speech in your Lovable site using any voice — including a clone of your own.",
    unlocks: [
      "Narrate every blog post in your voice automatically.",
      "Build a podcast that publishes itself from your written content.",
      "Add a Listen to this article audio player to every post.",
      "Generate an RSS feed submitted to Apple Podcasts and Spotify automatically.",
      "Clone your own voice once and have it narrate content you never recorded.",
    ],
    agent: "Lazy Voice",
    agentHref: "/lazy-voice",
    icon: <Mic size={20} />,
  },
  {
    name: "Twitch",
    category: "Lazy Media",
    description: "Connect your Lovable site to Twitch to monitor streams and turn live content into published articles.",
    unlocks: [
      "Publish a stream recap blog post automatically every time you go offline.",
      "Generate an SEO article from every stream targeting the keywords your audience searches.",
      "Extract top clips and publish them as a highlights page.",
      "Show a live banner on your site automatically when you go live.",
      "Build a growing archive of indexed stream content without writing anything manually.",
    ],
    agent: "Lazy Stream",
    agentHref: "/lazy-stream",
    icon: <MonitorPlay size={20} />,
  },
  {
    name: "YouTube",
    category: "Lazy Media",
    description: "Turn every YouTube video into a transcript, SEO article, GEO article, summary, and chapter markers — published automatically.",
    unlocks: [
      "Publish a full transcript from every video as a searchable article on your site.",
      "Generate a long-form SEO article from every video's content targeting your niche keywords.",
      "Create GEO-optimised content so AI agent cite your videos in their answers.",
      "Auto-generate chapter markers and update your YouTube video description.",
      "Extract comment intelligence — questions become SEO keyword targets automatically.",
    ],
    agent: "Lazy YouTube",
    agentHref: "/lazy-youtube",
    icon: <Youtube size={20} />,
    note: "Uses YouTube Data API + Supadata — both free to start",
  },
  // Lazy Dev
  {
    name: "GitHub",
    category: "Lazy Dev",
    description: "Turn every GitHub commit into changelogs, release notes, and developer blog posts automatically.",
    unlocks: [
      "Publish a plain-English changelog automatically every time you push code.",
      "Generate comprehensive release notes for every tagged release.",
      "Write developer-facing SEO articles for significant features.",
      "Maintain a public roadmap that updates from your GitHub issues and milestones.",
      "Build a growing developer blog from the work you are already doing.",
    ],
    agent: "Lazy GitHub",
    agentHref: "/lazy-github",
    icon: <Code size={20} />,
  },
  {
    name: "GitLab",
    category: "Lazy Dev",
    description: "Back up, sync, and collaborate on your Lovable code with GitLab — and turn every commit into published content.",
    unlocks: [
      "Publish a plain-English changelog automatically every time you push code.",
      "Generate release notes for every tagged version without writing them yourself.",
      "Write developer blog posts for significant features automatically.",
      "Maintain a public roadmap that updates from your GitLab issues.",
      "Summarise every merge request in plain English for non-technical stakeholders.",
    ],
    agent: "Lazy GitLab",
    agentHref: "/lazy-gitlab",
    icon: <GitBranch size={20} />,
  },
  {
    name: "Linear",
    category: "Lazy Dev",
    description: "Import your Linear issues and specs to inform app creation — and turn completed cycles into published product updates.",
    unlocks: [
      "Publish a cycle summary automatically every time a sprint completes.",
      "Generate a changelog from every batch of closed issues.",
      "Write product update posts when significant features ship.",
      "Maintain a public roadmap that reflects your Linear milestones in real time.",
      "Produce weekly velocity reports without writing them manually.",
    ],
    agent: "Lazy Linear",
    agentHref: "/lazy-linear",
    icon: <BarChart3 size={20} />,
  },
  {
    name: "21st.dev",
    category: "Lazy Dev",
    description: "Browse and install pre-built UI components into your Lovable project — heroes, navbars, testimonials, CTAs, and more.",
    unlocks: [
      "Audit every page and detect which sections can be upgraded with a premium component.",
      "Get brand-matched component suggestions based on your colour scheme and typography.",
      "Apply upgrades with one click using ready-to-paste Lovable prompts.",
      "Schedule weekly or monthly design reviews that upgrade one section at a time.",
      "Fall back to AI-generated Tailwind + Framer Motion components when no library match exists.",
    ],
    agent: "Lazy Design",
    agentHref: "/lazy-design",
    icon: <Paintbrush size={20} />,
    note: "Uses the 21st.dev component library — no API key required",
  },
  {
    name: "Google OAuth",
    category: "Lazy Dev",
    description: "Add Google Sign-In to your Lovable project with one prompt — no Google Cloud configuration required.",
    unlocks: [
      "Add Sign in with Google to your login page with zero OAuth setup.",
      "Protect any route so only authenticated users can access it.",
      "Assign roles like admin, moderator, and user to control access.",
      "Build a user management dashboard that shows signups, last seen, and role.",
      "Export your entire user list as a CSV with one click.",
    ],
    agent: "Lazy Auth",
    agentHref: "/lazy-auth",
    icon: <Lock size={20} />,
    note: "Uses Lovable Cloud for OAuth — no Google Cloud setup needed",
  },
  {
    name: "Granola",
    category: "Lazy Dev",
    description: "Turn every meeting into blog posts, Slack summaries, Linear issues, and customer intelligence automatically.",
    unlocks: [
      "Publish a blog post from every customer discovery call automatically.",
      "Send a Slack summary to your team the moment a meeting ends.",
      "Create Linear issues from every action item without manual entry.",
      "Extract customer signals — problems, feature requests, competitors — into a private intelligence feed.",
      "Generate product update posts from planning sessions and product reviews.",
    ],
    agent: "Lazy Granola",
    agentHref: "/lazy-granola",
    icon: <Calendar size={20} />,
    note: "Uses the Granola MCP server — free to start",
  },
  // Lazy Ops
  {
    name: "Slack",
    category: "Lazy Ops",
    description: "Send alerts, read channels, and post updates from your Lovable site to any Slack workspace.",
    unlocks: [
      "Get an instant Slack message every time a payment comes in.",
      "Receive alerts when any agent encounters an error.",
      "Get a morning briefing in Slack showing everything your autonomous site did overnight.",
      "Control your agents with slash commands without opening a dashboard.",
      "Route different events to different Slack channels — payments to one channel, errors to another.",
    ],
    agent: "Lazy Alert",
    agentHref: "/lazy-alert",
    icon: <Bell size={20} />,
  },
  {
    name: "Telegram",
    category: "Lazy Ops",
    description: "Send messages and receive commands through bots — connecting your Lovable site to Telegram.",
    unlocks: [
      "Get real-time Telegram messages for every significant agent event.",
      "Control your agents with bot commands from your phone.",
      "Receive a daily morning briefing in Telegram.",
      "Get instant alerts for critical security vulnerabilities.",
      "Use /lazy publish, /lazy pause, /lazy status from any device without opening a browser.",
    ],
    agent: "Lazy Telegram",
    agentHref: "/lazy-telegram",
    icon: <Send size={20} />,
  },
  {
    name: "Supabase",
    category: "Lazy Ops",
    description: "Authenticate users and store data — the backbone of every Lovable project, now with autonomous milestone monitoring.",
    unlocks: [
      "Publish a celebration post automatically when you hit 100, 500, or 1,000 users.",
      "Get alerted when edge function error rates spike.",
      "Track which database tables are growing fastest.",
      "Monitor storage usage and get alerts before hitting limits.",
      "Generate weekly growth reports showing signup trends and database health automatically.",
    ],
    agent: "Lazy Supabase",
    agentHref: "/lazy-supabase",
    icon: <Database size={20} />,
  },
  {
    name: "Aikido",
    category: "Lazy Ops",
    description: "Run penetration tests against your live Lovable app and get audit-ready security reports automatically.",
    unlocks: [
      "Run a full pentest automatically on a configurable schedule — weekly, monthly, or quarterly.",
      "Get instant alerts when critical vulnerabilities are found.",
      "Generate a shareable security report before every enterprise sales call or investor meeting.",
      "Track your security score over time and see the trend.",
      "Detect regressions when previously fixed vulnerabilities reappear.",
      "Show a public security posture page that builds enterprise trust.",
    ],
    agent: "Lazy Security",
    agentHref: "/lazy-security",
    icon: <Shield size={20} />,
    note: "Powered by Aikido — available via Lazy Security",
  },
  // Lazy Commerce — AutoDS
  {
    name: "AutoDS",
    category: "Lazy Commerce",
    description: "Connect to 800M+ products from 25+ global suppliers. Automate product discovery, pricing, and fulfilment for your Lovable store.",
    unlocks: [
      "Discover trending products in your niche automatically every day.",
      "Import products with AI-written listings — no copy-paste from suppliers.",
      "Monitor supplier prices hourly and adjust your sell price to maintain target margins.",
      "Fulfil every customer order automatically via AutoDS without manual work.",
      "Pause out-of-stock products automatically and re-activate when stock returns.",
      "Get weekly optimisation reports identifying worst performers.",
    ],
    agent: "Lazy Drop",
    agentHref: "/lazy-drop",
    icon: <Package size={20} />,
    note: "Requires an AutoDS account — plans from $26.90/month",
  },
  // Lazy Commerce — Printful
  {
    name: "Printful",
    category: "Lazy Commerce",
    description: "Design, list, and sell custom merch with zero inventory. Printful prints and ships every order on demand.",
    unlocks: [
      "Generate branded merch designs from your site's colour palette and logo automatically.",
      "Sync your Printful catalogue to your Lovable storefront in real time.",
      "Fulfil every order via Printful — print, pack, and ship without touching a product.",
      "Monitor profit margins and get weekly performance reports.",
      "Launch seasonal collections automatically based on trending topics in your niche.",
      "Show a public merch store page on your site with one prompt.",
    ],
    agent: "Lazy Print",
    agentHref: "/lazy-print",
    icon: <Printer size={20} />,
    note: "Requires a Printful account — free to start, pay per order",
  },
  // Ops — Lazy Admin
  {
    name: "Ops Dashboard",
    category: "Lazy Ops",
    description: "A unified control panel for every agent in your stack — start, stop, publish, and monitor from one screen.",
    unlocks: [
      "Start or pause any agent with a single click.",
      "See which agents are healthy, erroring, or stalled at a glance.",
      "Trigger a manual publish for any content agent instantly.",
      "View a live feed of recent agent activity and errors.",
    ],
    agent: "Lazy Admin",
    agentHref: "/lazy-admin",
    icon: <LayoutDashboard size={20} />,
  },
  // Ops — Lazy Watch
  {
    name: "Error Monitoring",
    category: "Lazy Ops",
    description: "Lazy Watch scans every agent's error table hourly, diagnoses root causes with AI, and opens GitHub issues automatically.",
    unlocks: [
      "Detect agent failures within an hour — not days later.",
      "Get AI-powered root cause analysis for every error.",
      "Open a GitHub issue with reproduction steps automatically.",
      "Track error frequency trends and see which agents need attention.",
    ],
    agent: "Lazy Watch",
    agentHref: "/lazy-watch",
    icon: <Eye size={20} />,
    note: "Requires GITHUB_TOKEN and ANTHROPIC_API_KEY",
  },
  // Ops — Lazy Fix
  {
    name: "Prompt Improvement",
    category: "Lazy Ops",
    description: "Lazy Fix analyses underperforming prompts weekly, writes targeted improvements, and opens pull requests with the changes.",
    unlocks: [
      "Automatically identify prompts producing low-quality output.",
      "Get AI-written prompt patches submitted as GitHub PRs.",
      "Track which fixes improved output quality over time.",
      "Never let a bad prompt run for more than a week uncorrected.",
    ],
    agent: "Lazy Fix",
    agentHref: "/lazy-fix",
    icon: <Wrench size={20} />,
    note: "Requires GITHUB_TOKEN and ANTHROPIC_API_KEY",
  },
  // Ops — Lazy Build
  {
    name: "Agent Generation",
    category: "Lazy Ops",
    description: "Lazy Build generates complete new agent prompts — with database schemas, edge functions, and UI — from a one-paragraph brief.",
    unlocks: [
      "Describe what you want in plain English and get a working agent prompt.",
      "Generated prompts include full database schemas and scheduling logic.",
      "New prompts are committed directly to your GitHub repo.",
      "Expand your autonomous stack without writing a single prompt manually.",
    ],
    agent: "Lazy Build",
    agentHref: "/lazy-build",
    icon: <Hammer size={20} />,
    note: "Requires GITHUB_TOKEN and ANTHROPIC_API_KEY",
  },
  // Ops — Lazy Intel
  {
    name: "Content Strategy",
    category: "Lazy Ops",
    description: "Lazy Intel generates weekly strategy reports by analysing your blog, SEO, and GEO performance data — then fuels new keywords automatically.",
    unlocks: [
      "Get a weekly content strategy brief delivered to your dashboard.",
      "Identify content gaps and underperforming keywords automatically.",
      "Feed high-priority keywords into Lazy SEO and Lazy GEO queues.",
      "Track which strategy recommendations led to ranking improvements.",
    ],
    agent: "Lazy Intel",
    agentHref: "/lazy-intel",
    icon: <Brain size={20} />,
    note: "No API keys required — reads from your existing agent data",
  },
  // Ops — Lazy Repurpose
  {
    name: "Content Repurposing",
    category: "Lazy Ops",
    description: "Lazy Repurpose reads your top posts every Sunday and generates four formats — Twitter thread, LinkedIn post, newsletter section, and video script.",
    unlocks: [
      "Turn every blog post into a Twitter thread with a hook that stops the scroll.",
      "Generate LinkedIn posts under 1300 characters optimised for engagement.",
      "Create newsletter sections that drive readers back to your full posts.",
      "Draft 60-90 second video scripts ready for TikTok, Reels, or Shorts.",
      "Queue everything for review or connect APIs for direct posting.",
    ],
    agent: "Lazy Repurpose",
    agentHref: "/lazy-repurpose",
    icon: <RefreshCw size={20} />,
    note: "No API keys required — optional Twitter/LinkedIn APIs for auto-posting",
  },
  // Ops — Lazy Trend
  {
    name: "Trend Detection",
    category: "Lazy Ops",
    description: "Lazy Trend scans Perplexity, Firecrawl, and competitors every 6 hours. When a topic spikes it queues SEO keywords and GEO articles automatically.",
    unlocks: [
      "Detect trending topics in your niche before competitors publish.",
      "Auto-queue urgent SEO keywords when a trend spikes.",
      "Draft GEO articles on trending topics for immediate AI citation.",
      "Get instant Slack alerts when high-urgency trends are detected.",
      "Publish on trends within hours — not days after everyone else.",
    ],
    agent: "Lazy Trend",
    agentHref: "/lazy-trend",
    icon: <TrendingUp size={20} />,
    note: "Uses Firecrawl + Perplexity — already set if Lazy Crawl/Perplexity installed",
  },
  // Ops — Lazy Churn
  {
    name: "Churn Prevention",
    category: "Lazy Ops",
    description: "Lazy Churn monitors Stripe subscribers daily, scores risk based on login activity and renewal proximity, and sends personalised re-engagement automatically.",
    unlocks: [
      "Score every subscriber daily on a 0-100 risk scale.",
      "Send personalised SMS and email re-engagement before cancellation.",
      "Track intervention outcomes — who logged back in after contact.",
      "Get daily Slack digests showing MRR at risk and recovery stats.",
      "Reduce churn by acting before customers reach the cancel button.",
    ],
    agent: "Lazy Churn",
    agentHref: "/lazy-churn",
    icon: <UserCheck size={20} />,
    note: "Requires Stripe — works with Lazy SMS and Lazy Mail for outreach",
  },
  // Ops — GitHub + Anthropic (shared infra)
  {
    name: "GitHub (Ops Agents)",
    category: "Lazy Ops",
    description: "Lazy Agents use your GitHub repo to open issues for errors and PRs for prompt improvements — all autonomously.",
    unlocks: [
      "Lazy Watch opens a GitHub issue every time an agent error is detected.",
      "Lazy Fix opens a pull request with targeted prompt improvements weekly.",
      "Lazy Build commits a complete new agent prompt from a one-paragraph brief.",
      "All agent activity is tracked and auditable via your repo.",
    ],
    agent: "Lazy Agents",
    agentHref: "/lazy-agents",
    icon: <Code size={20} />,
    note: "Requires GITHUB_TOKEN with repo scope",
  },
  {
    name: "Anthropic (Ops Agents)",
    category: "Lazy Ops",
    description: "Lazy Agents use Claude to reason about errors, performance data, and content strategy — powering autonomous decisions.",
    unlocks: [
      "Lazy Watch diagnoses root causes from error logs using Claude.",
      "Lazy Fix analyses performance trends and writes precise prompt edits.",
      "Lazy Intel generates weekly content strategy briefs from all your data.",
      "Lazy Build drafts complete agent prompts with database schemas and edge functions.",
    ],
    agent: "Lazy Agents",
    agentHref: "/lazy-agents",
    icon: <Code size={20} />,
    note: "Uses Anthropic API — requires ANTHROPIC_API_KEY",
  },
];

function IntegrationCard({ item, index }: { item: Integration; index: number }) {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.05 }}
      className="border border-border bg-card p-6 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-foreground/70">{item.icon}</span>
          <h2 className="font-display text-lg font-bold">{item.name}</h2>
        </div>
        <Badge variant="outline" className="text-[14px] tracking-[0.15em] uppercase shrink-0">
          {item.category}
        </Badge>
      </div>
      <p className="font-body text-sm text-foreground/50 leading-relaxed">{item.description}</p>
      <div>
        <p className="font-body text-[14px] tracking-[0.2em] uppercase text-foreground/70 font-semibold mb-3">What it unlocks</p>
        <ul className="space-y-2">
          {item.unlocks.map((u, j) => (
            <li key={j} className="flex items-start gap-2">
              <ArrowRight size={12} className="text-accent mt-0.5 shrink-0" />
              <span className="font-body text-sm text-foreground/65 leading-relaxed">{u}</span>
            </li>
          ))}
        </ul>
      </div>
      {item.note && <p className="font-body text-[14px] text-foreground/65 italic">{item.note}</p>}
      <div className="mt-auto pt-3 border-t border-border">
        <Link
          to={item.agentHref}
          className="inline-flex items-center gap-2 font-body text-sm tracking-[0.1em] uppercase font-semibold text-foreground/65 hover:text-foreground transition-colors"
        >
          <span className="text-[14px] text-foreground/60">Lazy agent →</span>
          {item.agent}
        </Link>
      </div>
    </motion.div>
  );
}

export default function UseCasesPage() {
  const [active, setActive] = useState<Category>("All");

  const filtered = active === "All" ? integrations : integrations.filter((i) => i.category === active);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0a0a08", color: "#f0ead6" }}>
      <SEO
        title="Use Cases — What Your Lovable Site Can Do | Lazy Unicorn"
        description="Real use cases for every Lovable integration. See what becomes possible when you connect Stripe, Twilio, ElevenLabs, and more through Lazy agents."
      />
      <Navbar />

      {/* Header */}
      <section className="px-6 md:px-12 pt-32 pb-24 md:pb-32 max-w-4xl mx-auto">
        <motion.div variants={fade} initial="hidden" animate="show">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            What your Lovable site can do when it is connected to everything.
          </h1>
          <p className="mt-6 font-body text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
            Every Lazy agent connects your{" "}
            <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">Lovable</a>{" "}
            site to a real service. Here is what each connection makes possible.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-4xl mx-auto mb-12">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`font-body text-sm tracking-[0.12em] uppercase font-semibold px-4 py-2 border transition-colors ${
                active === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-white/15 hover:border-white/30 transition-colors"
              }`}
              style={active !== f ? { color: "#f0ead6", opacity: 0.5 } : {}}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Section Header */}
      {filtered.length > 0 && (
        <section className="px-6 md:px-12 max-w-4xl mx-auto pt-8 pb-12">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
              36 agents run your Lovable business.
            </h2>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em", marginTop: "0.1em" }}>
              One prompt each.
            </h3>
            <p className="mt-6 font-body text-base max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
              Each agent connects your Lovable site to a real service. Here is what each connection makes possible.
            </p>
          </motion.div>
        </section>
      )}

      {/* All Cards */}
      {filtered.length > 0 && (
        <section className="px-6 md:px-12 max-w-4xl mx-auto pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((item, i) => (
              <IntegrationCard key={item.name} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {filtered.length > 0 && (
        <section className="border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-24">
            <motion.h2 variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
              All of these. One prompt.
            </motion.h2>
            <motion.p variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: 0.1 }} className="mt-6 font-body text-base leading-relaxed max-w-xl" style={{ color: "#f0ead6", opacity: 0.5 }}>
              Lazy Run installs every integration your site needs in a single setup wizard. Select the services you want, add your API keys, and your Lovable site connects to all of them at once.
            </motion.p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <Link to="/lazy-run" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity">
                Install Lazy Run <ArrowRight size={14} />
              </Link>
              <Link to="/lazy-agents" className="inline-flex items-center gap-2 border border-white/15 font-body text-sm font-semibold tracking-[0.1em] uppercase px-6 py-2.5 hover:border-white/30 transition-colors" style={{ color: "#f0ead6", opacity: 0.5 }}>
                Browse all agents
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
