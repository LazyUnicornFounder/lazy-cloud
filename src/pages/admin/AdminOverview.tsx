import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, CATEGORY_META } from "./agentRegistry";

export default function AdminOverview() {
  const { installed, statuses, refetchStatuses } = useAdminContext();
  const installedAgents = AGENTS.filter((a) => installed.has(a.key));

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const todayIso = today.toISOString();
      const weekIso = weekAgo.toISOString();
      const [blogToday, seoToday, geoToday, blogWeek, seoWeek, geoWeek, installsTotal] = await Promise.all([
        (supabase as any).from("blog_posts").select("id", { count: "exact", head: true }).gte("created_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("blog_posts").select("id", { count: "exact", head: true }).gte("created_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("installs").select("id", { count: "exact", head: true }).then((r: any) => r.count || 0).catch(() => 0),
      ]);
      return {
        postsToday: blogToday + seoToday + geoToday,
        postsWeek: blogWeek + seoWeek + geoWeek,
        activeAgents: Object.values(statuses).filter((s) => s.running).length,
        errorsToday: Object.values(statuses).reduce((a, s) => a + s.errorsToday, 0),
        installsTotal,
      };
    },
    refetchInterval: 60_000,
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-overview-errors"],
    queryFn: async () => {
      const since = new Date(); since.setHours(since.getHours() - 24);
      const sinceIso = since.toISOString();
      const tables = [
        { table: "blog_errors", agent: "Blogger" }, { table: "seo_errors", agent: "SEO" },
        { table: "geo_errors", agent: "GEO" }, { table: "voice_errors", agent: "Voice" },
        { table: "stream_errors", agent: "Stream" }, { table: "granola_errors", agent: "Granola" },
      ];
      const results: { agent: string; message: string; time: string }[] = [];
      await Promise.all(tables.map(async ({ table, agent }) => {
        try {
          const { data } = await (supabase as any).from(table).select("error_message, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(10);
          if (data) data.forEach((r: any) => results.push({ agent, message: r.error_message, time: r.created_at }));
        } catch {}
      }));
      return results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 50);
    },
    refetchInterval: 60_000,
  });

  const [runningAction, setRunningAction] = useState<string | null>(null);
  const runAction = async (fn: string, label: string) => {
    setRunningAction(fn);
    try {
      const { error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      toast.success(`${label} completed`);
    } catch { toast.error(`${label} failed`); }
    setRunningAction(null);
  };

  const timeAgo = (iso: string) => {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 60) return `${Math.floor(d)}s ago`;
    if (d < 3600) return `${Math.floor(d / 60)}m ago`;
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Mission Control</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {[
          { label: "Posts today", value: stats?.postsToday ?? "—" },
          { label: "Posts this week", value: stats?.postsWeek ?? "—" },
          { label: "Active agents", value: stats?.activeAgents ?? "—" },
          { label: "Errors today", value: stats?.errorsToday ?? "—", red: (stats?.errorsToday ?? 0) > 0 },
          { label: "Installs", value: stats?.installsTotal ?? "—" },
        ].map((s) => (
          <div key={s.label} className={`border border-[#f0ead6]/8 p-4 ${s.red ? "border-red-500/30 bg-red-500/5" : ""}`}>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/50">{s.label}</p>
            <p className="font-display text-2xl font-bold mt-1">{statsLoading ? "—" : s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60 mb-3">Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {installedAgents.map((agent) => {
          const s = statuses[agent.key];
          const dotColor = s ? (s.errorsToday > 0 ? "#ef4444" : s.running ? "#22c55e" : "#6b7280") : "#6b7280";
          const firstAction = agent.actions[0];
          return (
            <div key={agent.key} className="border border-[#f0ead6]/8 p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Link to={agent.route} className="font-display text-sm font-bold hover:text-[#c8a961] transition-colors flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                  {agent.label}
                </Link>
                <span className="font-body text-[10px] tracking-wider uppercase px-2 py-0.5 border border-[#f0ead6]/8" style={{ color: CATEGORY_META[agent.category].color }}>
                  {CATEGORY_META[agent.category].label}
                </span>
              </div>
              <p className="font-body text-[11px] text-[#f0ead6]/50 leading-relaxed">{agent.subtitle}</p>
              <div className="flex items-center gap-2 mt-auto pt-2">
                {firstAction && (
                  <button onClick={() => runAction(firstAction.fn, firstAction.label)} disabled={!!runningAction}
                    className="inline-flex items-center gap-1.5 border border-[#f0ead6]/10 px-3 py-1.5 font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40">
                    {runningAction === firstAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                    {firstAction.label}
                  </button>
                )}
                <Link to={agent.route} className="ml-auto font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/40 hover:text-[#c8a961] transition-colors">Open →</Link>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60 mb-3">Errors (24h)</h2>
      {errors.length === 0 ? (
        <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-500" />
          <span className="font-body text-[13px] text-emerald-400">No errors in the last 24 hours</span>
        </div>
      ) : (
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-80 overflow-y-auto">
          {errors.map((err, i) => (
            <div key={i} className="px-4 py-2 flex items-start gap-3">
              <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-body text-[11px] font-bold text-red-400 uppercase tracking-wider">{err.agent}</span>
                <p className="font-body text-[12px] text-[#f0ead6]/70 truncate">{err.message}</p>
              </div>
              <span className="font-body text-[10px] text-[#f0ead6]/40 shrink-0">{timeAgo(err.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
