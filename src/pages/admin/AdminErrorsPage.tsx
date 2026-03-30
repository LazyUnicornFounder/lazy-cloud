import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ERROR_TABLES = [
  { table: "blog_errors", engine: "Blogger" },
  { table: "seo_errors", engine: "SEO" },
  { table: "geo_errors", engine: "GEO" },
  { table: "voice_errors", engine: "Voice" },
  { table: "stream_errors", engine: "Stream" },
  { table: "granola_errors", engine: "Granola" },
  { table: "waitlist_errors", engine: "Waitlist" },
];

interface ErrorRow {
  id: string;
  engine: string;
  error_message: string;
  created_at: string;
  function_name?: string;
}

export default function AdminErrorsPage() {
  const [engineFilter, setEngineFilter] = useState<string>("All");

  const { data: errors, isLoading } = useQuery({
    queryKey: ["admin-errors-unified"],
    queryFn: async () => {
      const rows: ErrorRow[] = [];
      for (const { table, engine } of ERROR_TABLES) {
        try {
          const { data } = await (supabase as any).from(table).select("*").order("created_at", { ascending: false }).limit(50);
          if (data) {
            rows.push(...data.map((r: any) => ({
              id: r.id,
              engine,
              error_message: r.error_message || "Unknown error",
              created_at: r.created_at,
              function_name: r.function_name,
            })));
          }
        } catch {}
      }
      rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return rows;
    },
  });

  const all = errors || [];
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 86400000);
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const last24h = all.filter((e) => new Date(e.created_at) >= dayAgo).length;
  const last7d = all.filter((e) => new Date(e.created_at) >= weekAgo).length;

  // Per-engine chart
  const byEngine: Record<string, number> = {};
  for (const e of all.filter((e) => new Date(e.created_at) >= weekAgo)) {
    byEngine[e.engine] = (byEngine[e.engine] || 0) + 1;
  }
  const chartData = Object.entries(byEngine).sort((a, b) => b[1] - a[1]).map(([engine, count]) => ({ engine, count }));

  const engines = ["All", ...new Set(all.map((e) => e.engine))];
  const filtered = engineFilter === "All" ? all : all.filter((e) => e.engine === engineFilter);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Errors</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Unified error log across all engines.</p>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>Last 24h</div>
          <div className="text-[20px] font-bold" style={{ color: last24h > 0 ? "#f87171" : "#f0ead6" }}>{last24h}</div>
        </div>
        <div className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>Last 7 Days</div>
          <div className="text-[20px] font-bold" style={{ color: last7d > 0 ? "#f87171" : "#f0ead6" }}>{last7d}</div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="p-4 rounded-lg mb-6" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <h3 className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4" style={{ color: "rgba(240,234,214,0.3)" }}>Errors by Engine (7 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" tick={{ fill: "rgba(240,234,214,0.3)", fontSize: 10 }} />
              <YAxis type="category" dataKey="engine" tick={{ fill: "rgba(240,234,214,0.5)", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#1a1a16", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6", fontSize: 12 }} />
              <Bar dataKey="count" fill="#f87171" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {engines.map((e) => (
          <button key={e} onClick={() => setEngineFilter(e)}
            className="px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-[0.06em]"
            style={{ background: engineFilter === e ? "rgba(248,113,113,0.15)" : "rgba(240,234,214,0.04)", color: engineFilter === e ? "#f87171" : "rgba(240,234,214,0.5)" }}>
            {e}
          </button>
        ))}
      </div>

      {/* Error feed */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
        {isLoading ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.4)", fontSize: 13 }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No errors found. 🎉</div>
        ) : (
          filtered.slice(0, 200).map((e) => (
            <div key={e.id} className="flex items-start gap-3 py-3 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)" }}>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase flex-shrink-0 mt-0.5" style={{ background: "rgba(248,113,113,0.12)", color: "#f87171" }}>{e.engine}</span>
              <div className="flex-1 min-w-0">
                {e.function_name && <span className="text-[11px] font-mono mr-2" style={{ color: "rgba(240,234,214,0.4)" }}>{e.function_name}</span>}
                <span className="text-[13px]" style={{ color: "#f0ead6" }}>{e.error_message.slice(0, 120)}</span>
              </div>
              <span className="text-[11px] flex-shrink-0" style={{ color: "rgba(240,234,214,0.3)" }}>{timeAgo(e.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
