import { useState, useEffect, useRef } from "react";
import { Menu, X as XIcon, Linkedin, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
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

function DropdownItem({ link, onClick }: { link: NavLink; onClick?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  if (!link.children) return null;

  // Group children by group label
  const groups: { label: string; items: { label: string; href: string }[] }[] = [];
  let currentGroup: { label: string; items: { label: string; href: string }[] } | null = null;
  for (const child of link.children) {
    const g = child.group || "";
    if (!currentGroup || currentGroup.label !== g) {
      currentGroup = { label: g, items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push(child);
  }

  const hasGroups = groups.some(g => g.label !== "");
  const isWide = hasGroups && link.children.length > 8;

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen(!open)}
        className="font-body text-[11px] tracking-[0.15em] uppercase font-bold text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1"
      >
        {link.label}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-3 bg-card border border-border py-3 z-50 ${
            isWide
              ? "right-0 grid grid-cols-2 gap-0 min-w-[360px]"
              : "left-1/2 -translate-x-1/2 min-w-[180px]"
          }`}
        >
          {isWide ? (
            groups.map((group) => (
              <div key={group.label} className="px-1">
                {group.label && (
                  <p className="px-3 pt-1 pb-2 font-body text-[9px] tracking-[0.2em] uppercase text-foreground/25 font-semibold">
                    {group.label}
                  </p>
                )}
                {group.items.map((child) => (
                  <a
                    key={child.label}
                    href={child.href}
                    onClick={() => { setOpen(false); onClick?.(); }}
                    className="block px-3 py-1.5 font-body text-[11px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            ))
          ) : (
            link.children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                onClick={() => { setOpen(false); onClick?.(); }}
                className="block px-4 py-2 font-body text-[11px] tracking-[0.12em] uppercase text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
              >
                {child.label}
              </a>
            ))
          )}
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
    {
      label: "Engines",
      href: "#",
      children: [
        { label: "Blogger", href: "/lazy-blogger", group: "Content" },
        { label: "SEO", href: "/lazy-seo", group: "Content" },
        { label: "GEO", href: "/lazy-geo", group: "Content" },
        { label: "Voice", href: "/lazy-voice", group: "Content" },
        { label: "Store", href: "/lazy-store", group: "Commerce" },
        { label: "Pay", href: "/lazy-pay", group: "Commerce" },
        { label: "SMS", href: "/lazy-sms", group: "Commerce" },
        { label: "Stream", href: "/lazy-stream", group: "Platforms" },
        { label: "Code", href: "/lazy-code", group: "Platforms" },
        { label: "GitLab", href: "/lazy-gitlab", group: "Platforms" },
        { label: "Linear", href: "/lazy-linear", group: "Platforms" },
        { label: "Contentful", href: "/lazy-contentful", group: "Platforms" },
        { label: "Perplexity", href: "/lazy-perplexity", group: "Intelligence" },
        { label: "Supabase", href: "/lazy-supabase", group: "Intelligence" },
        { label: "Alert", href: "/lazy-alert", group: "Intelligence" },
        { label: "Telegram", href: "/lazy-telegram", group: "Intelligence" },
      ],
    },
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
              link.children ? (
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
              {links.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className="font-body text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1 w-full"
                    >
                      {link.label}
                      <ChevronDown size={12} className={`transition-transform ${mobileDropdowns[link.label] ? "rotate-180" : ""}`} />
                    </button>
                    {mobileDropdowns[link.label] && (
                      <div className="pl-4 mt-2 flex flex-col gap-2">
                        {link.children.map((child) => (
                          <a
                            key={child.label}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="font-body text-xs tracking-[0.12em] uppercase text-foreground/30 hover:text-foreground transition-colors"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-body text-xs tracking-[0.15em] uppercase transition-colors ${
                      link.highlight
                        ? "text-foreground"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
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
