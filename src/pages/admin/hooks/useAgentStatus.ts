import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AGENTS, type AgentConfig } from "../agentRegistry";

export interface AgentStatus {
  key: string;
  running: boolean;
  errorsToday: number;
}

async function fetchStatuses(installed: Set<string>): Promise<Record<string, AgentStatus>> {
  const result: Record<string, AgentStatus> = {};
  const agents = AGENTS.filter((a) => installed.has(a.key));

  const tasks = agents.map(async (agent) => {
    let running = false;
    try {
      const { data } = await (supabase as any)
        .from(agent.settingsTable)
        .select(agent.runField)
        .limit(1)
        .single();
      if (data) running = !!data[agent.runField];
    } catch {}

    let errorsToday = 0;
    if (agent.errorsTable) {
      try {
        const since = new Date();
        since.setHours(0, 0, 0, 0);
        const { count } = await (supabase as any)
          .from(agent.errorsTable)
          .select("id", { count: "exact", head: true })
          .gte("created_at", since.toISOString());
        errorsToday = count || 0;
      } catch {}
    }

    result[agent.key] = { key: agent.key, running, errorsToday };
  });

  await Promise.all(tasks);
  return result;
}

export function useAgentStatuses(installed: Set<string>) {
  return useQuery({
    queryKey: ["agent-statuses", Array.from(installed).sort().join(",")],
    queryFn: () => fetchStatuses(installed),
    refetchInterval: 60_000,
    enabled: installed.size > 0,
  });
}
