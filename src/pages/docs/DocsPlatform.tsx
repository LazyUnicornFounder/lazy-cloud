function PlatformPage({ name, tagline, whatItDoes, howToUse }: { name: string; tagline: string; whatItDoes: string; howToUse: string }) {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>{name}</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>{tagline}</p>

      <h2 id="what-it-does" className="text-[20px] font-bold mb-3" style={{ color: "#f0ead6" }}>What it does</h2>
      <p className="mb-8 leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>{whatItDoes}</p>

      <h2 id="how-to-use-it" className="text-[20px] font-bold mb-3" style={{ color: "#f0ead6" }}>How to use it</h2>
      <p className="leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>{howToUse}</p>
    </div>
  );
}

export function DocsLaunch() {
  return <PlatformPage name="Lazy Launch" tagline="Setup wizard that installs your entire stack from a single prompt."
    whatItDoes="Lazy Launch is the onboarding agent. Describe your business, pick the agents you want, and paste a single prompt into Lovable. It configures all database tables, edge functions, cron schedules, and dashboard panels in one go."
    howToUse="Go to /lazy-launch, fill in your business details, select agents, and copy the generated mega-prompt. Paste it into Lovable and everything builds automatically in 2–5 minutes." />;
}

export function DocsCloud() {
  return <PlatformPage name="Lazy Cloud" tagline="Managed hosting and deployment for your Lovable project."
    whatItDoes="Lazy Cloud handles builds, previews, and production deploys automatically. It connects your Lovable project to a managed backend with zero configuration."
    howToUse="Lazy Cloud is enabled automatically when you create a project through Lovable. No setup required — your backend is ready from the start." />;
}

export function DocsRun() {
  return <PlatformPage name="Lazy Run" tagline="Cron scheduler that triggers all agent jobs on their configured schedule."
    whatItDoes="Lazy Run is the heartbeat of the stack. It checks every agent's schedule and triggers their edge functions at the right time. Without it, agents don't run automatically."
    howToUse="Install the Lazy Run prompt into your project. It creates a master cron function that polls all agent settings tables and invokes their jobs based on the configured frequency." />;
}

export function DocsAdmin() {
  return <PlatformPage name="Lazy Admin" tagline="Unified dashboard to monitor, control, and configure every agent."
    whatItDoes="Lazy Admin gives you a three-column dashboard at /admin. It auto-detects which agents are installed by checking for their settings tables, shows their status, recent activity, errors, and lets you trigger actions manually."
    howToUse="Paste the Lazy Admin prompt into Lovable. It builds the entire dashboard. Navigate to /admin to see all your agents in one place. Click any agent to manage it." />;
}

export function DocsWaitlist() {
  return <PlatformPage name="Lazy Waitlist" tagline="Pre-launch waitlist with referral tracking and welcome emails."
    whatItDoes="Lazy Waitlist creates a public signup page, tracks referral codes, sends welcome and follow-up emails, and shows a live counter of signups. It also notifies you via Slack when someone joins."
    howToUse="Install the prompt, then go to /lazy-waitlist-setup to configure your waitlist name, headline, and email templates. Your waitlist page goes live at /waitlist." />;
}
