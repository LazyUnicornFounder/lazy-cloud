import { useNavigate } from "react-router-dom";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, type AgentCategory } from "./agentRegistry";
import { useOverviewStats } from "./hooks/useOverviewStats";
import { AdminRightSidebar } from "./components/AdminRightSidebar";

type AgentStatus = "error" | "running" | "needs_setup" | "not_installed";

function getStatus(state: any): AgentStatus {
  if (!state || !state.installed) return "not_installed";
  if (state.hasRecentError) return "error";
  if (!state.setupComplete) return "needs_setup";
  if (state.isRunning) return "running";
  return "needs_setup";
}

const STATUS_BADGES: Record<AgentStatus, { label: string; bg: string; text: string; dot: string }> = {
  error: { label: "ERROR", bg: "rgba(248,113,113,0.15)", text: "#f87171", dot: "#f87171" },
  running: { label: "RUNNING", bg: "rgba(74,222,128,0.1)", text: "#4ade80", dot: "#4ade80" },
  needs_setup: { label: "NEEDS SETUP", bg: "rgba(201,168,76,0.15)", text: "#c9a84c", dot: "#c9a84c" },
  not_installed: { label: "NOT SET UP", bg: "rgba(240,234,214,0.05)", text: "rgba(240,234,214,0.25)", dot: "rgba(240,234,214,0.2)" },
};

