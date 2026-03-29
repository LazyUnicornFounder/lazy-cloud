import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, getAgentsByTab, TAB_COLORS } from "./agentRegistry";

export default function AdminOverview() {
  const { installed, statuses, refetchStatuses, activeTab } = useAdminContext();
  const filteredAgents = getAgentsByTab(installed, activeTab);

  /* ── Stats ── */
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

  /* ── Primary metric per agent ── */
  const installedAgents = AGENTS.filter((a) => installed.has(a.key));
  const { data: agentMetrics = {} } = useQuery({
    queryKey: ["admin-overview-agent-metrics"],
    queryFn: async () => {
      const metrics: Record<string, { metric: string; value: number | string; lastRun: string | null }> = {};
      await Promise.all(installedAgents.map(async (agent) => {
        let metric = "";
        let value: number | string = "—";
        let lastRun: string | null = null;

        if (agent.statsQueries.length > 0) {
          const sq = agent.statsQueries[0];
          try {
            if (sq.type === "count") {
              const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true });
              metric = sq.label; value = count || 0;
            } else if (sq.type === "count_today") {
              const today = new Date(); today.setHours(0, 0, 0, 0);
              const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true }).gte("created_at", today.toISOString());
              metric = sq.label; value = count || 0;
            }
          } catch {}
        }

        if (agent.contentTable) {
          try {
            const { data } = await (supabase as any).from(agent.contentTable).select("created_at").order("created_at", { ascending: false }).limit(1).single();
            if (data) lastRun = data.created_at;
          } catch {}
        }

        metrics[agent.key] = { metric, value, lastRun };
      }));
      return metrics;
    },
    refetchInterval: 60_000,
  });

  /* ── Errors (24h) ── */
  const { data: errors = [] } = useQuery({
    queryKey: ["admin-overview-errors"],
    queryFn: async () => {
      const since = new Date(); since.setHours(since.getHours() - 24);
      const sinceIso = since.toISOString();
      const tables = [
        { table: "blog_errors", agent: "Blogger" }, { table: "seo_errors", agent: "SEO" },
        { table: "geo_errors", agent: "GEO" }, { table: "voice_errors", agent: "Voice" },
        { table: "stream_errors", agent: "Stream" }, { table: "granola_errors", agent: "Granola" },
        { table: "waitlist_errors", agent: "Waitlist" },
      ];
      const results: { agent: string; message: string; time: string }[] = [];
      await Promise.all(tables.map(async ({ table, agent }) => {
        try {
          const { data } = await (supabase as any).from(table).select("error_message, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(5);
          if (data) data.forEach((r: any) => results.push({ agent, message: r.error_message, time: r.created_at }));
        } catch {}
      }));
      return results.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 20);
    },
    refetchInterval: 60_000,
  });

  const [runningAction, setRunningAction] = useState<string | null>(null);
  const runAction = async (fn: string, label: string) => {
    setRunningAction(fn);
    try {
      const { data, error } = await supabase.functions.invoke(fn);
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(`${label} completed`);
    } catch (err: any) {
      toast.error(`${label} failed — ${err?.message || "Unknown error"}`);
    }
    setRunningAction(null);
  };

  const timeAgo = (iso: string) => {
    const d = (Date.now() - new Date(iso).getTime()) / 1000;
    if (d < 60) return `${Math.floor(d)}s ago`;
    if (d < 3600) return `${Math.floor(d / 60)}m ago`;
    if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
    return `${Math.floor(d / 86400)}d ago`;
  };

  const tabColor = TAB_COLORS[activeTab];

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
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

      {/* Agent grid */}
      {filteredAgents.length === 0 ? (
        <div className="border border-[#f0ead6]/8 border-dashed p-12 text-center">
          <p className="font-body text-[13px] text-[#f0ead6]/40">No agents installed in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
          {filteredAgents.map((agent) => {
            const s = statuses[agent.key];
            const dotColor = s ? (s.errorsToday > 0 ? "#ef4444" : s.running ? "#22c55e" : "#6b7280") : "#6b7280";
            const firstAction = agent.actions[0];
            const m = agentMetrics[agent.key];
            return (
              <div
                key={agent.key}
                className="border border-[#f0ead6]/8 p-4 flex flex-col gap-2 hover:border-[#f0ead6]/15 transition-colors"
                style={{ borderTopColor: `${tabColor}30`, borderTopWidth: "2px" }}
              >
                <div className="flex items-center justify-between">
                  <Link to={agent.route} className="font-display text-sm font-bold hover:text-[#c8a961] transition-colors flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                    {agent.label}
                  </Link>
                  {s?.errorsToday > 0 && (
                    <span className="font-body text-[9px] text-red-400 bg-red-500/10 px-1.5 py-0.5 uppercase tracking-wider">
                      {s.errorsToday} err
                    </span>
                  )}
                </div>
                <p className="font-body text-[11px] text-[#f0ead6]/40 leading-relaxed line-clamp-2">{agent.subtitle}</p>

                {/* Metric + last run */}
                <div className="flex items-baseline justify-between mt-auto pt-1">
                  {m && m.metric ? (
                    <span className="font-body text-[10px] text-[#f0ead6]/50">
                      {m.metric}: <span className="font-display text-lg font-bold text-[#f0ead6]">{m.value}</span>
                    </span>
                  ) : (
                    <span className="font-body text-[10px] text-[#f0ead6]/25 italic">No data</span>
                  )}
                  {m?.lastRun && (
                    <span className="font-body text-[9px] text-[#f0ead6]/30">{timeAgo(m.lastRun)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#f0ead6]/5">
                  {firstAction && (
                    <button
                      onClick={() => runAction(firstAction.fn, firstAction.label)}
                      disabled={!!runningAction}
                      className="inline-flex items-center gap-1 px-2 py-1 font-body text-[9px] uppercase tracking-wider text-[#f0ead6]/60 hover:text-[#f0ead6] border border-[#f0ead6]/8 hover:border-[#f0ead6]/20 transition-colors disabled:opacity-40"
                    >
                      {runningAction === firstAction.fn ? <Loader2 size={9} className="animate-spin" /> : <Play size={9} />}
                      Run
                    </button>
                  )}
                  <Link to={agent.route} className="ml-auto font-body text-[9px] uppercase tracking-wider text-[#f0ead6]/30 hover:text-[#c8a961] transition-colors">
                    Open →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Error log — only show if errors exist */}
      {errors.length > 0 && (
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60 mb-3">Errors (24h)</h2>
          <div className="border border-red-500/20 divide-y divide-[#f0ead6]/5 max-h-64 overflow-y-auto">
            {errors.map((err, i) => (
              <div key={i} className="px-4 py-2 flex items-start gap-3">
                <AlertTriangle size={11} className="text-red-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <span className="font-body text-[10px] font-bold text-red-400 uppercase tracking-wider">{err.agent}</span>
                  <p className="font-body text-[11px] text-[#f0ead6]/60 truncate">{err.message}</p>
                </div>
                <span className="font-body text-[9px] text-[#f0ead6]/30 shrink-0">{timeAgo(err.time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {errors.length === 0 && (
        <div className="border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2">
          <CheckCircle size={13} className="text-emerald-500" />
          <span className="font-body text-[12px] text-emerald-400">No errors in the last 24 hours</span>
        </div>
      )}
    </div>
  );
}
