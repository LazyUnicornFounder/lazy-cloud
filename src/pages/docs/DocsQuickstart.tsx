import { Info } from "lucide-react";

export default function DocsQuickstart() {
  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Quickstart</h1>
      <p className="mb-8" style={{ fontSize: 14, color: "rgba(240,234,214,0.45)" }}>Install your first agent in 2 minutes</p>

      <Step id="step-1--open-lovable" n={1} title="Open Lovable">
        Go to <a href="https://lovable.dev" target="_blank" rel="noopener" className="underline" style={{ color: "#f0ead6" }}>lovable.dev</a> and create a new project. It comes with Supabase built in — no extra setup needed.
      </Step>

      <Step id="step-2--pick-an-agent" n={2} title="Pick an agent">
        Good first agents: <strong>Lazy Blogger</strong> (publishes blog posts on autopilot), <strong>Lazy SEO</strong> (finds keywords and writes posts), <strong>Lazy Admin</strong> (dashboard to manage everything).
      </Step>

      <Step id="step-3--get-the-prompt" n={3} title="Get the prompt">
        Open the <a href="https://github.com/lazyunicornfounder/LazyUnicorn" target="_blank" rel="noopener" className="underline" style={{ color: "#f0ead6" }}>GitHub repo</a>, find the prompt file for your agent (e.g. <code className="px-1.5 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>prompts/lazy-blogger.md</code>), and copy the full contents.
      </Step>

      <Step id="step-4--paste-into-lovable" n={4} title="Paste into Lovable">
        Paste the prompt into the Lovable chat. Lovable builds everything automatically in 1–3 minutes.
      </Step>

      <Step id="step-5--complete-setup" n={5} title="Complete setup">
        Go to <code className="px-1.5 py-0.5 rounded text-[13px]" style={{ background: "rgba(240,234,214,0.08)" }}>/lazy-[agent-name]-setup</code> in your app and fill in any required settings. Most agents need no API keys — just hit Save.
      </Step>

      <Step id="step-6--its-running" n={6} title="It's running">
        The agent starts on its schedule automatically. Install Lazy Admin to see it in your dashboard.
      </Step>

      {/* Note box */}
      <div className="mt-8 p-4 rounded-lg flex gap-3" style={{ background: "rgba(240,234,214,0.04)", border: "1px solid rgba(240,234,214,0.08)" }}>
        <Info size={16} className="flex-shrink-0 mt-0.5" style={{ color: "rgba(240,234,214,0.4)" }} />
        <p style={{ fontSize: 13, color: "rgba(240,234,214,0.6)", lineHeight: 1.6 }}>
          If rebuilding an existing page, start your message with: <strong style={{ color: "#f0ead6" }}>"Delete everything at /[page] and rebuild from scratch using this prompt:"</strong>
        </p>
      </div>
    </div>
  );
}

function Step({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-[18px] font-bold mb-3 flex items-center gap-3" style={{ color: "#f0ead6" }}>
        <span className="flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold" style={{ background: "rgba(234,88,12,0.15)", color: "#ea580c" }}>{n}</span>
        {title}
      </h2>
      <p className="leading-relaxed pl-10" style={{ fontSize: 15, color: "rgba(240,234,214,0.7)" }}>{children}</p>
    </div>
  );
}
