import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CATEGORY_META, AGENTS } from "./agentRegistry";
import { Loader2 } from "lucide-react";

export default function AdminInstallsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const { data: installs = [], isLoading } = useQuery({
    queryKey: ["admin-installs", page, search],
    queryFn: async () => {
      let q = supabase.from("installs").select("*").order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (search) q = q.or(`engine.ilike.%${search}%,site_url.ilike.%${search}%`);
      const { data } = await q;
      return data || [];
    },
  });

  const { data: chartData = [] } = useQuery({
    queryKey: ["admin-installs-chart"],
    queryFn: async () => {
      const { data } = await supabase.from("installs").select("engine");
      if (!data) return [];
      const counts: Record<string, number> = {};
      data.forEach((r) => { counts[r.engine] = (counts[r.engine] || 0) + 1; });
      return Object.entries(counts).map(([engine, count]) => ({ engine, count })).sort((a, b) => b.count - a.count);
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-installs-stats"],
    queryFn: async () => {
      const { count: total } = await supabase.from("installs").select("id", { count: "exact", head: true });
      const { data: sites } = await supabase.from("installs").select("site_url");
      const uniqueSites = new Set(sites?.map((s) => s.site_url)).size;
      const week = new Date(); week.setDate(week.getDate() - 7);
      const { count: weekCount } = await supabase.from("installs").select("id", { count: "exact", head: true }).gte("created_at", week.toISOString());
      return { total: total || 0, uniqueSites, weekCount: weekCount || 0 };
    },
  });

  const getEngineColor = (engine: string) => {
    const agent = AGENTS.find((a) => a.key === engine || a.label.toLowerCase() === engine.toLowerCase());
    return agent ? CATEGORY_META[agent.category].color : "#6b7280";
  };

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Installs</h1>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ label: "Total", value: stats?.total ?? "—" }, { label: "Unique Sites", value: stats?.uniqueSites ?? "—" }, { label: "This Week", value: stats?.weekCount ?? "—" }].map((s) => (
          <div key={s.label} className="border border-[#f0ead6]/8 p-4">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40">{s.label}</p>
            <p className="font-display text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>
      {chartData.length > 0 && (
        <div className="border border-[#f0ead6]/8 p-4 mb-6">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 60 }}>
              <XAxis type="number" tick={{ fill: "#f0ead640", fontSize: 10 }} />
              <YAxis dataKey="engine" type="category" tick={{ fill: "#f0ead680", fontSize: 11 }} width={60} />
              <Tooltip contentStyle={{ background: "#0a0a08", border: "1px solid #f0ead620", color: "#f0ead6", fontSize: 12 }} />
              <Bar dataKey="count" radius={0}>{chartData.map((e, i) => <Cell key={i} fill={getEngineColor(e.engine)} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search engine or URL…"
        className="bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-1.5 font-body text-[11px] focus:outline-none focus:border-[#f0ead6]/20 w-64 mb-3" />
      {isLoading ? <div className="flex justify-center h-16"><Loader2 size={16} className="animate-spin text-[#f0ead6]/40" /></div> : (
        <>
          <div className="border border-[#f0ead6]/8 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-[#f0ead6]/8">{["Site","Engine","Version","Date"].map(h=><th key={h} className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-[#f0ead6]/5">{installs.map(row=>(
                <tr key={row.id} className="hover:bg-[#f0ead6]/3"><td className="px-3 py-2"><a href={row.site_url} target="_blank" rel="noopener noreferrer" className="font-body text-[12px] text-[#c8a961] hover:underline truncate block max-w-xs">{row.site_url}</a></td>
                <td className="px-3 py-2"><span className="px-1.5 py-0.5 border text-[10px] uppercase tracking-wider font-body" style={{borderColor:getEngineColor(row.engine)+"40",color:getEngineColor(row.engine)}}>{row.engine}</span></td>
                <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/50">{row.version}</td>
                <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/40">{new Date(row.created_at).toLocaleDateString("en-GB",{day:"2-digit",month:"short"})}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30">← Previous</button>
            <span className="font-body text-[10px] text-[#f0ead6]/40">Page {page+1}</span>
            <button onClick={()=>setPage(page+1)} disabled={installs.length<PAGE_SIZE} className="font-body text-[11px] uppercase tracking-wider text-[#f0ead6]/50 hover:text-[#f0ead6] disabled:opacity-30">Next →</button>
          </div>
        </>
      )}
    </div>
  );
}
