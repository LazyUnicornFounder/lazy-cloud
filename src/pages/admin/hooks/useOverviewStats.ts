import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminWrite } from "@/lib/adminWrite";

export function useOverviewStats() {
  return useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const todayIso = new Date().toISOString().slice(0, 10);

      const safeCount = async (table: string, filter?: Record<string, any>, dateFilter?: string) => {
        try {
          let q = (supabase as any).from(table).select("id", { count: "exact", head: true });
          if (dateFilter) q = q.gte("created_at", dateFilter).lt("created_at", dateFilter + "T23:59:59.999Z");
          if (filter) {
            for (const [k, v] of Object.entries(filter)) {
              q = q.eq(k, v);
            }
          }
          const { count } = await q;
          return count || 0;
        } catch {
          return 0;
        }
      };

      const [blogToday, seoToday, geoToday] = await Promise.all([
        safeCount("blog_posts", { status: "published" }, todayIso),
        safeCount("seo_posts", { status: "published" }, todayIso),
        safeCount("geo_posts", { status: "published" }, todayIso),
      ]);

      // Errors today across all error tables
      const errorTables = ["blog_errors", "seo_errors", "geo_errors", "voice_errors", "stream_errors", "granola_errors"];
      const errorCounts = await Promise.all(errorTables.map((t) => safeCount(t, undefined, todayIso)));
      const errorsToday = errorCounts.reduce((a, b) => a + b, 0);

      // Per-agent copy counts from analytics_events
      const copiesByAgent: Record<string, number> = {};
      try {
        const pw = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("admin_pw") || "" : "";
        const { data: copyData } = await adminWrite({
          table: "analytics_events",
          operation: "select",
          match: { event_name: "prompt_copied" },
        });
        if (Array.isArray(copyData)) {
          for (const row of copyData) {
            const product = (row.event_data as any)?.product || (row.page as string) || "unknown";
            const key = product.replace(/^\/lazy-/, "").replace(/^lazy-/, "").replace(/\/$/, "");
            copiesByAgent[key] = (copiesByAgent[key] || 0) + 1;
          }
        }
      } catch {}

      // Per-agent install counts from installs table
      const installsByAgent: Record<string, number> = {};
      try {
        const { data: installData } = await supabase.from("installs").select("engine");
        if (Array.isArray(installData)) {
          for (const row of installData) {
            const key = (row.engine || "unknown").replace(/^lazy-/, "");
            installsByAgent[key] = (installsByAgent[key] || 0) + 1;
          }
        }
      } catch {}

      return {
        postsToday: blogToday + seoToday + geoToday,
        errorsToday,
        copiesByAgent,
        installsByAgent,
      };
    },
    refetchInterval: 30000,
  });
}
