import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENTS } from "../agentRegistry";

/**
 * Detects which agents are installed by checking if their settings table exists.
 * Tries a limit-1 select on each table — if it doesn't error, the table exists.
 */
export function useAgentDetection() {
  const [installed, setInstalled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detect() {
      const found = new Set<string>();
      const checks = AGENTS.map(async (agent) => {
        try {
          const { error } = await (supabase as any)
            .from(agent.settingsTable)
            .select("id", { count: "exact", head: true });
          if (!error) found.add(agent.key);
        } catch {
          // table doesn't exist
        }
      });
      await Promise.all(checks);
      setInstalled(found);
      setLoading(false);
    }
    detect();
  }, []);

  return { installed, loading };
}
