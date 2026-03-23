import { useEffect } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Zap, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FlyingSeoCards from "@/components/lazy-seo/FlyingSeoCards";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const steps = [
  "Tell Lazy SEO about your business and target keywords.",
  "It analyses your competitors and finds keyword gaps.",
  "Every day it writes and publishes SEO-optimised articles.",
  "Your organic traffic grows while you do nothing.",
];

const LazySeoPage = () => {
  const trackEvent = useTrackEvent();

  useEffect(() => {
    trackEvent("lazy_seo_page_view");
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy SEO — Autonomous SEO Engine for Lovable"
        description="Set up once and watch your Google rankings climb. Lazy SEO analyses competitors, finds keyword gaps, and publishes SEO-optimised content on autopilot."
        url="/lazy-seo"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-5xl mx-auto text-center px-6 mb-20 min-h-[520px] flex items-center justify-center">
          <FlyingSeoCards />
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }} className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold"
            >
              Introducing
            </motion.p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              <span>The Autonomous</span><br />
              <span className="text-lovable">Lovable</span>{" "}
              <span className="text-gradient-primary">SEO Engine</span>
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
              Set up once. Lazy SEO analyses your competitors, finds keyword gaps, and publishes SEO-optimised content every day — on autopilot.
            </p>
            <Link
              to="/lazy-seo-setup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
            >
              <Search size={16} /> Start Lazy SEO
            </Link>
            <p className="font-body text-xs text-muted-foreground mt-4">Built for Lovable projects. Powered by AI.</p>
          </motion.div>
        </section>

        {/* ── How It Works ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What You Get ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            What you get
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: BarChart3, title: "Keyword Analysis", desc: "AI finds 20 high-opportunity keywords from your competitors every week." },
              { icon: TrendingUp, title: "Auto-Publishing", desc: "SEO articles targeting your keywords — written and published daily." },
              { icon: Zap, title: "Zero Effort", desc: "No writing. No keyword research. No scheduling. It just ranks." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {[
              { q: "How does it find keywords?", a: "Lazy SEO uses AI to analyse your business description, target keywords, and competitor URLs to identify keyword gaps you should be ranking for." },
              { q: "What kind of content does it write?", a: "Long-form, SEO-optimised articles (1000–1500 words) with proper headings, internal links, and natural keyword placement." },
              { q: "Can I control what gets published?", a: "Yes. Use the dashboard to pause, resume, or manually trigger posts. You can also edit settings anytime." },
              { q: "Does it work with any Lovable site?", a: "Yes. Lazy SEO runs as part of your Lovable project with no external tools or API keys needed." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Start ranking today.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              Every day you wait is a day your competitors publish content that outranks you.
            </p>
            <Link
              to="/lazy-seo-setup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
            >
              <ArrowRight size={16} /> Set Up Lazy SEO
            </Link>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazySeoPage;
