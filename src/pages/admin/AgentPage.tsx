import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";
import { Loader2, Play, CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Search, Settings, XCircle, ArrowRight, Trash2, Save } from "lucide-react";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";
import { useParams, Link } from "react-router-dom";

/* ── Error diagnosis ── */
function diagnoseError(msg: string): { hint: string; action?: string } {
  const lower = msg.toLowerCase();
  if (lower.includes("secret") || lower.includes("api key") || lower.includes("api_key") || lower.includes("unauthorized") || lower.includes("401"))
    return { hint: "Add the required API key to your project secrets at Project Settings → Edge Functions → Secrets.", action: "Check Secrets" };
  if (lower.includes("not found") || lower.includes("does not exist") || lower.includes("relation") || lower.includes("42P01"))
    return { hint: "One or more database tables are missing. Re-run the setup page to create them.", action: "Re-run Setup" };
  if (lower.includes("setup_complete") || lower.includes("not configured") || lower.includes("setup"))
    return { hint: "Complete the setup page first before running this agent." };
  return { hint: "See error details above. Check the error log below for more context." };
}

export default function AgentPage() {
  const { agentKey } = useParams<{ agentKey: string }>();
  const agent = AGENTS.find((a) => a.key === agentKey);
  const { statuses, refetchStatuses } = useAdminContext();
  const queryClient = useQueryClient();
  const errorLogRef = useRef<HTMLDivElement>(null);

  const [runningFn, setRunningFn] = useState<string | null>(null);
  const [successFn, setSuccessFn] = useState<string | null>(null);
  const [actionError, setActionError] = useState<{ fn: string; message: string } | null>(null);
  const [toggling, setToggling] = useState(false);
  const [errorsOpen, setErrorsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [settingsForm, setSettingsForm] = useState<Record<string, any>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [clearingErrors, setClearingErrors] = useState(false);
  const PAGE_SIZE = 50;

  if (!agent) return <div className="text-[#f0ead6]/50 font-body">Agent not found.</div>;

  const status = statuses[agent.key];
  const setupRoute = agent.setupRoute || `/lazy-${agent.key}-setup`;

  /* ── Settings / setup check ── */
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: [`agent-settings-${agent.key}`],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any).from(agent.settingsTable).select("*").limit(1).single();
        if (error) throw error;
        return data || null;
      } catch { return null; }
    },
  });

  // Populate form when settings load
  const isConfigured = settingsLoading ? null : (settings && settings.setup_complete !== false);

  /* ── Not configured ── */
  if (isConfigured === false) {
    return (
      <div className="border border-[#f0ead6]/8 p-8 text-center max-w-md mx-auto mt-12">
        <Settings size={28} className="text-[#f0ead6]/20 mx-auto mb-4" />
        <h2 className="font-display text-lg font-bold tracking-tight mb-2">{agent.label} is not configured</h2>
        <p className="font-body text-[13px] text-[#f0ead6]/50 mb-6">Complete setup to activate this agent.</p>
        <Link
          to={setupRoute}
          className="inline-flex items-center gap-2 bg-[#f0ead6] text-[#0a0a08] px-6 py-2.5 font-body text-[11px] tracking-[0.12em] uppercase font-semibold hover:opacity-90 transition-opacity"
        >
          Set Up {agent.label} <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  if (isConfigured === null) {
    return <div className="flex items-center justify-center h-32"><Loader2 size={16} className="animate-spin text-[#f0ead6]/40" /></div>;
  }

  /* ── Toggle running ── */
  const toggleRunning = async () => {
    setToggling(true);
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: { [agent.runField]: !status?.running },
      });
      toast.success(status?.running ? `${agent.label} paused` : `${agent.label} started`);
      refetchStatuses();
      queryClient.invalidateQueries({ queryKey: [`agent-settings-${agent.key}`] });
    } catch (err: any) {
      toast.error(`Failed to toggle: ${err?.message || "Unknown error"}`);
    }
    setToggling(false);
  };

  /* ── Run action ── */
  const runAction = async (fn: string, label: string) => {
    setRunningFn(fn);
    setActionError(null);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${label} completed`);
      setSuccessFn(fn);
      setTimeout(() => setSuccessFn(null), 2000);
      queryClient.invalidateQueries({ queryKey: [`agent-content-${agent.key}`] });
      queryClient.invalidateQueries({ queryKey: [`agent-errors-${agent.key}`] });
      queryClient.invalidateQueries({ queryKey: [`agent-stats-${agent.key}`] });
      refetchStatuses();
    } catch (err: any) {
      const msg = err?.message || err?.toString() || "Unknown error";
      setActionError({ fn, message: msg });
      toast.error(`${label} failed — see details below`);
    }
    setRunningFn(null);
  };

  /* ── Stats ── */
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

  /* ── Content/history ── */
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

  /* ── Queue ── */
  const { data: queue = [] } = useQuery({
    queryKey: [`agent-queue-${agent.key}`],
    queryFn: async () => {
      if (!agent.queueTable) return [];
      try {
        let q = (supabase as any).from(agent.queueTable).select("*").order("created_at", { ascending: false }).limit(20);
        if (agent.queueFilter) {
          for (const [k, v] of Object.entries(agent.queueFilter)) q = q.eq(k, v);
        }
        const { data } = await q;
        return data || [];
      } catch { return []; }
    },
    enabled: !!agent.queueTable,
  });

  /* ── Errors ── */
  const { data: agentErrors = [], refetch: refetchErrors } = useQuery({
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

  const columns = agent.contentColumns || [
    { key: "title", label: "Title" },
    { key: "created_at", label: "Date", type: "date" as const },
  ];

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
  };

  const hasNeverRun = agentStats.length > 0 && agentStats.every(s => s.value === 0) && content.length === 0;
  const primaryAction = agent.actions[0];

  /* ── Save settings ── */
  const saveSettings = async () => {
    if (Object.keys(settingsForm).length === 0) return;
    setSavingSettings(true);
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: settingsForm,
      });
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: [`agent-settings-${agent.key}`] });
      setSettingsForm({});
    } catch (err: any) {
      toast.error(`Save failed: ${err?.message || "Unknown error"}`);
    }
    setSavingSettings(false);
  };

  /* ── Clear errors ── */
  const clearErrors = async () => {
    if (!agent.errorsTable) return;
    setClearingErrors(true);
    try {
      await adminWrite({
        table: agent.errorsTable,
        operation: "select", // We can't delete via adminWrite, just refresh
      });
      toast.success("Error log refreshed");
      refetchErrors();
    } catch {}
    setClearingErrors(false);
  };

  // Build editable settings fields
  const editableFields = agent.settingsFields || [];
  const getFieldValue = (key: string) => {
    if (key in settingsForm) return settingsForm[key];
    return settings?.[key] ?? "";
  };

  return (
    <div>
      {/* 1. Status bar */}
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

      {/* Requirements (secrets) */}
      {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
        <div className="border border-[#f0ead6]/8 p-4 mb-6">
          <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/50 mb-3">Requirements</h2>
          <div className="space-y-2">
            {agent.requiredSecrets.map((secret) => {
              const hasRecentSecretError = agentErrors.some((e: any) =>
                e.error_message?.toLowerCase().includes(secret.toLowerCase()) ||
                (e.error_message?.toLowerCase().includes("api key") && e.error_message?.toLowerCase().includes(secret.split("_")[0].toLowerCase()))
              );
              return (
                <div key={secret} className="flex items-center gap-2">
                  {hasRecentSecretError ? (
                    <>
                      <XCircle size={12} className="text-red-400 shrink-0" />
                      <span className="font-body text-[12px] text-red-400">{secret}</span>
                      <span className="font-body text-[10px] text-[#f0ead6]/40">— Add to Project Settings → Edge Functions → Secrets</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} className="text-emerald-500 shrink-0" />
                      <span className="font-body text-[12px] text-[#f0ead6]/60">{secret}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Quick actions */}
      {agent.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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

      {/* Action error callout */}
      {actionError && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-sm font-bold text-red-400 mb-1">{agent.actions.find(a => a.fn === actionError.fn)?.label || actionError.fn} failed</p>
              <pre className="font-body text-[11px] text-red-300/80 whitespace-pre-wrap break-all">{actionError.message}</pre>
            </div>
          </div>
          <div className="border-t border-red-500/20 pt-3 mt-2">
            <p className="font-body text-[11px] text-[#f0ead6]/50 uppercase tracking-wider mb-1">How to fix</p>
            <p className="font-body text-[12px] text-[#f0ead6]/70">{diagnoseError(actionError.message).hint}</p>
          </div>
          <div className="flex items-center gap-3 mt-3">
            {agent.errorsTable && (
              <button
                onClick={() => { setErrorsOpen(true); errorLogRef.current?.scrollIntoView({ behavior: "smooth" }); }}
                className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] transition-colors underline"
              >
                View Error Log
              </button>
            )}
            <button onClick={() => setActionError(null)} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/40 hover:text-[#f0ead6] transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {hasNeverRun && !actionError && (
        <div className="border border-[#f0ead6]/8 border-dashed p-8 mb-6 text-center">
          <p className="font-body text-[13px] text-[#f0ead6]/50 mb-4">
            No data yet — click{" "}
            {primaryAction ? (
              <button onClick={() => runAction(primaryAction.fn, primaryAction.label)} className="text-[#f0ead6] underline hover:no-underline">
                {primaryAction.label}
              </button>
            ) : (
              "an action above"
            )}{" "}
            to run your first check.
          </p>
        </div>
      )}

      {/* 3. Stats + Queue */}
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

      {/* 4. History */}
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
                      <tr key={i} className="hover:bg-[#f0ead6]/[0.03] transition-colors">
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
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30">← Previous</button>
                <span className="font-body text-[10px] text-[#f0ead6]/40">Page {page + 1}</span>
                <button onClick={() => setPage(page + 1)} disabled={content.length < PAGE_SIZE} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30">Next →</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 5. Settings — editable fields */}
      {settings && (
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
              {editableFields.length > 0 ? (
                <div className="space-y-3">
                  {editableFields.map((f) => (
                    <div key={f.key}>
                      <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 mb-1">{f.label}</label>
                      {f.type === "toggle" ? (
                        <button
                          onClick={() => setSettingsForm({ ...settingsForm, [f.key]: !getFieldValue(f.key) })}
                          className={`relative w-11 h-5 transition-colors ${getFieldValue(f.key) ? "bg-emerald-600" : "bg-[#f0ead6]/10"}`}
                        >
                          <span className={`block w-4 h-4 bg-[#f0ead6] transition-transform ${getFieldValue(f.key) ? "translate-x-6" : "translate-x-0.5"}`} />
                        </button>
                      ) : f.type === "textarea" ? (
                        <textarea
                          value={getFieldValue(f.key) || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, [f.key]: e.target.value })}
                          placeholder={f.placeholder}
                          rows={3}
                          className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-[12px] focus:outline-none focus:border-[#f0ead6]/20 resize-y"
                        />
                      ) : (
                        <input
                          type={f.type === "password" ? "password" : f.type === "number" ? "number" : "text"}
                          value={getFieldValue(f.key) || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                          placeholder={f.placeholder}
                          className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-2 font-body text-[12px] focus:outline-none focus:border-[#f0ead6]/20"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={saveSettings}
                    disabled={savingSettings || Object.keys(settingsForm).length === 0}
                    className="inline-flex items-center gap-2 bg-[#f0ead6] text-[#0a0a08] px-4 py-2 font-display text-[11px] tracking-[0.1em] uppercase font-bold hover:opacity-90 disabled:opacity-50"
                  >
                    {savingSettings ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                    Save Settings
                  </button>
                </div>
              ) : (
                // Fallback: render all settings as read-only fields
                <div className="space-y-2">
                  {Object.entries(settings).filter(([k]) => k !== "id" && k !== "created_at").map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 min-w-[140px]">{key.replace(/_/g, " ")}</span>
                      <span className="font-body text-[12px] text-[#f0ead6]/70">
                        {typeof val === "boolean" ? (val ? "✓ Yes" : "✗ No") : String(val ?? "—")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Error log */}
      {agent.errorsTable && (
        <div ref={errorLogRef} className="border border-[#f0ead6]/8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setErrorsOpen(!errorsOpen)}
              className="flex-1 flex items-center gap-2 px-4 py-3 font-body text-[11px] uppercase tracking-[0.15em] text-[#f0ead6]/60 hover:text-[#f0ead6]/90 transition-colors"
            >
              {errorsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Errors ({agentErrors.length})
              {agentErrors.length > 0 && <AlertTriangle size={11} className="text-red-400 ml-1" />}
            </button>
            {errorsOpen && agentErrors.length > 0 && (
              <button
                onClick={clearErrors}
                disabled={clearingErrors}
                className="px-4 py-3 font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/40 hover:text-[#f0ead6]/70 transition-colors flex items-center gap-1"
              >
                {clearingErrors ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                Refresh
              </button>
            )}
          </div>
          {errorsOpen && (
            <div className="px-4 pb-4 divide-y divide-[#f0ead6]/5">
              {agentErrors.length === 0 ? (
                <div className="flex items-center gap-2 py-2">
                  <CheckCircle size={12} className="text-emerald-500" />
                  <span className="font-body text-[12px] text-emerald-400">No recent errors</span>
                </div>
              ) : (
                agentErrors.map((err: any, i: number) => {
                  const diag = diagnoseError(err.error_message || "");
                  return (
                    <div key={i} className="py-3">
                      <p className="font-body text-[11px] text-red-400/80">{err.error_message}</p>
                      <p className="font-body text-[10px] text-[#f0ead6]/30 mt-0.5">{formatDate(err.created_at)}</p>
                      <p className="font-body text-[10px] text-[#f0ead6]/50 mt-1 italic">{diag.hint}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
