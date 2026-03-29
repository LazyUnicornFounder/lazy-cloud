import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Shield, Bug, TrendingUp, Bell, FileText, CheckCircle, RotateCcw, BookOpen, Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import LazyPricingSection from "@/components/LazyPricingSection";
import LazyFaqSection from "@/components/LazyFaqSection";
import { toast } from "sonner";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import AutopilotHeadline from "@/components/AutopilotHeadline";

const LAZY_SECURITY_PROMPT = `[Lazy Security Prompt — v0.0.5 — LazyUnicorn.ai]

Add a complete autonomous security monitoring agent called Lazy Security to this project. It connects to Aikido to run automated pentests, tracks vulnerability history, monitors security score over time, generates audit-ready reports, and sends instant alerts for critical findings — all automatically with no manual security work required after setup.

Note: Store the Aikido API key as Supabase secret AIKIDO_API_KEY. Never store in the database.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**security_settings**
id (uuid, primary key, default gen_random_uuid()),
brand_name (text),
site_url (text),
aikido_project_id (text),
pentest_frequency (text, default 'monthly'),
alert_critical (boolean, default true),
alert_high (boolean, default true),
alert_medium (boolean, default false),
slack_webhook_url (text),
telegram_chat_id (text),
next_pentest_at (timestamptz),
is_running (boolean, default true),
setup_complete (boolean, default false),
prompt_version (text, nullable),
created_at (timestamptz, default now())

**security_scans**
id (uuid, primary key, default gen_random_uuid()),
aikido_scan_id (text, unique),
scan_type (text — one of pentest, static, continuous),
status (text — one of queued, running, completed, failed),
score (integer),
critical_count (integer, default 0),
high_count (integer, default 0),
medium_count (integer, default 0),
low_count (integer, default 0),
info_count (integer, default 0),
started_at (timestamptz),
completed_at (timestamptz),
report_url (text),
created_at (timestamptz, default now())

**security_vulnerabilities**
id (uuid, primary key, default gen_random_uuid()),
scan_id (uuid),
aikido_vuln_id (text),
title (text),
severity (text — one of critical, high, medium, low, informational),
category (text),
description (text),
remediation (text),
status (text, default 'open' — one of open, fixed, accepted, regression),
first_found_at (timestamptz, default now()),
fixed_at (timestamptz),
alerted (boolean, default false)

**security_reports**
id (uuid, primary key, default gen_random_uuid()),
scan_id (uuid),
title (text),
generated_at (timestamptz, default now()),
score (integer),
summary (text),
methodology (text),
findings_count (integer),
pdf_url (text),
public (boolean, default false)

**security_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-security-setup.

Show a welcome message: "Your Lovable site ships fast. Lazy Security makes sure it ships safe. Connect Aikido and your first pentest runs automatically."

Form fields:
- Brand name
- Site URL (the live URL of your Lovable project — this is what Aikido will pentest)
- Aikido API key (password) — instructions: create a free account at aikido.dev, go to Settings then API keys, create a new key. Stored as Supabase secret AIKIDO_API_KEY.
- Aikido Project ID (text) — instructions: after connecting your Lovable project in Aikido go to the project settings and copy the project ID.
- Pentest frequency (select: Weekly — recommended for active development / Monthly — recommended for stable products / Quarterly — minimum for compliance / Manual only — I will trigger pentests myself)
- Alert on Critical findings (toggle, default on)
- Alert on High findings (toggle, default on)
- Alert on Medium findings (toggle, default off)
- Slack webhook URL for alerts (text, optional)
- Telegram chat ID for alerts (text, optional) — requires Lazy Telegram to be installed

Submit button: Activate Lazy Security

On submit:
1. Store AIKIDO_API_KEY as Supabase secret
2. Save all other values to security_settings
3. Set setup_complete to true and prompt_version to 'v0.0.1'
4. Set next_pentest_at to now plus 5 minutes
5. Immediately call security-scan
6. Redirect to /admin with message: "Lazy Security is active. Your first pentest is queued. Results will appear here within the next hour."

---

## 3. Core scan edge function

Create a Supabase edge function called security-scan.
Cron: every hour — 0 * * * * (checks if a pentest is due, does not run one every hour)

1. Read security_settings. If is_running is false or setup_complete is false exit.
2. Check if now is past next_pentest_at. If not exit.
3. Call the Aikido API to trigger a new pentest. POST to https://app.aikido.dev/api/v1/scans with project_id set to aikido_project_id. Use AIKIDO_API_KEY secret in Authorization header.
4. Insert into security_scans with the returned aikido_scan_id and status queued.
5. Calculate and set next_pentest_at based on pentest_frequency — weekly adds 7 days, monthly adds 30 days, quarterly adds 90 days, manual sets to null.
Log errors to security_errors with function_name security-scan.

---

## 4. Results polling edge function

Create a Supabase edge function called security-poll.
Cron: every 10 minutes — */10 * * * *

1. Read security_settings. Query security_scans where status is queued or running ordered by created_at descending.
2. For each active scan call the Aikido API: GET https://app.aikido.dev/api/v1/scans/[aikido_scan_id] using AIKIDO_API_KEY secret.
3. If status is still running update security_scans status to running and continue.
4. If status is completed:
   Update security_scans with score, counts by severity, completed_at, status completed, and report_url.
   For each vulnerability in findings: check if it exists in security_vulnerabilities by aikido_vuln_id. If new insert it. If it existed as fixed update status to regression.
   For each new critical or high vulnerability where alerted is false: call security-alert. Mark alerted true.
   Call security-generate-report with the scan id.
5. If status is failed: update security_scans status to failed. Log to security_errors.
Log errors to security_errors with function_name security-poll.

---

## 5. Alert edge function

Create a Supabase edge function called security-alert handling POST requests with a vulnerability_id.

1. Read security_settings and the matching security_vulnerabilities row.
2. If severity does not meet the alert threshold based on alert_critical, alert_high, alert_medium toggles exit without sending.
3. If slack_webhook_url is set: POST a Slack Block Kit message. Header: 🚨 Security Alert — [severity] vulnerability found in [brand_name]. Body: [title]. Fields: Severity, Category, Remediation hint (first 100 chars of remediation), Dashboard link to [site_url]/admin/security.
4. If telegram_chat_id is set and TELEGRAM_BOT_TOKEN secret exists: POST a Telegram message via the Telegram API. MarkdownV2 format: bold severity header, vulnerability title, one-line remediation hint, link to dashboard.
Log errors to security_errors with function_name security-alert.

---

## 6. Report generation edge function

Create a Supabase edge function called security-generate-report handling POST requests with a scan_id.

1. Read security_settings and the matching security_scans row and all security_vulnerabilities for that scan.
2. Call the built-in Lovable AI:
"You are a security report writer for [brand_name]. Write a professional pentest report executive summary. Scan date: [completed_at]. Security score: [score] out of 100. Findings: [critical_count] critical, [high_count] high, [medium_count] medium, [low_count] low, [info_count] informational. Top findings: [list of top 5 vulnerability titles and severities]. Write a 150 to 200 word professional executive summary suitable for enterprise prospects and compliance auditors. Cover what was tested, overall security posture, most significant findings, and recommended next steps. Be factual and professional. Return only the summary text. No preamble."
3. Insert into security_reports: scan_id, title as Security Assessment Report — [brand_name] — [date], score, summary from AI, methodology as Automated penetration test combining static analysis and dynamic testing powered by Aikido, findings_count as total vulnerability count, public false.
Log errors to security_errors with function_name security-generate-report.

---

## 7. Continuous monitoring edge function

Create a Supabase edge function called security-monitor.
Cron: daily at 3am UTC — 0 3 * * *

1. Read security_settings. If is_running is false exit.
2. Call the Aikido API for a lightweight static scan to check for new issues since the last full pentest: GET https://app.aikido.dev/api/v1/projects/[aikido_project_id]/issues using AIKIDO_API_KEY.
3. Compare returned issues to existing security_vulnerabilities. For any new issue insert into security_vulnerabilities. If severity is critical or high call security-alert.
4. For any issue previously open that no longer appears update status to fixed and set fixed_at to now.
Log errors to security_errors with function_name security-monitor.

---

## 8. Public security page

Create a public page at /security showing a professional security posture page.

Show:
- Current security score as a large number with colour indicator — green above 80, amber 60 to 79, red below 60
- Last pentest date
- Brief statement: "This application is regularly tested using automated penetration testing combining static analysis and dynamic security testing powered by Aikido."
- Open vulnerability counts by severity — show only medium, low, and informational publicly. Never expose critical or high counts publicly.
- A link labelled Request Security Report that opens a mailto link to the support email

At the bottom add: "🦄 Security monitored by Lazy Security — autonomous security for Lovable sites. Powered by Aikido. Built by LazyUnicorn.ai" — link to https://lazyunicorn.ai.

---

## 9. Admin

Do not build a standalone dashboard page for this agent. The dashboard lives at /admin/security as part of the unified LazyUnicorn admin panel, which is built separately using the LazyUnicorn Admin Dashboard prompt. This agent only needs its setup page, database tables, edge functions, and public pages.

If /admin does not yet exist on this project add a simple placeholder at /admin with the text: "Install the LazyUnicorn Admin Dashboard to manage all agents in one place." and a link to /lazy-security-setup.

## 10. Navigation

Add a Security link to the main site navigation pointing to /security (the public page).
Add an Admin link to the main site navigation pointing to /admin.
Do not add /lazy-security-setup to public navigation.

## Backlink Badge
Add a small "Powered by Lazy Unicorn" backlink badge in the footer of every public-facing page. Use this exact HTML:
<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>
Style it to sit at the bottom of the page footer, centered, with subtle opacity (60%) that increases to 100% on hover.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

function CopyPromptButton({ className = "", text }: { className?: string; text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Prompt copied — paste it into your Lovable project");
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 bg-foreground text-background font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 hover:opacity-90 transition-opacity ${className}`}
    >
      {copied ? <><Check size={16} /> Copied ✓</> : <><Copy size={16} /> Copy the Lovable Prompt</>}
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
  { q: "How do I know when there's an update?", a: "Check the changelog at /changelog. Every agent update is versioned and documented with upgrade instructions." },
  { q: "How do I upgrade to a new prompt version?", a: "Visit the upgrade guide at /upgrade-guide. Copy the latest prompt and paste it into your Lovable project. Your existing data and settings are preserved." },
];

