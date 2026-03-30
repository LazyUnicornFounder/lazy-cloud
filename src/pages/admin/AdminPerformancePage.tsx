import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function AdminPerformancePage() {
  const now = new Date();

  const { data: velocityData } = useQuery({
    queryKey: ["admin-perf-velocity"],
    queryFn: async () => {
      const days: Record<string, { blog: number; seo: number; geo: number }> = {};
      for (let d = 29; d >= 0; d--) days[new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10)] = { blog: 0, seo: 0, geo: 0 };
      const tables = [
        { table: "blog_posts", key: "blog", dateField: "created_at" },
        { table: "seo_posts", key: "seo", dateField: "published_at" },
        { table: "geo_posts", key: "geo", dateField: "published_at" },
      ];
      for (const { table, key, dateField } of tables) {
        try {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
          const { data } = await (supabase as any).from(table).select(dateField).gte(dateField, thirtyDaysAgo);
          if (data) for (const row of data) { const date = row[dateField]?.slice(0, 10); if (date && days[date]) (days[date] as any)[key]++; }
        } catch {}
      }
      return Object.entries(days).map(([date, counts]) => ({ date: date.slice(5), ...counts }));
    },
  });

  const { data: errorData } = useQuery({
    queryKey: ["admin-perf-errors"],
    queryFn: async () => {
      const tables = ["blog_errors", "seo_errors", "geo_errors", "voice_errors", "stream_errors", "granola_errors"];
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
      const counts: Record<string, number> = {};
      for (const table of tables) {
        try {
          const { count } = await (supabase as any).from(table).select("id", { count: "exact", head: true }).gte("created_at", weekAgo);
          const name = table.replace("_errors", "").replace(/^\w/, (c: string) => c.toUpperCase());
          if (count && count > 0) counts[name] = count;
        } catch {}
      }
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([engine, count]) => ({ engine, count }));
    },
  });

  const { data: installData } = useQuery({
    queryKey: ["admin-perf-installs"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();
      const { data } = await supabase.from("installs").select("created_at").gte("created_at", thirtyDaysAgo);
      const dailyCounts: Record<string, number> = {};
      for (let d = 29; d >= 0; d--) dailyCounts[new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10)] = 0;
      let cumulative = 0;
      if (data) for (const row of data) { const date = row.created_at.slice(0, 10); if (dailyCounts[date] !== undefined) dailyCounts[date]++; }
      return Object.entries(dailyCounts).map(([date, count]) => { cumulative += count; return { date: date.slice(5), total: cumulative }; });
    },
  });

  const tooltipStyle = { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", color: "#fafafa", fontSize: 12, borderRadius: 8 };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Performance</h1>
      <p className="text-sm mb-8" style={{ color: "var(--admin-text-tertiary)" }}>Key metrics across all engines.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Content velocity (30 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={velocityData || []}>
              <XAxis dataKey="date" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="blog" stroke="var(--admin-accent)" strokeWidth={2} dot={false} name="Blog" />
              <Line type="monotone" dataKey="seo" stroke="#8b5cf6" strokeWidth={2} dot={false} name="SEO" />
              <Line type="monotone" dataKey="geo" stroke="var(--admin-success)" strokeWidth={2} dot={false} name="GEO" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Error rate (7 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={errorData || []}>
              <XAxis dataKey="engine" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="var(--admin-error)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Install growth (30 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={installData || []}>
              <XAxis dataKey="date" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <YAxis tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="total" stroke="var(--admin-accent)" fill="var(--admin-accent-muted)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
