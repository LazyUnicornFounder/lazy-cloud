import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const engineCategories = [
  {
    label: "Lazy Content",
    items: [
      { name: "Lazy Blogger", href: "/lazy-blogger" },
      { name: "Lazy SEO", href: "/lazy-seo" },
      { name: "Lazy GEO", href: "/lazy-geo" },
      { name: "Lazy Crawl", href: "/lazy-crawl" },
      { name: "Lazy Perplexity", href: "/lazy-perplexity" },
    ],
  },
  {
    label: "Lazy Commerce",
    items: [
      { name: "Lazy Store", href: "/lazy-store" },
      { name: "Lazy Pay", href: "/lazy-pay" },
      { name: "Lazy SMS", href: "/lazy-sms" },
    ],
  },
  {
    label: "Lazy Media",
    items: [
      { name: "Lazy Voice", href: "/lazy-voice" },
      { name: "Lazy Stream", href: "/lazy-stream" },
    ],
  },
  {
    label: "Lazy Dev",
    items: [
      { name: "Lazy GitHub", href: "/lazy-github" },
      { name: "Lazy GitLab", href: "/lazy-gitlab" },
      { name: "Lazy Linear", href: "/lazy-linear" },
    ],
  },
  {
    label: "Lazy Channels",
    items: [
      { name: "Lazy Alert", href: "/lazy-alert" },
      { name: "Lazy Telegram", href: "/lazy-telegram" },
      { name: "Lazy Contentful", href: "/lazy-contentful" },
      { name: "Lazy Supabase", href: "/lazy-supabase" },
    ],
  },
  {
    label: "Lazy Shield",
    items: [
      { name: "Lazy Security", href: "/lazy-security" },
    ],
  },
];

const resources = [
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Autonomy", href: "/autonomy" },
  { name: "Changelog", href: "/changelog" },
  { name: "Upgrade Guide", href: "/upgrade-guide" },
  { name: "About", href: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-10 gap-10 md:gap-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <p className="font-display text-[10px] font-semibold tracking-[0.15em] uppercase text-foreground leading-tight">
                <span className="block">Lazy</span>
                <span className="block">Unicorn</span>
              </p>
            </Link>
            <p className="mt-4 font-body text-xs text-foreground/30 leading-relaxed max-w-[200px]">
              The autonomous layer for Lovable. One prompt, everything runs itself.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://x.com/SaadSahawneh" target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-foreground/50 transition-colors" aria-label="Follow on X">
                <XLogo />
              </a>
              <a href="https://www.linkedin.com/company/lazy-unicorn/" target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-foreground/50 transition-colors" aria-label="Follow on LinkedIn">
                <Linkedin size={12} />
              </a>
            </div>
          </div>

          {/* Get started — prominent left column */}
          <div className="col-span-1 md:col-span-1">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-semibold mb-4 max-w-[60px]">
              Get Started
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                  Use Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Lazy Unicorn */}
          <div className="col-span-1 md:col-span-1">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-semibold mb-4">
              Lazy Unicorn
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/lazy-run" className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                  Lazy Run
                </Link>
              </li>
              <li>
                <Link to="/lazy-admin" className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                  Lazy Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Engine categories */}
          {engineCategories.map((cat) => (
            <div key={cat.label} className="min-w-0">
              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-semibold mb-4 max-w-[60px]">
                {cat.label}
              </p>
              <ul className="space-y-2">
                {cat.items.map((e) => (
                  <li key={e.name}>
                    <Link to={e.href} className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                      {e.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Resources */}
          <div>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-semibold mb-4">
              Resources
            </p>
            <ul className="space-y-2">
              {resources.map((r) => (
                <li key={r.name}>
                  <Link to={r.href} className="font-body text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
                    {r.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[10px] text-foreground/15 tracking-wider">
            © {new Date().getFullYear()} Lazy Unicorn. All rights reserved.
          </p>
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="font-body text-[10px] text-foreground/15 tracking-wider hover:text-foreground/30 transition-colors">
            Built for Lovable
          </a>
        </div>
      </div>
    </footer>
  );
}
