import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, GitBranch, FileText, BookOpen, Map, MessageSquare, Search, Webhook, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `Add a complete autonomous GitHub content engine called Lazy Code to this project. It monitors a GitHub repository via webhooks, processes commits and releases, writes plain-English changelogs, release notes, developer blog posts, SEO articles, and maintains a public roadmap — all automatically with no manual input required after setup.

1. Database Create a Supabase table called code_settings with fields: id (uuid, primary key), github_token (text), github_username (text), github_repo (text), github_webhook_secret (text), site_url (text), business_name (text), project_description (text), tech_stack (text), is_running (boolean, default true), setup_complete (boolean, default false), recap_template_guidance (text). Create a Supabase table called code_commits with fields: id (uuid, primary key, default gen_random_uuid()), github_sha (text, unique), message (text), author (text), files_changed (integer), additions (integer), deletions (integer), branch (text), committed_at (timestamptz), plain_english_summary (text), significance (text — one of minor, moderate, significant), processed (boolean, default false), created_at (timestamptz, default now()). Create a Supabase table called code_releases with fields: id (uuid, primary key, default gen_random_uuid()), github_release_id (text, unique), tag_name (text), release_name (text), body (text), published_at (timestamptz), processed (boolean, default false), created_at (timestamptz, default now()). Create a Supabase table called code_content with fields: id (uuid, primary key, default gen_random_uuid()), content_type (text — one of changelog, release-notes, blog-post, seo-article), title (text), slug (text, unique), body (text), target_keyword (text), related_commits (text), related_release (text), published_at (timestamptz, default now()), status (text, default 'published'), views (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called code_roadmap with fields: id (uuid, primary key, default gen_random_uuid()), github_issue_id (text, unique), title (text), body (text), status (text — one of planned, in-progress, completed), milestone (text), labels (text), opened_at (timestamptz), closed_at (timestamptz), updated_at (timestamptz, default now())). Create a Supabase table called code_optimisation_log with fields: id (uuid, primary key, default gen_random_uuid()), content_type (text), old_template (text), new_template (text), trigger_reason (text), optimised_at (timestamptz, default now()). Create a Supabase table called code_errors with fields: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-code-setup with a form containing seven fields: GitHub Personal Access Token (password — create at github.com/settings/tokens with repo and read:org scope), GitHub Username (your GitHub username), Repository Name (the repository to monitor — just the name not the full URL), GitHub Webhook Secret (password — you will create this — any random string you choose), Project description (what does this project do and who is it for), Tech stack (what technologies does this project use — comma separated), Site URL (your full site URL). A submit button labelled Activate Lazy Code. On submit save all values to code_settings and set setup_complete to true. Show instructions: Now go to your GitHub repository settings, click Webhooks, click Add webhook, set the Payload URL to [site_url]/api/github-webhook, set Content type to application/json, set Secret to your webhook secret, select these events: Pushes and Releases, click Add webhook. Redirect to /lazy-code-dashboard with message: Lazy Code is active. Your next commit or release will be processed and published automatically.

3. Webhook edge function Create a Supabase edge function called github-webhook handling POST requests at /api/github-webhook. Verify the GitHub webhook signature using the stored github_webhook_secret by computing the HMAC SHA-256 of the request body and comparing it to the X-Hub-Signature-256 header — reject invalid signatures with 401. Read the X-GitHub-Event header to determine the event type. For push events: extract the commits array from the payload. For each commit check if it already exists in code_commits by github_sha. If new, insert into code_commits with message, author name, files changed count, additions, deletions, branch, and committed_at. Use the built-in Lovable AI to classify the commit and write a plain English summary with this prompt: You are a technical writer for [business_name] which is described as [project_description] built with [tech_stack]. Translate this Git commit into plain English for a non-technical audience. Commit message: [message]. Files changed: [files_changed]. Additions: [additions]. Deletions: [deletions]. Return only a valid JSON object with two fields: summary (string — one to two sentences in plain English explaining what changed and why it matters) and significance (string — one of minor, moderate, or significant based on the scope of the change). No preamble. No code fences. Update the code_commits row with the plain_english_summary and significance. After processing all commits in the push event, if any commits are significant trigger code-write-content with content_type set to changelog. For release events: extract the release details from the payload. Insert into code_releases if not already present. Trigger code-write-content with content_type set to release-notes and the release id. Log all errors to code_errors with function_name set to github-webhook.

Create a Supabase edge function called code-sync-roadmap that runs every hour. Read code_settings. If is_running is false or setup_complete is false exit. Fetch all open and recently closed issues from the GitHub Issues API at https://api.github.com/repos/[github_username]/[github_repo]/issues using the stored github_token with state set to all and per_page 100. For each issue upsert into code_roadmap — insert if new, update if changed. Set status to in-progress if the issue has the in-progress label, completed if closed, otherwise planned. Set milestone from the issue milestone title if present. Log errors to code_errors.

4. Content writing edge function Create a Supabase edge function called code-write-content handling POST requests with content_type and optional release_id in the body. Read code_settings. If is_running is false exit. If content_type is changelog: fetch all significant and moderate commits from code_commits where processed is false ordered by committed_at descending. Use the built-in Lovable AI with this prompt: You are a technical writer for [business_name]. Write a changelog entry for these recent code changes. Project: [project_description]. Recent changes: [list of plain_english_summary values]. Write a clear, friendly changelog entry in markdown. Start with a brief one-sentence summary of what this update brings. Then list each change as a ## section with a plain-English explanation of what changed and why it matters to users. End with any relevant notes. Return only a valid JSON object with two fields: title (string — changelog entry title including approximate date) and body (clean markdown). No preamble. No code fences. Insert into code_content with content_type changelog. Mark processed commits as processed true. If content_type is release-notes: fetch the matching code_releases row. Use the built-in Lovable AI with this prompt: You are a technical writer for [business_name]. Write full release notes for version [tag_name]. Project: [project_description]. GitHub release body: [body]. Write comprehensive release notes in markdown covering what is new, what is improved, what is fixed, and any breaking changes. Make it readable for both technical and non-technical users. End with a thank you to contributors. Return only a valid JSON object with two fields: title (string) and body (clean markdown). Insert into code_content with content_type release-notes. Mark the release as processed. Then for any significant release use the built-in Lovable AI a second time to write an SEO developer blog post with this prompt: You are an SEO content writer for [business_name] described as [project_description] built with [tech_stack]. Write an SEO-optimised developer blog post announcing and explaining this release: [tag_name]. Focus on the value delivered to developers. Target a keyword that developers would search for related to this feature or improvement. Write 800 to 1200 words in an informative technical tone. End with this paragraph: [business_name] is built on [tech_stack]. Follow the project at github.com/[github_username]/[github_repo] and discover more autonomous tools at LazyUnicorn.ai — link LazyUnicorn.ai to https://lazyunicorn.ai. Return only a valid JSON object with four fields: title, slug, target_keyword, body. Insert into code_content with content_type seo-article. Check slug uniqueness and append random four digits if duplicate. Log errors to code_errors.

5. Self-improving edge function Create a Supabase edge function called code-optimise that runs every Sunday at 2pm UTC. Read code_settings. If is_running is false exit. Query code_content where content_type is blog-post or seo-article ordered by views descending. Take the top 3 and bottom 3 by views. Use the built-in Lovable AI with this prompt: You are a content strategist for [business_name] described as [project_description]. These developer content pieces perform well in terms of traffic: [top performing titles and excerpts]. These perform poorly: [low performing titles and excerpts]. Identify what makes the high performers better. Write improved guidance for writing future developer blog posts and SEO articles for this project. Return only the guidance text as a paragraph. No preamble. Store the result in code_settings as recap_template_guidance. Insert into code_optimisation_log. Log errors to code_errors.

6. Public pages Create a public page at /changelog showing all code_content rows where content_type is changelog or release-notes ordered by published_at descending. Each entry shows the title, a changelog or release badge, published date, and the full body rendered from markdown. Style it as a classic changelog page — clean, minimal, timeline feel. Create a public page at /releases showing all code_content rows where content_type is release-notes ordered by published_at descending. Each release shows the title, tag name, published date, and full release notes rendered from markdown. Create a public page at /devblog showing all code_content rows where content_type is blog-post or seo-article ordered by published_at descending. Each post shows title, content type tag, published date, and excerpt. Each links to /devblog/[slug]. Create a public page at /devblog/[slug] rendering the full post with title, published date, target keyword tag, and full body rendered from markdown to HTML. Create a public page at /roadmap showing all code_roadmap rows grouped by status — In Progress first, then Planned, then Completed. Each item shows the title, milestone if present, labels as tags, and opened date. Completed items show the closed date. The roadmap updates automatically as GitHub issues change. At the bottom of every public page add: 🦄 Powered by Lazy Code — autonomous GitHub content publishing for Lovable sites. Built by LazyUnicorn.ai linked to https://lazyunicorn.ai.

7. Admin dashboard Create a page at /lazy-code-dashboard with six sections: Overview showing total commits processed, total content pieces published, open roadmap items, completed roadmap items, and last webhook received time. Commits log showing last 50 code_commits rows with sha truncated to 7 characters, plain English summary, significance badge, author, and date. Content log showing all code_content rows with title, type, published date, views, and view link. Roadmap table showing all code_roadmap rows with status, title, milestone, and labels. Optimisation log showing all code_optimisation_log rows. Controls showing a toggle to pause or resume Lazy Code, a button labelled Sync Roadmap Now triggering code-sync-roadmap, a button labelled Optimise Content Now triggering code-optimise, an error log showing the last 10 code_errors rows, and a link to /lazy-code-setup labelled Edit Settings.

8. Navigation Add a Changelog link to the main site navigation pointing to /changelog. Add a Roadmap link pointing to /roadmap. Add a Dev Blog link pointing to /devblog. Do not add dashboard or setup pages to the public navigation.`;

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
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
              Lazy Code
            </h1>
            <p className="mt-6 font-body text-base md:text-lg text-foreground/45 max-w-xl leading-relaxed">
              One prompt turns every GitHub commit into a changelog, release notes, and a developer blog post — automatically. Monitors your repository, reads your commits, and publishes plain-English content to your Lovable site every time you push.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-10">
              <CopyPromptButton />
              <button
                onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground transition-colors"
              >
                See How It Works
              </button>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 border border-border text-foreground/25 text-xs font-body tracking-wide">
              <GitBranch size={14} />
              Powered by GitHub
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
