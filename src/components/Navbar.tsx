import { useState, useEffect, useRef } from "react";
import { Menu, X as XIcon, Linkedin, ChevronDown, ChevronRight, Github, Rocket, Clock, FileText, Search, Globe, Radar, Compass, Layers, ShoppingCart, Package, Printer, CreditCard, MessageSquare, Mail, Mic, MonitorPlay, Youtube, Code, GitBranch, BarChart3, Paintbrush, Lock, Calendar, LayoutDashboard, Bell, Send, Database, Shield, Eye, Wrench, Hammer, Brain, RefreshCw, TrendingUp, UserCheck, ListEnd, type LucideIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  activePage?: "home" | "blog" | "guide" | "autonomy" | "docs";
}

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Agent icon map (Lucide, consistent with homepage & lazy-run) ── */
const iconMap: Record<string, LucideIcon> = {
  Launch: Rocket, Cloud: Database, Waitlist: ListEnd, Run: Clock, Blogger: FileText, SEO: Search, GEO: Globe,
  Crawl: Radar, Perplexity: Compass, Contentful: Layers, Store: ShoppingCart,
  Drop: Package, Print: Printer, Pay: CreditCard, SMS: MessageSquare, Mail: Mail,
  Voice: Mic, Stream: MonitorPlay, YouTube: Youtube, GitHub: Code, GitLab: GitBranch,
  Linear: BarChart3, Design: Paintbrush, Auth: Lock, Granola: Calendar,
  Admin: LayoutDashboard, Alert: Bell, Telegram: Send, Supabase: Database,
  Security: Shield, Watch: Eye, Fix: Wrench, Build: Hammer, Intel: Brain,
  Repurpose: RefreshCw, Trend: TrendingUp, Churn: UserCheck,
};

const agentIcon = (name: string) => {
  const Icon = iconMap[name];
  return Icon ? <Icon size={16} strokeWidth={1.5} /> : null;
};

type CategoryItem = { label: string; href: string; tagline: string; iconKey: string };
type Category = { label: string; items: CategoryItem[] };

