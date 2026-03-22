import { useState, useEffect } from "react";
import { Menu, X as XIcon, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import LiveCounter from "@/components/LiveCounter";

interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
  isCta?: boolean;
}

interface NavbarProps {
  activePage?: "home" | "blog" | "guide";
}

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Navbar = ({ activePage = "home" }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";

  const links: NavLink[] = [
    { label: "Guide", href: "/guide", highlight: activePage === "guide" },
    { label: "Directory", href: isHome ? "#directory" : "/#directory" },
    { label: "Blog", href: "/blog", highlight: activePage === "blog" },
    { label: "Mission", href: isHome ? "#mission" : "/#mission" },
    { label: "About", href: isHome ? "#about" : "/#about" },
    { label: "Submit", href: isHome ? "#launch" : "/#launch", isCta: true },
  ];

  const brandHref = isHome ? "#top" : "/";
  const handleBrandClick = isHome
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    : undefined;

  const socialIcons = (
    <>
      <a
        href="https://x.com/SaadSahawneh"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/50 hover:text-primary transition-colors"
        aria-label="Follow on X"
      >
        <XLogo />
      </a>
      <a
        href="https://www.linkedin.com/in/saadsahawneh"
        target="_blank"
        rel="noopener noreferrer"
        className="text-foreground/50 hover:text-primary transition-colors"
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
          ? "bg-transparent backdrop-blur-xl border-b border-foreground/10 shadow-[0_4px_16px_rgba(0,0,0,0.3)] pt-3 pb-1"
          : "pt-6"
      }`}
    >
      {!isMobile ? (
        <>
          <div className="mb-1.5 flex items-center gap-2">
            <div className="bg-transparent backdrop-blur-xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
              <LiveCounter />
            </div>
          </div>
          <div className="flex items-center justify-between w-full py-3">
            <a
              href={brandHref}
              onClick={handleBrandClick}
              className="font-display text-sm font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Lazy&#160;Unicorn
            </a>
            <div className="flex items-center gap-6">
              {links.map((link) =>
                link.isCta ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`font-body text-[11px] tracking-[0.15em] uppercase transition-colors ${
                      link.highlight
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
              {socialIcons}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between w-full bg-background/60 backdrop-blur-xl-2xl border border-foreground/10 rounded-full px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <a
              href={brandHref}
              onClick={(e) => {
                handleBrandClick?.(e);
                setOpen(false);
              }}
              className="font-display text-xs font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors"
            >
              Lazy&#160;Unicorn
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground/70 hover:text-primary transition-colors p-1"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <XIcon size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {open && (
            <div className="mt-2 w-full bg-background/80 backdrop-blur-xl-2xl border border-foreground/10 rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-3">
              {links.map((link) =>
                link.isCta ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-body text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold text-center hover:opacity-90 transition-opacity"
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-body text-xs tracking-[0.15em] uppercase transition-colors ${
                      link.highlight
                        ? "text-primary"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                )
              )}
              <div className="flex items-center gap-3 pt-2 border-t border-foreground/10">
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
