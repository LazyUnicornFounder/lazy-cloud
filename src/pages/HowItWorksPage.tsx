import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const engineGroups = [
  {
    label: "Content Engines",
    description: "Autonomous content creation, SEO, and AI citation.",
    engines: [
      { name: "Lazy Blogger", tagline: "Your blog writes itself. Four posts a day, zero input.", href: "/lazy-blogger" },
      { name: "Lazy SEO", tagline: "Discovers keywords and publishes ranking articles.", href: "/lazy-seo" },
      { name: "Lazy GEO", tagline: "Gets your brand cited by ChatGPT and Perplexity.", href: "/lazy-geo" },
      { name: "Lazy Voice", tagline: "Narrates every post into a podcast episode.", href: "/lazy-voice" },
      { name: "Lazy Contentful", tagline: "Two-way content sync with Contentful.", href: "/lazy-contentful" },
      { name: "Lazy Stream", tagline: "Turns every Twitch stream into blog posts and SEO content.", href: "/lazy-stream" },
      { name: "Lazy Perplexity", tagline: "Queries Perplexity for trends and feeds your content engines.", href: "/lazy-perplexity" },
    ],
  },
  {
    label: "Commerce Engines",
    description: "Autonomous storefronts, payments, and conversion optimisation.",
    engines: [
      { name: "Lazy Store", tagline: "Discovers products, writes listings, optimises conversion.", href: "/lazy-store" },
      { name: "Lazy Pay", tagline: "Full Stripe integration that optimises its own conversion rate.", href: "/lazy-pay" },
    ],
  },
  {
    label: "Developer Engines",
    description: "Turn commits, issues, and cycles into public content.",
    engines: [
      { name: "Lazy GitHub", tagline: "Turns every GitHub commit into a changelog and developer post.", href: "/lazy-github" },
      { name: "Lazy GitLab", tagline: "Turns GitLab activity into public content.", href: "/lazy-gitlab" },
      { name: "Lazy Linear", tagline: "Turns Linear cycles into product update content.", href: "/lazy-linear" },
      { name: "Lazy Supabase", tagline: "Narrates your database growth story automatically.", href: "/lazy-supabase" },
    ],
  },
  {
    label: "Messaging Engines",
    description: "Automated texts and real-time notifications.",
    engines: [
      { name: "Lazy SMS", tagline: "Self-improving SMS sequences via Twilio.", href: "/lazy-sms" },
      { name: "Lazy Telegram", tagline: "Real-time engine reporting via Telegram bot.", href: "/lazy-telegram" },
      { name: "Lazy Alert", tagline: "Every engine event reported to Slack in real time.", href: "/lazy-alert" },
    ],
  },
  {
    label: "Security",
    description: "Autonomous pentesting and vulnerability monitoring.",
    engines: [
      { name: "Lazy Security", tagline: "Autonomous pentesting and vulnerability monitoring via Aikido.", href: "/lazy-security" },
    ],
  },
  {
    label: "Operations",
    description: "Unified runtime and dashboard for the entire stack.",
    engines: [
      { name: "Lazy Run", tagline: "One prompt installs and orchestrates every engine.", href: "/lazy-run" },
      { name: "Lazy Admin", tagline: "One dashboard for every engine. 60 seconds a day.", href: "/lazy-admin" },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <SEO
        title="How It Works — Lazy Unicorn"
        description="Every Lazy engine explained. See how autonomous content, commerce, code, messaging, and security engines work together to run your business."
        url="/how-it-works"
      />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fade}>
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-6 block">
                The autonomous layer for Lovable
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                How it works
              </h1>
              <p className="font-body text-foreground/50 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
                <strong className="text-foreground/80">Lovable</strong> gave everyone a website. <strong className="text-foreground/80">Lazy Unicorn</strong> makes it work while you sleep. Every engine is a self-contained prompt you paste into your Lovable project. Each one installs its own database tables, edge functions, and UI — then runs itself autonomously.
              </p>
              <p className="font-body text-foreground/30 text-sm max-w-xl mx-auto leading-relaxed">
                Integrates with <strong className="text-foreground/50">Stripe</strong>, <strong className="text-foreground/50">Twilio</strong>, <strong className="text-foreground/50">ElevenLabs</strong>, <strong className="text-foreground/50">Twitch</strong>, <strong className="text-foreground/50">GitHub</strong>, <strong className="text-foreground/50">GitLab</strong>, <strong className="text-foreground/50">Linear</strong>, <strong className="text-foreground/50">Slack</strong>, <strong className="text-foreground/50">Telegram</strong>, <strong className="text-foreground/50">Supabase</strong>, <strong className="text-foreground/50">Contentful</strong>, <strong className="text-foreground/50">Firecrawl</strong>, and <strong className="text-foreground/50">Perplexity</strong>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">Three steps. Any engine.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: "1", title: "Copy the prompt", desc: "Every engine page has a Copy Prompt button. One click copies the full installation instructions." },
                  { step: "2", title: "Paste into Lovable", desc: "Open your Lovable project, paste the prompt into the chat. Lovable builds the engine into your project." },
                  { step: "3", title: "Configure and run", desc: "Fill in any API keys the engine needs. Toggle it on. It runs itself from there." },
                ].map((s) => (
                  <div key={s.step} className="border border-border p-6">
                    <span className="font-display text-3xl font-bold text-[#c8a961]/30 mb-3 block">{s.step}</span>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-2">{s.title}</h3>
                    <p className="font-body text-sm text-foreground/50 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Engine Groups */}
        {engineGroups.map((group, gi) => (
          <section key={group.label} className="py-16 px-6 border-t border-border">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fade}>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#c8a961]/60 mb-2">{group.label}</p>
                <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">{group.label}</h2>
                <p className="font-body text-foreground/40 text-sm mb-8">{group.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.engines.map((engine) => (
                    <Link
                      key={engine.name}
                      to={engine.href}
                      className="group border border-border p-5 flex items-start justify-between gap-4 hover:border-foreground/20 transition-colors"
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-sm font-bold tracking-[0.06em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">
                          {engine.name}
                        </h3>
                        <p className="font-body text-[13px] text-foreground/40 leading-relaxed">{engine.tagline}</p>
                      </div>
                      <ArrowRight size={14} className="text-foreground/15 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        ))}

        {/* Resources */}
        <section className="py-20 px-6 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <motion.div {...fade}>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/upgrade-guide"
                  className="group border border-border p-6 hover:border-foreground/20 transition-colors flex items-start gap-4"
                >
                  <BookOpen size={20} className="text-foreground/20 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">Upgrade Guide</h3>
                    <p className="font-body text-[13px] text-foreground/40 leading-relaxed">Step-by-step instructions for upgrading every engine to the latest prompt version.</p>
                  </div>
                </Link>
                <Link
                  to="/changelog"
                  className="group border border-border p-6 hover:border-foreground/20 transition-colors flex items-start gap-4"
                >
                  <FileText size={20} className="text-foreground/20 group-hover:text-foreground/50 transition-colors flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase mb-1 group-hover:text-[#c8a961] transition-colors">Changelog</h3>
                    <p className="font-body text-[13px] text-foreground/40 leading-relaxed">Every prompt release, version history, and what changed across all engines.</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-6">Pick an engine. Paste the prompt. Watch it run.</h2>
            <p className="font-body text-foreground/40 mb-8">Or install everything at once with Lazy Run.</p>
            <Link
              to="/lazy-run"
              className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-display text-[11px] tracking-[0.15em] uppercase font-bold px-8 py-3.5 hover:opacity-90 transition-opacity"
            >
              Get Lazy Run
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
