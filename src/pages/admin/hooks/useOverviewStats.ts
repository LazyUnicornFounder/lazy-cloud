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

      // Copies today
      const copiesToday = await (async () => {
        try {
          const { data } = await adminWrite({
            table: "prompt_versions", operation: "select", match: {},
          });
          return 0;
        } catch { return 0; }
      })();

      return {
        postsToday: blogToday + seoToday + geoToday,
        errorsToday,
      };
    },
    refetchInterval: 30000,
  });
}
