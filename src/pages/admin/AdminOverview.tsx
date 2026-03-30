import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, type AgentCategory } from "./agentRegistry";
import { useOverviewStats } from "./hooks/useOverviewStats";

const CATEGORY_COLORS: Record<AgentCategory, string> = {
  Content: "var(--admin-accent)",
  Commerce: "var(--admin-success)",
  Media: "#8b5cf6",
  Dev: "#f97316",
  Monitor: "var(--admin-error)",
  Intelligence: "var(--admin-warning)",
};

type RunStatus = "completed" | "failed" | "running" | "never";

function getRunStatus(state: any): RunStatus {
  if (!state?.installed) return "never";
  if (state.hasRecentError) return "failed";
  if (state.isRunning) return "running";
  return "completed";
}

const STATUS_STYLE: Record<RunStatus, { label: string; dotColor: string }> = {
  completed: { label: "Idle", dotColor: "var(--admin-text-tertiary)" },
  failed: { label: "Error", dotColor: "var(--admin-error)" },
  running: { label: "Running", dotColor: "var(--admin-success)" },
  never: { label: "Never run", dotColor: "var(--admin-text-tertiary)" },
};

export default function AdminOverview() {
  const { states, refetch } = useAdminContext();
  const { data: stats } = useOverviewStats();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const installed = AGENTS.filter((a) => states[a.key]?.installed);
  const activeCount = installed.filter((a) => states[a.key]?.isRunning).length;

  const runAction = async (fn: string) => {
    if (!fn) return;
    setActionLoading(fn);
    try {
      await supabase.functions.invoke(fn);
      refetch();
    } catch {}
    setActionLoading(null);
  };

  const statCards = [
    { label: "Content today", value: stats?.postsToday ?? 0 },
    { label: "Active engines", value: activeCount },
    { label: "Errors (24h)", value: stats?.errorsToday ?? 0, isError: (stats?.errorsToday || 0) > 0 },
    { label: "Total installs", value: stats?.installsByAgent ? Object.values(stats.installsByAgent).reduce((a: number, b: number) => a + b, 0) : 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Overview</h1>
      <p className="text-sm mb-8" style={{ color: "var(--admin-text-tertiary)" }}>System status and quick actions.</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {statCards.map((s, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <div className="text-xs mb-1.5" style={{ color: "var(--admin-text-tertiary)" }}>{s.label}</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: s.isError ? "var(--admin-error)" : "var(--admin-text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Engine cards */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--admin-text-tertiary)" }}>Installed Engines</h2>
        <span className="text-xs" style={{ color: "var(--admin-text-tertiary)" }}>{installed.length} engines</span>
      </div>

      {installed.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No engines detected yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {installed.map((agent) => {
            const state = states[agent.key];
            const status = getRunStatus(state);
            const sty = STATUS_STYLE[status];
            const catColor = CATEGORY_COLORS[agent.category] || "var(--admin-accent)";
            const primaryAction = agent.actions.find((a) => a.primary);

            return (
              <div
                key={agent.key}
                className="p-4 rounded-lg cursor-pointer transition-colors group"
                onClick={() => navigate(`/admin/${agent.slug}`)}
                style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-border-strong)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{agent.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: `${catColor}15`, color: catColor }}>{agent.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sty.dotColor }} />
                    <span className="text-[11px]" style={{ color: "var(--admin-text-tertiary)" }}>{sty.label}</span>
                  </div>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--admin-text-tertiary)" }}>{agent.subtitle}</p>
                {primaryAction && (
                  <button
                    onClick={(e) => { e.stopPropagation(); runAction(primaryAction.fn); }}
                    disabled={!!actionLoading}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all hover:brightness-110"
                    style={{ background: "var(--admin-accent)", color: "#fff" }}
                  >
                    {actionLoading === primaryAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                    Run
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
