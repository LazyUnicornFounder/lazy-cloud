import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";

const AGENT_KEYS = ["watch", "fix", "build", "intel"];

export default function AdminAgentsPage() {
  const { states, refetch } = useAdminContext();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const agents = AGENTS.filter((a) => AGENT_KEYS.includes(a.key));
  const installed = agents.filter((a) => states[a.key]?.installed);

  const runAction = async (fn: string) => {
    if (!fn) return;
    setActionLoading(fn);
    try {
      await supabase.functions.invoke(fn);
      toast.success("Action completed");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
    setActionLoading(null);
  };

  const toggleAgent = async (agent: typeof AGENTS[0]) => {
    const state = states[agent.key];
    if (!state?.installed) return;
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: { [agent.runField]: !state.isRunning },
        match: { id: state.settings?.id },
      });
      toast.success(state.isRunning ? `${agent.label} paused` : `${agent.label} resumed`);
      refetch();
    } catch {}
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Agents</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Autonomous agents that monitor, fix, and build.</p>

      {installed.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No agent engines installed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {installed.map((agent) => {
            const state = states[agent.key];
            const primaryAction = agent.actions.find((a) => a.primary);

            return (
              <div key={agent.key} className="p-5 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{agent.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: state?.hasRecentError ? "var(--admin-error)" : state?.isRunning ? "var(--admin-success)" : "var(--admin-text-tertiary)" }} />
                    <span className="text-[11px]" style={{ color: "var(--admin-text-tertiary)" }}>
                      {state?.hasRecentError ? "Error" : state?.isRunning ? "Running" : "Paused"}
                    </span>
                  </div>
                </div>
                <p className="text-xs mb-4" style={{ color: "var(--admin-text-tertiary)" }}>{agent.subtitle}</p>
                <div className="flex gap-2">
                  {primaryAction && (
                    <button onClick={() => runAction(primaryAction.fn)} disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all hover:brightness-110"
                      style={{ background: "var(--admin-accent)", color: "#fff" }}>
                      {actionLoading === primaryAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                      Run
                    </button>
                  )}
                  <button onClick={() => toggleAgent(agent)}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
                    style={{ border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
                    {state?.isRunning ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => navigate(`/admin/${agent.slug}`)}
                    className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
                    style={{ border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
                    Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
