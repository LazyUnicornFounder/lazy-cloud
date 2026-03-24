import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Bug, TrendingUp, Bell, FileText, CheckCircle, RotateCcw, BookOpen } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const LAZY_SECURITY_PROMPT = `You are adding Lazy Security to this Lovable project — an autonomous security monitoring engine powered by Aikido.

## What to build

### Database tables (via migration)

1. security_settings — id uuid PK, aikido_api_key text, scan_schedule text default 'monthly', slack_webhook_url text, telegram_chat_id text, is_running boolean default false, setup_complete boolean default false, created_at timestamptz default now()
2. security_scans — id uuid PK, scan_type text (pentest | static), status text default 'pending', security_score integer, critical_count integer default 0, high_count integer default 0, medium_count integer default 0, low_count integer default 0, info_count integer default 0, report_url text, started_at timestamptz, completed_at timestamptz, created_at timestamptz default now()
3. security_vulnerabilities — id uuid PK, scan_id uuid FK→security_scans, severity text, title text, description text, remediation text, status text default 'open', fixed_at timestamptz, created_at timestamptz default now()
4. security_errors — id uuid PK, error_message text, created_at timestamptz default now()

All tables: enable RLS, add permissive select/insert policies for anon and authenticated.

### Edge functions

1. security-scan — triggers an Aikido pentest via their API, stores results in security_scans and security_vulnerabilities, sends Slack/Telegram alert for critical/high findings
2. security-report — generates a formatted pentest report from the latest scan data, returns PDF-ready JSON
3. security-schedule — cron-compatible function that checks scan_schedule and triggers security-scan when due

### Pages

1. /lazy-security-setup — setup wizard: enter Aikido API key, configure scan schedule, optional Slack webhook, test connection, save settings
2. /lazy-security-dashboard — shows current security score, scan history chart, vulnerability list with severity badges, fix tracking, trigger manual scan button, download report button

### Admin

Add Lazy Security to /admin with route /admin/security showing scan history, error log, and settings.

### Navigation

Add Lazy Security to the Security nav group and footer.`;

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(LAZY_SECURITY_PROMPT);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return (
    <button
      onClick={handleCopy}
      className={`text-[11px] font-mono tracking-wider uppercase px-5 py-2.5 border transition-colors ${
        copied
          ? "bg-foreground text-background border-foreground"
          : "bg-foreground text-background border-foreground hover:bg-transparent hover:text-foreground"
      } ${className}`}
    >
      {copied ? "Copied ✓" : "Copy the Lovable Prompt"}
    </button>
  );
}

