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

  // Stats
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  const thisWeek = all.filter((i) => new Date(i.created_at) >= weekAgo).length;
  const thisMonth = all.filter((i) => new Date(i.created_at) >= monthAgo).length;
  const uniqueSites = new Set(all.map((i) => i.site_url)).size;

  // Per-engine chart data
  const byEngine: Record<string, number> = {};
  for (const i of all) { byEngine[i.engine] = (byEngine[i.engine] || 0) + 1; }
  const engineChartData = Object.entries(byEngine).sort((a, b) => b[1] - a[1]).map(([engine, count]) => ({ engine, count }));

  // Daily chart data (last 30 days)
  const dailyCounts: Record<string, number> = {};
  for (let d = 29; d >= 0; d--) {
    const date = new Date(now.getTime() - d * 86400000).toISOString().slice(0, 10);
    dailyCounts[date] = 0;
  }
  for (const i of all) {
    const date = i.created_at.slice(0, 10);
    if (dailyCounts[date] !== undefined) dailyCounts[date]++;
  }
  const dailyChartData = Object.entries(dailyCounts).map(([date, count]) => ({ date: date.slice(5), count }));

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Installs</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Engine installations across all projects.</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "All Time", value: all.length, color: "#f0ead6" },
          { label: "This Week", value: thisWeek, color: "#c9a84c" },
          { label: "This Month", value: thisMonth, color: "#c9a84c" },
          { label: "Unique Sites", value: uniqueSites, color: "#60a5fa" },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>{s.label}</div>
            <div className="text-[24px] font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {engineChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
            <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4" style={{ color: "rgba(240,234,214,0.3)" }}>Installs per Engine</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={engineChartData}>
                <XAxis dataKey="engine" tick={{ fill: "rgba(240,234,214,0.4)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(240,234,214,0.3)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1a1a16", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6", fontSize: 12 }} />
                <Bar dataKey="count" fill="#c9a84c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-4 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
            <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4" style={{ color: "rgba(240,234,214,0.3)" }}>Daily Installs (30 days)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyChartData}>
                <XAxis dataKey="date" tick={{ fill: "rgba(240,234,214,0.4)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(240,234,214,0.3)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1a1a16", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#c9a84c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
        <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
          <div style={{ flex: 2 }}>Site URL</div>
          <div style={{ flex: 1 }}>Engine</div>
          <div style={{ flex: 0.6 }}>Version</div>
          <div style={{ flex: 1 }}>Installed</div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.4)", fontSize: 13 }}>Loading…</div>
        ) : all.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No installs tracked yet.</div>
        ) : (
          all.slice(0, 100).map((i) => (
            <div key={i.id} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
              <div style={{ flex: 2 }}>
                <a href={i.site_url} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "underline" }}>{i.site_url}</a>
              </div>
              <div style={{ flex: 1 }}>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}>{i.engine}</span>
              </div>
              <div style={{ flex: 0.6, color: "rgba(240,234,214,0.5)" }}>{i.version}</div>
              <div style={{ flex: 1, color: "rgba(240,234,214,0.4)" }}>{format(new Date(i.created_at), "MMM d, yyyy")}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
