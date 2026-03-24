import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileText, Search, Globe, ShoppingCart, Mic, CreditCard,
  MessageSquare, Video, Code, ChevronDown, Zap, Activity,
  Clock, ArrowRight
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const LAZY_RUN_PROMPT = `You are setting up Lazy Run — the unified autonomous runtime for a Lovable project. Lazy Run installs and coordinates all nine Lazy engines from a single prompt. Follow these steps:

1. Ask which engines the user wants to activate.
2. For each activated engine, install the required database tables, edge functions, and UI components.
3. Install the Lazy Run dashboard with master toggle, unified activity feed, and smart scheduling.
4. Configure cross-engine coordination so engines share context and avoid resource conflicts.
5. Set up performance reporting and health checks for all active engines.

Engines available: Lazy Blogger, Lazy SEO, Lazy GEO, Lazy Store, Lazy Voice, Lazy Pay, Lazy SMS, Lazy Stream, Lazy Code.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const engines = [
  { name: "Lazy Blogger", desc: "Publishes four blog posts per day automatically.", icon: FileText, href: "/lazy-blogger" },
  { name: "Lazy SEO", desc: "Discovers keywords and publishes ranking articles.", icon: Search, href: "/lazy-seo" },
  { name: "Lazy GEO", desc: "Publishes content structured to be cited by ChatGPT and Perplexity.", icon: Globe, href: "/lazy-geo" },
  { name: "Lazy Store", desc: "Discovers products, writes listings, optimises conversion.", icon: ShoppingCart, href: "/lazy-store" },
  { name: "Lazy Voice", desc: "Narrates every blog post in your voice via ElevenLabs.", icon: Mic, href: "/lazy-voice" },
  { name: "Lazy Pay", desc: "Installs Stripe with self-improving conversion optimisation.", icon: CreditCard, href: "/lazy-pay" },
  { name: "Lazy SMS", desc: "Sends automated texts via Twilio that improve themselves.", icon: MessageSquare, href: "/lazy-sms" },
  { name: "Lazy Stream", desc: "Turns every Twitch stream into blog posts and SEO content.", icon: Video, href: "/lazy-stream" },
  { name: "Lazy Code", desc: "Turns every GitHub commit into a changelog and developer post.", icon: Code, href: "/lazy-code" },
];

const faqs = [
  { q: "Do I need all nine engines?", a: "No. The setup screen lets you choose which engines to activate. You can start with two or three and add more later without reinstalling." },
  { q: "Does it replace the individual Lazy prompts?", a: "Yes. If you install Lazy Run you do not need to paste the individual prompts. Lazy Run includes all of them." },
  { q: "What API keys do I need?", a: "Only the ones for the engines you activate. Lazy Blogger and Lazy SEO only need an Anthropic key. Lazy Pay needs Stripe. Lazy SMS needs Twilio. Lazy Voice needs ElevenLabs." },
  { q: "Can I still use individual engines if I have them installed?", a: "Yes. Lazy Run is additive. If you already have Lazy Blogger installed it will detect it and manage it alongside the others." },
  { q: "How is Lazy Run different from just pasting all the individual prompts?", a: "Lazy Run adds the coordination layer — unified scheduling, cross-engine activity feed, master controls, performance reporting, and smart resource management. The individual prompts do not talk to each other. Lazy Run makes them work as one system." },
];

const dashboardFeatures = [
  { icon: Zap, title: "Master toggle", desc: "One switch pauses or resumes every engine simultaneously." },
  { icon: Activity, title: "Unified feed", desc: "Every action from every engine in a single chronological activity stream." },
  { icon: Clock, title: "Smart scheduling", desc: "Engines are staggered automatically so they never compete for resources or API limits." },
];

function CopyPromptButton({ label = "Copy the Lovable Prompt" }: { label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_RUN_PROMPT);
    setCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-colors"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export default function LazyRunPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Run — The Autonomous Runtime for Lovable"
        description="One prompt installs the complete autonomous operations layer into your Lovable project. Nine engines. One dashboard. Everything runs itself."
        path="/lazy-run"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-20 md:pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}>
            <span className="inline-block font-display text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border border-foreground/20 text-foreground/50 mb-6">
              Includes all Lazy engines
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            The missing half of Lovable.
            <br />
            In one prompt.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl leading-relaxed mb-10"
          >
            Lazy Run installs the complete autonomous operations layer into your existing Lovable project. Blog posts that publish themselves. SEO that compounds. GEO that gets you cited by AI. Payments that optimise. SMS that converts. Audio that narrates. Stores that grow. All managed from one dashboard. All running without you.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("what-it-installs")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              See What It Installs <ChevronDown size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Lovable builds your site.
            <br />
            Then what?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 leading-relaxed">
            Lovable is the best way to build a product. It is not the operations layer. It does not publish your blog. It does not target your SEO keywords. It does not send SMS confirmations. It does not narrate your posts. It does not optimise your payments. It does not process your GitHub commits. Those things require a second layer — the autonomous operations layer that runs your site after Lovable has built it. Lazy Run is that layer.
          </motion.p>
        </div>
      </section>

      {/* What It Installs */}
      <section id="what-it-installs" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            Every Lazy engine. One prompt.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {engines.map((e, i) => (
              <motion.a
                key={e.name}
                href={e.href}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border border-border p-6 bg-card hover:border-foreground/20 transition-colors group"
              >
                <e.icon size={20} className="text-foreground/30 mb-3 group-hover:text-foreground/60 transition-colors" />
                <h3 className="font-display text-sm font-bold mb-1">{e.name}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{e.desc}</p>
              </motion.a>
            ))}
          </div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-body text-sm text-foreground/30 text-center mt-10 max-w-lg mx-auto">
            All nine engines install in one prompt. All run automatically. All managed from one dashboard.
          </motion.p>
        </div>
      </section>

      {/* Dashboard */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight text-center mb-14">
            One dashboard. Everything running.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardFeatures.map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-border p-6 bg-card"
              >
                <f.icon size={20} className="text-foreground/30 mb-3" />
                <h3 className="font-display text-sm font-bold mb-2">{f.title}</h3>
                <p className="font-body text-xs text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compound Effect */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-8">
            Nine engines compounding simultaneously.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 leading-relaxed">
            Each Lazy engine compounds on its own. Lazy Blogger builds domain authority. Lazy SEO captures keyword traffic. Lazy GEO earns AI citations. Lazy Store grows revenue. Together they compound on each other. The blog posts support the SEO. The SEO drives traffic to the store. The store triggers the SMS sequences. The SMS drives repeat purchases. The payments data improves the copy. Lazy Run coordinates the whole system so every engine feeds every other one. One prompt. Nine compounding loops. Running forever.
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            Pricing
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="border border-border p-8 bg-card flex flex-col">
              <h3 className="font-display text-lg font-bold mb-1">Free</h3>
              <p className="font-body text-2xl font-bold mb-4">$0</p>
              <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
                <li>✓ Lazy Run setup prompt</li>
                <li>✓ Self-hosted in your existing Lovable project</li>
                <li>✓ Installs all nine engines</li>
                <li>✓ Bring your own API keys for each service</li>
              </ul>
              <div className="mt-6"><CopyPromptButton label="Get the Prompt" /></div>
            </motion.div>

            {/* Pro */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border-2 border-amber-500/40 p-8 bg-card flex flex-col relative">
              <span className="absolute top-4 right-4 bg-amber-500/10 text-amber-500/70 text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1">
                Coming Soon
              </span>
              <h3 className="font-display text-lg font-bold mb-1">Pro</h3>
              <p className="font-body text-2xl font-bold mb-4">
                $99<span className="text-sm text-muted-foreground font-normal">/month</span>
              </p>
              <ul className="font-body text-sm text-muted-foreground space-y-2 flex-1">
                <li>✓ Hosted version</li>
                <li>✓ All API costs included</li>
                <li>✓ Priority processing</li>
                <li>✓ Weekly performance email</li>
                <li>✓ Dedicated support</li>
              </ul>
              <button disabled className="mt-6 w-full inline-flex items-center justify-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 border border-border text-muted-foreground cursor-not-allowed opacity-50">
                Coming Soon
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            FAQ
          </motion.h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border bg-card px-6">
                <AccordionTrigger className="font-display text-sm font-bold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-foreground/45 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-6">
            Lovable builds your site.
            <br />
            Lazy Run runs it.
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-body text-base md:text-lg text-foreground/45 max-w-2xl mx-auto leading-relaxed mb-10">
            One prompt installs the complete autonomous operations layer — publishing, SEO, GEO, payments, SMS, audio, e-commerce, streams, and code — all managed from one dashboard, all running without you.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <CopyPromptButton />
          </motion.div>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="font-body text-xs text-foreground/25 mt-6 max-w-md mx-auto">
            Open your Lovable project, paste it into the chat, choose your engines, add your API keys. Your site starts running itself today.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="font-display text-[10px] tracking-[0.15em] uppercase text-foreground/20">
          Lazy Unicorn — Autonomous growth engines for Lovable
        </p>
      </footer>
    </div>
  );
}
