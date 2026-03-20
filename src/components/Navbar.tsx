import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavLink {
  label: string;
  href: string;
  highlight?: boolean;
  isCta?: boolean;
}

interface NavbarProps {
  /** Which page is active — used to highlight the correct link */
  activePage?: "home" | "blog";
}

const Navbar = ({ activePage = "home" }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const isHome = activePage === "home";
  const prefix = isHome ? "" : "/#";

  const links: NavLink[] = [
    { label: "Directory", href: isHome ? "#directory" : "/#directory" },
    { label: "Blog", href: "/blog", highlight: activePage === "blog" },
    { label: "About", href: isHome ? "#about" : "/#about" },
    { label: "Pitch Deck", href: isHome ? "#pitch" : "/#pitch" },
    { label: "I'm raising!", href: "/blog/lazy-unicorn-raising-angel-round", highlight: true },
    { label: "Submit", href: isHome ? "#submit" : "/#submit", isCta: true },
  ];

  const brandHref = isHome ? "#top" : "/";
  const handleBrandClick = isHome
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    : undefined;

  return (
    <nav className="fixed top-12 sm:top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center w-[calc(100%-2rem)] sm:w-auto max-w-[95vw]">
      {/* Desktop nav */}
      {!isMobile ? (
        <>
          <div className="flex items-center gap-6 bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <a
              href={brandHref}
              onClick={handleBrandClick}
              className="font-display text-sm font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Lazy Unicorn
            </a>
            <span className="w-px h-4 bg-foreground/20" />
            {links.map((link) =>
              link.isCta ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
                >
                  {link.label}
                </a>
              ) : link.label === "I'm raising!" ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-body text-[11px] tracking-[0.15em] uppercase text-orange-400 hover:text-orange-300 font-semibold transition-colors"
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
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <a
              href="https://x.com/SaadSahawneh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              Follow on 𝕏
            </a>
            <a
              href="https://www.linkedin.com/in/saadsahawneh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            >
              Follow on LinkedIn
            </a>
          </div>
        </>
      ) : (
        /* Mobile nav */
        <>
          <div className="flex items-center justify-between w-full bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <a
              href={brandHref}
              onClick={(e) => {
                handleBrandClick?.(e);
                setOpen(false);
              }}
              className="font-display text-xs font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors"
            >
              Lazy Unicorn
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="text-foreground/70 hover:text-primary transition-colors p-1"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {open && (
            <div className="mt-2 w-full bg-background/80 backdrop-blur-2xl border border-foreground/10 rounded-2xl px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col gap-3">
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
                ) : link.label === "I'm raising!" ? (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-body text-xs tracking-[0.15em] uppercase text-orange-400 hover:text-orange-300 font-semibold transition-colors"
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
              <div className="flex items-center gap-2 pt-2 border-t border-foreground/10">
                <a
                  href="https://x.com/SaadSahawneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors"
                >
                  Follow on 𝕏
                </a>
                <a
                  href="https://www.linkedin.com/in/saadsahawneh"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors"
                >
                  Follow on LinkedIn
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