export default function LazySecurityPage() {
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-security");
  const promptText = dbPrompt?.prompt_text || LAZY_SECURITY_PROMPT;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Security — Autonomous Security Monitoring for Lovable"
        description="Autonomous security monitoring for Lovable. One prompt connects Aikido pentesting, vulnerability tracking, and audit-ready reports to your existing project."
        url="/lazy-security"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* ── Hero ── */}
        <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <div className="flex items-center gap-3 mb-6">
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.5 }}>Introducing</p>
                <span className="bg-foreground text-background text-[14px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
              </div>
              <AutopilotHeadline product="lazy-security" />

              <div className="flex items-center gap-4 flex-wrap">
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                  Lazy Security
                </h1>
                <span className="inline-flex items-center gap-1.5 font-body text-[14px] tracking-[0.12em] uppercase text-foreground/70 border border-border px-3 py-1">Powered by Aikido</span>
              </div>
              <p className="mt-6 font-body text-base md:text-lg max-w-xl leading-relaxed" style={{ color: "#f0ead6", opacity: 0.45 }}>
                Your Lovable site ships fast. Lazy Security makes sure it ships safe. One prompt connects Aikido pentesting, vulnerability tracking, security score monitoring, and audit-ready reports to your existing project. Security that never sleeps.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
                <CopyPromptButton text={promptText} />
                <button
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 font-body text-[13px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── The Problem ── */}
        <section className="max-w-3xl mx-auto px-6 py-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            You shipped fast. But fast and secure are not the same thing.
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-0 border border-border">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-b md:border-b-0 md:border-r border-border bg-card p-6">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Lovable lets you build a working product in hours. But working and secure are different properties. AI-generated code introduces vulnerabilities at meaningful rates even when it works exactly as intended. Most founders run one free scan, get a green checkmark, and assume they are covered. They are not.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.08 }} className="bg-card p-6">
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Enterprise prospects ask for pentest reports before signing. Investors run security due diligence. SOC 2 and ISO 27001 require documented security testing. A single breach destroys the trust you spent months building. Lazy Security makes continuous security testing a one-prompt install rather than a five-figure engagement.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            How it works
          </motion.h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-foreground text-background font-display text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed pt-1">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What It Does ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Security that runs itself
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="border-b sm:odd:border-r border-border last:border-b-0 bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <f.icon size={16} className="text-foreground/70" />
                  <h3 className="font-display text-sm font-bold text-foreground">{f.title}</h3>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Static vs Dynamic ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Most tools read your code. Aikido attacks your app.
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-0 border border-border">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border-b md:border-b-0 md:border-r border-border bg-card p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground/65 mb-3">Static analysis</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Reads your source code and identifies known vulnerability patterns — exposed secrets, missing RLS policies, insecure dependencies, common misconfigurations. Valuable. Fast. Catches what you can see in the code.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.08 }} className="bg-card p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-widest text-foreground/60 mb-3">Dynamic pentesting (what Lazy Security adds)</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                Attacks your running application with real payloads. Tries to escalate privileges, access data it should not be able to reach, bypass authentication, and break your application logic. Finds what only becomes visible when someone actually tries to break in.
              </p>
            </motion.div>
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-body text-sm text-muted-foreground leading-relaxed text-center mt-8 max-w-2xl mx-auto">
            Lazy Security does both. Static scanning runs continuously. Dynamic pentesting runs on schedule and on demand. Together they close the gap between what could go wrong and what actually breaks.
          </motion.p>
        </section>

        {/* ── The Report ── */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-4">
            The report that closes enterprise deals
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-body text-sm text-muted-foreground leading-relaxed text-center max-w-2xl mx-auto mb-10">
            Enterprise prospects ask for it. Investors expect it. SOC 2 auditors require it. A formal pentest report from Aikido says your application has been tested against real-world attack scenarios and here is what was found. Lazy Security generates this report automatically — updated after every pentest run, formatted for audit purposes, ready to attach to any vendor questionnaire or compliance submission without you lifting a finger.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card p-8 max-w-md mx-auto space-y-6">
            <div className="text-center space-y-1">
              <p className="font-display text-[14px] uppercase tracking-widest text-foreground/65">Security Score</p>
              <p className="font-display text-5xl font-extrabold text-foreground">87</p>
              <p className="font-body text-[14px] text-foreground/70">/ 100</p>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <p className="font-display text-[14px] uppercase tracking-widest text-foreground/65 mb-3">Vulnerability Breakdown</p>
              {[
                { label: "Critical", count: 0, color: "hsl(0 84% 60%)" },
                { label: "High", count: 1, color: "hsl(25 90% 55%)" },
                { label: "Medium", count: 3, color: "hsl(45 80% 55%)" },
                { label: "Low", count: 7, color: "hsl(210 60% 50%)" },
                { label: "Informational", count: 12, color: "hsl(0 0% 45%)" },
              ].map((v) => (
                <div key={v.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2" style={{ backgroundColor: v.color }} />
                    <span className="font-body text-muted-foreground">{v.label}</span>
                  </div>
                  <span className="font-display text-foreground/60">{v.count}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-1 font-body text-[14px] text-muted-foreground">
              <p>Test date: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p>Methodology: OWASP Top 10, SANS CWE 25, Aikido proprietary</p>
            </div>
            <button className="w-full font-display text-[13px] font-bold uppercase tracking-wider py-2.5 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
              Download PDF
            </button>
          </motion.div>
        </section>

        {/* ── Pricing ── */}
        <LazyPricingSection
          lazyFeatures={["Lazy Security setup prompt", "Self-hosted in your Lovable project", "Bring your own Aikido account", "Automated scheduling and reporting"]}
          proFeatures={["Hosted version", "Automated report delivery before meetings", "Multi-project security dashboard", "Slack and Telegram alerts included"]}
          ctaButton={<CopyPromptButton text={promptText} className="w-full justify-center" />}
        />

        <LazyFaqSection faqs={faqs} />

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Ship fast. Stay secure. One prompt does both.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-8">
              You built it fast. Lazy Security makes sure it stays safe — continuous scanning, automated pentests, instant alerts, and audit-ready reports that close enterprise deals.
            </p>
            <CopyPromptButton text={promptText} />
            <p className="font-body text-[14px] text-muted-foreground/50 max-w-sm mx-auto mt-4">
              Open your Lovable project, paste it into the chat, connect your Aikido account. Your first pentest runs automatically within minutes.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
