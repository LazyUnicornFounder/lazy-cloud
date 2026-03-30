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
        <p className="text-muted-foreground text-[13px]">Agent not found.</p>
        <Link to="/admin" className="text-primary text-[12px] mt-2 inline-block">← Back to overview</Link>
      </div>
    );
  }

  const st = states[agent.key];

  if (!st || !st.installed || !st.setupComplete) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <h2 className="text-xl font-bold mb-2">{agent.label} is not configured</h2>
        <p className="text-foreground/50 text-[13px] mb-6">Complete setup to activate this agent.</p>
        <button onClick={() => setShowSetupWizard(true)}
          className="inline-block px-6 py-3 bg-primary text-primary-foreground text-[12px] font-bold tracking-[0.1em] uppercase hover:opacity-90 transition-opacity">
          SET UP {agent.label.toUpperCase()} →
        </button>
        <br />
        <Link to="/admin" className="text-foreground/40 text-[11px] mt-4 inline-block hover:text-foreground/60">← Back</Link>
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

  const dotColor = st.isRunning ? "#4ade80" : "hsl(var(--muted-foreground))";

  return (
    <div>
      <button onClick={() => navigate("/admin")} className="flex items-center gap-1 text-[11px] text-foreground/40 hover:text-foreground/70 mb-4 transition-colors">
        <ArrowLeft size={12} /> Back to overview
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.05em] uppercase">{agent.label}</h1>
          <p className="text-[13px] text-foreground/50 mt-1">{agent.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
            <span className={st.isRunning ? "text-[#4ade80]" : "text-muted-foreground"}>
              {st.isRunning ? "RUNNING" : "PAUSED"}
            </span>
          </span>
          <button onClick={toggleRunning}
            className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-colors ${
              st.isRunning
                ? "border border-border text-foreground/60 hover:text-foreground"
                : "bg-[#4ade80] text-background"
            }`}>
            {st.isRunning ? "PAUSE" : "RESUME"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Status */}
        <div>
          {agent.stats.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {agent.stats.map((s) => (
                <div key={s.label} className="border border-border p-4">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{statValues[s.label] ?? "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-border border-dashed p-8 mb-6 text-center">
              <p className="text-[12px] text-muted-foreground">
                No data yet — click the primary action to run your first check.
              </p>
            </div>
          )}

          {/* Error log */}
          <div className="border border-border">
            <button onClick={() => setShowErrors(!showErrors)}
              className="w-full flex items-center justify-between px-4 py-3 text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-bold hover:text-foreground/70 transition-colors">
              <span>Error Log ({agentErrors.length})</span>
              {showErrors ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showErrors && (
              <div className="border-t border-foreground/5 max-h-64 overflow-y-auto">
                {agentErrors.length === 0 ? (
                  <p className="px-4 py-3 text-[12px] text-muted-foreground">No errors in the last 24 hours</p>
                ) : (
                  agentErrors.map((err: any, i: number) => (
                    <div key={i} className="px-4 py-2 border-b border-foreground/5 last:border-0">
                      <p className="text-[11px] text-destructive truncate">{err.error_message}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{timeAgo(err.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right — Actions + Settings */}
        <div>
          {agent.requiredSecrets && agent.requiredSecrets.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold mb-2">Requirements</p>
              {agent.requiredSecrets.map((sec) => {
                const hasValue = !!settings[sec.field];
                return (
                  <div key={sec.field} className="flex items-center gap-2 py-1">
                    <span className={`w-3 h-3 rounded-full text-[8px] flex items-center justify-center ${hasValue ? "bg-[#4ade80]/20 text-[#4ade80]" : "bg-destructive/20 text-destructive"}`}>
                      {hasValue ? "✓" : "!"}
                    </span>
                    <span className="text-[12px] text-foreground/60">{sec.label}</span>
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
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground/60 hover:text-foreground hover:border-foreground/30"
                }`}>
                {runningAction === action.fn ? <Loader2 size={14} className="animate-spin inline mr-2" /> : null}
                {action.label}
              </button>
            ))}
          </div>

          {/* Settings */}
          {importantFields.length > 0 && (
            <div>
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-bold mb-2">Settings</p>
              <div className="border border-border divide-y divide-foreground/5">
                {importantFields.map((field) => (
                  <div key={field} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[11px] text-foreground/50">{field.replace(/_/g, " ")}</span>
                    {editingField === field ? (
                      <div className="flex items-center gap-1">
                        <input value={editValue} onChange={(e) => setEditValue(e.target.value)}
                          className="bg-transparent border border-border text-foreground text-[11px] px-2 py-1 w-32 focus:outline-none" />
                        <button onClick={() => saveField(field)} disabled={saving}
                          className="p-1 text-[#4ade80] hover:text-[#4ade80]/80">
                          {saving ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                        </button>
                        <button onClick={() => setEditingField(null)} className="p-1 text-destructive">
                          <X size={10} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-foreground">
                          {typeof settings[field] === "boolean" ? (settings[field] ? "true" : "false") : String(settings[field] ?? "—")}
                        </span>
                        <button onClick={() => { setEditingField(field); setEditValue(String(settings[field] ?? "")); }}
                          className="p-1 text-foreground/20 hover:text-foreground/60 transition-colors">
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
