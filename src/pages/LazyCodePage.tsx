import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, GitBranch, FileText, BookOpen, Map, MessageSquare, Search, Webhook, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `Add a complete autonomous GitHub content engine called Lazy Code to this project. It monitors your GitHub repository, reads commits and releases, and publishes changelogs, release notes, developer blog posts, and a public roadmap to your Lovable site — all automatically with no manual input required after setup.

1. Database Create a Supabase table called code_settings with fields: id (uuid, primary key, default gen_random_uuid()), github_token (text), github_repo (text), github_owner (text), site_url (text), business_name (text), content_niche (text), is_running (boolean, default true), setup_complete (boolean, default false), significance_threshold (integer, default 3), created_at (timestamptz, default now()). Create a Supabase table called code_commits with fields: id (uuid, primary key, default gen_random_uuid()), sha (text, unique), message (text), author (text), files_changed (integer), additions (integer), deletions (integer), committed_at (timestamptz), batch_id (text), processed (boolean, default false), created_at (timestamptz, default now()). Create a Supabase table called code_content with fields: id (uuid, primary key, default gen_random_uuid()), content_type (text — one of changelog, release-notes, dev-post, roadmap), title (text), slug (text, unique), body (text), target_keyword (text), published_at (timestamptz, default now()), status (text, default 'published'), views (integer, default 0), created_at (timestamptz, default now()). Create a Supabase table called code_releases with fields: id (uuid, primary key, default gen_random_uuid()), tag_name (text, unique), name (text), body (text), published_at (timestamptz), created_at (timestamptz, default now()). Create a Supabase table called code_errors with fields: id (uuid, primary key, default gen_random_uuid()), function_name (text), error_message (text), created_at (timestamptz, default now()).

2. Setup page Create a page at /lazy-code-setup with a form containing five fields: GitHub Personal Access Token (password — generate at github.com/settings/tokens with repo scope), Repository Owner (text — your GitHub username or organisation), Repository Name (text — the repository to monitor), Content niche (text — what does this project do), Site URL (your full site URL). A submit button labelled Activate Lazy Code. On submit save all values to code_settings and set setup_complete to true. Redirect to /lazy-code-dashboard.

3. Core edge functions Create a Supabase edge function called code-monitor that processes GitHub webhook events. On push events read the commits, batch them by 1-hour windows, and for each batch generate a changelog entry and if any commit touches more files than the significance_threshold generate a developer blog post. On release events generate full release notes. Use the built-in Lovable AI for all content generation. Log errors to code_errors.

4. Public pages Create a page at /changelog showing all code_content where content_type is changelog ordered by published_at descending. Create a page at /releases showing release notes. Create a page at /dev-blog showing developer blog posts. Create a page at /roadmap showing open GitHub issues as a public roadmap.

5. Self-improving Create a Supabase edge function called code-optimise that runs weekly. Analyses which developer blog posts drive the most traffic and adjusts the writing template to produce more of what performs. Logs changes to code_content.`;

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
