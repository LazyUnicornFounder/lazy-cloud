import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";

export default function AdminVersionsPage() {
  const { states } = useAdminContext();

  const { data: releases } = useQuery({
    queryKey: ["admin-versions-releases"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("prompt_releases").select("engine_name, version").eq("published", true).order("created_at", { ascending: false });
        if (!data) return {};
        const latest: Record<string, string> = {};
        for (const r of data) { if (!latest[r.engine_name]) latest[r.engine_name] = r.version; }
        return latest;
      } catch { return {}; }
    },
  });

  const latestVersions = releases || {};
  const installed = AGENTS.filter((a) => states[a.key]?.installed);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Versions</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Engine version status and update availability.</p>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
        <div className="grid grid-cols-[1fr_100px_100px_140px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
          <div>Engine</div><div>Installed</div><div>Latest</div><div>Status</div>
        </div>
        {installed.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No engines installed yet.</div>
        ) : (
          installed.map((agent) => {
            const state = states[agent.key];
            const installedVersion = state?.promptVersion || "unknown";
            const latestVersion = latestVersions[agent.key] || latestVersions[agent.slug] || null;
            const isUpToDate = !latestVersion || installedVersion === latestVersion;
            const statusLabel = !latestVersion ? "Unknown" : isUpToDate ? "Up to date" : "Update available";
            const statusColor = !latestVersion ? "var(--admin-text-tertiary)" : isUpToDate ? "var(--admin-success)" : "var(--admin-warning)";
            const statusBg = !latestVersion ? "var(--admin-bg-hover)" : isUpToDate ? "var(--admin-success-muted)" : "var(--admin-warning-muted)";

            return (
              <div key={agent.key} className="grid grid-cols-[1fr_100px_100px_140px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <div className="font-medium" style={{ color: "var(--admin-text)" }}>{agent.label}</div>
                <div style={{ color: "var(--admin-text-secondary)" }}>v{installedVersion}</div>
                <div style={{ color: "var(--admin-text-secondary)" }}>{latestVersion ? `v${latestVersion}` : "—"}</div>
                <div><span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: statusBg, color: statusColor }}>{statusLabel}</span></div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
