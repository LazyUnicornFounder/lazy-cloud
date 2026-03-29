import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Download, Globe, Cpu, TrendingUp, ExternalLink, Search } from "lucide-react";

const db = supabase as any;

/* ── Category colour mapping ── */
const ENGINE_CATEGORIES: Record<string, { category: string; color: string }> = {
  blogger: { category: "Content", color: "#22c55e" },
  seo: { category: "Content", color: "#22c55e" },
  geo: { category: "Content", color: "#22c55e" },
  crawl: { category: "Content", color: "#22c55e" },
  perplexity: { category: "Content", color: "#22c55e" },
  contentful: { category: "Content", color: "#22c55e" },
  store: { category: "Commerce", color: "#f97316" },
  drop: { category: "Commerce", color: "#f97316" },
  print: { category: "Commerce", color: "#f97316" },
  pay: { category: "Commerce", color: "#f97316" },
  sms: { category: "Commerce", color: "#f97316" },
  mail: { category: "Commerce", color: "#f97316" },
  voice: { category: "Media", color: "#a855f7" },
  stream: { category: "Media", color: "#a855f7" },
  youtube: { category: "Media", color: "#a855f7" },
  github: { category: "Dev", color: "#3b82f6" },
  gitlab: { category: "Dev", color: "#3b82f6" },
  linear: { category: "Dev", color: "#3b82f6" },
  design: { category: "Dev", color: "#3b82f6" },
  auth: { category: "Dev", color: "#3b82f6" },
  granola: { category: "Dev", color: "#3b82f6" },
  admin: { category: "Ops", color: "#ef4444" },
  alert: { category: "Ops", color: "#ef4444" },
  telegram: { category: "Ops", color: "#ef4444" },
  "supabase": { category: "Ops", color: "#ef4444" },
  security: { category: "Ops", color: "#ef4444" },
  watch: { category: "Ops", color: "#ef4444" },
  fix: { category: "Ops", color: "#ef4444" },
  build: { category: "Ops", color: "#ef4444" },
  intel: { category: "Ops", color: "#ef4444" },
  repurpose: { category: "Ops", color: "#ef4444" },
  trend: { category: "Ops", color: "#ef4444" },
  churn: { category: "Ops", color: "#ef4444" },
  launch: { category: "Unicorn", color: "#c8a961" },
  waitlist: { category: "Unicorn", color: "#c8a961" },
  run: { category: "Unicorn", color: "#c8a961" },
};

const getEngineInfo = (engine: string) => {
  const key = engine.replace(/^lazy-?/i, "").toLowerCase();
  return ENGINE_CATEGORIES[key] || { category: "Other", color: "#6b7280" };
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
};

export default function AdminInstallsPage() {
  const [engineFilter, setEngineFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: installs = [], isLoading } = useQuery({
    queryKey: ["admin-installs"],
    queryFn: async () => {
      const { data, error } = await db.from("installs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as { id: string; engine: string; version: string; site_url: string; created_at: string }[];
    },
  });

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const stats = useMemo(() => {
    const uniqueSites = new Set(installs.map((i: any) => i.site_url)).size;
    const thisWeek = installs.filter((i: any) => i.created_at >= weekAgo).length;
    const engineCounts: Record<string, number> = {};
    installs.forEach((i: any) => { engineCounts[i.engine] = (engineCounts[i.engine] || 0) + 1; });
    const topEngine = Object.entries(engineCounts).sort((a, b) => b[1] - a[1])[0];
    return { total: installs.length, uniqueSites, thisWeek, topEngine: topEngine?.[0] || "—" };
  }, [installs, weekAgo]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    installs.forEach((i: any) => { counts[i.engine] = (counts[i.engine] || 0) + 1; });
    return Object.entries(counts)
      .map(([engine, count]) => ({ engine, count, fill: getEngineInfo(engine).color }))
      .sort((a, b) => b.count - a.count);
  }, [installs]);

  const distinctEngines = useMemo(() => [...new Set(installs.map((i: any) => i.engine))].sort(), [installs]);

  const filtered = useMemo(() => {
    let result = installs;
    if (engineFilter) result = result.filter((i: any) => i.engine === engineFilter);
    if (search) result = result.filter((i: any) => i.site_url.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [installs, engineFilter, search]);

  const statCards = [
    { label: "Total Installs", value: stats.total, icon: Download },
    { label: "Unique Sites", value: stats.uniqueSites, icon: Globe },
    { label: "Most Popular", value: stats.topEngine, icon: Cpu },
    { label: "This Week", value: stats.thisWeek, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight">Installs</h1>
        <p className="font-body text-[13px] text-[#f0ead6]/50 mt-1">Track agent installations across all sites.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#f0ead6]/5">
        {statCards.map((s) => (
          <div key={s.label} className="bg-[#0a0a08] border border-[#f0ead6]/5 p-5">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={13} className="text-[#f0ead6]/40" />
              <span className="font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50">{s.label}</span>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="border border-[#f0ead6]/8 p-6">
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/50 mb-4">Installs per Engine</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="engine" tick={{ fill: "#f0ead6", opacity: 0.5, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#f0ead6", opacity: 0.4, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0a0a08", border: "1px solid rgba(240,234,214,0.15)", color: "#f0ead6", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 }}
                cursor={{ fill: "rgba(240,234,214,0.03)" }}
              />
              <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f0ead6]/30" />
          <input
            type="text"
            placeholder="Search by site URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] pl-9 pr-4 py-2 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30"
          />
        </div>
        <select
          value={engineFilter}
          onChange={(e) => setEngineFilter(e.target.value)}
          className="bg-[#0a0a08] border border-[#f0ead6]/10 text-[#f0ead6] px-4 py-2 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30 appearance-none cursor-pointer"
        >
          <option value="">All engines</option>
          {distinctEngines.map((e: string) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[#f0ead6]/8 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#f0ead6]/8">
              <th className="text-left px-4 py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50">Site URL</th>
              <th className="text-left px-4 py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50">Engine</th>
              <th className="text-left px-4 py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50">Version</th>
              <th className="text-left px-4 py-3 font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/50">Installed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0ead6]/5">
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-[#f0ead6]/40">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center font-body text-sm text-[#f0ead6]/40">No installs found.</td></tr>
            ) : filtered.map((install: any) => {
              const info = getEngineInfo(install.engine);
              return (
                <tr key={install.id} className="hover:bg-[#f0ead6]/3 transition-colors">
                  <td className="px-4 py-3">
                    <a href={install.site_url.startsWith("http") ? install.site_url : `https://${install.site_url}`} target="_blank" rel="noopener noreferrer"
                      className="font-body text-sm text-[#c8a961] hover:text-[#c8a961]/80 inline-flex items-center gap-1.5 transition-colors">
                      {install.site_url}
                      <ExternalLink size={11} />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 font-body text-[11px] tracking-[0.1em] uppercase font-medium border"
                      style={{ color: info.color, borderColor: `${info.color}33` }}>
                      {install.engine}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-[#f0ead6]/60">{install.version}</td>
                  <td className="px-4 py-3 font-body text-sm text-[#f0ead6]/50" title={new Date(install.created_at).toLocaleString()}>
                    {timeAgo(install.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
