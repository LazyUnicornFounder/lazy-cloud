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

  const allAgents = activeCategory === "All"
    ? AGENTS
    : AGENTS.filter((a) => CATEGORY_AGENTS[activeCategory]?.includes(a.slug));

  const rows: AgentRow[] = allAgents.map((agent) => {
    const st = states[agent.key];
    const agentErrors = errors[agent.key];
    if (!st || !st.installed) return { agent, status: "not-installed", activity: agent.subtitle };
    if (!st.setupComplete) return { agent, status: "needs-setup", activity: agent.subtitle };
    if (agentErrors && agentErrors.length > 0) return { agent, status: "error", activity: agentErrors[0], errorMsg: agentErrors[0] };
    return { agent, status: "running", activity: st.isRunning ? "Active" : "Paused" };
  });

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
    const styles: Record<string, { cls: string; label: string }> = {
      error: { cls: "bg-destructive/15 text-destructive", label: "● ERROR" },
      running: { cls: "bg-[#4ade80]/10 text-[#4ade80]", label: "● RUNNING" },
      "needs-setup": { cls: "bg-primary/15 text-primary", label: "● NEEDS SETUP" },
      "not-installed": { cls: "bg-foreground/5 text-foreground/25", label: "NOT SET UP" },
    };
    const s = styles[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${s.cls}`}>
        {s.label}
      </span>
    );
  };

  const ActionButton = ({ row }: { row: AgentRow }) => {
    if (row.status === "error") {
      return (
        <Link to={`/admin/${row.agent.slug}`}
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">
          FIX →
        </Link>
      );
    }
    if (row.status === "needs-setup" || row.status === "not-installed") {
      return (
        <button onClick={() => setSetupAgent(row.agent)}
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          SET UP
        </button>
      );
    }
    return (
      <Link to={`/admin/${row.agent.slug}`}
        className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors">
        MANAGE
      </Link>
    );
  };

  const TableRow = ({ row, dimmed }: { row: AgentRow; dimmed?: boolean }) => (
    <div
      className={`grid items-center gap-2 px-4 py-3 border-b border-foreground/5 text-[13px] ${dimmed ? "opacity-45" : ""}`}
      style={{
        gridTemplateColumns: "2fr 1.2fr 1fr 1.8fr 1fr 1fr 1.4fr",
        backgroundColor: row.status === "error" ? "hsl(var(--destructive) / 0.03)" : "transparent",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="font-bold text-[14px]">{row.agent.label}</span>
        <ActionButton row={row} />
      </div>
      <div><StatusBadge status={row.status} /></div>
      <div className="text-[12px] text-muted-foreground">{row.agent.category}</div>
      <div className={`text-[12px] truncate ${row.status === "error" ? "text-destructive" : "text-foreground/50"}`}>
        {row.activity}
      </div>
      <div className="text-[12px] text-muted-foreground">
        {row.status === "running" || row.status === "error" ? timeAgo(states[row.agent.key]?.settings?.last_run_at || null) : "—"}
      </div>
      <div className="text-[12px] text-muted-foreground">—</div>
      <div className="text-[12px] text-muted-foreground">
        {states[row.agent.key]?.promptVersion ? `v${states[row.agent.key]!.promptVersion}` : "—"}
      </div>
    </div>
  );

  return (
    <div className="flex gap-0">
      {/* Left sidebar */}
      <div className="w-[150px] shrink-0 pr-4 border-r border-border">
        <div className="mb-6">
          <p className="text-[13px] font-bold text-foreground mb-1">🦄 Lazy</p>
          <p className="text-[10px] text-muted-foreground">{runningCount} of {TOTAL_AGENTS} running</p>
        </div>
        <nav className="flex flex-col gap-0.5">
          {(["All", ...CATEGORIES] as FilterCategory[]).map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-left px-3 py-2 text-[14px] font-bold transition-colors ${
                activeCategory === cat
                  ? "text-foreground bg-primary/10 border-l-2 border-primary"
                  : "text-foreground/40 hover:text-foreground/70 border-l-2 border-transparent"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
             {[
              { label: "Posts Today", value: stats?.postsToday ?? "—" },
              { label: "Agents Active", value: `${runningCount}/${TOTAL_AGENTS}` },
              { label: "Prompts Copied Today", value: stats?.copiesToday ?? "—", gold: true },
              { label: "Total Prompts Copied", value: stats?.copiesTotal ?? "—", gold: true },
              { label: "Errors Today", value: stats?.errorsToday ?? "—", red: (stats?.errorsToday ?? 0) > 0 },
              { label: "Security Score", value: "—" },
            ].map((s) => (
              <div key={s.label} className={`border border-border p-4 ${s.red ? "border-destructive/30 bg-destructive/5" : ""}`}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold mt-1 ${s.gold ? "text-primary" : s.red ? "text-destructive" : ""}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Table header */}
        <div className="grid items-center gap-2 px-4 py-2 border-b border-border text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold"
          style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1.8fr 1fr 1fr 1.4fr" }}>
          <div>Agent</div><div>Status</div><div>Category</div><div>Activity</div><div>Last Run</div><div>Next Run</div><div>Version</div>
        </div>

        {errorRows.map((r) => <TableRow key={r.agent.key} row={r} />)}
        {runningRows.map((r) => <TableRow key={r.agent.key} row={r} />)}

        {notSetUpRows.length > 0 && (
          <>
            <div className="px-4 py-3 border-b border-foreground/5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 font-bold">
                NOT SET UP YET
              </span>
            </div>
            {visibleNotSetUp.map((r) => <TableRow key={r.agent.key} row={r} dimmed />)}
            {!showAllNotSetUp && hiddenCount > 0 && (
              <button onClick={() => setShowAllNotSetUp(true)}
                className="w-full px-4 py-3 text-[12px] text-muted-foreground hover:text-foreground/50 text-left transition-colors">
                + {hiddenCount} more agents not set up
              </button>
            )}
          </>
        )}

        {errorRows.length === 0 && runningRows.length === 0 && notSetUpRows.length === 0 && (
          <div className="py-16 text-center text-muted-foreground text-[13px]">
            No agents found.
          </div>
        )}
      </div>

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
