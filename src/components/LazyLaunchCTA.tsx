import { Link, useLocation } from "react-router-dom";
import { Rocket, Zap, Layers, Play } from "lucide-react";

export default function LazyLaunchCTA() {
  const { pathname } = useLocation();
  if (pathname === "/lazy-launch" || pathname.startsWith("/admin")) return null;

  return (
    <section className="border-t border-border" style={{ backgroundColor: "#0a0a08" }}>
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Rocket size={20} className="text-foreground/40" />
          <p className="font-display text-[11px] tracking-[0.25em] uppercase text-foreground/40 font-bold">
            Lazy Launch
          </p>
        </div>

        <h2
          className="text-2xl md:text-4xl font-bold text-foreground mb-5"
          style={{ fontFamily: "var(--font-display)", lineHeight: 1.15 }}
        >
          Launch your entire Lovable site with one prompt.
        </h2>

        <p className="font-body text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          Lazy Launch is a step-by-step wizard that builds a custom prompt for your project. Tell it your business, pick a style, choose which agents to install — and paste. It sets up your tables, edge functions, UI, and agents in one go.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <Zap size={16} className="text-foreground/60" />
            </div>
            <p className="font-body text-xs text-foreground/50">Describe your business</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <Layers size={16} className="text-foreground/60" />
            </div>
            <p className="font-body text-xs text-foreground/50">Pick agents to install</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center">
              <Play size={16} className="text-foreground/60" />
            </div>
            <p className="font-body text-xs text-foreground/50">Paste and run</p>
          </div>
        </div>

        <Link
          to="/lazy-launch"
          className="inline-flex items-center gap-2 font-display text-xs tracking-[0.12em] uppercase font-bold px-10 py-4 bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Get Started with Lazy Launch →
        </Link>
      </div>
    </section>
  );
}
