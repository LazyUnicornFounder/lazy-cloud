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
          await adminWrite({
            table: a.settingsTable,
            operation: "update",
            data,
            match: { id: states[a.key]?.settings?.id },
          });
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
        await adminWrite({
          table: a.settingsTable,
          operation: "update",
          data: { [a.runField]: false },
          match: { id: states[a.key]?.settings?.id },
        });
      } catch {}
    }
    toast.success("All engines paused");
    refetch();
  };

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-8" style={{ color: "#f0ead6" }}>Settings</h1>

      {/* Site settings */}
      <div className="mb-10">
        <h3 className="mb-4" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
          SITE SETTINGS
        </h3>
        <div className="mb-4">
          <label style={{ fontSize: 12, color: "rgba(240,234,214,0.5)", display: "block", marginBottom: 6 }}>Site URL</label>
          <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)}
            placeholder="https://yourdomain.com"
            className="w-full max-w-md px-3 py-2 rounded-md text-[13px] font-display"
            style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6" }} />
        </div>
        <div className="mb-6">
          <label style={{ fontSize: 12, color: "rgba(240,234,214,0.5)", display: "block", marginBottom: 6 }}>Brand Name</label>
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)}
            placeholder="Your Brand"
            className="w-full max-w-md px-3 py-2 rounded-md text-[13px] font-display"
            style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6" }} />
        </div>
        <button onClick={handlePropagate} disabled={propagating}
          className="px-5 py-2.5 rounded-md text-[12px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-90 flex items-center gap-2"
          style={{ background: "#c9a84c", color: "#0a0a08" }}>
          {propagating && <Loader2 size={14} className="animate-spin" />}
          PROPAGATE TO ALL ENGINES
        </button>
      </div>

      {/* Danger zone */}
      <div className="mt-10 p-5 rounded-lg" style={{ border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.03)" }}>
        <h3 className="mb-4" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f87171" }}>
          DANGER ZONE
        </h3>
        <button onClick={handlePauseAll}
          className="px-4 py-2 rounded-md text-[12px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-90"
          style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
          PAUSE ALL ENGINES
        </button>
        <p className="mt-2" style={{ fontSize: 12, color: "rgba(240,234,214,0.4)" }}>
          This will set is_running to false on every installed engine's settings table.
        </p>
      </div>
    </div>
  );
}