/* ── Agent categories ── */
const agentCategories: Category[] = [
  {
    label: "Lazy Platform",
    items: [
      { label: "Lazy Launch", href: "/lazy-launch", tagline: "Autonomous project launcher", iconKey: "Launch" },
      { label: "Lazy Cloud", href: "/lazy-cloud", tagline: "Autonomous cloud hosting", iconKey: "Cloud" },
      { label: "Lazy Run", href: "/lazy-run", tagline: "Autonomous everything", iconKey: "Run" },
      { label: "Lazy Admin", href: "/lazy-admin", tagline: "Autonomous ops control", iconKey: "Admin" },
      { label: "Lazy Waitlist", href: "/lazy-waitlist", tagline: "Autonomous pre-launch capture", iconKey: "Waitlist" },
    ],
  },
  {
    label: "Lazy Content",
    items: [
      { label: "Lazy Blogger", href: "/lazy-blogger", tagline: "Autonomous blog posts", iconKey: "Blogger" },
      { label: "Lazy SEO", href: "/lazy-seo", tagline: "Autonomous SEO content", iconKey: "SEO" },
      { label: "Lazy GEO", href: "/lazy-geo", tagline: "Autonomous AI citations", iconKey: "GEO" },
      { label: "Lazy Crawl", href: "/lazy-crawl", tagline: "Autonomous web research", iconKey: "Crawl" },
      { label: "Lazy Perplexity", href: "/lazy-perplexity", tagline: "Autonomous deep research", iconKey: "Perplexity" },
      { label: "Lazy Contentful", href: "/lazy-contentful", tagline: "Autonomous CMS sync", iconKey: "Contentful" },
    ],
  },
  {
    label: "Lazy Commerce",
    items: [
      { label: "Lazy Store", href: "/lazy-store", tagline: "Autonomous storefronts", iconKey: "Store" },
      { label: "Lazy Drop", href: "/lazy-drop", tagline: "Autonomous dropshipping", iconKey: "Drop" },
      { label: "Lazy Print", href: "/lazy-print", tagline: "Autonomous print-on-demand", iconKey: "Print" },
      { label: "Lazy Pay", href: "/lazy-pay", tagline: "Autonomous payments", iconKey: "Pay" },
      { label: "Lazy SMS", href: "/lazy-sms", tagline: "Autonomous text campaigns", iconKey: "SMS" },
      { label: "Lazy Mail", href: "/lazy-mail", tagline: "Autonomous email flows", iconKey: "Mail" },
    ],
  },
  {
    label: "Lazy Media",
    items: [
      { label: "Lazy Voice", href: "/lazy-voice", tagline: "Autonomous podcasts", iconKey: "Voice" },
      { label: "Lazy Stream", href: "/lazy-stream", tagline: "Autonomous stream content", iconKey: "Stream" },
      { label: "Lazy YouTube", href: "/lazy-youtube", tagline: "Autonomous video content", iconKey: "YouTube" },
    ],
  },
  {
    label: "Lazy Dev",
    items: [
      { label: "Lazy GitHub", href: "/lazy-github", tagline: "Autonomous changelogs", iconKey: "GitHub" },
      { label: "Lazy GitLab", href: "/lazy-gitlab", tagline: "Autonomous GitLab docs", iconKey: "GitLab" },
      { label: "Lazy Linear", href: "/lazy-linear", tagline: "Autonomous issue content", iconKey: "Linear" },
      { label: "Lazy Design", href: "/lazy-design", tagline: "Autonomous UI upgrades", iconKey: "Design" },
      { label: "Lazy Auth", href: "/lazy-auth", tagline: "Autonomous login flows", iconKey: "Auth" },
      { label: "Lazy Granola", href: "/lazy-granola", tagline: "Autonomous meeting content", iconKey: "Granola" },
    ],
  },
  {
    label: "Lazy Ops",
    items: [
      { label: "Lazy Alert", href: "/lazy-alert", tagline: "Autonomous Slack alerts", iconKey: "Alert" },
      { label: "Lazy Telegram", href: "/lazy-telegram", tagline: "Autonomous Telegram updates", iconKey: "Telegram" },
      { label: "Lazy Supabase", href: "/lazy-supabase", tagline: "Autonomous database reports", iconKey: "Supabase" },
      { label: "Lazy Security", href: "/lazy-security", tagline: "Autonomous pentesting", iconKey: "Security" },
      { label: "Lazy Watch", href: "/lazy-watch", tagline: "Autonomous error monitoring", iconKey: "Watch" },
      { label: "Lazy Fix", href: "/lazy-fix", tagline: "Autonomous prompt improvement", iconKey: "Fix" },
      { label: "Lazy Build", href: "/lazy-build", tagline: "Autonomous agent writing", iconKey: "Build" },
      { label: "Lazy Intel", href: "/lazy-intel", tagline: "Autonomous content strategy", iconKey: "Intel" },
      { label: "Lazy Repurpose", href: "/lazy-repurpose", tagline: "Autonomous content repurposing", iconKey: "Repurpose" },
      { label: "Lazy Trend", href: "/lazy-trend", tagline: "Autonomous trend detection", iconKey: "Trend" },
      { label: "Lazy Churn", href: "/lazy-churn", tagline: "Autonomous churn prevention", iconKey: "Churn" },
    ],
  },
];

