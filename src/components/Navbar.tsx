import { useState, useEffect, useRef, ReactNode } from "react";
import { Menu, X as XIcon, Linkedin, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
  megamenu?: boolean;
  children?: { label: string; href: string; group?: string }[];
}

interface NavbarProps {
  activePage?: "home" | "blog" | "guide" | "autonomy";
}

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Engine data for the mega menu ── */
interface EngineEntry {
  name: string;
  href: string;
  tagline: string;
  group: string;
  icon: ReactNode;
}

const engines: EngineEntry[] = [
  { name: "Blogger", href: "/lazy-blogger", tagline: "Your blog writes itself.", group: "Content",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="30" y="20" width="50" height="70" rx="3"/><line x1="40" y1="38" x2="70" y2="38"/><line x1="40" y1="48" x2="65" y2="48"/><line x1="40" y1="58" x2="70" y2="58"/><line x1="40" y1="68" x2="55" y2="68"/><path d="M82 90 L90 20 L94 22 L86 92 Z"/></svg> },
  { name: "SEO", href: "/lazy-seo", tagline: "Rankings on autopilot.", group: "Content",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="50" cy="55" r="22"/><line x1="66" y1="71" x2="85" y2="90"/><rect x="25" y="70" width="8" height="20" rx="1"/><rect x="38" y="60" width="8" height="30" rx="1"/><rect x="51" y="50" width="8" height="40" rx="1"/></svg> },
  { name: "GEO", href: "/lazy-geo", tagline: "Get cited by AI.", group: "Content",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M25 75 Q25 30 60 30 Q95 30 95 75 Q95 85 60 95 Q25 85 25 75Z"/><circle cx="60" cy="58" r="12"/><path d="M54 55 L58 62 L66 54"/></svg> },
  { name: "Voice", href: "/lazy-voice", tagline: "Every post, narrated.", group: "Content",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="50" y="25" width="20" height="40" rx="10"/><path d="M40 55 Q40 80 60 80 Q80 80 80 55"/><line x1="60" y1="80" x2="60" y2="95"/><line x1="48" y1="95" x2="72" y2="95"/></svg> },
  { name: "Store", href: "/lazy-store", tagline: "A store that runs itself.", group: "Commerce",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M35 45 L40 25 L80 25 L85 45"/><rect x="35" y="45" width="50" height="50" rx="3"/></svg> },
  { name: "Pay", href: "/lazy-pay", tagline: "Payments that optimise.", group: "Commerce",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="20" y="35" width="80" height="50" rx="5"/><line x1="20" y1="50" x2="100" y2="50"/><circle cx="85" cy="70" r="8"/><path d="M81 70 L84 73 L89 67"/></svg> },
  { name: "SMS", href: "/lazy-sms", tagline: "Texts that convert.", group: "Commerce",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="38" y="18" width="44" height="84" rx="8"/><line x1="52" y1="24" x2="68" y2="24"/><circle cx="60" cy="92" r="4"/></svg> },
  { name: "Stream", href: "/lazy-stream", tagline: "Streams become content.", group: "Platforms",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="25" y="30" width="70" height="45" rx="3"/><circle cx="60" cy="52" r="10"/><path d="M56 49 L66 52 L56 55 Z" fill="currentColor" stroke="none"/></svg> },
  { name: "Code", href: "/lazy-code", tagline: "Commits become changelogs.", group: "Platforms",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M45 40 L25 60 L45 80"/><path d="M75 40 L95 60 L75 80"/><line x1="65" y1="30" x2="55" y2="90"/></svg> },
  { name: "GitLab", href: "/lazy-gitlab", tagline: "GitLab commits → content.", group: "Platforms",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 95 L30 55 L38 25 L48 55 L72 55 L82 25 L90 55 Z"/></svg> },
  { name: "Linear", href: "/lazy-linear", tagline: "Issues become changelogs.", group: "Platforms",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="60" cy="55" r="28"/><path d="M45 55 L55 65 L75 45"/></svg> },
  { name: "Contentful", href: "/lazy-contentful", tagline: "Two-way CMS sync.", group: "Platforms",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="30" y="28" width="60" height="64" rx="5"/><line x1="60" y1="28" x2="60" y2="92"/><path d="M40 50 L55 50"/><path d="M65 50 L80 50"/></svg> },
  { name: "Perplexity", href: "/lazy-perplexity", tagline: "Research-backed content.", group: "Intelligence",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="55" cy="50" r="22"/><line x1="71" y1="66" x2="90" y2="85"/><path d="M48 45 Q55 35 62 45"/><circle cx="55" cy="55" r="3" fill="currentColor" stroke="none"/></svg> },
  { name: "Supabase", href: "/lazy-supabase", tagline: "Database tells its story.", group: "Intelligence",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M60 90 Q30 80 30 55 Q30 30 60 25 Q90 30 90 55 Q90 80 60 90Z"/><line x1="40" y1="50" x2="80" y2="50"/><line x1="40" y1="60" x2="80" y2="60"/></svg> },
  { name: "Alert", href: "/lazy-alert", tagline: "Your business in Slack.", group: "Notifications",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="28" y="30" width="64" height="50" rx="5"/><path d="M28 40 L60 62 L92 40"/><circle cx="85" cy="35" r="10" fill="currentColor" stroke="none"/></svg> },
  { name: "Telegram", href: "/lazy-telegram", tagline: "Your business in Telegram.", group: "Notifications",
    icon: <svg width="28" height="28" viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M25 55 L95 30 L75 90 L55 65 Z"/><line x1="95" y1="30" x2="55" y2="65"/></svg> },
];

/* Group engines */
const engineGroups = (() => {
  const map = new Map<string, EngineEntry[]>();
  for (const e of engines) {
    if (!map.has(e.group)) map.set(e.group, []);
    map.get(e.group)!.push(e);
  }
  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
})();

/* ── Mega menu for engines ── */
function EngineMegaMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute top-full right-0 mt-3 bg-card border border-border z-50 w-[720px] p-6">
      <div className="grid grid-cols-4 gap-6">
        {engineGroups.map((group) => (
          <div key={group.label}>
            <p className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/30 font-semibold mb-3">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((engine) => (
                <a
                  key={engine.name}
                  href={engine.href}
                  onClick={onClose}
                  className="group flex items-start gap-2.5 px-2 py-2 -mx-2 hover:bg-secondary/50 transition-colors rounded-sm"
                >
                  <span className="text-foreground/25 group-hover:text-foreground/60 transition-colors flex-shrink-0 mt-0.5">
                    {engine.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-[11px] font-bold tracking-[0.08em] uppercase text-foreground/60 group-hover:text-foreground transition-colors leading-tight">
                      {engine.name}
                    </p>
                    <p className="font-body text-[10px] text-foreground/25 group-hover:text-foreground/40 transition-colors leading-snug mt-0.5">
                      {engine.tagline}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <a href="/lazy-run" onClick={onClose} className="font-body text-[10px] tracking-[0.12em] uppercase text-foreground/40 hover:text-foreground transition-colors font-semibold">
          Lazy Run — All engines in one prompt →
        </a>
        <a href="/pricing" onClick={onClose} className="font-body text-[10px] tracking-[0.12em] uppercase text-foreground/25 hover:text-foreground transition-colors">
          View Pricing →
        </a>
      </div>
    </div>
  );
}

/* ── Simple dropdown ── */
function DropdownItem({ link, onClick }: { link: NavLink; onClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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

  if (!link.children && !link.megamenu) return null;

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className="font-body text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
      >
        {link.label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && link.megamenu && (
        <EngineMegaMenu onClose={() => { setOpen(false); onClick?.(); }} />
      )}
      {open && !link.megamenu && link.children && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-card border border-border py-2 min-w-[180px] z-50">
          {link.children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              onClick={() => { setOpen(false); onClick?.(); }}
              className="block px-4 py-2 font-body text-[11px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
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

  const links: NavLink[] = [
    { label: "Lazy Run", href: "/lazy-run" },
    { label: "Engines", href: "#", megamenu: true },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog", highlight: activePage === "blog" },
    { label: "About", href: "/about" },
    {
      label: "Resources",
      href: "#",
      children: [
        { label: "Guide", href: "/guide" },
        { label: "Directory", href: isHome ? "#directory" : "/#directory" },
        { label: "Autonomy Scale", href: "/autonomy-scale" },
        { label: "Launch Your Autonomous Startup", href: "/launch" },
      ],
    },
  ];

  const brandHref = isHome ? "#top" : "/";
  const handleBrandClick = isHome && !isMobile
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    : undefined;

  const mobileBrandHref = "/";

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdowns(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const socialIcons = (
    <>
      <a
        href="https://x.com/SaadSahawneh"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/30 hover:text-foreground transition-colors"
        aria-label="Follow on X"
      >
        <XLogo />
      </a>
      <a
        href="https://www.linkedin.com/in/saadsahawneh"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/30 hover:text-foreground transition-colors"
        aria-label="Follow on LinkedIn"
      >
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
        <div className="flex items-center justify-between w-full py-3">
          <a
            href={brandHref}
            onClick={handleBrandClick}
            className="font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground hover:text-foreground/70 transition-colors cursor-pointer leading-tight flex flex-col"
          >
            <span>Lazy</span>
            <span>Unicorn</span>
          </a>
          <div className="flex items-center gap-6">
            {links.map((link) =>
              link.children || link.megamenu ? (
                <DropdownItem key={link.label} link={link} />
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className={`font-body text-[11px] tracking-[0.15em] uppercase font-bold transition-colors ${
                    link.highlight
                      ? "text-foreground"
                      : "text-foreground/50 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </a>
              )
            )}
            {socialIcons}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between w-full bg-background border border-border px-5 py-2.5">
            <a
              href={mobileBrandHref}
              onClick={() => setOpen(false)}
              className="font-display text-[9px] font-semibold tracking-[0.15em] uppercase text-foreground hover:text-foreground/70 transition-colors leading-tight flex flex-col"
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
              <a href="/lazy-run" onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors">
                Lazy Run
              </a>
              <div>
                <button
                  onClick={() => toggleMobileDropdown("engines")}
                  className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 w-full"
                >
                  Engines
                  <ChevronDown size={12} className={`transition-transform ${mobileDropdowns["engines"] ? "rotate-180" : ""}`} />
                </button>
                {mobileDropdowns["engines"] && (
                  <div className="mt-3 space-y-3">
                    {engineGroups.map((group) => (
                      <div key={group.label}>
                        <p className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/25 font-semibold mb-1 pl-4">
                          {group.label}
                        </p>
                        {group.items.map((engine) => (
                          <a
                            key={engine.name}
                            href={engine.href}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 pl-4 py-1.5 font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors"
                          >
                            <span className="text-foreground/15 flex-shrink-0">{engine.icon}</span>
                            {engine.name}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {[
                { label: "Pricing", href: "/pricing" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <a key={item.label} href={item.href} onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors">
                  {item.label}
                </a>
              ))}
              <div>
                <button
                  onClick={() => toggleMobileDropdown("resources")}
                  className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 w-full"
                >
                  Resources
                  <ChevronDown size={12} className={`transition-transform ${mobileDropdowns["resources"] ? "rotate-180" : ""}`} />
                </button>
                {mobileDropdowns["resources"] && (
                  <div className="pl-4 mt-2 flex flex-col gap-2">
                    <a href="/guide" onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors">Guide</a>
                    <a href={isHome ? "#directory" : "/#directory"} onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors">Directory</a>
                    <a href="/autonomy-scale" onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors">Autonomy Scale</a>
                    <a href="/launch" onClick={() => setOpen(false)} className="font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors">Launch Your Startup</a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {socialIcons}
              </div>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
