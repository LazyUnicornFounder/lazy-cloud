import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Search, Upload, Brain, MessageSquare, Globe, FileText,
  Bookmark, Shield, Lock, Building2,
  Scale, Landmark, HardHat, Check, ArrowRight, Sparkles,
  TrendingUp, ShieldCheck
} from "lucide-react";

/* ── Scroll-triggered wrapper ── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stats = [
  { value: "55,000+", label: "files indexed" },
  { value: "61GB", label: "processed" },
  { value: "1 afternoon", label: "to set up" },
  { value: "EN", label: "language" },
];

const techStack = [
  { name: "Lovable", role: "Frontend" },
  { name: "Supabase", role: "Database" },
  { name: "Voyage AI", role: "Embeddings" },
  { name: "AWS S3", role: "Storage" },
  { name: "Claude Code", role: "Pipeline" },
];

const steps = [
  {
    icon: Upload,
    title: "Upload your files",
    desc: "Connect existing storage or upload directly. Supports PDF, Word, Excel, CAD, images, and more.",
  },
  {
    icon: Brain,
    title: "We index everything",
    desc: "AI reads, chunks, and embeds every document. Full semantic search across your entire archive.",
  },
  {
    icon: Search,
    title: "Ask anything",
    desc: "Search in plain language. Get exact files, page numbers, and AI-powered answers with citations.",
  },
];

const useCases = [
  { icon: HardHat, title: "Construction & Engineering", desc: "Find that FIDIC clause in seconds, not hours" },
  { icon: Scale, title: "Legal", desc: "Search 25 years of court decisions and contracts simultaneously" },
  { icon: Building2, title: "Corporate", desc: "Every policy, procedure, and memo — instantly searchable" },
  { icon: Landmark, title: "Government", desc: "Decades of records, one search bar" },
  { icon: TrendingUp, title: "Finance", desc: "Compliance docs, audit trails, and reports — all searchable instantly" },
  { icon: ShieldCheck, title: "Insurance", desc: "Claims, policies, and underwriting files at your fingertips" },
];

const features = [
  { icon: Search, title: "Semantic search", desc: "Understands meaning, not just keywords" },
  { icon: Globe, title: "Multilingual support", desc: "Built for global teams from day one" },
  { icon: FileText, title: "PDF preview", desc: "Highlighting on the exact page" },
  { icon: Bookmark, title: "Bookmarks & collections", desc: "Organise your most-used documents" },
  { icon: MessageSquare, title: "Chat with citations", desc: "AI answers backed by your files" },
  { icon: Shield, title: "Your data stays yours", desc: "Client-owned infrastructure" },
];

const securityPoints = [
  "Client-owned AWS / Supabase accounts",
  "End-to-end encryption",
  "SOC 2 compatible architecture",
  "Full audit trails",
  "NDA + DPA standard",
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    features: ["Up to 50 GB", "50,000 files", "5 users", "Email support"],
    cta: "Get Early Access",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$999",
    period: "/month",
    features: ["Up to 500 GB", "500,000 files", "25 users", "Priority support", "Custom branding"],
    cta: "Get Early Access",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Coming Soon",
    period: "",
    features: ["Unlimited everything", "On-premise option", "Dedicated support", "SLA"],
    cta: "Contact Us",
    highlighted: false,
  },
];


export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">Lazy Cloud</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {["How it works", "Use cases", "Pricing", "Security"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-foreground transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-sm">
              Get Early Access
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-accent/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 text-xs border border-primary/20 bg-primary/5 rounded-full px-4 py-1.5 text-primary mb-8">
              <Sparkles className="h-3 w-3" />
              Now in Early Access
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight leading-[1.08] mb-8"
          >
            Supercharge your on-prem server with the{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                AI cloud.
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Lazy Cloud indexes your entire file archive with AI and lets your team search in plain language — exact file, page number, answer in seconds.
          </motion.p>

          {/* Tech stack pills */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4"
          >
            We build with these technologies
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
                className="text-base border border-border/60 bg-secondary/40 backdrop-blur-sm rounded-full px-8 py-3.5 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
              >
                <span className="font-medium text-foreground">{t.name}</span>
                <span className="mx-1.5 text-border">·</span>
                {t.role}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Link to="/signup">
              <Button
                size="lg"
                className="text-base px-8 h-12 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] transition-all duration-500"
              >
                Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 py-10 px-6 relative">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="text-2xl md:text-3xl font-bold font-display bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6 relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-center mb-20">How it works</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <div className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:border-primary/30 group-hover:from-primary/20 transition-all duration-500">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-[10px] text-primary/60 mb-3 uppercase tracking-[0.2em] font-medium">Step {i + 1}</div>
                  <h3 className="text-lg font-semibold mb-2.5">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-center mb-6">
              Built for industries that drown in documents
            </h2>
            <p className="text-muted-foreground text-center max-w-lg mx-auto mb-16">
              From construction to government — if your team wastes time searching for files, we built this for you.
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4">
            {useCases.map((uc, i) => (
              <Reveal key={uc.title} delay={i * 0.08}>
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-500 group">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/15 group-hover:border-primary/20 transition-all duration-500">
                      <uc.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{uc.title}</h3>
                      <p className="text-sm text-muted-foreground">{uc.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 relative">
        <div className="absolute left-0 top-1/3 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-center mb-20">Everything you need</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <div className="p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/15 transition-all duration-500 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:border-primary/20 transition-all duration-500">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-8">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">
              Your data, your servers,
              <br className="hidden sm:block" />
              your keys.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-12">
              We deploy into your own cloud accounts. Your documents never touch our servers.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-3">
              {securityPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-sm border border-border/50 bg-card/30 backdrop-blur-sm rounded-full px-4 py-2 hover:border-primary/20 transition-all duration-300"
                >
                  <Check className="h-3.5 w-3.5 text-primary" />
                  {point}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6 relative">
        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-center mb-5">Simple, transparent pricing</h2>
            <p className="text-muted-foreground text-center max-w-md mx-auto mb-16">
              Start small, scale as you grow. No hidden fees.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {pricingTiers.map((tier, i) => (
              <Reveal key={tier.name} delay={i * 0.1}>
                <Card
                  className={`bg-card/30 backdrop-blur-sm border-border/50 relative hover:border-primary/20 transition-all duration-500 ${
                    tier.highlighted
                      ? "border-primary/40 shadow-[0_0_40px_-10px_hsl(var(--primary)/0.2)]"
                      : ""
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px] font-semibold uppercase tracking-wider px-4 py-1 rounded-full">
                      Most popular
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">{tier.name}</h3>
                    <div className="mb-8">
                      <span className="text-4xl font-bold font-display">{tier.price}</span>
                      <span className="text-muted-foreground text-sm">{tier.period}</span>
                    </div>
                    <ul className="space-y-3.5 mb-10">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm">
                          <Check className="h-4 w-4 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link to={tier.name === "Enterprise" ? "#contact" : "/signup"}>
                      <Button
                        className={`w-full ${
                          tier.highlighted
                            ? "shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]"
                            : ""
                        }`}
                        variant={tier.highlighted ? "default" : "outline"}
                      >
                        {tier.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-secondary/50 to-secondary/30" />
        <div className="max-w-3xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center">
              <div className="text-4xl mb-8 text-primary/40">"</div>
              <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                Lazy Cloud saved us hours of unproductive searching through files. We can learn faster and do more.
              </p>
              <a href="https://www.cmajo.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">Construction Management Associates</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        </div>
        <Reveal>
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-5">Ready to unlock your archive?</h2>
            <p className="text-muted-foreground mb-10">Join the early access list. Be the first to try Lazy Cloud.</p>
            <Link to="/signup">
              <Button
                size="lg"
                className="text-base px-8 h-12 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)] transition-all duration-500"
              >
                Get Early Access <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display font-bold tracking-tight">Lazy Cloud</span>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            {["Pricing", "Security", "Contact"].map((item) => (
              <a
                key={item}
                href={item === "Contact" ? "mailto:hello@lazycloud.ai" : `#${item.toLowerCase()}`}
                className="hover:text-foreground transition-colors duration-300"
              >
                {item}
              </a>
            ))}
            <Link to="/privacy" className="hover:text-foreground transition-colors duration-300">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors duration-300">Terms</Link>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lazy Cloud</div>
        </div>
      </footer>
    </div>
  );
}
