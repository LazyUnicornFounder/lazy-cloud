import { Link, useLocation } from "react-router-dom";
import { Rocket, Zap, Layers, Play } from "lucide-react";

export default function LazyLaunchCTA() {
  const { pathname } = useLocation();
  if (pathname === "/lazy-launch" || pathname.startsWith("/admin")) return null;

  return (
    <section className="border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 md:py-28">
        <p className="font-body text-[14px] tracking-[0.2em] uppercase mb-6" style={{ color: "#c8a961", opacity: 0.6 }}>
          Lazy Launch
        </p>

        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
          Launch your entire Lovable site with one prompt.
        </h2>

        <p className="mt-6 font-body text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
          Lazy Launch is a step-by-step wizard that builds a custom prompt for your project. Tell it your business, pick a style, choose which agents to install — and paste.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mt-10 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
              <Zap size={16} style={{ color: "#f0ead6", opacity: 0.5 }} />
            </div>
            <p className="font-body text-sm" style={{ color: "#f0ead6", opacity: 0.5 }}>Describe your business</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
              <Layers size={16} style={{ color: "#f0ead6", opacity: 0.5 }} />
            </div>
            <p className="font-body text-sm" style={{ color: "#f0ead6", opacity: 0.5 }}>Pick agents to install</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center shrink-0">
              <Play size={16} style={{ color: "#f0ead6", opacity: 0.5 }} />
            </div>
            <p className="font-body text-sm" style={{ color: "#f0ead6", opacity: 0.5 }}>Paste and run</p>
          </div>
        </div>

        <Link
          to="/lazy-launch"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity"
        >
          Get Started with Lazy Launch →
        </Link>
      </div>
    </section>
  );
}
