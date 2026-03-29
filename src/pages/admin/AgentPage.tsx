import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Play, CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, type AgentConfig } from "./agentRegistry";
import { useParams } from "react-router-dom";

export default function AgentPage() {
  const { agentKey } = useParams<{ agentKey: string }>();
  const agent = AGENTS.find((a) => a.key === agentKey);
  const { statuses, refetchStatuses } = useAdminContext();
  const queryClient = useQueryClient();

  const [runningFn, setRunningFn] = useState<string | null>(null);
  const [successFn, setSuccessFn] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  if (!agent) return <div className="text-[#f0ead6]/50 font-body">Agent not found.</div>;

  const status = statuses[agent.key];

  // Toggle running
  const toggleRunning = async () => {
    setToggling(true);
    try {
      const { error } = await (supabase as any)
        .from(agent.settingsTable)
        .update({ [agent.runField]: !status?.running });
      if (error) throw error;
      toast.success(status?.running ? `${agent.label} paused` : `${agent.label} started`);
      refetchStatuses();
    } catch {
      toast.error("Failed to toggle");
    }
    setToggling(false);
  };

  // Run action
  const runAction = async (fn: string, label: string) => {
    setRunningFn(fn);
    try {
      const { error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      toast.success(`${label} completed`);
      setSuccessFn(fn);
      setTimeout(() => setSuccessFn(null), 2000);
      queryClient.invalidateQueries({ queryKey: [`agent-content-${agent.key}`] });
      queryClient.invalidateQueries({ queryKey: [`agent-errors-${agent.key}`] });
      queryClient.invalidateQueries({ queryKey: [`agent-stats-${agent.key}`] });
      refetchStatuses();
    } catch {
      toast.error(`${label} failed`);
    }
    setRunningFn(null);
  };

  // Stats
  const { data: agentStats = [] } = useQuery({
    queryKey: [`agent-stats-${agent.key}`],
    queryFn: async () => {
      const results: { label: string; value: number }[] = [];
      for (const sq of agent.statsQueries) {
        try {
          if (sq.type === "count") {
            const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true });
            results.push({ label: sq.label, value: count || 0 });
          } else if (sq.type === "count_today") {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true }).gte("created_at", today.toISOString());
            results.push({ label: sq.label, value: count || 0 });
          } else if (sq.type === "count_week") {
            const week = new Date(); week.setDate(week.getDate() - 7);
            const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true }).gte("created_at", week.toISOString());
            results.push({ label: sq.label, value: count || 0 });
          }
        } catch {
          results.push({ label: sq.label, value: 0 });
        }
      }
      return results;
    },
    enabled: agent.statsQueries.length > 0,
  });

  // Content/history
  const { data: content = [], isLoading: contentLoading } = useQuery({
    queryKey: [`agent-content-${agent.key}`, page, searchTerm],
    queryFn: async () => {
      if (!agent.contentTable) return [];
      try {
        let q = (supabase as any).from(agent.contentTable).select("*").order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
        if (searchTerm) {
          const cols = agent.contentColumns || [];
          const textCol = cols.find((c) => c.type !== "date" && c.type !== "number" && c.type !== "badge")?.key || "title";
          q = q.ilike(textCol, `%${searchTerm}%`);
        }
        const { data } = await q;
        return data || [];
      } catch { return []; }
    },
  });

  // Queue
  const { data: queue = [] } = useQuery({
    queryKey: [`agent-queue-${agent.key}`],
    queryFn: async () => {
      if (!agent.queueTable) return [];
      try {
        let q = (supabase as any).from(agent.queueTable).select("*").order("created_at", { ascending: false }).limit(20);
        if (agent.queueFilter) {
          for (const [k, v] of Object.entries(agent.queueFilter)) {
            q = q.eq(k, v);
          }
        }
        const { data } = await q;
        return data || [];
      } catch { return []; }
    },
    enabled: !!agent.queueTable,
  });

  // Errors
  const { data: agentErrors = [] } = useQuery({
    queryKey: [`agent-errors-${agent.key}`],
    queryFn: async () => {
      if (!agent.errorsTable) return [];
      try {
        const { data } = await (supabase as any).from(agent.errorsTable).select("*").order("created_at", { ascending: false }).limit(10);
        return data || [];
      } catch { return []; }
    },
    enabled: !!agent.errorsTable,
  });

  // Settings
  const { data: settings } = useQuery({
    queryKey: [`agent-settings-${agent.key}`],
    queryFn: async () => {
      try {
        const { data } = await (supabase as any).from(agent.settingsTable).select("*").limit(1).single();
        return data || {};
      } catch { return {}; }
    },
  });

  const columns = agent.contentColumns || [
    { key: "title", label: "Title" },
    { key: "created_at", label: "Date", type: "date" as const },
  ];

  const formatDate = (d: string) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
  };

  return (
    <div>
      {/* Status bar */}
      <div className="border border-[#f0ead6]/8 p-5 flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4 flex-1">
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight">{agent.label}</h1>
            <p className="font-body text-[12px] text-[#f0ead6]/50 mt-0.5">{agent.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`font-body text-[11px] tracking-[0.15em] uppercase ${status?.running ? "text-emerald-500" : "text-[#f0ead6]/50"}`}>
            {status?.running ? "Running" : "Paused"}
          </span>
          <button
            onClick={toggleRunning}
            disabled={toggling}
            className={`relative w-11 h-5 transition-colors ${status?.running ? "bg-emerald-600" : "bg-[#f0ead6]/10"}`}
          >
            {toggling && <Loader2 size={8} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-[#f0ead6]" />}
            <span className={`block w-4 h-4 bg-[#f0ead6] transition-transform ${status?.running ? "translate-x-6" : "translate-x-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      {agent.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {agent.actions.map((a) => (
            <button
              key={a.fn}
              onClick={() => runAction(a.fn, a.label)}
              disabled={!!runningFn}
              className="inline-flex items-center gap-2 border border-[#f0ead6]/10 px-4 py-2 font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40"
            >
              {runningFn === a.fn ? <Loader2 size={11} className="animate-spin" /> : successFn === a.fn ? <CheckCircle size={11} className="text-emerald-500" /> : <Play size={11} />}
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Stats + Queue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {agentStats.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-3">Stats</h2>
            <div className="grid grid-cols-2 gap-3">
              {agentStats.map((s) => (
                <div key={s.label} className="border border-[#f0ead6]/8 p-3">
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40">{s.label}</p>
                  <p className="font-display text-xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {queue.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-3">Queue ({queue.length})</h2>
            <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-48 overflow-y-auto">
              {queue.map((item: any, i: number) => {
                const qCols = agent.queueColumns || [{ key: "title", label: "Title" }];
                return (
                  <div key={i} className="px-3 py-2 flex items-center gap-3">
                    {qCols.map((c) => (
                      <span key={c.key} className={`font-body text-[12px] ${c.type === "badge" ? "px-1.5 py-0.5 border border-[#f0ead6]/10 text-[10px] uppercase tracking-wider text-[#f0ead6]/60" : "text-[#f0ead6]/80 flex-1 truncate"}`}>
                        {item[c.key] ?? "—"}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {agent.contentTable && (
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50">History</h2>
            <div className="relative flex-1 max-w-xs">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f0ead6]/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                placeholder="Search…"
                className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] pl-8 pr-3 py-1.5 font-body text-[11px] focus:outline-none focus:border-[#f0ead6]/20"
              />
            </div>
          </div>
          {contentLoading ? (
            <div className="flex items-center justify-center h-16"><Loader2 size={16} className="animate-spin text-[#f0ead6]/40" /></div>
          ) : content.length === 0 ? (
            <p className="font-body text-[12px] text-[#f0ead6]/40">No records yet.</p>
          ) : (
            <>
              <div className="border border-[#f0ead6]/8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#f0ead6]/8">
                      {columns.map((c) => (
                        <th key={c.key} className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0ead6]/5">
                    {content.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-[#f0ead6]/3 transition-colors">
                        {columns.map((c) => (
                          <td key={c.key} className="px-3 py-2 font-body text-[12px]">
                            {c.type === "date" ? (
                              <span className="text-[#f0ead6]/50">{formatDate(row[c.key])}</span>
                            ) : c.type === "badge" ? (
                              <span className="px-1.5 py-0.5 border border-[#f0ead6]/10 text-[10px] uppercase tracking-wider text-[#f0ead6]/60">
                                {row[c.key] ?? "—"}
                              </span>
                            ) : (
                              <span className="text-[#f0ead6]/80 truncate block max-w-xs">{row[c.key] ?? "—"}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30"
                >
                  ← Previous
                </button>
                <span className="font-body text-[10px] text-[#f0ead6]/40">Page {page + 1}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={content.length < PAGE_SIZE}
                  className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Settings */}
      {settings && Object.keys(settings).length > 0 && (
        <div className="mb-6 border border-[#f0ead6]/8">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center gap-2 px-4 py-3 font-body text-[11px] uppercase tracking-[0.15em] text-[#f0ead6]/60 hover:text-[#f0ead6]/90 transition-colors"
          >
            {settingsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Settings
          </button>
          {settingsOpen && (
            <div className="px-4 pb-4">
              <pre className="font-body text-[11px] text-[#f0ead6]/60 whitespace-pre-wrap break-all">
                {JSON.stringify(settings, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Error log */}
      {agent.errorsTable && (
        <div className="border border-[#f0ead6]/8">
          <button
            onClick={() => setErrorsOpen(!errorsOpen)}
            className="w-full flex items-center gap-2 px-4 py-3 font-body text-[11px] uppercase tracking-[0.15em] text-[#f0ead6]/60 hover:text-[#f0ead6]/90 transition-colors"
          >
            {errorsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            Errors ({agentErrors.length})
            {agentErrors.length > 0 && <AlertTriangle size={11} className="text-red-400 ml-1" />}
          </button>
          {errorsOpen && (
            <div className="px-4 pb-4 divide-y divide-[#f0ead6]/5">
              {agentErrors.length === 0 ? (
                <div className="flex items-center gap-2 py-2">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="font-body text-[12px] text-emerald-400">No recent errors</span>
                </div>
              ) : (
                agentErrors.map((err: any, i: number) => (
                  <div key={i} className="py-2">
                    <p className="font-body text-[11px] text-red-400/80">{err.error_message}</p>
                    <p className="font-body text-[10px] text-[#f0ead6]/30 mt-0.5">{formatDate(err.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
