import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil, X, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { getAgentBySlug } from "./agentRegistry";
import { useQuery } from "@tanstack/react-query";
import AgentSetupWizard from "./components/AgentSetupWizard";

export default function AgentPage() {
  const { agentSlug } = useParams<{ agentSlug: string }>();
  const navigate = useNavigate();
  const { states, refetch } = useAdminContext();
  const agent = getAgentBySlug(agentSlug || "");

  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  if (!agent) {
    return (
      <div className="py-16 text-center">
        <p className="text-[#f0ead6]/40 text-[13px]">Agent not found.</p>
        <Link to="/admin" className="text-[#c9a84c] text-[12px] mt-2 inline-block">← Back to overview</Link>
      </div>
    );
  }

  const st = states[agent.key];

  // Not configured — show setup card with inline wizard
  if (!st || !st.installed || !st.setupComplete) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold mb-2">{agent.label} is not configured</h2>
        <p className="text-[#f0ead6]/50 text-[13px] mb-6">Complete setup to activate this agent.</p>
        <button onClick={() => setShowSetupWizard(true)}
          className="inline-block px-6 py-3 bg-[#c9a84c] text-[#0a0a08] text-[12px] font-bold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity">
          SET UP {agent.label.toUpperCase()} →
        </button>
        <br />
        <Link to="/admin" className="text-[#f0ead6]/40 text-[11px] mt-4 inline-block hover:text-[#f0ead6]/60">← Back</Link>
        <AgentSetupWizard
          agent={agent}
          open={showSetupWizard}
          onClose={() => setShowSetupWizard(false)}
          onComplete={() => refetch()}
        />
      </div>
    );
  }

  const runAction = async (fn: string, label: string) => {
    setRunningAction(fn);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${label} completed`);
      refetch();
    } catch (err: any) {
      const msg = err?.message || "Unknown error";
      // Show contextual fix hint
      let hint = "";
      if (/secret|api.key|unauthorized/i.test(msg)) hint = "Add the required API key in your backend secrets.";
      else if (/not found|does not exist/i.test(msg)) hint = "Check that all database tables were created. Re-run setup.";
      else if (/setup_complete/i.test(msg)) hint = "Complete the setup page first.";
      toast.error(`${label} failed — ${msg}${hint ? `\n💡 ${hint}` : ""}`);
    }
    setRunningAction(null);
  };

  const toggleRunning = async () => {
    try {
      await (supabase as any).from(agent.settingsTable).update({ [agent.runField]: !st.isRunning });
      toast.success(st.isRunning ? `${agent.label} paused` : `${agent.label} resumed`);
      refetch();
    } catch { toast.error("Failed to toggle agent"); }
  };

  const saveField = async (field: string) => {
    setSaving(true);
    try {
      await (supabase as any).from(agent.settingsTable).update({ [field]: editValue });
      toast.success("Saved");
      setEditingField(null);
      refetch();
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  // Errors query
  const { data: agentErrors = [] } = useQuery({
    queryKey: ["agent-errors", agent.key],
    queryFn: async () => {
      if (!agent.errorTable) return [];
      try {
        const { data } = await (supabase as any)
          .from(agent.errorTable)
          .select("error_message, created_at")
          .order("created_at", { ascending: false })
          .limit(10);
        return data || [];
      } catch { return []; }
    },
  });

  // Stats query
  const { data: statValues = {} } = useQuery({
    queryKey: ["agent-stats", agent.key],
    queryFn: async () => {
      const result: Record<string, number> = {};
      await Promise.all(agent.stats.map(async (s) => {
        try {
          if (s.type === "count") {
            const { count } = await (supabase as any).from(s.table).select("id", { count: "exact", head: true });
            result[s.label] = count || 0;
          } else if (s.type === "count_today") {
            const today = new Date(); today.setHours(0, 0, 0, 0);
            const { count } = await (supabase as any).from(s.table).select("id", { count: "exact", head: true }).gte(s.dateField || "created_at", today.toISOString());
            result[s.label] = count || 0;
          } else if (s.type === "count_week") {
            const week = new Date(); week.setDate(week.getDate() - 7);
            const { count } = await (supabase as any).from(s.table).select("id", { count: "exact", head: true }).gte(s.dateField || "created_at", week.toISOString());
            result[s.label] = count || 0;
          }
        } catch {}
      }));
      return result;
    },
  });

  const settings = st.settings || {};
  const importantFields = Object.keys(settings).filter(
    (k) => !["id", "created_at", "setup_complete"].includes(k) && typeof settings[k] !== "object"
  ).slice(0, 5);

  const timeAgo = (iso: string) => {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 60) return `${Math.floor(d)}s ago`;
    if (d < 3600) return `${Math.floor(d / 60)}m ago`;
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  const dotColor = st.isRunning ? "#4ade80" : "#6b7280";

  return (
    <div>
      {/* Back + Header */}
      <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-[11px] text-[#f0ead6]/40 hover:text-[#f0ead6]/70 mb-4 transition-colors">
        <ArrowLeft size={12} /> Back to overview
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.05em] uppercase">{agent.label}</h1>
          <p className="text-[13px] text-[#f0ead6]/50 mt-1">{agent.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
            <span className={st.isRunning ? "text-[#4ade80]" : "text-[#f0ead6]/40"}>
              {st.isRunning ? "RUNNING" : "PAUSED"}
            </span>
          </span>
          <button onClick={toggleRunning}
            className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${
              st.isRunning
                ? "border border-[#f0ead6]/15 text-[#f0ead6]/60 hover:text-[#f0ead6]"
                : "bg-[#4ade80] text-[#0a0a08]"
            }`}>
            {st.isRunning ? "PAUSE" : "RESUME"}
          </button>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Status */}
        <div>
          {/* Stat grid */}
          {agent.stats.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {agent.stats.map((s) => (
                <div key={s.label} className="border border-[#f0ead6]/8 p-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/50">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{statValues[s.label] ?? "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-[#f0ead6]/8 border-dashed p-8 mb-6 text-center">
              <p className="text-[12px] text-[#f0ead6]/30">
                No data yet — click the primary action to run your first check.
              </p>
            </div>
          )}

          {/* Error log */}
          <div className="border border-[#f0ead6]/8">
            <button onClick={() => setShowErrors(!showErrors)}
              className="w-full flex items-center justify-between px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50 font-bold hover:text-[#f0ead6]/70 transition-colors">
              <span>Error Log ({agentErrors.length})</span>
              {showErrors ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showErrors && (
              <div className="border-t border-[#f0ead6]/5 max-h-64 overflow-y-auto">
                {agentErrors.length === 0 ? (
                  <p className="px-4 py-3 text-[12px] text-[#f0ead6]/30">No errors in the last 24 hours</p>
                ) : (
                  agentErrors.map((err: any, i: number) => (
                    <div key={i} className="px-4 py-2 border-b border-[#f0ead6]/5 last:border-0">
                      <p className="text-[11px] text-[#f87171] truncate">{err.error_message}</p>
                      <p className="text-[9px] text-[#f0ead6]/30 mt-0.5">{timeAgo(err.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Actions + Settings */}
        <div>
          {/* Requirements */}
          {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 font-bold mb-2">Requirements</p>
              {agent.requiredSecrets.map((sec) => {
                const hasValue = !!settings[sec.field];
                return (
                  <div key={sec.field} className="flex items-center gap-2 py-1">
                    <span className={`w-3 h-3 rounded-full text-[8px] flex items-center justify-center ${hasValue ? "bg-[#4ade80]/20 text-[#4ade80]" : "bg-[#f87171]/20 text-[#f87171]"}`}>
                      {hasValue ? "✓" : "!"}
                    </span>
                    <span className="text-[12px] text-[#f0ead6]/60">{sec.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 mb-6">
            {agent.actions.map((action) => (
              <button key={action.fn}
                onClick={() => runAction(action.fn, action.label)}
                disabled={!!runningAction}
                className={`w-full py-3 text-[12px] font-bold tracking-[0.1em] uppercase transition-all disabled:opacity-40 ${
                  action.primary
                    ? "bg-[#c9a84c] text-[#0a0a08] hover:opacity-90"
                    : "border border-[#f0ead6]/15 text-[#f0ead6]/60 hover:text-[#f0ead6] hover:border-[#f0ead6]/30"
                }`}>
                {runningAction === action.fn ? <Loader2 size={14} className="animate-spin inline mr-2" /> : null}
                {action.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          {importantFields.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 font-bold mb-2">Settings</p>
              <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5">
                {importantFields.map((field) => (
                  <div key={field} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[11px] text-[#f0ead6]/50">{field.replace(/_/g, " ")}</span>
                    {editingField === field ? (
                      <div className="flex items-center gap-1">
                        <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                          className="bg-transparent border border-[#f0ead6]/20 text-[#f0ead6] text-[11px] px-2 py-1 w-32 focus:outline-none" />
                        <button onClick={() => saveField(field)} disabled={saving}
                          className="p-1 text-[#4ade80] hover:text-[#4ade80]/80">
                          {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                        </button>
                        <button onClick={() => setEditingField(null)} className="p-1 text-[#f87171]">
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#f0ead6]">
                          {typeof settings[field] === "boolean" ? (settings[field] ? "true" : "false") : String(settings[field] ?? "—")}
                        </span>
                        <button onClick={() => { setEditingField(field); setEditValue(String(settings[field] ?? "")); }}
                          className="p-1 text-[#f0ead6]/20 hover:text-[#f0ead6]/60 transition-colors">
                          <Pencil size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