/* ── Shared dropdown category renderer ── */
function renderCategoryBlock(cat: Category, onClose: () => void) {
  return (
    <div key={cat.label} className="mb-2">
      <p className="font-display text-[18px] tracking-[0.2em] uppercase text-foreground font-black mb-2">
        {cat.label}
      </p>
      {cat.items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={onClose}
          className="group flex items-center gap-3 px-3 py-[7px] -mx-1 hover:bg-secondary/50 transition-colors"
        >
          <span className="text-foreground/50 group-hover:text-foreground/70 transition-colors flex-shrink-0">
            {agentIcon(item.iconKey)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-body text-[14px] font-black tracking-[0.04em] uppercase text-foreground/60 group-hover:text-foreground transition-colors leading-tight whitespace-nowrap">
              {item.label}
            </p>
            <p className="font-body text-[13px] font-normal text-foreground/40 group-hover:text-foreground/55 transition-colors leading-tight mt-1 whitespace-nowrap">
              {item.tagline}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ── Agents mega dropdown ── */
function AgentsDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEnter = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setOpen(true); };
  const handleLeave = () => { timeoutRef.current = setTimeout(() => setOpen(false), 250); };
  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);
  const close = () => setOpen(false);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
      >
        Agents
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card border border-border z-50 p-6" style={{ width: 1380 }}>
          <div className="mb-3 pb-3 border-b border-border/50 flex items-center justify-between">
            <a href="/agents" onClick={close} className="font-body text-[12px] tracking-[0.12em] uppercase text-foreground/40 hover:text-foreground transition-colors font-semibold">
              View all agents →
            </a>
            <span className="font-body text-[12px] tracking-[0.15em] uppercase text-foreground/30 font-semibold">
              Made for Lovable ❤️
            </span>
          </div>
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              {[agentCategories[0], agentCategories[2]].map(c => renderCategoryBlock(c, close))}
            </div>
            <div className="flex-1 min-w-0">
              {[agentCategories[1]].map(c => renderCategoryBlock(c, close))}
            </div>
            <div className="flex-1 min-w-0">
              {[agentCategories[3], agentCategories[4]].map(c => renderCategoryBlock(c, close))}
            </div>
            <div className="flex-1 min-w-0">
              {[agentCategories[5]].map(c => renderCategoryBlock(c, close))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Simple dropdown for Resources ── */
function SimpleDropdown({
  label,
  children,
}: {
  label: string;
  children: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
      >
        {label}
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card border border-border py-2 min-w-[200px] z-50">
          {children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-body text-[13px] tracking-[0.1em] uppercase text-foreground/60 hover:text-foreground hover:bg-secondary transition-colors"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── All mobile categories ── */
const allMobileCategories: Category[] = [...agentCategories];

const Navbar = ({ activePage = "home" }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const brandHref = isHome ? "#top" : "/";
  const handleBrandClick = isHome && !isMobile
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    : undefined;

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center w-full px-4 md:px-8 transition-all duration-300 ${
        scrolled
          ? "bg-background border-b border-border pt-3 pb-1"
          : "pt-4 md:pt-6"
      }`}
    >
      {!isMobile ? (
        <div className="flex items-center w-full py-3 relative">
          <a
            href={brandHref}
            onClick={handleBrandClick}
            className="font-display text-[12px] font-semibold tracking-[0.15em] uppercase text-foreground hover:text-foreground/70 transition-colors cursor-pointer leading-tight flex flex-col absolute left-0"
          >
            <span>Lazy</span>
            <span>Unicorn</span>
          </a>
          <div className="flex items-center gap-8 mx-auto">
            <a href="/lazy-launch" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              Lazy Launch
            </a>
            <a href="/lazy-cloud" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              Lazy Cloud
            </a>
            <AgentsDropdown />
            <a href="/pricing" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="/how-it-works" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              How It Works
            </a>
            <SimpleDropdown
              label="Resources"
              children={[
                { label: "Docs", href: "/docs" },
                { label: "Use Cases", href: "/use-cases" },
                { label: "Blog", href: "/blog" },
                { label: "Autonomy", href: "/autonomy" },
                { label: "Changelog", href: "/changelog" },
                { label: "Upgrade Guide", href: "/upgrade-guide" },
                { label: "About", href: "/about" },
              ]}
            />
          </div>
          <a href="https://github.com/LazyUnicornFounder/LazyUnicorn" target="_blank" rel="noopener noreferrer" className="text-foreground/45 hover:text-foreground transition-colors" aria-label="View prompts on GitHub">
            <Github size={20} />
          </a>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full bg-background border border-border px-5 py-2.5">
            <a
              href="/"
              onClick={() => setOpen(false)}
              className="font-display text-[11px] font-semibold tracking-[0.15em] uppercase text-foreground hover:text-foreground/70 transition-colors leading-tight flex flex-col"
            >
              <span>Lazy</span>
              <span>Unicorn</span>
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground/50 hover:text-foreground transition-colors p-1"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <XIcon size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {open && (
            <div className="mt-0 w-full bg-background border border-t-0 border-border px-5 py-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
              <a href="/docs" onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold py-1">
                Docs
              </a>
              <a href="/how-it-works" onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold py-1">
                How It Works
              </a>
              <a href="/use-cases" onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold py-1">
                Use Cases
              </a>

              {/* Mobile: collapsible categories */}
              {allMobileCategories.map((cat) => (
                <div key={cat.label}>
                  <button
                    onClick={() => toggleMobileDropdown(cat.label)}
                    className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 w-full font-semibold"
                  >
                    {cat.label}
                    <ChevronDown size={12} className={`transition-transform ${mobileDropdowns[cat.label] ? "rotate-180" : ""}`} />
                  </button>
                  {mobileDropdowns[cat.label] && (
                    <div className="mt-2 space-y-1 pl-2">
                      {cat.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2.5 py-2 font-body text-[13px] tracking-[0.1em] uppercase text-foreground/55 hover:text-foreground transition-colors"
                        >
                          <span className="text-foreground/15 flex-shrink-0">{agentIcon(item.iconKey)}</span>
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {[
                { label: "Lazy Launch", href: "/lazy-launch" },
                { label: "Lazy Cloud", href: "/lazy-cloud" },
                { label: "Pricing", href: "/pricing" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Use Cases", href: "/use-cases" },
                { label: "Autonomy", href: "/autonomy" },
                { label: "Blog", href: "/blog" },
                { label: "Changelog", href: "/changelog" },
                { label: "Upgrade Guide", href: "/upgrade-guide" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <a key={item.label + item.href} href={item.href} onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold py-1">
                  {item.label}
                </a>
              ))}

            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
