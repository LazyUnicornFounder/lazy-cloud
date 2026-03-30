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

interface ErrorRow { id: string; engine: string; error_message: string; created_at: string; function_name?: string; }

export default function AdminErrorsPage() {
  const [engineFilter, setEngineFilter] = useState<string>("All");

  const { data: errors, isLoading } = useQuery({
    queryKey: ["admin-errors-unified"],
    queryFn: async () => {
      const rows: ErrorRow[] = [];
      for (const { table, engine } of ERROR_TABLES) {
        try {
          const { data } = await (supabase as any).from(table).select("*").order("created_at", { ascending: false }).limit(50);
          if (data) rows.push(...data.map((r: any) => ({ id: r.id, engine, error_message: r.error_message || "Unknown error", created_at: r.created_at, function_name: r.function_name })));
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

  const byEngine: Record<string, number> = {};
  for (const e of all.filter((e) => new Date(e.created_at) >= weekAgo)) byEngine[e.engine] = (byEngine[e.engine] || 0) + 1;
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
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Errors</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Unified error log across all engines.</p>

      <div className="flex gap-3 mb-6">
        {[
          { label: "Last 24h", value: last24h, isError: last24h > 0 },
          { label: "Last 7 days", value: last7d, isError: last7d > 0 },
        ].map((s, i) => (
          <div key={i} className="px-4 py-3 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--admin-text-tertiary)" }}>{s.label}</div>
            <div className="text-xl font-semibold tabular-nums" style={{ color: s.isError ? "var(--admin-error)" : "var(--admin-text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="p-4 rounded-lg mb-6" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
          <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: "var(--admin-text-tertiary)" }}>Errors by engine (7 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" tick={{ fill: "var(--admin-text-tertiary)", fontSize: 10 }} />
              <YAxis type="category" dataKey="engine" tick={{ fill: "var(--admin-text-secondary)", fontSize: 11 }} width={80} />
              <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", color: "#fafafa", fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="count" fill="var(--admin-error)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex gap-1 mb-4 flex-wrap p-1 rounded-lg w-fit" style={{ background: "var(--admin-bg-elevated)" }}>
        {engines.map((e) => (
          <button key={e} onClick={() => setEngineFilter(e)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ background: engineFilter === e ? "var(--admin-bg-hover)" : "transparent", color: engineFilter === e ? "var(--admin-text)" : "var(--admin-text-secondary)" }}>
            {e}
          </button>
        ))}
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No errors found. 🎉</div>
        ) : (
          filtered.slice(0, 200).map((e) => (
            <div key={e.id} className="flex items-start gap-3 py-3 px-4" style={{ borderBottom: "1px solid var(--admin-border)" }}>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5" style={{ background: "var(--admin-error-muted)", color: "var(--admin-error)" }}>{e.engine}</span>
              <div className="flex-1 min-w-0">
                {e.function_name && <span className="text-[11px] font-mono mr-2" style={{ color: "var(--admin-text-tertiary)" }}>{e.function_name}</span>}
                <span className="text-sm" style={{ color: "var(--admin-text)" }}>{e.error_message.slice(0, 120)}</span>
              </div>
              <span className="text-[11px] flex-shrink-0" style={{ color: "var(--admin-text-tertiary)" }}>{timeAgo(e.created_at)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
