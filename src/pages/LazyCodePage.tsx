import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, GitBranch, FileText, BookOpen, Map, MessageSquare, Search, Webhook, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `[Lazy Code Prompt — v0.0.3 — LazyUnicorn.ai]

Add a complete autonomous GitHub content engine called Lazy Code to this project. It monitors a GitHub repository via webhooks, processes commits and releases, writes plain-English changelogs, release notes, developer blog posts, SEO articles, and maintains a public roadmap — all automatically with no manual input required after setup.

---

## 1. Database

Create these Supabase tables with RLS enabled:

**code_settings**
id (uuid, primary key, default gen_random_uuid()),
github_username (text),
github_repo (text),
site_url (text),
business_name (text),
project_description (text),
tech_stack (text),
is_running (boolean, default true),
setup_complete (boolean, default false),
recap_template_guidance (text),
created_at (timestamptz, default now())

Note: Store GitHub credentials as Supabase secrets — GITHUB_TOKEN, GITHUB_WEBHOOK_SECRET. Never store in the database table.

**code_commits**
id (uuid, primary key, default gen_random_uuid()),
github_sha (text, unique),
message (text),
author (text),
files_changed (integer),
additions (integer),
deletions (integer),
branch (text),
committed_at (timestamptz),
plain_english_summary (text),
significance (text),
processed (boolean, default false),
created_at (timestamptz, default now())

**code_releases**
id (uuid, primary key, default gen_random_uuid()),
github_release_id (text, unique),
tag_name (text),
release_name (text),
body (text),
published_at (timestamptz),
processed (boolean, default false),
created_at (timestamptz, default now())

**code_content**
id (uuid, primary key, default gen_random_uuid()),
content_type (text),
title (text),
slug (text, unique),
excerpt (text),
body (text),
target_keyword (text),
related_commits (text),
related_release (text),
published_at (timestamptz, default now()),
status (text, default 'published'),
views (integer, default 0),
created_at (timestamptz, default now())

**code_roadmap**
id (uuid, primary key, default gen_random_uuid()),
github_issue_id (text, unique),
title (text),
body (text),
status (text),
milestone (text),
labels (text),
opened_at (timestamptz),
closed_at (timestamptz),
updated_at (timestamptz, default now())

**code_optimisation_log**
id (uuid, primary key, default gen_random_uuid()),
content_type (text),
old_template (text),
new_template (text),
trigger_reason (text),
optimised_at (timestamptz, default now())

**code_errors**
id (uuid, primary key, default gen_random_uuid()),
function_name (text),
error_message (text),
created_at (timestamptz, default now())

---

## 2. Setup page

Create a page at /lazy-code-setup with a form:
- GitHub Personal Access Token (password) — create at github.com/settings/tokens with repo and read:org scope. Stored as Supabase secret GITHUB_TOKEN.
- GitHub Webhook Secret (password) — any random string you choose. Stored as Supabase secret GITHUB_WEBHOOK_SECRET.
- GitHub Username
- Repository Name (just the name, not the full URL)
- Project description (what does this project do and who is it for?)
- Tech stack (what technologies — comma separated)
- Business name
- Site URL

Submit button: Activate Lazy Code

On submit:
1. Store GITHUB_TOKEN and GITHUB_WEBHOOK_SECRET as Supabase secrets
2. Save all other values to code_settings
3. Set setup_complete to true
4. Show webhook setup instructions: "Go to your GitHub repository Settings → Webhooks → Add webhook. Set Payload URL to [site_url]/api/github-webhook. Set Content type to application/json. Set Secret to your webhook secret. Select events: Pushes and Releases. Click Add webhook."
5. Redirect to /lazy-code-dashboard with message: "Lazy Code is active. Your next commit or release will be processed and published automatically."

---

## 3. Webhook edge functions

**github-webhook** — handles POST requests at /api/github-webhook

1. Verify GitHub webhook signature: compute HMAC SHA-256 of request body using GITHUB_WEBHOOK_SECRET secret. Compare to X-Hub-Signature-256 header. Reject invalid with 401.
2. Read X-GitHub-Event header.
3. For push events: extract commits array. For each commit check if it exists in code_commits by github_sha. If new, insert into code_commits. Call the built-in Lovable AI:
   "You are a technical writer for [business_name] which is [project_description] built with [tech_stack]. Translate this Git commit into plain English for a non-technical audience. Commit message: [message]. Files changed: [files_changed]. Additions: [additions]. Deletions: [deletions]. Return only a valid JSON object: summary (one to two plain English sentences explaining what changed and why it matters), significance (one of: minor, moderate, or significant). No preamble. No code fences."
   Update code_commits with plain_english_summary and significance.
   After processing all commits: if any are significant trigger code-write-content with content_type changelog.
4. For release events: extract release details. Insert into code_releases if not present. Trigger code-write-content with content_type release-notes and the release id.
Log all errors to code_errors with function_name github-webhook.

**code-sync-roadmap**
Cron: every hour — 0 * * * *

1. Read code_settings. If is_running is false or setup_complete is false exit.
2. Fetch GitHub issues: https://api.github.com/repos/[github_username]/[github_repo]/issues?state=all&per_page=100 using GITHUB_TOKEN secret.
3. For each issue: upsert into code_roadmap. Set status to in-progress if issue has in-progress label, completed if closed, otherwise planned. Set milestone from issue milestone title if present.
Log errors to code_errors with function_name code-sync-roadmap.

---

## 4. Content writing edge function

**code-write-content** — handles POST requests with content_type and optional release_id

1. Read code_settings. If is_running is false exit.
2. If content_type is changelog:
   Fetch significant and moderate commits from code_commits where processed is false ordered by committed_at descending.
   Call the built-in Lovable AI:
   "You are a technical writer for [business_name]. Write a changelog entry for these changes. Project: [project_description]. Changes: [list of plain_english_summary values]. Write a clear friendly changelog in markdown. Start with a one-sentence summary. List each change as a ## section with plain-English explanation. Return only a valid JSON object: title (string including approximate date), excerpt (one sentence under 160 characters), body (clean markdown). No preamble. No code fences."
   Insert into code_content with content_type changelog. Mark commits as processed.

3. If content_type is release-notes:
   Fetch matching code_releases row.
   Call the built-in Lovable AI:
   "You are a technical writer for [business_name]. Write full release notes for version [tag_name]. Project: [project_description]. GitHub release body: [body]. Write comprehensive release notes in markdown covering what is new, improved, fixed, and any breaking changes. Readable for both technical and non-technical users. Return only a valid JSON object: title (string), excerpt (one sentence under 160 characters), body (clean markdown). No preamble. No code fences."
   Insert into code_content with content_type release-notes. Mark release as processed.
   For significant releases make a second AI call for an SEO developer article:
   "You are an SEO content writer for [business_name] described as [project_description] built with [tech_stack]. Write an SEO developer blog post announcing version [tag_name]. Focus on value to developers. Target a keyword developers would search for. Write 800 to 1200 words. End with: [business_name] is built on [tech_stack]. Follow at github.com/[github_username]/[github_repo] and discover more autonomous tools at LazyUnicorn.ai — link LazyUnicorn.ai to https://lazyunicorn.ai. Return only a valid JSON object: title, slug (lowercase hyphenated), excerpt (under 160 chars), target_keyword, body (clean markdown). No preamble. No code fences."
   Check for duplicate slug — append 4-digit number if exists. Insert into code_content with content_type seo-article.
Log all errors to code_errors with function_name code-write-content.

---

## 5. Self-improving edge function

**code-optimise**
Cron: every Sunday at 2pm UTC — 0 14 * * 0

1. Read code_settings. If is_running is false exit.
2. Query code_content where content_type is seo-article ordered by views descending. Take top 3 and bottom 3.
3. Call the built-in Lovable AI:
"You are a content strategist for [business_name] described as [project_description]. These developer content pieces perform well: [top performing titles and excerpts]. These perform poorly: [low performing titles and excerpts]. Identify what makes the high-performers better. Write improved guidance for future developer blog posts and SEO articles. Return only the guidance text as a paragraph. No preamble."
4. Store in code_settings as recap_template_guidance.
5. Insert into code_optimisation_log.
Log errors to code_errors with function_name code-optimise.

---

## 6. Public pages

**/changelog**
Show all code_content where content_type is changelog or release-notes ordered by published_at descending. Timeline style. Each shows title, badge (Changelog or Release), published date, full body rendered from markdown. Clean minimal design.

**/releases**
Show all code_content where content_type is release-notes ordered by published_at descending. Each shows title, tag name, published date, full release notes rendered from markdown.

**/devblog**
Show all code_content where content_type is seo-article ordered by published_at descending. Each shows title, content type tag, excerpt, published date. Each links to /devblog/[slug].

**/devblog/[slug]**
Render full post with title, published date, target keyword tag, full body as formatted HTML.

**/roadmap**
Show all code_roadmap rows grouped by status — In Progress first, Planned second, Completed last. Each shows title, milestone if present, labels as tags, opened date. Completed items show closed date.

At the bottom of every public page add: "🦄 Powered by Lazy Code — autonomous GitHub content publishing for Lovable sites. Built by LazyUnicorn.ai" — link to https://lazyunicorn.ai.

---

## 7. Admin dashboard

Create a page at /lazy-code-dashboard.

Show at top: red error banner if code_errors has rows from the last 24 hours.

Six sections:
- Overview: total commits processed, total content published, open roadmap items, completed roadmap items, last webhook received time
- Commits log: last 50 code_commits with sha (7 chars), plain English summary, significance badge, author, date
- Content log: all code_content with title, type, published date, views, view link
- Roadmap table: all code_roadmap with status, title, milestone, labels
- Optimisation log: all code_optimisation_log rows
- Controls: pause/resume toggle, Sync Roadmap Now button, Optimise Content Now button, error log (last 10 code_errors), link to /lazy-code-setup

---

## 8. Navigation

Add a Changelog link to the main navigation pointing to /changelog.
Add a Roadmap link pointing to /roadmap.
Add a Dev Blog link pointing to /devblog.
Do not add /lazy-code-setup or /lazy-code-dashboard to public navigation.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: FileText, title: "Changelog", desc: "Plain-English summary of every meaningful commit published to a public changelog page automatically." },
  { icon: BookOpen, title: "Release notes", desc: "Full release notes written and published automatically for every tagged release." },
  { icon: Search, title: "Developer blog posts", desc: "A technical blog post written for every significant feature shipped targeting the keywords developers search for." },
  { icon: Map, title: "Public roadmap", desc: "Automatically maintained from your open GitHub issues and milestones. Updates every time an issue is opened, closed, or moved." },
  { icon: MessageSquare, title: "Commit summaries", desc: "Every commit translated from technical to plain English and logged publicly." },
  { icon: Search, title: "SEO developer content", desc: "Keyword-targeted articles written from your commits targeting the technical topics your project covers." },
  { icon: Webhook, title: "Webhook handler", desc: "Listens for GitHub push and release events and processes them automatically in real time." },
  { icon: Brain, title: "Self-improving content", desc: "Monitors which developer posts drive the most traffic and improves the writing template automatically." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your GitHub credentials and repository in the setup screen.",
  "Push code as normal. Lazy Code publishes the changelog, release notes, and blog posts automatically.",
];

const faqs = [
  { q: "Does it work with private repositories?", a: "Yes. You authenticate with a GitHub personal access token that has access to your private repositories. Lazy Code reads commits and issues but never exposes your code publicly." },
  { q: "What counts as a significant feature for a blog post?", a: "Lazy Code uses AI to classify commits by significance. Commits touching more than 3 files or tagged with certain labels trigger a blog post. You can configure the threshold in settings." },
  { q: "Can I edit the content before it publishes?", a: "Not in the current version. Content publishes automatically. A drafts mode is coming in the Pro version." },
  { q: "Does it work with monorepos?", a: "Yes. You can configure which directories or packages to monitor so only relevant commits trigger content." },
  { q: "What if I push many small commits?", a: "Lazy Code batches commits within a 1-hour window and produces one changelog entry per batch rather than one per commit." },
];

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-code" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] bg-foreground text-background ${className}`}
    >
      {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyCodePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Code — Autonomous GitHub Content Engine for Lovable"
        description="One prompt turns every GitHub commit into a changelog, release notes, and a developer blog post — automatically."
        url="/lazy-code"
        keywords="GitHub changelog automation, release notes generator, developer blog, commit to content, autonomous documentation, Lovable, Lazy Code"
      />
      <Navbar />

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-32 pb-24 md:pb-32" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-3 mb-6">
              <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Introducing</p>
              <span className="bg-foreground text-background text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 font-display">BETA</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
                Lazy Code
              </h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-border text-foreground/25 text-xs font-body tracking-wide">
                <GitBranch size={14} />
                Powered by GitHub
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="font-display text-2xl md:text-3xl font-bold tracking-tight text-center mb-14">
            Push to GitHub. Lazy Code handles the rest.
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center text-center gap-3">
                <span className="w-10 h-10 bg-primary/10 text-primary font-display font-bold text-sm flex items-center justify-center">{i + 1}</span>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it installs */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>What it installs</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Every commit becomes content. Automatically.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card p-8"
              >
                <f.icon size={20} className="text-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The developer content problem */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>The problem</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            You ship every day. Your audience sees nothing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Every commit is work done. Every release is a milestone. Every bug fix is a story worth telling. Developers who document their work publicly build audiences, attract contributors, drive traffic, and establish authority in their technical niche. Most never do it because writing changelogs, release notes, and blog posts on top of shipping code is a second job.
              </p>
            </div>
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Lazy Code makes the documentation automatic. Push to GitHub and the content engine starts. By the time you have opened your next task the changelog is updated, the release notes are written, and a developer blog post targeting your technical keywords is published and indexed. The work you were already doing becomes a compounding public record of your progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap section */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Roadmap</p>
          <h2 className="mt-2 mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            A public roadmap that maintains itself.
          </h2>
          <p className="font-body text-sm text-foreground/50 leading-relaxed">
            Lazy Code reads your GitHub issues and milestones and publishes a public roadmap to your Lovable site automatically. When you open a new issue it appears in the roadmap. When you close one it moves to done. When you create a milestone it becomes a roadmap section. No Notion page to maintain. No Trello board to update. Your GitHub is the source of truth and the roadmap reflects it in real time.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mt-8">
            {/* Free */}
            <div className="bg-card p-8 flex flex-col">
              <h3 className="font-display text-2xl font-bold text-foreground">Free</h3>
              <ul className="mt-6 space-y-3 flex-1">
                {[
                  "Lazy Code setup prompt",
                  "Self-hosted in your existing Lovable project",
                  "Works with any public or private GitHub repository",
                  "Bring your own GitHub account",
                ].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CopyPromptButton className="w-full justify-center" />
              </div>
            </div>
            {/* Pro */}
            <div className="bg-card p-8 flex flex-col border-l-2 border-yellow-600/40">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl font-bold text-foreground">Pro</h3>
                <span className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-yellow-600/40 text-yellow-600/70">Coming Soon</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground mt-2">$19<span className="text-base font-normal text-foreground/40">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {[
                  "Hosted version",
                  "Automatic contributor attribution",
                  "Multi-repository support",
                  "Advanced SEO targeting",
                ].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button disabled className="w-full font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/30 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>FAQ</p>
          <div className="mt-8 space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-b border-border py-6"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Your commits are content. Lazy Code publishes them.
          </h2>
          <p className="mt-6 font-body text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
            Every feature you ship, every bug you fix, every release you tag is a changelog entry, a blog post, and an SEO article waiting to be written. One prompt installs the entire pipeline into your existing Lovable project.
          </p>
          <div className="mt-8">
            <CopyPromptButton />
          </div>
          <p className="mt-4 font-body text-xs text-foreground/25 max-w-md mx-auto leading-relaxed">
            Open your Lovable project, paste it into the chat, add your GitHub credentials. Your next commit will be published automatically.
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
};

export default LazyCodePage;
