import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, type AgentCategory } from "./agentRegistry";
import { useOverviewStats } from "./hooks/useOverviewStats";

const CATEGORY_COLORS: Record<AgentCategory, string> = {
  Content: "#c9a84c",
  Commerce: "#4ade80",
  Media: "#60a5fa",
  Dev: "#a78bfa",
  Monitor: "#f87171",
  Intelligence: "#f97316",
};

type RunStatus = "completed" | "failed" | "running" | "never";

function getRunStatus(state: any): RunStatus {
  if (!state?.installed) return "never";
  if (state.hasRecentError) return "failed";
  if (state.isRunning) return "running";
  return "completed";
}

const STATUS_STYLE: Record<RunStatus, { label: string; bg: string; text: string }> = {
  completed: { label: "COMPLETED", bg: "rgba(74,222,128,0.1)", text: "#4ade80" },
  failed: { label: "FAILED", bg: "rgba(248,113,113,0.12)", text: "#f87171" },
  running: { label: "RUNNING", bg: "rgba(251,191,36,0.12)", text: "#fbbf24" },
  never: { label: "NEVER RUN", bg: "rgba(240,234,214,0.05)", text: "rgba(240,234,214,0.3)" },
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

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-8" style={{ color: "#f0ead6" }}>Overview</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Content Today", value: stats?.postsToday ?? 0, color: "#c9a84c" },
          { label: "Active Engines", value: activeCount, color: "#4ade80" },
          { label: "Errors 24h", value: stats?.errorsToday ?? 0, color: (stats?.errorsToday || 0) > 0 ? "#f87171" : "#f0ead6" },
          { label: "Total Installs", value: stats?.installsByAgent ? Object.values(stats.installsByAgent).reduce((a: number, b: number) => a + b, 0) : 0, color: "#60a5fa" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>{s.label}</div>
            <div className="text-[24px] font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Engine cards */}
      <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase mb-4" style={{ color: "rgba(240,234,214,0.3)" }}>Installed Engines</h2>
      {installed.length === 0 ? (
        <p style={{ fontSize: 14, color: "rgba(240,234,214,0.4)" }}>No engines detected. Install an engine and its settings table will appear here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {installed.map((agent) => {
            const state = states[agent.key];
            const status = getRunStatus(state);
            const sty = STATUS_STYLE[status];
            const catColor = CATEGORY_COLORS[agent.category] || "#c9a84c";
            const primaryAction = agent.actions.find((a) => a.primary);

            return (
              <div key={agent.key} className="p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => navigate(`/admin/${agent.slug}`)}
                style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold" style={{ color: "#f0ead6" }}>{agent.label}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: `${catColor}20`, color: catColor }}>{agent.category}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: sty.bg, color: sty.text }}>{sty.label}</span>
                </div>
                <p className="text-[12px] mb-3" style={{ color: "rgba(240,234,214,0.4)" }}>{agent.subtitle}</p>
                {primaryAction && (
                  <button
                    onClick={(e) => { e.stopPropagation(); runAction(primaryAction.fn); }}
                    disabled={!!actionLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-[0.06em] transition-opacity hover:opacity-90"
                    style={{ background: "#c9a84c", color: "#0a0a08" }}>
                    {actionLoading === primaryAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                    Run Now
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
