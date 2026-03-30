import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENTS } from "../agentRegistry";

export interface AgentState {
  installed: boolean;
  setupComplete: boolean;
  isRunning: boolean;
  hasRecentError: boolean;
  lastError?: string;
  promptVersion?: string;
  settings?: Record<string, any>;
}

export function useAgentDetection() {
  const [states, setStates] = useState<Record<string, AgentState>>({});
  const [loading, setLoading] = useState(true);

  const detect = useCallback(async () => {
    const result: Record<string, AgentState> = {};
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const checks = AGENTS.map(async (agent) => {
      try {
        const { data, error } = await (supabase as any)
          .from(agent.settingsTable)
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) {
          result[agent.key] = { installed: false, setupComplete: false, isRunning: false, hasRecentError: false };
          return;
        }
        if (!data) {
          result[agent.key] = { installed: true, setupComplete: false, isRunning: false, hasRecentError: false };
          return;
        }

        // Check for recent errors
        let hasRecentError = false;
        let lastError: string | undefined;
        if (agent.errorsTable) {
          try {
            const { data: errData } = await (supabase as any)
              .from(agent.errorsTable)
              .select("error_message, created_at")
              .gte("created_at", oneHourAgo)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
            if (errData) {
              hasRecentError = true;
              lastError = errData.error_message;
            }
          } catch {}
        }

        result[agent.key] = {
          installed: true,
          setupComplete: data.setup_complete !== false,
          isRunning: !!data[agent.runField],
          hasRecentError,
          lastError,
          promptVersion: data.prompt_version || undefined,
          settings: data,
        };
      } catch {
        result[agent.key] = { installed: false, setupComplete: false, isRunning: false, hasRecentError: false };
      }
    });

    await Promise.all(checks);
    setStates(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    detect();
    const interval = setInterval(detect, 60000);
    return () => clearInterval(interval);
  }, [detect]);

  return { states, loading, refetch: detect };
}
