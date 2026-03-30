export default function DocsHowItWorks() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>How it works</h1>
      <p className="mb-10" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>Understanding the agent architecture</p>

      <Section id="every-agent-is-a-mega-prompt" title="Every agent is a mega-prompt">
        <p className="mb-4">Each LazyUnicorn agent is a self-contained prompt file. When you paste it into Lovable, it instructs Lovable to build:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4" style={{ color: "rgba(240,234,214,0.65)" }}>
          <li>A Supabase table to store the agent's settings and data</li>
          <li>A setup page at <code className="px-1 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>/lazy-[agent]-setup</code> where you configure it</li>
          <li>Edge functions that do the actual work (written in Deno)</li>
          <li>A cron schedule so the agent runs automatically</li>
          <li>A dashboard panel at <code className="px-1 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>/admin/[agent]</code> to monitor and control it</li>
        </ul>
      </Section>

      <Section id="agents-detect-each-other" title="Agents detect each other">
        <p>Agents share a common pattern — they all use a settings table with <code className="px-1 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>is_running</code> and <code className="px-1 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>setup_complete</code> columns. The Lazy Admin dashboard reads these tables to show you what's installed and what state it's in.</p>
      </Section>

      <Section id="updates" title="Updates">
        <p>When a prompt is updated, the version number in the file header increments. The admin checks <code className="px-1 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>lazyunicorn.ai/api/versions</code> and shows an orange banner when any of your agents have updates available. To update: copy the new prompt and paste it into Lovable with "rebuild from scratch."</p>
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
