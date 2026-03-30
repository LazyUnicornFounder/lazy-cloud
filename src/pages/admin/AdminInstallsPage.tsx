import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function AdminInstallsPage() {
  const { data: installs, isLoading } = useQuery({
    queryKey: ["admin-installs"],
    queryFn: async () => {
      const { data } = await supabase.from("installs").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  const all = installs || [];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  const thisWeek = all.filter((i) => new Date(i.created_at) >= weekAgo).length;
  const thisMonth = all.filter((i) => new Date(i.created_at) >= monthAgo).length;
  const uniqueSites = new Set(all.map((i) => i.site_url)).size;

  const byEngine: Record<string, number> = {};
  for (const i of all) byEngine[i.engine] = (byEngine[i.engine] || 0) + 1;
  const engineChartData = Object.entries(byEngine).sort((a, b) => b[1] - a[1]).map(([engine, count]) => ({ engine, count }));

  const dailyCounts: Record<string, number> = {};
  for (let d = 29; d >= 0; d--) dailyCounts[new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10)] = 0;
  for (const i of all) { const date = i.created_at.slice(0, 10); if (dailyCounts[date] !== undefined) dailyCounts[date]++; }
  const dailyChartData = Object.entries(dailyCounts).map(([date, count]) => ({ date: date.slice(5), count }));

  const tooltipStyle = { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", color: "#fafafa", fontSize: 12, borderRadius: 8 };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Installs</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Engine installations across all projects.</p>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "All time", value: all.length },
          { label: "This week", value: thisWeek },
          { label: "This month", value: thisMonth },
          { label: "Unique sites", value: uniqueSites },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--admin-text-tertiary)" }}>{s.label}</div>
            <div className="text-2xl font-semibold tabular-nums" style={{ color: "var(--admin-text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {engineChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Per engine</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engineChartData}>
                <XAxis dataKey="engine" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="var(--admin-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Daily (30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChartData}>
                <XAxis dataKey="date" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
                <YAxis tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="count" stroke="var(--admin-accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
        <div className="grid grid-cols-[1fr_120px_80px_120px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
          <div>Site URL</div><div>Engine</div><div>Version</div><div>Installed</div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>Loading…</div>
        ) : all.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No installs tracked yet.</div>
        ) : (
          all.slice(0, 100).map((i) => (
            <div key={i.id} className="grid grid-cols-[1fr_120px_80px_120px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
              <div><a href={i.site_url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--admin-accent)" }}>{i.site_url}</a></div>
              <div><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: "var(--admin-accent-muted)", color: "var(--admin-accent)" }}>{i.engine}</span></div>
              <div style={{ color: "var(--admin-text-secondary)" }}>{i.version}</div>
              <div style={{ color: "var(--admin-text-tertiary)" }}>{format(new Date(i.created_at), "MMM d, yyyy")}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
