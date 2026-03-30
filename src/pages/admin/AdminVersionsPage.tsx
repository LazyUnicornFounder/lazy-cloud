import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";

export default function AdminVersionsPage() {
  const { states } = useAdminContext();

  // Get latest versions from prompt_releases
  const { data: releases } = useQuery({
    queryKey: ["admin-versions-releases"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("prompt_releases").select("engine_name, version").eq("published", true).order("created_at", { ascending: false });
        if (!data) return {};
        const latest: Record<string, string> = {};
        for (const r of data) {
          if (!latest[r.engine_name]) latest[r.engine_name] = r.version;
        }
        return latest;
      } catch { return {}; }
    },
  });

  const latestVersions = releases || {};

  const installed = AGENTS.filter((a) => states[a.key]?.installed);

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Versions</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Engine version status and update availability.</p>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
        <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
          <div style={{ flex: 2 }}>Engine</div>
          <div style={{ flex: 1 }}>Installed</div>
          <div style={{ flex: 1 }}>Latest</div>
          <div style={{ flex: 1 }}>Status</div>
        </div>

        {installed.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No engines installed yet.</div>
        ) : (
          installed.map((agent) => {
            const state = states[agent.key];
            const installedVersion = state?.promptVersion || "unknown";
            const latestVersion = latestVersions[agent.key] || latestVersions[agent.slug] || null;
            const isUpToDate = !latestVersion || installedVersion === latestVersion;
            const statusLabel = !latestVersion ? "UNKNOWN" : isUpToDate ? "UP TO DATE" : "UPDATE AVAILABLE";
            const statusColor = !latestVersion ? "rgba(240,234,214,0.3)" : isUpToDate ? "#4ade80" : "#c9a84c";
            const statusBg = !latestVersion ? "rgba(240,234,214,0.05)" : isUpToDate ? "rgba(74,222,128,0.1)" : "rgba(201,168,76,0.15)";

            return (
              <div key={agent.key} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
                <div style={{ flex: 2, color: "#f0ead6", fontWeight: 600 }}>{agent.label}</div>
                <div style={{ flex: 1, color: "rgba(240,234,214,0.5)" }}>v{installedVersion}</div>
                <div style={{ flex: 1, color: "rgba(240,234,214,0.5)" }}>{latestVersion ? `v${latestVersion}` : "—"}</div>
                <div style={{ flex: 1 }}>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: statusBg, color: statusColor }}>{statusLabel}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
