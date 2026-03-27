import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Zap, Search, Brain } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Action {
  label: string;
  fnName: string;
  icon: typeof Zap;
  body?: Record<string, any>;
}

export default function QuickActions({ actions, queryKeys }: { actions: Action[]; queryKeys: string[] }) {
  const [running, setRunning] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const run = async (action: Action) => {
    setRunning(action.fnName);
    try {
      const { error } = await supabase.functions.invoke(action.fnName, { body: action.body });
      if (error) throw error;
      toast.success(`${action.label} completed`);
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    } catch {
      toast.error(`${action.label} failed`);
    }
    setRunning(null);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      {actions.map((a) => (
        <button
          key={a.fnName}
          onClick={() => run(a)}
          disabled={!!running}
          className="inline-flex items-center gap-2 border border-[#f0ead6]/10 px-4 py-2.5 font-body text-xs text-[#f0ead6]/92 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40"
        >
          {running === a.fnName ? <Loader2 size={12} className="animate-spin" /> : <a.icon size={12} />}
          {a.label}
        </button>
      ))}
    </div>
  );
}

export { Zap, Search, Brain };
