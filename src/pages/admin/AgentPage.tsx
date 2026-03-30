import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Pencil, Check, X, ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";
import { useAdminContext } from "./AdminLayout";
import { getAgentBySlug } from "./agentRegistry";

export default function AgentPage() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const navigate = useNavigate();
  const { states, refetch } = useAdminContext();
  const agent = getAgentBySlug(agentSlug || "");

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorsExpanded, setErrorsExpanded] = useState(false);
  const [actionError, setActionError] = useState<{ message: string; hint?: string } | null>(null);

  if (!agent) return <div className="py-10 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>Agent not found</div>;

  const state = states[agent.key];

  if (!state?.installed || !state?.setupComplete) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--admin-text)" }}>{agent.label} is not configured</h2>
        <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Complete setup to activate this agent.</p>
        <button onClick={() => navigate(`/lazy-${agent.slug}-setup`)}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:brightness-110"
          style={{ background: "var(--admin-accent)", color: "#fff" }}>
          Set up {agent.label} →
        </button>
      </div>
    );
  }

  const toggleRunning = async () => {
    try {
      await adminWrite({ table: agent.settingsTable, operation: "update", data: { [agent.runField]: !state.isRunning }, match: { id: state.settings?.id } });
      toast.success(state.isRunning ? `${agent.label} paused` : `${agent.label} resumed`);
      refetch();
    } catch (err: any) { toast.error(err.message); }
  };

  const runAction = async (fn: string, label: string) => {
    if (!fn) return;
    setActionLoading(fn);
    setActionError(null);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      toast.success(`${label} completed`);
      refetch();
    } catch (err: any) {
      const msg = err.message || "Unknown error";
      let hint: string | undefined;
      if (/secret|api.?key|unauthorized/i.test(msg)) hint = "Add the required API key in your project secrets.";
      else if (/not found|does not exist/i.test(msg)) hint = "Check that all database tables were created. Re-run the setup page.";
      else if (/setup_complete/i.test(msg)) hint = "Complete the setup page first.";
      setActionError({ message: msg, hint });
      toast.error(`${label} failed`);
    } finally { setActionLoading(null); }
  };

  const saveField = async (field: string) => {
    setSaving(true);
    try {
      await adminWrite({ table: agent.settingsTable, operation: "update", data: { [field]: editValue }, match: { id: state.settings?.id } });
      toast.success("Saved");
      setEditingField(null);
      refetch();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const { data: errors } = useQuery({
    queryKey: ["agent-errors", agent.errorsTable],
    queryFn: async () => {
      if (!agent.errorsTable) return [];
      try {
        const { data } = await (supabase as any).from(agent.errorsTable).select("*").order("created_at", { ascending: false }).limit(10);
        return data || [];
      } catch { return []; }
    },
    enabled: !!agent.errorsTable,
  });

  const { data: statValues } = useQuery({
    queryKey: ["agent-stats", agent.key],
    queryFn: async () => {
      const results: Record<string, number> = {};
      for (const stat of agent.stats) {
        try {
          let q = (supabase as any).from(stat.table).select("id", { count: "exact", head: true });
          if (stat.filter) for (const [k, v] of Object.entries(stat.filter)) q = q.eq(k, v);
          if (stat.dateFilter === "today") q = q.gte("created_at", new Date().toISOString().slice(0, 10));
          if (stat.dateFilter === "this_week") { const d = new Date(); d.setDate(d.getDate() - 7); q = q.gte("created_at", d.toISOString()); }
          const { count } = await q;
          results[stat.label] = count || 0;
        } catch { results[stat.label] = 0; }
      }
      return results;
    },
  });

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--admin-text)" }}>{agent.label}</h1>
          <span className="w-2 h-2 rounded-full" style={{ background: state.hasRecentError ? "var(--admin-error)" : state.isRunning ? "var(--admin-success)" : "var(--admin-text-tertiary)" }} />
          <span className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>
            {state.hasRecentError ? "Error" : state.isRunning ? "Running" : "Paused"}
          </span>
        </div>
        <button onClick={toggleRunning}
          className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
          style={{ background: state.isRunning ? "var(--admin-bg-hover)" : "var(--admin-accent)", color: state.isRunning ? "var(--admin-text)" : "#fff", border: state.isRunning ? "1px solid var(--admin-border-strong)" : "none" }}>
          {state.isRunning ? "Pause" : "Resume"}
        </button>
      </div>

      {/* Actions */}
      {agent.actions.length > 0 && (
        <div className="flex gap-2 mb-6">
          {agent.actions.map((action) => (
            <button key={action.fn || action.label}
              onClick={() => runAction(action.fn, action.label)}
              disabled={!!actionLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:brightness-110"
              style={action.primary
                ? { background: "var(--admin-accent)", color: "#fff" }
                : { border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }
              }>
              {actionLoading === action.fn && <Loader2 size={12} className="animate-spin" />}
              {action.label}
            </button>
          ))}
        </div>
      )}

      {actionError && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: "var(--admin-error-muted)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--admin-error)" }}>{actionError.message}</p>
          {actionError.hint && (
            <div className="mt-2">
              <p className="text-xs font-medium uppercase mb-1" style={{ color: "var(--admin-text-secondary)" }}>How to fix</p>
              <p className="text-xs" style={{ color: "var(--admin-text-secondary)" }}>{actionError.hint}</p>
            </div>
          )}
        </div>
      )}

      {agent.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {agent.stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
              <div className="text-2xl font-semibold tabular-nums" style={{ color: "var(--admin-text)" }}>{statValues?.[stat.label] ?? "—"}</div>
              <div className="text-xs mt-1" style={{ color: "var(--admin-text-tertiary)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {agent.settingsFields && agent.settingsFields.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--admin-text-tertiary)" }}>Settings</h3>
          {agent.settingsFields.map((field) => (
            <div key={field} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid var(--admin-border)" }}>
              <span className="text-sm" style={{ color: "var(--admin-text-secondary)" }}>{field}</span>
              {editingField === field ? (
                <div className="flex items-center gap-2">
                  <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                    className="px-2 py-1 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                    style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border-strong)", color: "var(--admin-text)", width: 200 }}
                    autoFocus />
                  <button onClick={() => saveField(field)} disabled={saving}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} style={{ color: "var(--admin-success)" }} />}
                  </button>
                  <button onClick={() => setEditingField(null)}><X size={14} style={{ color: "var(--admin-error)" }} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: "var(--admin-text)" }}>{String(state.settings?.[field] ?? "—")}</span>
                  <button onClick={() => { setEditingField(field); setEditValue(String(state.settings?.[field] ?? "")); }}>
                    <Pencil size={12} style={{ color: "var(--admin-text-tertiary)" }} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Requirements */}
      {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--admin-text-tertiary)" }}>Requirements</h3>
          {agent.requiredSecrets.map((secret) => {
            const hasValue = secret.settingsField && state?.settings?.[secret.settingsField];
            return (
              <div key={secret.name} className="flex items-center gap-2 mb-2">
                {hasValue ? <CheckCircle size={14} style={{ color: "var(--admin-success)" }} /> : <AlertTriangle size={14} style={{ color: "var(--admin-error)" }} />}
                <span className="text-xs font-mono" style={{ color: hasValue ? "var(--admin-text-secondary)" : "var(--admin-error)" }}>{secret.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {agent.errorsTable && (
        <div className="mb-8">
          <button onClick={() => setErrorsExpanded(!errorsExpanded)} className="flex items-center gap-2 mb-2">
            {errorsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--admin-text-tertiary)" }}>Error log</span>
          </button>
          {errorsExpanded && (
            <div>
              {(!errors || errors.length === 0) ? (
                <p className="text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No errors in the last 24 hours</p>
              ) : (
                errors.map((err: any) => (
                  <div key={err.id} className="py-2" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                    <span className="text-[11px]" style={{ color: "var(--admin-text-tertiary)" }}>{timeAgo(err.created_at)}</span>
                    <span className="ml-3 text-sm" style={{ color: "var(--admin-error)" }}>{err.error_message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {agent.stats.length === 0 && (!errors || errors.length === 0) && (
        <div className="py-10 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>
          No data yet — click an action above to run your first check.
        </div>
      )}
    </div>
  );
}

export function AgentRightSidebar({ slug }: { slug: string }) {
  const { states } = useAdminContext();
  const agent = getAgentBySlug(slug);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  if (!agent) return null;
  const state = states[agent.key];

  const runAction = async (fn: string, label: string) => {
    if (!fn) return;
    setActionLoading(fn);
    try {
      const { error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      toast.success(`${label} completed`);
    } catch (err: any) { toast.error(err.message || "Action failed"); } finally { setActionLoading(null); }
  };

  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Actions</h3>
      {agent.actions.map((action) => (
        <button key={action.fn || action.label}
          onClick={() => runAction(action.fn, action.label)}
          disabled={!!actionLoading}
          className="w-full mb-2 py-2.5 rounded-lg text-sm font-medium transition-all hover:brightness-110 flex items-center justify-center gap-2"
          style={action.primary ? { background: "var(--admin-accent)", color: "#fff" } : { border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
          {actionLoading === action.fn && <Loader2 size={12} className="animate-spin" />}
          {action.label}
        </button>
      ))}

      {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "var(--admin-text-tertiary)" }}>Requirements</h4>
          {agent.requiredSecrets.map((secret) => {
            const hasValue = secret.settingsField && state?.settings?.[secret.settingsField];
            return (
              <div key={secret.name} className="flex items-center gap-2 mb-2">
                {hasValue ? <CheckCircle size={12} style={{ color: "var(--admin-success)" }} /> : <AlertTriangle size={12} style={{ color: "var(--admin-error)" }} />}
                <span className="text-xs font-mono" style={{ color: hasValue ? "var(--admin-text-secondary)" : "var(--admin-error)" }}>{secret.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
