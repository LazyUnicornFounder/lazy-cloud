import { useState, useEffect } from "react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";

const sections = [
  { id: "why-updated", title: "Why prompts get updated" },
  { id: "upgrade-complexity", title: "Understanding upgrade complexity" },
  { id: "general-process", title: "The general upgrade process" },
  { id: "drop-in", title: "Drop-in upgrades" },
  { id: "setup-required", title: "Setup-required upgrades" },
  { id: "breaking", title: "Breaking upgrades" },
  { id: "upgrading-lazy-run", title: "Upgrading Lazy Run" },
  { id: "upgrading-admin", title: "Upgrading the admin dashboard" },
  { id: "upgrading-agents", title: "Upgrading Lazy Agents" },
  { id: "common-issues", title: "Common issues after upgrading" },
  { id: "staying-up-to-date", title: "Staying up to date" },
  { id: "getting-help", title: "Getting help" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-32">
      <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight mb-6">{title}</h2>
      <div className="font-body text-sm leading-relaxed text-foreground/60 space-y-4">{children}</div>
    </section>
  );
}

export default function UpgradeGuidePage() {
  const [activeSection, setActiveSection] = useState("");
  const [tocOpen, setTocOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px" }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toc = (
    <nav className="space-y-1">
      {sections.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={() => setTocOpen(false)}
          className={`block font-body text-[13px] tracking-[0.08em] py-1.5 transition-colors ${
            activeSection === s.id ? "text-[#c8a961]" : "text-foreground/70 hover:text-foreground/50"
          }`}
        >
          {s.title}
        </a>
      ))}
    </nav>
  );

  return (
    <>
      <SEO title="How to Upgrade Your Prompts" description="A practical guide to keeping your Lazy agents up to date without breaking your site." />
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">How to upgrade your Lazy prompts</h1>
            <p className="font-body text-foreground/50 text-lg max-w-2xl">
              A practical guide to keeping your Lazy agents up to date without breaking your site.
            </p>
          </div>

          {/* Mobile TOC */}
          <div className="lg:hidden mb-8">
            <button
              onClick={() => setTocOpen(!tocOpen)}
              className="font-body text-[13px] tracking-[0.12em] uppercase text-foreground/65 border border-border px-4 py-2 w-full text-left"
            >
              On this page ▾
            </button>
            {tocOpen && <div className="border border-t-0 border-border p-4">{toc}</div>}
          </div>

          <div className="flex gap-12">
            {/* Desktop TOC */}
            <aside className="hidden lg:block w-48 flex-shrink-0">
              <div className="sticky top-32">
                <p className="font-display text-[14px] tracking-[0.15em] uppercase text-foreground/60 mb-3">On this page</p>
                {toc}
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <Section id="why-updated" title="Why prompts get updated">
                <p>Lazy prompts are updated for four reasons.</p>
                <p><strong className="text-foreground/80">Major updates</strong> add new agents, new features, or significant changes to how an agent works. A major update to Lazy Pay might add abandoned checkout recovery. A major update to Lazy Run might add three new agents to the selection screen. These updates require re-running the prompt in your Lovable project.</p>
                <p><strong className="text-foreground/80">Minor updates</strong> fix small issues, improve AI prompt quality, or add fields to existing database tables. A minor update to Lazy SEO might add a source field to the keywords table. These are usually drop-in — re-run the prompt and Lovable adds what is missing without removing what exists.</p>
                <p><strong className="text-foreground/80">Fixes</strong> address specific bugs. A fix might correct a function name conflict or a missing field in a table. These are always drop-in.</p>
                <p><strong className="text-foreground/80">Security updates</strong> address vulnerabilities — typically moving API keys from database tables to secrets. These require specific steps and should be applied promptly.</p>
                <p>You can always see what changed between versions on the <a href="/changelog" className="text-[#c8a961] hover:underline">Changelog page</a>.</p>
              </Section>

              <Section id="upgrade-complexity" title="Understanding upgrade complexity">
                <p>Every release on the changelog is labelled with one of three upgrade complexities.</p>
                <p><strong className="text-foreground/80">Drop-in</strong> means you can paste the new prompt into your Lovable project and it will add or update what is needed without breaking anything. Your existing data stays intact. Your existing edge functions get updated. Your existing tables get new fields if needed.</p>
                <p><strong className="text-foreground/80">Setup-required</strong> means the update is significant enough that Lovable will ask you questions during setup or requires you to revisit the setup page to configure new options. Your data stays intact but you need to go through the setup flow again.</p>
                <p><strong className="text-foreground/80">Breaking</strong> means something fundamental changed — a table name, a function name, or a data structure — and applying the update without following the upgrade instructions will break your site. Always read the upgrade instructions before applying a breaking update.</p>
              </Section>

              <Section id="general-process" title="The general upgrade process">
                <p>Before upgrading anything, do three things.</p>
                <p><strong className="text-foreground/80">First</strong>, note your current version. The version number is at the top of every Lazy prompt as a comment in square brackets — for example <code className="text-[13px] bg-foreground/5 px-1.5 py-0.5">[Lazy Blogger Prompt — v0.0.3 — LazyUnicorn.ai]</code>. If you do not know which version you installed, check the <a href="/changelog" className="text-[#c8a961] hover:underline">/changelog</a> page and use the Version Checker to find out.</p>
                <p><strong className="text-foreground/80">Second</strong>, read the changelog entry for the new version. Understand what changed and check the upgrade complexity. If it is drop-in you can proceed immediately. If it is setup-required set aside five minutes. If it is breaking read the full upgrade instructions first.</p>
                <p><strong className="text-foreground/80">Third</strong>, download the latest prompt from the changelog. Never paste a prompt you copied weeks ago — always get the latest file.</p>
              </Section>

              <Section id="drop-in" title="Drop-in upgrades — step by step">
                <p>A drop-in upgrade is the simplest case.</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>Open your Lovable project.</li>
                  <li>Paste the new prompt into the Lovable chat.</li>
                  <li>Lovable will detect what already exists and add only what is missing or different. It will not delete your existing data, posts, or settings.</li>
                  <li>Watch the build. If Lovable asks you a question answer it. If Lovable encounters a conflict it will usually offer to skip or merge — choose merge.</li>
                  <li>After the build completes go to your site and verify: the public pages still work, the admin still loads, and the agent is still running.</li>
                </ol>
                <p>If anything breaks, open the Lovable chat and type: <em>"The [agent name] stopped working after upgrading. Please check for issues and fix them."</em> Lovable will diagnose and repair.</p>
              </Section>

              <Section id="setup-required" title="Setup-required upgrades — step by step">
                <p>A setup-required upgrade means new configuration options were added that require your input.</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>Paste the new prompt into Lovable as described in the drop-in process above.</li>
                  <li>After the build completes visit the setup page for that agent — /lazy-[agent]-setup.</li>
                  <li>You will see new fields that did not exist before. Fill them in. Your existing settings are pre-filled from the database, so you only need to complete the new fields.</li>
                  <li>Save the settings. The agent will re-initialise with the updated configuration.</li>
                  <li>Verify the agent is running from /admin.</li>
                </ol>
                <p><strong className="text-foreground/80">Example:</strong> Lazy Pay v0.0.3 moved Stripe API keys from the database to Supabase secrets. After pasting the new prompt you need to visit /lazy-pay-setup, re-enter your Stripe keys (they will now be stored securely as secrets), and save.</p>
              </Section>

              <Section id="breaking" title="Breaking upgrades — step by step">
                <p>A breaking upgrade means a fundamental change was made. Follow these steps exactly.</p>
                <ol className="list-decimal list-inside space-y-2 pl-2">
                  <li>Read the full upgrade instructions on the changelog entry for this version. Do not skip this.</li>
                  <li>Back up your data if it matters. Export any database tables that contain content you cannot recreate — blog posts, SEO articles, customer data, transaction history.</li>
                  <li>Follow the specific instructions in the changelog entry. These are written for the exact breaking change and will tell you precisely what to do before, during, and after pasting the new prompt.</li>
                  <li>Paste the new prompt into Lovable.</li>
                  <li>If the instructions say to run a migration SQL statement, do that before or after pasting the prompt as directed.</li>
                  <li>Verify everything works end to end — public pages, setup page, admin panel, edge functions.</li>
                </ol>
                <p>Breaking upgrades are rare. Most version changes are drop-in or setup-required.</p>
              </Section>

              <Section id="upgrading-lazy-run" title="Upgrading Lazy Run specifically">
                <p>Lazy Run is the most complex to upgrade because it manages all other agents. When Lazy Run gets a major update it usually means new agents were added to the agent selection screen.</p>
                <p>If you upgrade Lazy Run and new agents appear that you want to install, you have two options.</p>
                <p><strong className="text-foreground/80">Option A:</strong> Re-run the Lazy Run setup at /lazy-run-setup, go through all five steps again, and add the new agents. Your existing agent settings and data are preserved — the setup only adds what is new.</p>
                <p><strong className="text-foreground/80">Option B:</strong> Install the new agents individually by pasting their individual prompts into Lovable. Each agent installs independently. Lazy Run will detect them on its next orchestrator run.</p>
                <p>Option B is simpler for adding one or two new agents. Option A is better if multiple new agents were added in the update.</p>
              </Section>

              <Section id="upgrading-admin" title="Upgrading the admin dashboard">
                <p>The Lazy Admin dashboard at /admin is built by pasting the LazyUnicorn Admin Dashboard prompt. When a new version of the admin prompt is released:</p>
                <p>Paste the new admin prompt into Lovable. It replaces the existing /admin routes entirely. Your agent data is unaffected — the admin only reads from your existing tables, it does not change them.</p>
                <p>The new admin will auto-detect all your installed agents as before. You do not need to configure anything after pasting. Check that /admin loads correctly and that your agents appear in the sidebar.</p>
              </Section>

              <Section id="common-issues" title="Common issues after upgrading">
                <div className="space-y-6">
                  <div>
                    <p className="text-foreground/80 font-semibold mb-1">My site looks broken after upgrading.</p>
                    <p>Open the Lovable chat and type: <em>"The site broke after I pasted the [agent] prompt. Please diagnose and fix."</em> Lovable will identify what went wrong.</p>
                  </div>
                  <div>
                    <p className="text-foreground/80 font-semibold mb-1">My agent stopped running after upgrading.</p>
                    <p>Go to /admin and check if the agent's is_running toggle is still on. Sometimes a new setup page resets it to false. Toggle it back on.</p>
                  </div>
                  <div>
                    <p className="text-foreground/80 font-semibold mb-1">A new field I expected does not appear in my admin.</p>
                    <p>The admin auto-detects from your database tables. If a new field was added but your existing table does not have it yet, Lovable may need to run a migration. Open the Lovable chat and type: <em>"Please add the [field name] field to the [table name] table."</em></p>
                  </div>
                  <div>
                    <p className="text-foreground/80 font-semibold mb-1">My API keys stopped working after upgrading.</p>
                    <p>Some updates move API keys from database tables to Supabase secrets. Go to /admin/settings and re-enter the keys for any service showing Not Connected.</p>
                  </div>
                  <div>
                    <p className="text-foreground/80 font-semibold mb-1">I see a duplicate setup page.</p>
                    <p>If you previously had /lazy-blogger-dashboard and now also have /admin/blogger, the old page is harmless but redundant. Open Lovable chat and type: <em>"Please remove the old /lazy-blogger-dashboard page — it has been replaced by /admin/blogger."</em></p>
                  </div>
                </div>
              </Section>

              <Section id="upgrading-agents" title="Upgrading Lazy Agents">
                <p>Lazy Agents (Watch, Fix, Build, Intel, Repurpose, Trend, and Churn) are upgraded the same way as other agents — copy the latest prompt and paste it into Lovable. Because these agents interact with your GitHub repo and AI models, pay attention to these specifics:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>GITHUB_TOKEN scope</strong> — newer agent versions may require additional GitHub token permissions (e.g. <code>issues:write</code> or <code>pull_requests:write</code>). Check the changelog for scope changes.</li>
                  <li><strong>Agent settings table</strong> — agent upgrades may add new columns to the <code>agent_settings</code> table. Lovable handles migrations automatically, but verify your settings are preserved after upgrading.</li>
                  <li><strong>Edge function names</strong> — agent functions follow the <code>agent-*</code> naming convention. If you customised any agent edge functions, back up your changes before upgrading.</li>
                  <li><strong>Run history</strong> — agent run logs in <code>agent_runs</code> are preserved across upgrades. You will not lose historical data.</li>
                </ul>
                <p>After upgrading, visit <code>/admin/agents</code> to verify all four agents show their updated version and are running correctly.</p>
              </Section>

              <Section id="staying-up-to-date" title="Staying up to date">
                <p>The easiest way to know when prompts are updated is to subscribe to the <a href="/changelog" className="text-[#c8a961] hover:underline">changelog RSS feed</a>. Add it to your RSS reader and you will be notified whenever a new version of any prompt is released.</p>
                <p>You do not need to update every time a new version is released. Minor updates and fixes can wait. Major updates and security updates should be applied promptly.</p>
                <p>Check the changelog before starting a new project or before showing your site to investors or enterprise customers. Running the latest prompts ensures your site benefits from all improvements and security fixes.</p>
              </Section>

              <Section id="getting-help" title="Getting help">
                <p>If you get stuck during an upgrade open the Lovable chat and describe the issue. Lovable can diagnose most upgrade problems automatically.</p>
                <p>For complex issues, include: the agent name, the version you upgraded from, the version you upgraded to, and any error messages you see. This helps Lovable resolve the issue faster.</p>
              </Section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
