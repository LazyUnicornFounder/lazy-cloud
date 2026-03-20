import { motion } from "framer-motion";
import unicornBg from "@/assets/unicorn-beach.png";
import BlogSection from "@/components/BlogSection";
import SEO from "@/components/SEO";

const Blog = () => {
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Full-bleed background */}
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Nav — centered, frosted pill */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        <div className="flex items-center gap-6 bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-8 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <a
            href="/"
            className="font-display text-sm font-semibold tracking-[0.15em] uppercase text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Lazy Unicorn
          </a>
          <span className="w-px h-4 bg-foreground/20" />
          <a
            href="/#directory"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Directory
          </a>
          <a
            href="/blog"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-primary transition-colors"
          >
            Blog
          </a>
          <a
            href="/#mission"
            className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground/70 hover:text-primary transition-colors"
          >
            Mission
          </a>
          <a
            href="/#submit"
            className="font-body text-[11px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-1.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            Submit
          </a>
        </div>
        <a
          href="https://x.com/SaadSahawneh"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 font-body text-[9px] tracking-[0.2em] uppercase text-foreground/50 hover:text-primary transition-colors bg-background/60 backdrop-blur-2xl border border-foreground/10 rounded-full px-4 py-1 shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
        >
          Follow on 𝕏
        </a>
      </nav>

      {/* Content */}
      <div className="pt-32">
        <BlogSection />
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-8 md:px-12 py-8 border-t border-foreground/10">
        <span className="font-body text-[10px] tracking-[0.2em] uppercase text-foreground/50">
          Lazy Unicorn © 2026
        </span>
      </footer>
    </div>
  );
};

export default Blog;
