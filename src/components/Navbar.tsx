import { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { Menu, X as XIcon, Linkedin, ChevronDown, ChevronRight, Github } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NavbarProps {
  activePage?: "home" | "blog" | "guide" | "autonomy";
}

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Engine icons ── */
const icons = {
  blogger: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="30" y="20" width="50" height="70" rx="3"/><line x1="40" y1="38" x2="70" y2="38"/><line x1="40" y1="48" x2="65" y2="48"/><line x1="40" y1="58" x2="70" y2="58"/><line x1="40" y1="68" x2="55" y2="68"/><path d="M82 90 L90 20 L94 22 L86 92 Z"/></svg>,
  seo: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="55" r="22"/><line x1="66" y1="71" x2="85" y2="90"/><rect x="25" y="70" width="8" height="20" rx="1"/><rect x="38" y="60" width="8" height="30" rx="1"/><rect x="51" y="50" width="8" height="40" rx="1"/></svg>,
  geo: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M25 75 Q25 30 60 30 Q95 30 95 75 Q95 85 60 95 Q25 85 25 75Z"/><circle cx="60" cy="58" r="12"/><path d="M54 55 L58 62 L66 54"/></svg>,
  voice: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="50" y="25" width="20" height="40" rx="10"/><path d="M40 55 Q40 80 60 80 Q80 80 80 55"/><line x1="60" y1="80" x2="60" y2="95"/><line x1="48" y1="95" x2="72" y2="95"/></svg>,
  store: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M35 45 L40 25 L80 25 L85 45"/><rect x="35" y="45" width="50" height="50" rx="3"/></svg>,
  pay: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="20" y="35" width="80" height="50" rx="5"/><line x1="20" y1="50" x2="100" y2="50"/><circle cx="85" cy="70" r="8"/></svg>,
  sms: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="38" y="18" width="44" height="84" rx="8"/><line x1="52" y1="24" x2="68" y2="24"/><circle cx="60" cy="92" r="4"/></svg>,
  stream: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="25" y="30" width="70" height="45" rx="3"/><circle cx="60" cy="52" r="10"/><path d="M56 49 L66 52 L56 55 Z" fill="currentColor" stroke="none"/></svg>,
  code: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M45 40 L25 60 L45 80"/><path d="M75 40 L95 60 L75 80"/><line x1="65" y1="30" x2="55" y2="90"/></svg>,
  gitlab: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 95 L30 55 L38 25 L48 55 L72 55 L82 25 L90 55 Z"/></svg>,
  linear: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="60" cy="55" r="28"/><path d="M45 55 L55 65 L75 45"/></svg>,
  contentful: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="30" y="28" width="60" height="64" rx="5"/><line x1="60" y1="28" x2="60" y2="92"/><path d="M40 50 L55 50"/><path d="M65 50 L80 50"/></svg>,
  perplexity: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="55" cy="50" r="22"/><line x1="71" y1="66" x2="90" y2="85"/><path d="M48 45 Q55 35 62 45"/><circle cx="55" cy="55" r="3" fill="currentColor" stroke="none"/></svg>,
  supabase: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 90 Q30 80 30 55 Q30 30 60 25 Q90 30 90 55 Q90 80 60 90Z"/><line x1="40" y1="50" x2="80" y2="50"/><line x1="40" y1="60" x2="80" y2="60"/></svg>,
  alert: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="28" y="30" width="64" height="50" rx="5"/><path d="M28 40 L60 62 L92 40"/><circle cx="85" cy="35" r="10" fill="currentColor" stroke="none"/></svg>,
  telegram: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M25 55 L95 30 L75 90 L55 65 Z"/><line x1="95" y1="30" x2="55" y2="65"/></svg>,
  security: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 20 L90 35 L90 65 Q90 90 60 100 Q30 90 30 65 L30 35 Z"/><path d="M48 58 L56 66 L72 50"/></svg>,
  mail: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="25" y="35" width="70" height="50" rx="3"/><path d="M25 40 L60 65 L95 40"/></svg>,
  run: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="50,30 85,60 50,90"/></svg>,
  admin: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="25" y="25" width="70" height="70" rx="5"/><line x1="25" y1="45" x2="95" y2="45"/><line x1="55" y1="45" x2="55" y2="95"/></svg>,
  launch: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 25 L60 75"/><path d="M45 40 L60 25 L75 40"/><path d="M35 95 L85 95"/></svg>,
  auth: <svg width="20" height="20" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="35" y="50" width="50" height="40" rx="4"/><path d="M45 50 L45 38 Q45 22 60 22 Q75 22 75 38 L75 50"/><circle cx="60" cy="68" r="5"/></svg>,
};

/* ── All products organised by category ── */
const productCategories = [
  {
    label: "Lazy Unicorn",
    items: [
      { label: "Lazy Run", href: "/lazy-run", tagline: "Launch autonomous everything.", icon: icons.run },
    ],
  },
  {
    label: "Lazy Content",
    items: [
      { label: "Lazy Blogger", href: "/lazy-blogger", tagline: "Launch autonomous blog posts.", icon: icons.blogger },
      { label: "Lazy SEO", href: "/lazy-seo", tagline: "Launch autonomous SEO content.", icon: icons.seo },
      { label: "Lazy GEO", href: "/lazy-geo", tagline: "Launch autonomous AI citations.", icon: icons.geo },
      { label: "Lazy Crawl", href: "/lazy-crawl", tagline: "Launch autonomous web research.", icon: icons.perplexity },
      { label: "Lazy Perplexity", href: "/lazy-perplexity", tagline: "Launch autonomous deep research.", icon: icons.perplexity },
      { label: "Lazy Contentful", href: "/lazy-contentful", tagline: "Launch autonomous CMS sync.", icon: icons.contentful },
    ],
  },
  {
    label: "Lazy Commerce",
    items: [
      { label: "Lazy Store", href: "/lazy-store", tagline: "Launch autonomous storefronts.", icon: icons.store },
      { label: "Lazy Pay", href: "/lazy-pay", tagline: "Launch autonomous payments.", icon: icons.pay },
      { label: "Lazy SMS", href: "/lazy-sms", tagline: "Launch autonomous text campaigns.", icon: icons.sms },
      { label: "Lazy Mail", href: "/lazy-mail", tagline: "Launch autonomous email flows.", icon: icons.mail },
    ],
  },
  {
    label: "Lazy Media",
    items: [
      { label: "Lazy Voice", href: "/lazy-voice", tagline: "Launch autonomous podcasts.", icon: icons.voice },
      { label: "Lazy Stream", href: "/lazy-stream", tagline: "Launch autonomous stream content.", icon: icons.stream },
    ],
  },
  {
    label: "Lazy Dev",
    items: [
      { label: "Lazy GitHub", href: "/lazy-github", tagline: "Launch autonomous changelogs.", icon: icons.code },
      { label: "Lazy GitLab", href: "/lazy-gitlab", tagline: "Launch autonomous GitLab docs.", icon: icons.gitlab },
      { label: "Lazy Linear", href: "/lazy-linear", tagline: "Launch autonomous issue content.", icon: icons.linear },
      { label: "Lazy Design", href: "/lazy-design", tagline: "Launch autonomous UI upgrades.", icon: icons.admin },
      { label: "Lazy Auth", href: "/lazy-auth", tagline: "Launch autonomous login flows.", icon: icons.auth },
    ],
  },
  {
    label: "Lazy Ops",
    items: [
      { label: "Lazy Admin", href: "/lazy-admin", tagline: "Launch autonomous ops control.", icon: icons.admin },
      { label: "Lazy Alert", href: "/lazy-alert", tagline: "Launch autonomous Slack alerts.", icon: icons.alert },
      { label: "Lazy Telegram", href: "/lazy-telegram", tagline: "Launch autonomous Telegram updates.", icon: icons.telegram },
      { label: "Lazy Supabase", href: "/lazy-supabase", tagline: "Launch autonomous database reports.", icon: icons.supabase },
      { label: "Lazy Security", href: "/lazy-security", tagline: "Launch autonomous pentesting.", icon: icons.security },
    ],
  },
];

/* ── Mega dropdown — flat grid showing all products ── */
function MegaDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptsFetched = useRef(false);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
    if (!promptsFetched.current) {
      promptsFetched.current = true;
      (supabase as any)
        .from("prompt_versions")
        .select("product, prompt_text")
        .eq("is_current", true)
        .then(({ data }: { data: any[] | null }) => {
          if (data) {
            const map: Record<string, string> = {};
            data.forEach((d: any) => { map[d.product] = d.prompt_text; });
            setPrompts(map);
          }
        });
    }
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 250);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const handleCopyPrompt = useCallback((e: React.MouseEvent, productKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const key = productKey.replace("/", "").replace("lazy-", "lazy-");
    const slug = productKey.startsWith("/") ? productKey.slice(1) : productKey;
    const text = prompts[slug];
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedKey(slug);
      toast.success("Prompt copied to clipboard");
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }, [prompts]);

  const renderCategory = (cat: typeof productCategories[number]) => (
    <div key={cat.label} className="mb-6">
      <p className="font-display text-[18px] tracking-[0.2em] uppercase text-foreground font-black mb-3">
        {cat.label}
      </p>
      {cat.items.map((item) => {
        const slug = item.href.slice(1);
        const hasPrompt = !!prompts[slug];
        const isCopied = copiedKey === slug;
        return (
          <a
            key={item.label}
            href={item.href}
            onClick={() => { setOpen(false); onNavigate?.(); }}
            className="group flex items-center gap-4 px-3 py-[18px] -mx-1 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-foreground/50 group-hover:text-foreground/70 transition-colors flex-shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[14px] font-black tracking-[0.04em] uppercase text-foreground/60 group-hover:text-foreground transition-colors leading-tight whitespace-nowrap">
                {item.label}
              </p>
              <p className="font-body text-[13px] font-normal text-foreground/40 group-hover:text-foreground/55 transition-colors leading-tight mt-1 whitespace-nowrap">
                {item.tagline}
              </p>
            </div>
            {hasPrompt && (
              <button
                onClick={(e) => handleCopyPrompt(e, item.href)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 font-display text-[10px] tracking-[0.15em] uppercase font-bold px-2.5 py-1.5 border border-foreground/20 text-foreground/50 hover:text-foreground hover:border-foreground/40 hover:bg-foreground/5 whitespace-nowrap"
              >
                {isCopied ? "Copied ✓" : "Copy Prompt"}
              </button>
            )}
          </a>
        );
      })}
    </div>
  );

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1"
      >
        Products
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card border border-border z-50 p-9"
          style={{ width: 1380 }}
        >
          <div className="flex gap-12">
            {/* Column 1: Lazy Unicorn + Lazy Commerce */}
            <div className="flex-1 min-w-0">
              {[productCategories[0], productCategories[2]].map(renderCategory)}
            </div>
            {/* Column 2: Lazy Content */}
            <div className="flex-1 min-w-0">
              {[productCategories[1]].map(renderCategory)}
            </div>
            {/* Column 3: Lazy Media + Lazy Dev */}
            <div className="flex-1 min-w-0">
              {[productCategories[3], productCategories[4]].map(renderCategory)}
            </div>
            {/* Column 4: Lazy Ops */}
            <div className="flex-1 min-w-0">
              {[productCategories[5]].map(renderCategory)}
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-center">
            <span className="font-body text-[12px] tracking-[0.15em] uppercase text-foreground/30 font-semibold">
              Made for Lovable ❤️
            </span>
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

  const socialIcons = (
    <>
      <a href="https://github.com/LazyUnicornFounder/LazyUnicorn" target="_blank" rel="noopener noreferrer" className="text-foreground/45 hover:text-foreground transition-colors" aria-label="View prompts on GitHub">
        <Github size={14} />
      </a>
      <a href="https://x.com/SaadSahawneh" target="_blank" rel="noopener noreferrer" className="text-foreground/45 hover:text-foreground transition-colors" aria-label="Follow on X">
        <XLogo />
      </a>
      <a href="https://www.linkedin.com/company/lazy-unicorn/" target="_blank" rel="noopener noreferrer" className="text-foreground/45 hover:text-foreground transition-colors" aria-label="Follow on LinkedIn">
        <Linkedin size={14} />
      </a>
    </>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center w-full px-8 transition-all duration-300 ${
        scrolled
          ? "bg-background border-b border-border pt-3 pb-1"
          : "pt-6"
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
          <div className="flex items-center gap-5 mx-auto">
            <a href="/how-it-works" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="/use-cases" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              Use Cases
            </a>
            <MegaDropdown />
            <a href="/pricing" className="font-body text-[13px] tracking-[0.1em] uppercase font-bold text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </a>
            <SimpleDropdown
              label="Resources"
              children={[
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
              <a href="/how-it-works" onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold">
                How It Works
              </a>
              <a href="/use-cases" onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold">
                Use Cases
              </a>

              {/* Mobile: collapsible product categories */}
              {productCategories.map((cat) => (
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
                          <span className="text-foreground/15 flex-shrink-0">{item.icon}</span>
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {[
                { label: "Pricing", href: "/pricing" },
                { label: "Autonomy", href: "/autonomy" },
                { label: "Blog", href: "/blog" },
                { label: "Changelog", href: "/changelog" },
                { label: "Upgrade Guide", href: "/upgrade-guide" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <a key={item.label + item.href} href={item.href} onClick={() => setOpen(false)} className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground transition-colors font-semibold">
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
