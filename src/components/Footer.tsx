import { Link } from "react-router-dom";
import { Linkedin, Github } from "lucide-react";

const XLogo = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const columns = [
  {
    label: "Unicorn",
    items: [
      { name: "Lazy Launch", href: "/lazy-launch" },
      { name: "Lazy Run", href: "/lazy-run" },
    ],
  },
  {
    label: "Content",
    items: [
      { name: "Lazy Blogger", href: "/lazy-blogger" },
      { name: "Lazy SEO", href: "/lazy-seo" },
      { name: "Lazy GEO", href: "/lazy-geo" },
      { name: "Lazy Crawl", href: "/lazy-crawl" },
      { name: "Lazy Perplexity", href: "/lazy-perplexity" },
      { name: "Lazy Contentful", href: "/lazy-contentful" },
    ],
  },
  {
    label: "Commerce",
    items: [
      { name: "Lazy Store", href: "/lazy-store" },
      { name: "Lazy Drop", href: "/lazy-drop" },
      { name: "Lazy Print", href: "/lazy-print" },
      { name: "Lazy Pay", href: "/lazy-pay" },
      { name: "Lazy SMS", href: "/lazy-sms" },
      { name: "Lazy Mail", href: "/lazy-mail" },
    ],
  },
  {
    label: "Media",
    items: [
      { name: "Lazy Voice", href: "/lazy-voice" },
      { name: "Lazy Stream", href: "/lazy-stream" },
      { name: "Lazy YouTube", href: "/lazy-youtube" },
    ],
  },
  {
    label: "Dev",
    items: [
      { name: "Lazy GitHub", href: "/lazy-github" },
      { name: "Lazy GitLab", href: "/lazy-gitlab" },
      { name: "Lazy Linear", href: "/lazy-linear" },
      { name: "Lazy Design", href: "/lazy-design" },
      { name: "Lazy Auth", href: "/lazy-auth" },
      { name: "Lazy Granola", href: "/lazy-granola" },
    ],
  },
  {
    label: "Ops",
    items: [
      { name: "Lazy Admin", href: "/lazy-admin" },
      { name: "Lazy Alert", href: "/lazy-alert" },
      { name: "Lazy Telegram", href: "/lazy-telegram" },
      { name: "Lazy Supabase", href: "/lazy-supabase" },
      { name: "Lazy Security", href: "/lazy-security" },
      { name: "Lazy Watch", href: "/lazy-watch" },
      { name: "Lazy Fix", href: "/lazy-fix" },
      { name: "Lazy Build", href: "/lazy-build" },
      { name: "Lazy Intel", href: "/lazy-intel" },
      { name: "Lazy Repurpose", href: "/lazy-repurpose" },
      { name: "Lazy Trend", href: "/lazy-trend" },
      { name: "Lazy Churn", href: "/lazy-churn" },
    ],
  },
];
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1520px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-10 md:gap-6">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <Link to="/" className="inline-block">
              <p className="font-display text-[14px] font-semibold tracking-[0.15em] uppercase text-foreground leading-tight">
                <span className="block">Lazy</span>
                <span className="block">Unicorn</span>
              </p>
            </Link>
            <p className="mt-4 font-body text-sm text-foreground/70 leading-relaxed max-w-[220px]">
              The autonomous layer for Lovable. One prompt, everything runs itself.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/LazyUnicornFounder/LazyUnicorn" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground/50 transition-colors" aria-label="View prompts on GitHub">
                <Github size={12} />
              </a>
              <a href="https://x.com/SaadSahawneh" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground/50 transition-colors" aria-label="Follow on X">
                <XLogo />
              </a>
              <a href="https://www.linkedin.com/company/lazy-unicorn/" target="_blank" rel="noopener noreferrer" className="text-foreground/60 hover:text-foreground/50 transition-colors" aria-label="Follow on LinkedIn">
                <Linkedin size={12} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.label}>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-foreground/50 font-semibold mb-1">
                Lazy
              </p>
              <p className="font-body text-xs tracking-[0.2em] uppercase text-foreground/50 font-semibold mb-4">
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="font-body text-sm text-foreground/65 hover:text-foreground/50 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Resources */}
          <div>
            <p className="font-body text-xs tracking-[0.2em] uppercase text-foreground/50 font-semibold mb-4">
              Resources
            </p>
            <ul className="space-y-2">
              {[
                { name: "How It Works", href: "/how-it-works" },
                { name: "Use Cases", href: "/use-cases" },
                { name: "Pricing", href: "/pricing" },
                { name: "Blog", href: "/blog" },
                { name: "Autonomy", href: "/autonomy" },
                { name: "Changelog", href: "/changelog" },
                { name: "Upgrade Guide", href: "/upgrade-guide" },
                { name: "About", href: "/about" },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="font-body text-sm text-foreground/65 hover:text-foreground/50 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-[14px] text-foreground/15 tracking-wider">
            © {new Date().getFullYear()} Lazy Unicorn. All rights reserved.
          </p>
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="font-body text-[14px] text-foreground/15 tracking-wider hover:text-foreground/65 transition-colors">
            Built for Lovable
          </a>
        </div>
      </div>
    </footer>
  );
}
