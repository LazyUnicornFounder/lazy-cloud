import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePresenceCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel("live-visitors", {
      config: { presence: { key: crypto.randomUUID() } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