export default function AdminOverview() {
  const { states, selectedCategory, searchQuery } = useAdminContext();
  const navigate = useNavigate();
  const { data: stats } = useOverviewStats();

  let filtered = selectedCategory === "All" ? AGENTS : AGENTS.filter((a) => a.category === selectedCategory);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  }

  // Group agents
  const errorAgents = filtered.filter((a) => getStatus(states[a.key]) === "error");
  const runningAgents = filtered.filter((a) => getStatus(states[a.key]) === "running");
  const notSetupAgents = filtered.filter((a) => {
    const s = getStatus(states[a.key]);
    return s === "needs_setup" || s === "not_installed";
  });
  // Sort needs_setup before not_installed
  notSetupAgents.sort((a, b) => {
    const sa = getStatus(states[a.key]);
    const sb = getStatus(states[b.key]);
    if (sa === "needs_setup" && sb === "not_installed") return -1;
    if (sa === "not_installed" && sb === "needs_setup") return 1;
    return 0;
  });

  const showNotSetupCollapsed = notSetupAgents.length > 5;
  const [expanded, setExpanded] = React.useState(false);
  const visibleNotSetup = expanded ? notSetupAgents : notSetupAgents.slice(0, 5);

  const renderRow = (agent: typeof AGENTS[0], dimmed = false) => {
    const state = states[agent.key];
    const status = getStatus(state);
    const badge = STATUS_BADGES[status];

    const handleAction = () => {
      if (status === "not_installed" || status === "needs_setup") {
        navigate(`/lazy-${agent.slug}-setup`);
      } else {
        navigate(`/admin/${agent.slug}`);
      }
    };

    const actionButton = () => {
      if (status === "error") {
        return <button onClick={() => navigate(`/admin/${agent.slug}`)}
          className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          style={{ background: "#f87171", color: "#fff" }}>FIX →</button>;
      }
      if (status === "running") {
        return <button onClick={() => navigate(`/admin/${agent.slug}`)}
          className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          style={{ border: "1px solid rgba(240,234,214,0.12)", color: "rgba(240,234,214,0.5)" }}>MANAGE</button>;
      }
      return <button onClick={handleAction}
        className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
        style={{ background: "#c9a84c", color: "#0a0a08" }}>SET UP</button>;
    };

    const activity = () => {
      if (status === "error" && state?.lastError) return <span style={{ color: "#f87171" }}>{state.lastError.slice(0, 60)}</span>;
      if (status === "not_installed" || status === "needs_setup") return <span style={{ color: "rgba(240,234,214,0.35)" }}>{agent.subtitle}</span>;
      return <span style={{ color: "rgba(240,234,214,0.5)" }}>—</span>;
    };

    return (
      <div key={agent.key} className="flex items-center py-2.5"
        style={{
          fontSize: 13, opacity: dimmed ? 0.45 : 1,
          borderBottom: "1px solid rgba(240,234,214,0.04)",
          background: status === "error" ? "rgba(248,113,113,0.03)" : "transparent",
        }}>
        <div style={{ flex: 2 }} className="flex items-center gap-2">
          <span className="font-bold" style={{ color: "#f0ead6", fontSize: 14 }}>{agent.label}</span>
          {actionButton()}
        </div>
        <div style={{ flex: 1.2 }}>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase"
            style={{ background: badge.bg, color: badge.text }}>
            <span className="w-[6px] h-[6px] rounded-full" style={{ background: badge.dot }} />
            {badge.label}
          </span>
        </div>
        <div style={{ flex: 1, fontSize: 12, color: "rgba(240,234,214,0.4)" }}>{agent.category}</div>
        <div style={{ flex: 1.8, fontSize: 13 }}>{activity()}</div>
        <div style={{ flex: 1, fontSize: 12, color: "rgba(240,234,214,0.4)" }}>—</div>
        <div style={{ flex: 1, fontSize: 12, color: "rgba(240,234,214,0.4)" }}>—</div>
        <div style={{ flex: 1.4, fontSize: 12, color: "rgba(240,234,214,0.4)" }}>
          {state?.promptVersion ? `v${state.promptVersion}` : "—"}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Header row */}
      <div className="flex items-center py-2.5"
        style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
        <div style={{ flex: 2 }}>Agent</div>
        <div style={{ flex: 1.2 }}>Status</div>
        <div style={{ flex: 1 }}>Category</div>
        <div style={{ flex: 1.8 }}>Activity</div>
        <div style={{ flex: 1 }}>Last Run</div>
        <div style={{ flex: 1 }}>Next Run</div>
        <div style={{ flex: 1.4 }}>Version</div>
      </div>

      {/* Error rows */}
      {errorAgents.map((a) => renderRow(a))}

      {/* Running rows */}
      {runningAgents.map((a) => renderRow(a))}

      {/* Not set up divider */}
      {notSetupAgents.length > 0 && (
        <div className="py-3 mt-2"
          style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.25)", borderBottom: "1px solid rgba(240,234,214,0.06)" }}>
          NOT SET UP YET
        </div>
      )}
      {visibleNotSetup.map((a) => renderRow(a, true))}
      {showNotSetupCollapsed && !expanded && (
        <button onClick={() => setExpanded(true)}
          className="mt-2 text-[12px] transition-colors hover:opacity-80"
          style={{ color: "rgba(240,234,214,0.35)" }}>
          + {notSetupAgents.length - 5} more agents not set up
        </button>
      )}
    </>
  );
}

// Need React import for useState
import React from "react";

export function OverviewRightSidebar() {
  const { states } = useAdminContext();
  const { data: stats } = useOverviewStats();

  const runningCount = Object.values(states).filter((s) => s.isRunning).length;
  const installedCount = Object.values(states).filter((s) => s.installed).length;

  if (installedCount === 0) {
    return (
      <div>
        <h3 className="mb-4" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
          QUICK STATS
        </h3>
        <p style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>No agents set up yet</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
        QUICK STATS
      </h3>

      <div className="mb-5">
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,234,214,0.4)" }}>Posts Today</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f0ead6" }}>{stats?.postsToday ?? "—"}</div>
      </div>
      <div className="mb-5">
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,234,214,0.4)" }}>Agents Active</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f0ead6" }}>{runningCount}/36</div>
      </div>
      <div className="mb-5">
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,234,214,0.4)" }}>Errors Today</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: (stats?.errorsToday || 0) > 0 ? "#f87171" : "#f0ead6" }}>
          {stats?.errorsToday ?? 0}
        </div>
      </div>
    </div>
  );
}
