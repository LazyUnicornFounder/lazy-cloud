import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTrackEvent() {
  const trackEvent = useCallback(
    async (eventName: string, eventData: Record<string, unknown> = {}, page?: string) => {
      if (localStorage.getItem("is_admin") === "true") return;
      try {
        await supabase.from("analytics_events").insert([{
          event_name: eventName,
          event_data: eventData as any,
          page: page || window.location.pathname,
        }]);
      } catch {
        // silent — analytics should never break the app
      }
    },
    []
  );

  return trackEvent;
}