const features = [
  { icon: Bug, title: "Automated pentesting", desc: "Runs a full Aikido pentest automatically on a configurable schedule. Static analysis, dynamic testing, and whitebox scanning combined. Finds what free scanners miss." },
  { icon: Shield, title: "Continuous vulnerability monitoring", desc: "Monitors your Lovable project for new vulnerabilities every time a significant change is detected. Not just on demand — continuously." },
  { icon: TrendingUp, title: "Security score tracking", desc: "Tracks your overall security score week over week and surfaces the trend in your dashboard. Know if you are getting more or less secure over time." },
  { icon: Bell, title: "Critical alerts", desc: "The moment a high or critical severity vulnerability is found Lazy Security sends an instant alert via Slack or Telegram. No more discovering breaches from customers." },
  { icon: FileText, title: "Audit-ready reports", desc: "Generates a formatted pentest report automatically before every scheduled investor meeting, enterprise sales call, or compliance deadline. SOC 2 and ISO 27001 ready." },
  { icon: CheckCircle, title: "Fix tracking", desc: "Tracks which vulnerabilities have been fixed and which are outstanding. Generates a remediation log that shows auditors and customers your security posture is actively managed." },
  { icon: RotateCcw, title: "Regression detection", desc: "Re-tests previously fixed vulnerabilities every time a new pentest runs. Catches regressions before they reach production." },
  { icon: BookOpen, title: "Security changelog", desc: "Publishes a public security changelog showing your vulnerability history, fix timeline, and current security score. Transparency that builds enterprise trust." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project.",
  "Connect your Aikido account in the setup screen.",
  "Lazy Security runs your first pentest automatically.",
  "Vulnerabilities surface in your dashboard and in Slack. Fixes get tracked. Reports generate automatically before every key meeting.",
];

const faqs = [
  { q: "Do I need an Aikido account?", a: "Yes. Create a free Aikido account at aikido.dev. Pentests cost $100 per test billed by Aikido directly. Lazy Security automates when and how often they run." },
  { q: "How is this different from Lovable's built-in Security Scanner?", a: "Lovable's Security Scanner does static analysis — it reads your code. Lazy Security adds dynamic pentesting via Aikido which attacks your running application. Both are valuable and Lazy Security runs alongside the Lovable scanner rather than replacing it." },
  { q: "How often does it run a pentest?", a: "You configure the schedule in setup. Default is monthly. You can also trigger a pentest manually from the dashboard or via a Slack command with /lazy pentest." },
  { q: "What happens when a vulnerability is found?", a: "Critical and high severity findings trigger an instant Slack or Telegram alert. All findings appear in your dashboard with Aikido's remediation recommendations. You fix them in Lovable and Lazy Security tracks the fix." },
  { q: "Can I show customers my security report?", a: "Yes. The generated report is designed to be shared. It shows your security score, test methodology, findings summary, and fix history. Attach it to vendor questionnaires, share it with enterprise prospects, or publish it to build trust." },
];

export default function LazySecurityPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Lazy Security — Autonomous Security Monitoring for Lovable"
        description="Autonomous security monitoring for Lovable. One prompt connects Aikido pentesting, vulnerability tracking, and audit-ready reports to your existing project."
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="min-h-[80vh] flex items-center justify-center px-6" style={{ fontFamily: "var(--font-body)" }}>
        <div className="max-w-3xl text-center space-y-6">
          <motion.span {...fadeUp} className="inline-block text-[10px] font-mono tracking-widest uppercase text-muted-foreground border border-border px-3 py-1">
            Powered by Aikido
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Lovable site ships fast. Lazy Security makes sure it ships safe.
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Lazy Security connects your Lovable project to Aikido and runs continuous security monitoring — vulnerability scanning, automated pentests, security score tracking, and instant Slack alerts when something critical is found. One prompt. Security that never sleeps.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <CopyPromptButton />
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="text-[11px] font-mono tracking-wider uppercase px-5 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              See How It Works
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          You shipped fast. But fast and secure are not the same thing.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div {...fadeUp} className="border border-border p-6 text-sm text-muted-foreground leading-relaxed">
            Lovable lets you build a working product in hours. But working and secure are different properties. AI-generated code introduces vulnerabilities at meaningful rates even when it works exactly as intended. Most founders run one free scan, get a green checkmark, and assume they are covered. They are not.
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border border-border p-6 text-sm text-muted-foreground leading-relaxed">
            Enterprise prospects ask for pentest reports before signing. Investors run security due diligence. SOC 2 and ISO 27001 require documented security testing. A single breach destroys the trust you spent months building. Lazy Security makes continuous security testing a one-prompt install rather than a five-figure engagement.
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          One prompt. Continuous security. Audit-ready reports.
        </motion.h2>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUp}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 border border-border p-5"
            >
              <span className="text-foreground/20 font-mono text-lg font-bold flex-shrink-0 w-6">{i + 1}</span>
              <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What It Does ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Security that runs itself.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border p-5 space-y-2">
              <div className="flex items-center gap-2">
                <f.icon size={16} className="text-foreground/30" />
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Static vs Dynamic ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Most tools read your code. Aikido attacks your app.
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp} className="border border-border p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Static analysis</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Reads your source code and identifies known vulnerability patterns — exposed secrets, missing RLS policies, insecure dependencies, common misconfigurations. Valuable. Fast. Catches what you can see in the code.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border border-foreground/20 p-6 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-foreground/60">Dynamic pentesting (what Lazy Security adds)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Attacks your running application with real payloads. Tries to escalate privileges, access data it should not be able to reach, bypass authentication, and break your application logic. Finds what only becomes visible when someone actually tries to break in.
            </p>
          </motion.div>
        </div>
        <motion.p {...fadeUp} className="text-sm text-muted-foreground leading-relaxed text-center mt-8 max-w-2xl mx-auto">
          Lazy Security does both. Static scanning runs continuously. Dynamic pentesting runs on schedule and on demand. Together they close the gap between what could go wrong and what actually breaks.
        </motion.p>
      </section>

      {/* ── The Report ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center" style={{ fontFamily: "var(--font-display)" }}>
          The report that closes enterprise deals.
        </motion.h2>
        <motion.p {...fadeUp} className="text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-10">
          Enterprise prospects ask for it. Investors expect it. SOC 2 auditors require it. A formal pentest report from Aikido says your application has been tested against real-world attack scenarios and here is what was found. Lazy Security generates this report automatically — updated after every pentest run, formatted for audit purposes, ready to attach to any vendor questionnaire or compliance submission without you lifting a finger.
        </motion.p>
        <motion.div {...fadeUp} className="border border-border p-8 max-w-md mx-auto space-y-6">
          <div className="text-center space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Security Score</p>
            <p className="text-5xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>87</p>
            <p className="text-[10px] font-mono text-muted-foreground">/ 100</p>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-3">Vulnerability Breakdown</p>
            {[
              { label: "Critical", count: 0, color: "hsl(0 84% 60%)" },
              { label: "High", count: 1, color: "hsl(25 90% 55%)" },
              { label: "Medium", count: 3, color: "hsl(45 80% 55%)" },
              { label: "Low", count: 7, color: "hsl(210 60% 50%)" },
              { label: "Informational", count: 12, color: "hsl(0 0% 45%)" },
            ].map((v) => (
              <div key={v.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2" style={{ backgroundColor: v.color }} />
                  <span className="text-muted-foreground">{v.label}</span>
                </div>
                <span className="font-mono text-foreground/60">{v.count}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4 space-y-1 text-[10px] font-mono text-muted-foreground">
            <p>Test date: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Methodology: OWASP Top 10, SANS CWE 25, Aikido proprietary</p>
          </div>
          <button className="w-full text-[11px] font-mono uppercase tracking-wider py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            Download PDF
          </button>
        </motion.div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          Pricing
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div {...fadeUp} className="border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Free</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lazy Security setup prompt, self-hosted, bring your own Aikido account. Aikido pentests cost $100 per test — billed directly by Aikido. Lazy Security automates the scheduling and reporting around it at no extra cost.
            </p>
            <CopyPromptButton className="w-full" />
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="border p-6 space-y-4" style={{ borderColor: "hsl(45 80% 55%)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Pro — $19/mo</h3>
              <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border" style={{ color: "hsl(45 80% 55%)", borderColor: "hsl(45 80% 55% / 0.4)" }}>Coming Soon</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hosted version, automated report delivery before scheduled meetings, multi-project security dashboard, Slack and Telegram alerts included.
            </p>
            <button disabled className="w-full text-[11px] font-mono uppercase tracking-wider py-2.5 border border-border text-muted-foreground opacity-40 cursor-not-allowed">
              Coming Soon
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center" style={{ fontFamily: "var(--font-display)" }}>
          FAQ
        </motion.h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="border border-border">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-5 py-4 flex items-center justify-between text-sm text-foreground hover:text-foreground/80 transition-colors"
              >
                {faq.q}
                <span className="text-muted-foreground text-xs ml-4">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-border py-20 px-6" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Ship fast. Stay secure. One prompt does both.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            You built it fast. Lazy Security makes sure it stays safe — continuous scanning, automated pentests, instant alerts, and audit-ready reports that close enterprise deals.
          </p>
          <CopyPromptButton />
          <p className="text-[10px] text-muted-foreground/50 max-w-sm mx-auto">
            Open your Lovable project, paste it into the chat, connect your Aikido account. Your first pentest runs automatically within minutes.
          </p>
        </div>
      </section>
    </>
  );
}
