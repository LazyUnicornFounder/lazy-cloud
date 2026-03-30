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
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Agents</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Autonomous agents that monitor, fix, and build.</p>

      {installed.length === 0 ? (
        <p style={{ fontSize: 14, color: "rgba(240,234,214,0.4)" }}>No agent engines installed yet. Install Watch, Fix, Build, or Intel to see them here.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {installed.map((agent) => {
            const state = states[agent.key];
            const primaryAction = agent.actions.find((a) => a.primary);

            return (
              <div key={agent.key} className="p-5 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[17px] font-bold" style={{ color: "#f0ead6" }}>{agent.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-[7px] h-[7px] rounded-full ${state?.hasRecentError ? "bg-[#f87171]" : state?.isRunning ? "bg-[#4ade80]" : "bg-[rgba(240,234,214,0.2)]"}`} />
                    <span style={{ fontSize: 11, color: "rgba(240,234,214,0.5)" }}>
                      {state?.hasRecentError ? "Error" : state?.isRunning ? "Running" : "Paused"}
                    </span>
                  </div>
                </div>
                <p className="text-[12px] mb-4" style={{ color: "rgba(240,234,214,0.4)" }}>{agent.subtitle}</p>
                <div className="flex gap-2">
                  {primaryAction && (
                    <button onClick={() => runAction(primaryAction.fn)} disabled={!!actionLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-[0.06em]"
                      style={{ background: "#c9a84c", color: "#0a0a08" }}>
                      {actionLoading === primaryAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                      Run Now
                    </button>
                  )}
                  <button onClick={() => toggleAgent(agent)}
                    className="px-3 py-1.5 rounded text-[10px] font-bold uppercase"
                    style={{ border: "1px solid rgba(240,234,214,0.12)", color: "rgba(240,234,214,0.5)" }}>
                    {state?.isRunning ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => navigate(`/admin/${agent.slug}`)}
                    className="px-3 py-1.5 rounded text-[10px] font-bold uppercase"
                    style={{ border: "1px solid rgba(240,234,214,0.12)", color: "rgba(240,234,214,0.5)" }}>
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
