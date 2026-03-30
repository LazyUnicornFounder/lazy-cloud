import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminWrite } from "@/lib/adminWrite";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";

export default function AdminSettingsPage() {
  const { states, refetch } = useAdminContext();
  const [siteUrl, setSiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [propagating, setPropagating] = useState(false);

  const handlePropagate = async () => {
    setPropagating(true);
    const installed = AGENTS.filter((a) => states[a.key]?.installed && states[a.key]?.setupComplete);
    for (const a of installed) {
      try {
        const data: Record<string, any> = {};
        if (siteUrl) data.site_url = siteUrl;
        if (brandName) data.brand_name = brandName;
        if (Object.keys(data).length > 0) {
          await adminWrite({ table: a.settingsTable, operation: "update", data, match: { id: states[a.key]?.settings?.id } });
        }
      } catch {}
    }
    toast.success("Settings propagated to all engines");
    setPropagating(false);
    refetch();
  };

  const installed = AGENTS.filter((a) => states[a.key]?.installed);
  const runningCount = installed.filter((a) => states[a.key]?.isRunning).length;

  const handlePauseAll = async () => {
    for (const a of installed) {
      try {
        await adminWrite({ table: a.settingsTable, operation: "update", data: { [a.runField]: false }, match: { id: states[a.key]?.settings?.id } });
      } catch {}
    }
    toast.success("All engines paused");
    refetch();
  };

  const inputStyle = { background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border-strong)", color: "var(--admin-text)" };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Settings</h1>
      <p className="text-sm mb-8" style={{ color: "var(--admin-text-tertiary)" }}>Global configuration for all engines.</p>

      <div className="mb-10">
        <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Site settings</h3>
        <div className="mb-4">
          <label className="text-sm block mb-1.5" style={{ color: "var(--admin-text-secondary)" }}>Site URL</label>
          <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://yourdomain.com"
            className="w-full max-w-md px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40" style={inputStyle} />
        </div>
        <div className="mb-6">
          <label className="text-sm block mb-1.5" style={{ color: "var(--admin-text-secondary)" }}>Brand name</label>
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Your Brand"
            className="w-full max-w-md px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40" style={inputStyle} />
        </div>
        <button onClick={handlePropagate} disabled={propagating}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:brightness-110 flex items-center gap-2"
          style={{ background: "var(--admin-accent)", color: "#fff" }}>
          {propagating && <Loader2 size={14} className="animate-spin" />}
          Propagate to all engines
        </button>
      </div>

      <div className="p-5 rounded-lg" style={{ border: "1px solid rgba(239,68,68,0.2)", background: "var(--admin-error-muted)" }}>
        <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--admin-error)" }}>Danger zone</h3>
        <button onClick={handlePauseAll}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:brightness-110"
          style={{ background: "rgba(239,68,68,0.15)", color: "var(--admin-error)", border: "1px solid rgba(239,68,68,0.2)" }}>
          Pause all engines
        </button>
        <p className="mt-2 text-xs" style={{ color: "var(--admin-text-tertiary)" }}>
          This will set is_running to false on every installed engine.
        </p>
      </div>
    </div>
  );
}
