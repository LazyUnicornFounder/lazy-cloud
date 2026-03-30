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

  if (!agent) {
    return <div className="py-10 text-center" style={{ color: "rgba(240,234,214,0.5)" }}>Agent not found</div>;
  }

  const state = states[agent.key];

  if (!state?.installed || !state?.setupComplete) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-[22px] font-bold mb-3" style={{ color: "#f0ead6" }}>{agent.label} is not configured</h2>
        <p className="mb-6" style={{ fontSize: 14, color: "rgba(240,234,214,0.5)" }}>Complete setup to activate this agent.</p>
        <button onClick={() => navigate(`/lazy-${agent.slug}-setup`)}
          className="px-5 py-2.5 rounded-md text-[12px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-90"
          style={{ background: "#c9a84c", color: "#0a0a08" }}>
          SET UP {agent.label.toUpperCase()} →
        </button>
      </div>
    );
  }

  const toggleRunning = async () => {
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: { [agent.runField]: !state.isRunning },
        match: { id: state.settings?.id },
      });
      toast.success(state.isRunning ? `${agent.label} paused` : `${agent.label} resumed`);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    }
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
    } finally {
      setActionLoading(null);
    }
  };

  const saveField = async (field: string) => {
    setSaving(true);
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: { [field]: editValue },
        match: { id: state.settings?.id },
      });
      toast.success("Saved");
      setEditingField(null);
      refetch();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Errors query
  const { data: errors } = useQuery({
    queryKey: ["agent-errors", agent.errorsTable],
    queryFn: async () => {
      if (!agent.errorsTable) return [];
      try {
        const { data } = await (supabase as any)
          .from(agent.errorsTable)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        return data || [];
      } catch { return []; }
    },
    enabled: !!agent.errorsTable,
  });

  // Stats query
  const { data: statValues } = useQuery({
    queryKey: ["agent-stats", agent.key],
    queryFn: async () => {
      const results: Record<string, number> = {};
      for (const stat of agent.stats) {
        try {
          let q = (supabase as any).from(stat.table).select("id", { count: "exact", head: true });
          if (stat.filter) {
            for (const [k, v] of Object.entries(stat.filter)) q = q.eq(k, v);
          }
          if (stat.dateFilter === "today") {
            q = q.gte("created_at", new Date().toISOString().slice(0, 10));
          }
          if (stat.dateFilter === "this_week") {
            const d = new Date();
            d.setDate(d.getDate() - 7);
            q = q.gte("created_at", d.toISOString());
          }
          const { count } = await q;
          results[stat.label] = count || 0;
        } catch {
          results[stat.label] = 0;
        }
      }
      return results;
    },
  });

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-bold" style={{ color: "#f0ead6" }}>{agent.label}</h1>
          <span className={`w-[8px] h-[8px] rounded-full ${state.hasRecentError ? "bg-[#f87171]" : state.isRunning ? "bg-[#4ade80]" : "bg-[rgba(240,234,214,0.2)]"}`} />
          <span style={{ fontSize: 13, color: "rgba(240,234,214,0.5)" }}>
            {state.hasRecentError ? "Error" : state.isRunning ? "Running" : "Paused"}
          </span>
        </div>
        <button onClick={toggleRunning}
          className="px-4 py-1.5 rounded text-[11px] font-bold uppercase tracking-[0.08em] transition-opacity hover:opacity-90"
          style={{ background: state.isRunning ? "rgba(240,234,214,0.08)" : "#c9a84c", color: state.isRunning ? "#f0ead6" : "#0a0a08" }}>
          {state.isRunning ? "PAUSE" : "RESUME"}
        </button>
      </div>

      {/* Action error */}
      {actionError && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <p className="text-[13px] font-bold mb-1" style={{ color: "#f87171" }}>{actionError.message}</p>
          {actionError.hint && (
            <div className="mt-2">
              <p className="text-[11px] font-bold uppercase mb-1" style={{ color: "rgba(240,234,214,0.5)" }}>How to fix</p>
              <p className="text-[12px]" style={{ color: "rgba(240,234,214,0.6)" }}>{actionError.hint}</p>
            </div>
          )}
        </div>
      )}

      {/* Stats grid */}
      {agent.stats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {agent.stats.map((stat) => (
            <div key={stat.label} className="p-4 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
              <div className="text-[24px] font-bold" style={{ color: "#f0ead6" }}>
                {statValues?.[stat.label] ?? "—"}
              </div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(240,234,214,0.4)", marginTop: 4 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      {agent.settingsFields && agent.settingsFields.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-3" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
            SETTINGS
          </h3>
          {agent.settingsFields.map((field) => (
            <div key={field} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(240,234,214,0.04)" }}>
              <span style={{ fontSize: 13, color: "rgba(240,234,214,0.5)" }}>{field}</span>
              {editingField === field ? (
                <div className="flex items-center gap-2">
                  <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                    className="px-2 py-1 rounded text-[13px] font-display"
                    style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.15)", color: "#f0ead6", width: 200 }}
                    autoFocus
                  />
                  <button onClick={() => saveField(field)} disabled={saving}>
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} style={{ color: "#4ade80" }} />}
                  </button>
                  <button onClick={() => setEditingField(null)}><X size={14} style={{ color: "#f87171" }} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 13, color: "#f0ead6" }}>{String(state.settings?.[field] ?? "—")}</span>
                  <button onClick={() => { setEditingField(field); setEditValue(String(state.settings?.[field] ?? "")); }}>
                    <Pencil size={12} style={{ color: "rgba(240,234,214,0.3)" }} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error log */}
      {agent.errorsTable && (
        <div className="mb-8">
          <button onClick={() => setErrorsExpanded(!errorsExpanded)} className="flex items-center gap-2 mb-2">
            {errorsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
              ERROR LOG
            </span>
          </button>
          {errorsExpanded && (
            <div>
              {(!errors || errors.length === 0) ? (
                <p style={{ fontSize: 13, color: "rgba(240,234,214,0.35)" }}>No errors in the last 24 hours</p>
              ) : (
                errors.map((err: any) => (
                  <div key={err.id} className="py-2" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)" }}>
                    <span style={{ fontSize: 11, color: "rgba(240,234,214,0.3)" }}>{timeAgo(err.created_at)}</span>
                    <span className="ml-3" style={{ fontSize: 13, color: "#f87171" }}>{err.error_message}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {agent.stats.length === 0 && (!errors || errors.length === 0) && (
        <div className="py-10 text-center" style={{ color: "rgba(240,234,214,0.4)", fontSize: 14 }}>
          No data yet — click the primary action to run your first check.
        </div>
      )}
    </div>
  );
}

// Right sidebar for agent detail
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
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>
      <h3 className="mb-4" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
        ACTIONS
      </h3>

      {agent.actions.map((action) => (
        <button key={action.fn || action.label}
          onClick={() => runAction(action.fn, action.label)}
          disabled={!!actionLoading}
          className="w-full mb-2 py-2.5 rounded-md text-[13px] font-bold uppercase tracking-[0.06em] transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
          style={action.primary
            ? { background: "#c9a84c", color: "#0a0a08" }
            : { border: "1px solid rgba(240,234,214,0.12)", color: "rgba(240,234,214,0.6)", background: "transparent" }
          }
        >
          {actionLoading === action.fn && <Loader2 size={12} className="animate-spin" />}
          {action.label} {action.primary && "→"}
        </button>
      ))}

      {/* Requirements */}
      {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,234,214,0.3)" }}>
            REQUIREMENTS
          </h4>
          {agent.requiredSecrets.map((secret) => {
            const hasValue = secret.settingsField && state?.settings?.[secret.settingsField];
            return (
              <div key={secret.name} className="flex items-center gap-2 mb-2">
                {hasValue ? <CheckCircle size={12} style={{ color: "#4ade80" }} /> : <AlertTriangle size={12} style={{ color: "#f87171" }} />}
                <span style={{ fontSize: 12, fontFamily: "monospace", color: hasValue ? "rgba(240,234,214,0.6)" : "#f87171" }}>
                  {secret.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

