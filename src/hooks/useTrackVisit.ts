import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

let tracked = false;

export function useTrackVisit() {
  useEffect(() => {
    if (tracked) return;
    tracked = true;

    const track = async () => {
      try {
        await supabase.functions.invoke("track-visit", {
          body: {
            page: window.location.pathname + window.location.hash,
            referrer: document.referrer || "",
          },
        });
      } catch {
        // silent fail - don't break the app for analytics
      }
    };
    track();
  }, []);
}
