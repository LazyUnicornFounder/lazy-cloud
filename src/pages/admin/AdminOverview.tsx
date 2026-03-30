import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { useOverviewStats } from "./hooks/useOverviewStats";
import { useAgentErrors } from "./hooks/useAgentErrors";
import { AGENTS, CATEGORIES, CATEGORY_AGENTS, TOTAL_AGENTS, type AgentCategory, type AgentConfig } from "./agentRegistry";
import AgentSetupWizard from "./components/AgentSetupWizard";

type FilterCategory = "All" | AgentCategory;

interface AgentRow {
  agent: AgentConfig;
  status: "error" | "running" | "needs-setup" | "not-installed";
  activity: string;
  errorMsg?: string;
}

export default function AdminOverview() {
  const { states, refetch } = useAdminContext();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [showAllNotSetUp, setShowAllNotSetUp] = useState(false);
  const [setupAgent, setSetupAgent] = useState<AgentConfig | null>(null);
  const installedKeys = new Set(Object.entries(states).filter(([, s]) => s.installed).map(([k]) => k));
  const { data: stats } = useOverviewStats(installedKeys.size > 0);
  const { data: errors = {} } = useAgentErrors(installedKeys);

  const runningCount = Object.values(states).filter((s) => s.isRunning).length;
  const hasAnySetup = Object.values(states).some((s) => s.setupComplete);

  // Build rows
  const allAgents = activeCategory === "All"
    ? AGENTS
    : AGENTS.filter((a) => CATEGORY_AGENTS[activeCategory]?.includes(a.slug));

  const rows: AgentRow[] = allAgents.map((agent) => {
    const st = states[agent.key];
    const agentErrors = errors[agent.key];

    if (!st || !st.installed) {
      return { agent, status: "not-installed", activity: agent.subtitle };
    }
    if (!st.setupComplete) {
      return { agent, status: "needs-setup", activity: agent.subtitle };
    }
    if (agentErrors && agentErrors.length > 0) {
      return { agent, status: "error", activity: agentErrors[0], errorMsg: agentErrors[0] };
    }
    return {
      agent, status: "running",
      activity: st.isRunning ? "Active" : "Paused",
    };
  });

  // Group into sections
  const errorRows = rows.filter((r) => r.status === "error");
  const runningRows = rows.filter((r) => r.status === "running");
  const needsSetupRows = rows.filter((r) => r.status === "needs-setup");
  const notInstalledRows = rows.filter((r) => r.status === "not-installed");
  const notSetUpRows = [...needsSetupRows, ...notInstalledRows];

  const visibleNotSetUp = showAllNotSetUp ? notSetUpRows : notSetUpRows.slice(0, 5);
  const hiddenCount = notSetUpRows.length - 5;

  const runAction = async (fn: string, label: string) => {
    setRunningAction(fn);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${label} completed`);
      refetch();
    } catch (err: any) {
      toast.error(`${label} failed — ${err?.message || "Unknown error"}`);
    }
    setRunningAction(null);
  };

  const timeAgo = (iso: string | null) => {
    if (!iso) return "Never";
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 60) return `${Math.floor(d)}s ago`;
    if (d < 3600) return `${Math.floor(d / 60)} mins ago`;
    if (d < 86400) return `${Math.floor(d / 3600)} hrs ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  const StatusBadge = ({ status }: { status: AgentRow["status"] }) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      error: { bg: "rgba(248,113,113,0.15)", text: "#f87171", label: "● ERROR" },
      running: { bg: "rgba(74,222,128,0.1)", text: "#4ade80", label: "● RUNNING" },
      "needs-setup": { bg: "rgba(201,168,76,0.15)", text: "#c9a84c", label: "● NEEDS SETUP" },
      "not-installed": { bg: "rgba(240,234,214,0.05)", text: "rgba(240,234,214,0.25)", label: "NOT SET UP" },
    };
    const s = styles[status];
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase"
        style={{ backgroundColor: s.bg, color: s.text }}>
        {s.label}
      </span>
    );
  };

  const ActionButton = ({ row }: { row: AgentRow }) => {
    if (row.status === "error") {
      return (
        <Link to={`/admin/${row.agent.slug}`}
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#f87171] text-white hover:bg-[#ef4444] transition-colors">
          FIX →
        </Link>
      );
    }
    if (row.status === "needs-setup") {
      return (
        <button onClick={() => setSetupAgent(row.agent)}
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c9a84c] text-[#0a0a08] hover:opacity-90 transition-opacity">
          SET UP
        </button>
      );
    }
    if (row.status === "not-installed") {
      return (
        <button onClick={() => setSetupAgent(row.agent)}
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#c9a84c] text-[#0a0a08] hover:opacity-90 transition-opacity">
          SET UP
        </button>
      );
    }
    return (
      <Link to={`/admin/${row.agent.slug}`}
        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#f0ead6]/15 text-[#f0ead6]/50 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors">
        MANAGE
      </Link>
    );
  };

  const TableRow = ({ row, dimmed }: { row: AgentRow; dimmed?: boolean }) => (
    <div
      className={`grid items-center gap-2 px-4 py-3 border-b border-[#f0ead6]/5 text-[13px] ${dimmed ? "opacity-45" : ""}`}
      style={{
        gridTemplateColumns: "2fr 1.2fr 1fr 1.8fr 1fr 1fr 1.4fr",
        backgroundColor: row.status === "error" ? "rgba(248,113,113,0.03)" : "transparent",
      }}
    >
      {/* Agent */}
      <div className="flex items-center gap-2">
        <span className="font-bold text-[14px]">{row.agent.label}</span>
        <ActionButton row={row} />
      </div>
      {/* Status */}
      <div><StatusBadge status={row.status} /></div>
      {/* Category */}
      <div className="text-[12px] text-[#f0ead6]/40">{row.agent.category}</div>
      {/* Activity */}
      <div className={`text-[12px] truncate ${row.status === "error" ? "text-[#f87171]" : "text-[#f0ead6]/50"}`}>
        {row.activity}
      </div>
      {/* Last Run */}
      <div className="text-[12px] text-[#f0ead6]/40">
        {row.status === "running" || row.status === "error" ? timeAgo(states[row.agent.key]?.settings?.last_run_at || null) : "—"}
      </div>
      {/* Next Run */}
      <div className="text-[12px] text-[#f0ead6]/40">—</div>
      {/* Version */}
      <div className="text-[12px] text-[#f0ead6]/40">
        {states[row.agent.key]?.promptVersion ? `v${states[row.agent.key]!.promptVersion}` : "—"}
      </div>
    </div>
  );

  return (
    <div className="flex gap-0">
      {/* Left sidebar */}
      <div className="w-[150px] shrink-0 pr-4 border-r border-[#f0ead6]/8">
        <div className="mb-6">
          <p className="text-[13px] font-bold text-[#f0ead6] mb-1">🦄 Lazy</p>
          <p className="text-[10px] text-[#f0ead6]/40">{runningCount} of {TOTAL_AGENTS} running</p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {(["All", ...CATEGORIES] as FilterCategory[]).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 py-2 text-[14px] font-bold transition-colors ${
                activeCategory === cat
                  ? "text-[#f0ead6] bg-[#c9a84c]/10 border-l-2 border-[#c9a84c]"
                  : "text-[#f0ead6]/40 hover:text-[#f0ead6]/70 border-l-2 border-transparent"
              }`}>
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {/* Right content */}
      <div className="flex-1 pl-6 min-w-0">
        {/* Stats row */}
        {hasAnySetup && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Posts Today", value: stats?.postsToday ?? "—" },
              { label: "Agents Active", value: `${runningCount}/${TOTAL_AGENTS}` },
              { label: "Revenue Today", value: "—", gold: true },
              { label: "Errors Today", value: stats?.errorsToday ?? "—", red: (stats?.errorsToday ?? 0) > 0 },
              { label: "Security Score", value: "—" },
            ].map((s) => (
              <div key={s.label} className={`border border-[#f0ead6]/8 p-4 ${s.red ? "border-red-500/30 bg-red-500/5" : ""}`}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/50">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.gold ? "text-[#c9a84c]" : s.red ? "text-[#f87171]" : ""}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Table header */}
        <div className="grid items-center gap-2 px-4 py-2 border-b border-[#f0ead6]/10 text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 font-bold"
          style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1.8fr 1fr 1fr 1.4fr" }}>
          <div>Agent</div><div>Status</div><div>Category</div><div>Activity</div><div>Last Run</div><div>Next Run</div><div>Version</div>
        </div>

        {/* Error rows */}
        {errorRows.map((r) => <TableRow key={r.agent.key} row={r} />)}

        {/* Running rows */}
        {runningRows.map((r) => <TableRow key={r.agent.key} row={r} />)}

        {/* Not set up divider */}
        {notSetUpRows.length > 0 && (
          <>
            <div className="px-4 py-3 border-b border-[#f0ead6]/5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/25 font-bold">
                NOT SET UP YET
              </span>
            </div>
            {visibleNotSetUp.map((r) => <TableRow key={r.agent.key} row={r} dimmed />)}
            {!showAllNotSetUp && hiddenCount > 0 && (
              <button onClick={() => setShowAllNotSetUp(true)}
                className="w-full px-4 py-3 text-[12px] text-[#f0ead6]/30 hover:text-[#f0ead6]/50 text-left transition-colors">
                + {hiddenCount} more agents not set up
              </button>
            )}
          </>
        )}

        {/* Empty state */}
        {errorRows.length === 0 && runningRows.length === 0 && notSetUpRows.length === 0 && (
          <div className="py-16 text-center text-[#f0ead6]/30 text-[13px]">
            No agents found.
          </div>
        )}
      </div>

      {/* Setup wizard dialog */}
      {setupAgent && (
        <AgentSetupWizard
          agent={setupAgent}
          open={!!setupAgent}
          onClose={() => setSetupAgent(null)}
          onComplete={() => refetch()}
        />
      )}
    </div>
  );
}
