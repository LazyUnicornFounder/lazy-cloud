import { ArrowRight } from "lucide-react";

export function DocsAdminOverview() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Admin Overview</h1>
      <p className="mb-10" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>The unified control panel for all your agents</p>

      <p className="mb-6 leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>
        The admin dashboard lives at <code className="px-1.5 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>/admin</code>. Install it by pasting the Lazy Admin prompt into Lovable.
      </p>

      <h2 id="three-column-layout" className="text-[20px] font-bold mb-4" style={{ color: "#f0ead6" }}>Three-column layout</h2>
      <ul className="list-disc pl-6 space-y-3 mb-8" style={{ fontSize: 15, color: "rgba(240,234,214,0.65)", lineHeight: 1.7 }}>
        <li><strong style={{ color: "#f0ead6" }}>Left sidebar</strong> — all 36 agents listed under their category. Each has a status dot: green (running), red (error), amber (needs setup), grey (not installed). Click any agent to open its detail page.</li>
        <li><strong style={{ color: "#f0ead6" }}>Main content</strong> — a table with 7 columns: Agent, Status, Category, Activity, Last Run, Next Run, Version. Rows are grouped: errors first, then running, then "NOT SET UP YET" (dimmed).</li>
        <li><strong style={{ color: "#f0ead6" }}>Right sidebar</strong> — quick stats: Posts Today, Agents Active, Revenue Today, Errors Today, Security Score.</li>
      </ul>

      <h2 id="agent-detail-page" className="text-[20px] font-bold mb-4" style={{ color: "#f0ead6" }}>Agent detail page</h2>
      <p className="mb-4 leading-relaxed" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>
        Each agent has a detail page at <code className="px-1.5 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>/admin/[slug]</code>:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-8" style={{ fontSize: 15, color: "rgba(240,234,214,0.65)", lineHeight: 1.7 }}>
        <li>4 key metrics in a stat grid</li>
        <li>Next scheduled action</li>
        <li>Last 3 activity entries</li>
        <li>Actions in the right sidebar (primary orange button + secondary ghost buttons)</li>
        <li>Inline editable settings</li>
        <li>Collapsible error log</li>
      </ul>

      <a href="/admin" className="inline-flex items-center gap-2 text-[14px] font-bold transition-colors hover:opacity-80" style={{ color: "#f0ead6" }}>
        Go to your dashboard <ArrowRight size={14} />
      </a>
    </div>
  );
}

export function DocsAdminSettings() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Admin Settings</h1>
      <p className="mb-10" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>Global configuration at /admin/settings</p>

      <Section id="site-settings" title="Site settings">
        <p>Brand name, URL, business description, support email. "Propagate to All Agents" button pushes these values to every agent's settings table at once.</p>
      </Section>

      <Section id="api-keys" title="API keys">
        <p>One section per installed service. Connection status badge, password input with show/hide, Test Connection button.</p>
      </Section>

      <Section id="weekly-schedule" title="Weekly schedule">
        <p>Read-only timeline of all cron jobs. Seven columns (one per day), colour-coded by category.</p>
      </Section>

      <Section id="version-status" title="Version status">
        <p>Table showing installed version vs latest for each agent. Orange "UPDATE" badge if behind. "Get Latest Prompt" link per row.</p>
      </Section>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-10">
      <h2 className="text-[20px] font-bold mb-4" style={{ color: "#f0ead6" }}>{title}</h2>
      <div style={{ fontSize: 15, color: "rgba(240,234,214,0.7)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}
