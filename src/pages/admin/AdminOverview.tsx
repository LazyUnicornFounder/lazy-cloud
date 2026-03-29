import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle, AlertTriangle, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, CATEGORY_META, type AgentCategory } from "./agentRegistry";

type FilterPill = "all" | "errors" | "content" | "commerce" | "ops";

export default function AdminOverview() {
  const { installed, statuses, refetchStatuses } = useAdminContext();
  const installedAgents = AGENTS.filter((a) => installed.has(a.key));
  const [filter, setFilter] = useState<FilterPill>("all");

  /* ── Stats ── */
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
      const todayIso = today.toISOString();
      const weekIso = weekAgo.toISOString();

      const [blogToday, seoToday, geoToday, blogWeek, seoWeek, geoWeek, installsTotal, revenueToday, securityScore] = await Promise.all([
        (supabase as any).from("blog_posts").select("id", { count: "exact", head: true }).gte("created_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("blog_posts").select("id", { count: "exact", head: true }).gte("created_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekIso).then((r: any) => r.count || 0).catch(() => 0),
        (supabase as any).from("installs").select("id", { count: "exact", head: true }).then((r: any) => r.count || 0).catch(() => 0),
        // Revenue today from pay_transactions
        (supabase as any).from("pay_transactions").select("amount").eq("status", "succeeded").gte("created_at", todayIso).then((r: any) => {
          if (!r.data) return 0;
          return r.data.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
        }).catch(() => 0),
        // Security score from latest scan
        (supabase as any).from("security_scans").select("score").order("created_at", { ascending: false }).limit(1).single().then((r: any) => r.data?.score ?? null).catch(() => null),
      ]);

      return {
        postsToday: blogToday + seoToday + geoToday,
        postsWeek: blogWeek + seoWeek + geoWeek,
        activeAgents: Object.values(statuses).filter((s) => s.running).length,
        errorsToday: Object.values(statuses).reduce((a, s) => a + s.errorsToday, 0),
        revenueToday,
        securityScore,
        installsTotal,
      };
    },
    refetchInterval: 60_000,
  });

  /* ── Primary metric per agent ── */
  const { data: agentMetrics = {} } = useQuery({
    queryKey: ["admin-overview-agent-metrics"],
    queryFn: async () => {
      const metrics: Record<string, { metric: string; value: number | string; lastRun: string | null }> = {};
      await Promise.all(installedAgents.map(async (agent) => {
        let metric = "—";
        let value: number | string = "—";
        let lastRun: string | null = null;

        // Get primary metric from first statsQuery
        if (agent.statsQueries.length > 0) {
          const sq = agent.statsQueries[0];
          try {
            if (sq.type === "count") {
              const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true });
              metric = sq.label;
              value = count || 0;
            } else if (sq.type === "count_today") {
              const today = new Date(); today.setHours(0, 0, 0, 0);
              const { count } = await (supabase as any).from(sq.table).select("id", { count: "exact", head: true }).gte("created_at", today.toISOString());
              metric = sq.label;
              value = count || 0;
            }
          } catch {}
        }

        // Get last run time from content table
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

  /* ── Activity feed ── */
  const { data: activity = [] } = useQuery({
    queryKey: ["admin-overview-activity"],
    queryFn: async () => {
      const since = new Date(); since.setHours(since.getHours() - 48);
      const sinceIso = since.toISOString();
      const items: { agent: string; category: AgentCategory; type: "content" | "error" | "action"; message: string; time: string }[] = [];

      const contentTables = [
        { table: "blog_posts", agent: "Blogger", cat: "content" as AgentCategory, msgKey: "title" },
        { table: "seo_posts", agent: "SEO", cat: "content" as AgentCategory, msgKey: "title" },
        { table: "geo_posts", agent: "GEO", cat: "content" as AgentCategory, msgKey: "title" },
        { table: "stream_content", agent: "Stream", cat: "media" as AgentCategory, msgKey: "title" },
        { table: "voice_episodes", agent: "Voice", cat: "media" as AgentCategory, msgKey: "post_title" },
        { table: "granola_outputs", agent: "Granola", cat: "dev" as AgentCategory, msgKey: "title" },
      ];
      await Promise.all(contentTables.map(async ({ table, agent, cat, msgKey }) => {
        try {
          const { data } = await (supabase as any).from(table).select(`${msgKey}, created_at`).gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(10);
          if (data) data.forEach((r: any) => items.push({ agent, category: cat, type: "content", message: `Published: ${r[msgKey]}`, time: r.created_at }));
        } catch {}
      }));

      const errorTables = [
        { table: "blog_errors", agent: "Blogger", cat: "content" as AgentCategory },
        { table: "seo_errors", agent: "SEO", cat: "content" as AgentCategory },
        { table: "geo_errors", agent: "GEO", cat: "content" as AgentCategory },
        { table: "voice_errors", agent: "Voice", cat: "media" as AgentCategory },
        { table: "stream_errors", agent: "Stream", cat: "media" as AgentCategory },
        { table: "granola_errors", agent: "Granola", cat: "dev" as AgentCategory },
      ];
      await Promise.all(errorTables.map(async ({ table, agent, cat }) => {
        try {
          const { data } = await (supabase as any).from(table).select("error_message, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(10);
          if (data) data.forEach((r: any) => items.push({ agent, category: cat, type: "error", message: r.error_message, time: r.created_at }));
        } catch {}
      }));

      return items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 50);
    },
    refetchInterval: 60_000,
  });

  /* ── Errors (24h) ── */
  const { data: errors = [], refetch: refetchErrors } = useQuery({
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

  const filteredActivity = activity.filter((item) => {
    if (filter === "all") return true;
    if (filter === "errors") return item.type === "error";
    if (filter === "content") return item.category === "content";
    if (filter === "commerce") return item.category === "commerce";
    if (filter === "ops") return item.category === "ops" || item.category === "dev";
    return true;
  });

  const pills: { key: FilterPill; label: string }[] = [
    { key: "all", label: "All" },
    { key: "errors", label: "Errors" },
    { key: "content", label: "Content" },
    { key: "commerce", label: "Commerce" },
    { key: "ops", label: "Ops" },
  ];

  const secScoreColor = stats?.securityScore == null ? "#6b7280" : stats.securityScore >= 80 ? "#22c55e" : stats.securityScore >= 60 ? "#c8a961" : "#ef4444";

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Mission Control</h1>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: "Posts today", value: stats?.postsToday ?? "—" },
          { label: "Posts this week", value: stats?.postsWeek ?? "—" },
          { label: "Active agents", value: stats?.activeAgents ?? "—" },
          { label: "Errors today", value: stats?.errorsToday ?? "—", red: (stats?.errorsToday ?? 0) > 0 },
          { label: "Revenue today", value: stats?.revenueToday != null ? `$${stats.revenueToday.toLocaleString()}` : "—" },
          { label: "Security", value: stats?.securityScore ?? "—", color: secScoreColor },
          { label: "Installs", value: stats?.installsTotal ?? "—" },
        ].map((s) => (
          <div key={s.label} className={`border border-[#f0ead6]/8 p-4 ${s.red ? "border-red-500/30 bg-red-500/5" : ""}`}>
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/50">{s.label}</p>
            <p className="font-display text-2xl font-bold mt-1" style={s.color ? { color: s.color } : undefined}>
              {statsLoading ? "—" : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Agent grid */}
      <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60 mb-3">Agents</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {installedAgents.map((agent) => {
          const s = statuses[agent.key];
          const dotColor = s ? (s.errorsToday > 0 ? "#ef4444" : s.running ? "#22c55e" : "#6b7280") : "#6b7280";
          const firstAction = agent.actions[0];
          const m = agentMetrics[agent.key];
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
              {/* Primary metric + last run */}
              <div className="flex items-center justify-between">
                {m && m.value !== "—" ? (
                  <span className="font-body text-[11px] text-[#f0ead6]/60">
                    {m.metric}: <span className="font-display text-base font-bold text-[#f0ead6]/90">{m.value}</span>
                  </span>
                ) : (
                  <span className="font-body text-[11px] text-[#f0ead6]/30 italic">No data</span>
                )}
                {m?.lastRun && (
                  <span className="font-body text-[10px] text-[#f0ead6]/30">{timeAgo(m.lastRun)}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-auto pt-1">
                {firstAction && (
                  <button onClick={() => runAction(firstAction.fn, firstAction.label)} disabled={!!runningAction}
                    className="inline-flex items-center gap-1.5 border border-[#f0ead6]/10 px-3 py-1.5 font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40">
                    {runningAction === firstAction.fn ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                    Run Now
                  </button>
                )}
                <Link to={agent.route} className="ml-auto font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/40 hover:text-[#c8a961] transition-colors">Open →</Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two columns: Activity Feed + Error Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity feed */}
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60">Activity</h2>
            <div className="flex gap-1.5">
              {pills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFilter(p.key)}
                  className={`font-body text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 border transition-colors ${
                    filter === p.key
                      ? "border-[#c8a961]/40 text-[#c8a961] bg-[#c8a961]/8"
                      : "border-[#f0ead6]/8 text-[#f0ead6]/50 hover:text-[#f0ead6]/80"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          {filteredActivity.length === 0 ? (
            <div className="border border-[#f0ead6]/8 p-6 text-center">
              <p className="font-body text-[12px] text-[#f0ead6]/40">No recent activity</p>
            </div>
          ) : (
            <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-96 overflow-y-auto">
              {filteredActivity.map((item, i) => (
                <div key={i} className="px-4 py-2 flex items-start gap-3">
                  {item.type === "error" ? (
                    <AlertTriangle size={12} className="text-red-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className={`font-body text-[10px] font-bold uppercase tracking-wider ${item.type === "error" ? "text-red-400" : "text-emerald-400"}`}>
                      {item.agent}
                    </span>
                    <p className="font-body text-[12px] text-[#f0ead6]/70 truncate">{item.message}</p>
                  </div>
                  <span className="font-body text-[10px] text-[#f0ead6]/40 shrink-0">{timeAgo(item.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm font-bold tracking-[0.1em] uppercase text-[#f0ead6]/60">Errors (24h)</h2>
            {errors.length > 0 && (
              <button
                onClick={() => refetchErrors()}
                className="font-body text-[10px] uppercase tracking-wider text-[#f0ead6]/40 hover:text-[#f0ead6]/70 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>
          {errors.length === 0 ? (
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" />
              <span className="font-body text-[13px] text-emerald-400">No errors in the last 24 hours</span>
            </div>
          ) : (
            <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-96 overflow-y-auto">
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
      </div>
    </div>
  );
}
