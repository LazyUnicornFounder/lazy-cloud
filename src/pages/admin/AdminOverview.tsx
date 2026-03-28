import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import {
  Loader2, Zap, Play, Pause, AlertTriangle, CheckCircle2,
  PenTool, Search, Brain, Radar, Compass, Database as DbIcon,
  ShoppingCart, CreditCard, MessageSquare, Mail, Mic, Tv,
  Code, GitBranch, CheckCircle, Bell, Send, Shield,
  LayoutDashboard, RefreshCw, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const db = supabase as any;

/* ── Engine definitions grouped by category ── */
interface EngineDef {
  key: string;
  label: string;
  icon: any;
  settingsTable?: string;
  runField?: string;
  errorTable?: string;
  publishFn?: string;
  contentTable?: string;
  adminPath?: string;
}

const CATEGORIES: { label: string; color: string; engines: EngineDef[] }[] = [
  {
    label: "Content", color: "text-blue-400",
    engines: [
      { key: "blogger", label: "Blogger", icon: PenTool, settingsTable: "blog_settings", runField: "is_publishing", errorTable: "blog_errors", publishFn: "auto-publish-blog", contentTable: "blog_posts", adminPath: "/admin/blogger" },
      { key: "seo", label: "SEO", icon: Search, settingsTable: "seo_settings", runField: "is_running", errorTable: "seo_errors", publishFn: "lazy-seo-publish", contentTable: "seo_posts", adminPath: "/admin/seo" },
      { key: "geo", label: "GEO", icon: Brain, settingsTable: "geo_settings", runField: "is_running", errorTable: "geo_errors", publishFn: "lazy-geo-publish", contentTable: "geo_posts", adminPath: "/admin/geo" },
      { key: "crawl", label: "Crawl", icon: Radar },
      { key: "perplexity", label: "Perplexity", icon: Compass },
      { key: "contentful", label: "Contentful", icon: DbIcon },
    ],
  },
  {
    label: "Commerce", color: "text-emerald-400",
    engines: [
      { key: "store", label: "Store", icon: ShoppingCart },
      { key: "pay", label: "Pay", icon: CreditCard },
      { key: "sms", label: "SMS", icon: MessageSquare },
      { key: "mail", label: "Mail", icon: Mail },
    ],
  },
  {
    label: "Media", color: "text-purple-400",
    engines: [
      { key: "voice", label: "Voice", icon: Mic, settingsTable: "voice_settings", runField: "is_running", errorTable: "voice_errors", adminPath: "/admin/voice" },
      { key: "stream", label: "Stream", icon: Tv, settingsTable: "stream_settings", runField: "is_running", errorTable: "stream_errors", adminPath: "/admin/stream" },
      { key: "youtube", label: "YouTube", icon: Tv },
    ],
  },
  {
    label: "Dev", color: "text-orange-400",
    engines: [
      { key: "github", label: "GitHub", icon: Code },
      { key: "gitlab", label: "GitLab", icon: GitBranch },
      { key: "linear", label: "Linear", icon: CheckCircle },
      { key: "design", label: "Design", icon: LayoutDashboard },
      { key: "auth", label: "Auth", icon: Shield },
      { key: "granola", label: "Granola", icon: PenTool, settingsTable: "granola_settings", runField: "is_running", errorTable: "granola_errors", adminPath: "/admin/granola" },
    ],
  },
  {
    label: "Agents", color: "text-cyan-400",
    engines: [
      { key: "repurpose", label: "Repurpose", icon: RefreshCw },
      { key: "trend", label: "Trend", icon: Radar },
      { key: "churn", label: "Churn", icon: CreditCard },
    ],
  },
  {
    label: "Ops", color: "text-red-400",
    engines: [
      { key: "alert", label: "Alert", icon: Bell },
      { key: "telegram", label: "Telegram", icon: Send },
      { key: "supabase", label: "Supabase", icon: DbIcon },
      { key: "security", label: "Security", icon: Shield },
    ],
  },
];

const ALL_ENGINES = CATEGORIES.flatMap(c => c.engines);
const MANAGED_ENGINES = ALL_ENGINES.filter(e => e.settingsTable);
const PUBLISHABLE = ALL_ENGINES.filter(e => e.publishFn);

type EngineStatus = { running: boolean; errors24h: number; publishedToday: number; lastPublished: string | null };

export default function AdminOverview() {
  const queryClient = useQueryClient();
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [bulkAction, setBulkAction] = useState(false);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterday = new Date(Date.now() - 86400000).toISOString();

  /* ── Fetch all engine statuses ── */
  const { data: statuses = {}, isLoading } = useQuery<Record<string, EngineStatus>>({
    queryKey: ["mission-control-status"],
    queryFn: async () => {
      const result: Record<string, EngineStatus> = {};

      await Promise.all(MANAGED_ENGINES.map(async (e) => {
        const { data: settings } = await db.from(e.settingsTable!).select(e.runField!).limit(1).single();
        let errors24h = 0;
        if (e.errorTable) {
          const { count } = await db.from(e.errorTable).select("id", { count: "exact", head: true }).gte("created_at", yesterday);
          errors24h = count ?? 0;
        }
        let publishedToday = 0;
        let lastPublished: string | null = null;
        if (e.contentTable) {
          const { count } = await db.from(e.contentTable).select("id", { count: "exact", head: true }).gte("published_at", todayStart.toISOString());
          publishedToday = count ?? 0;
          const { data: latest } = await db.from(e.contentTable).select("published_at").order("published_at", { ascending: false }).limit(1).single();
          lastPublished = latest?.published_at ?? null;
        }
        result[e.key] = { running: settings?.[e.runField!] ?? false, errors24h, publishedToday, lastPublished };
      }));

      // Unmanaged engines default
      ALL_ENGINES.forEach(e => {
        if (!result[e.key]) result[e.key] = { running: false, errors24h: 0, publishedToday: 0, lastPublished: null };
      });
      return result;
    },
    refetchInterval: 30000,
  });

  /* ── Activity feed ── */
  const { data: alerts = [] } = useQuery({
    queryKey: ["mission-alerts"],
    queryFn: async () => {
      const items: { engine: string; message: string; time: string; type: "error" | "success" | "info" }[] = [];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [blogErrs, seoErrs, geoErrs, voiceErrs, streamErrs, blogPosts, seoPosts, geoPosts] = await Promise.all([
        db.from("blog_errors").select("error_message, created_at").gte("created_at", yesterday).order("created_at", { ascending: false }).limit(5),
        db.from("seo_errors").select("error_message, created_at").gte("created_at", yesterday).order("created_at", { ascending: false }).limit(5),
        db.from("geo_errors").select("error_message, created_at").gte("created_at", yesterday).order("created_at", { ascending: false }).limit(5),
        db.from("voice_errors").select("error_message, created_at").gte("created_at", yesterday).order("created_at", { ascending: false }).limit(5),
        db.from("stream_errors").select("error_message, created_at").gte("created_at", yesterday).order("created_at", { ascending: false }).limit(5),
        db.from("blog_posts").select("title, published_at").eq("status", "published").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(8),
        db.from("seo_posts").select("title, published_at").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(8),
        db.from("geo_posts").select("title, published_at").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(8),
      ]);

      const errMap: [string, any][] = [["Blogger", blogErrs], ["SEO", seoErrs], ["GEO", geoErrs], ["Voice", voiceErrs], ["Stream", streamErrs]];
      errMap.forEach(([eng, res]) => (res.data || []).forEach((e: any) => items.push({ engine: eng, message: e.error_message, time: e.created_at, type: "error" })));
      const pubMap: [string, any][] = [["Blogger", blogPosts], ["SEO", seoPosts], ["GEO", geoPosts]];
      pubMap.forEach(([eng, res]) => (res.data || []).forEach((p: any) => items.push({ engine: eng, message: p.title, time: p.published_at, type: "success" })));

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      return items.slice(0, 25);
    },
    refetchInterval: 30000,
  });

  /* ── Actions ── */
  const triggerPublish = async (engine: EngineDef) => {
    if (!engine.publishFn) return;
    setRunningAction(engine.key);
    try {
      const { error } = await supabase.functions.invoke(engine.publishFn);
      if (error) throw error;
      toast.success(`${engine.label} published`);
      queryClient.invalidateQueries({ queryKey: ["mission-control-status"] });
      queryClient.invalidateQueries({ queryKey: ["mission-alerts"] });
    } catch { toast.error(`${engine.label} failed`); }
    setRunningAction(null);
  };

  const toggleEngine = async (engine: EngineDef) => {
    if (!engine.settingsTable || !engine.runField) return;
    const current = statuses[engine.key]?.running ?? false;
    setRunningAction(`toggle-${engine.key}`);
    try {
      const { data: row } = await db.from(engine.settingsTable).select("id").limit(1).single();
      if (row) {
        await db.from(engine.settingsTable).update({ [engine.runField]: !current }).eq("id", row.id);
        toast.success(`${engine.label} ${current ? "paused" : "started"}`);
        queryClient.invalidateQueries({ queryKey: ["mission-control-status"] });
      }
    } catch { toast.error(`Failed to toggle ${engine.label}`); }
    setRunningAction(null);
  };

  const bulkToggle = async (start: boolean) => {
    setBulkAction(true);
    try {
      await Promise.all(MANAGED_ENGINES.map(async (e) => {
        const { data: row } = await db.from(e.settingsTable!).select("id").limit(1).single();
        if (row) await db.from(e.settingsTable!).update({ [e.runField!]: start }).eq("id", row.id);
      }));
      toast.success(start ? "All engines started" : "All engines paused");
      queryClient.invalidateQueries({ queryKey: ["mission-control-status"] });
    } catch { toast.error("Bulk action failed"); }
    setBulkAction(false);
  };

  const bulkPublish = async () => {
    setBulkAction(true);
    try {
      await Promise.all(PUBLISHABLE.map(e => supabase.functions.invoke(e.publishFn!)));
      toast.success("All content engines published");
      queryClient.invalidateQueries({ queryKey: ["mission-control-status"] });
      queryClient.invalidateQueries({ queryKey: ["mission-alerts"] });
    } catch { toast.error("Bulk publish failed"); }
    setBulkAction(false);
  };

  /* ── Computed stats ── */
  const runningCount = Object.values(statuses).filter(s => s.running).length;
  const totalErrors = Object.values(statuses).reduce((sum, s) => sum + s.errors24h, 0);
  const totalPublished = Object.values(statuses).reduce((sum, s) => sum + s.publishedToday, 0);
  const needsAttention = Object.entries(statuses).filter(([, s]) => s.errors24h > 0);

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">Mission Control</h1>
          <p className="font-body text-[13px] text-[#f0ead6]/68 mt-1">
            {runningCount} engine{runningCount !== 1 ? "s" : ""} active · {totalPublished} published today · {totalErrors} error{totalErrors !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["mission-control-status"] })}
          className="p-2 border border-[#f0ead6]/10 hover:border-[#f0ead6]/30 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── Alerts bar ── */}
      {needsAttention.length > 0 && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="font-body text-sm text-red-300 font-medium">
              {needsAttention.length} engine{needsAttention.length > 1 ? "s" : ""} need attention
            </p>
            <p className="font-body text-xs text-red-300/70 mt-1">
              {needsAttention.map(([key, s]) => {
                const eng = ALL_ENGINES.find(e => e.key === key);
                return `${eng?.label ?? key} (${s.errors24h} error${s.errors24h > 1 ? "s" : ""})`;
              }).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* ── Bulk Actions ── */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => bulkToggle(true)} disabled={bulkAction} className="inline-flex items-center gap-2 border border-emerald-500/30 text-emerald-400 px-4 py-2 font-body text-xs hover:bg-emerald-500/10 transition-colors disabled:opacity-40">
          {bulkAction ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Start All
        </button>
        <button onClick={() => bulkToggle(false)} disabled={bulkAction} className="inline-flex items-center gap-2 border border-[#f0ead6]/10 text-[#f0ead6]/70 px-4 py-2 font-body text-xs hover:bg-[#f0ead6]/5 transition-colors disabled:opacity-40">
          {bulkAction ? <Loader2 size={12} className="animate-spin" /> : <Pause size={12} />} Pause All
        </button>
        <button onClick={bulkPublish} disabled={bulkAction} className="inline-flex items-center gap-2 border border-[#c8a961]/30 text-[#c8a961] px-4 py-2 font-body text-xs hover:bg-[#c8a961]/10 transition-colors disabled:opacity-40">
          {bulkAction ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Publish All Content
        </button>
      </div>

      {/* ── Engine Grid ── */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.label}>
            <p className={`font-body text-[11px] tracking-[0.2em] uppercase mb-2 ${cat.color}`}>
              Lazy {cat.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#f0ead6]/5">
              {cat.engines.map((engine) => {
                const s = statuses[engine.key] || { running: false, errors24h: 0, publishedToday: 0, lastPublished: null };
                const isManaged = !!engine.settingsTable;
                const isToggling = runningAction === `toggle-${engine.key}`;
                const isPublishing = runningAction === engine.key;

                return (
                  <div key={engine.key} className="bg-[#0a0a08] border border-[#f0ead6]/5 p-4 flex flex-col gap-3">
                    {/* Top row: icon, name, status */}
                    <div className="flex items-center gap-3">
                      <engine.icon size={14} className="text-[#f0ead6]/50" />
                      <span className="font-body text-sm text-[#f0ead6]/95 flex-1">{engine.label}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        s.errors24h > 0 ? "bg-red-500" : s.running ? "bg-emerald-500" : "bg-[#f0ead6]/15"
                      }`} />
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 font-body text-[11px] text-[#f0ead6]/55">
                      {isManaged && (
                        <span className={s.running ? "text-emerald-400" : "text-[#f0ead6]/40"}>
                          {s.running ? "Running" : "Paused"}
                        </span>
                      )}
                      {!isManaged && <span className="text-[#f0ead6]/30">Not configured</span>}
                      {s.publishedToday > 0 && <span>{s.publishedToday} today</span>}
                      {s.errors24h > 0 && <span className="text-red-400">{s.errors24h} err</span>}
                      {s.lastPublished && <span>{timeAgo(s.lastPublished)}</span>}
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-2 mt-auto">
                      {isManaged && (
                        <button
                          onClick={() => toggleEngine(engine)}
                          disabled={!!runningAction}
                          className={`px-2.5 py-1 font-body text-[11px] border transition-colors disabled:opacity-30 ${
                            s.running
                              ? "border-[#f0ead6]/10 text-[#f0ead6]/60 hover:text-[#f0ead6]/90"
                              : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          }`}
                        >
                          {isToggling ? <Loader2 size={10} className="animate-spin" /> : s.running ? "Pause" : "Start"}
                        </button>
                      )}
                      {engine.publishFn && (
                        <button
                          onClick={() => triggerPublish(engine)}
                          disabled={!!runningAction}
                          className="px-2.5 py-1 font-body text-[11px] border border-[#c8a961]/20 text-[#c8a961]/80 hover:bg-[#c8a961]/10 transition-colors disabled:opacity-30"
                        >
                          {isPublishing ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} className="inline mr-1" />}
                          Publish
                        </button>
                      )}
                      {engine.adminPath && (
                        <Link to={engine.adminPath} className="ml-auto text-[#f0ead6]/30 hover:text-[#f0ead6]/60 transition-colors">
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Live Feed ── */}
      <div>
        <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/55 mb-3">Live Feed</p>
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-[400px] overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="p-4 font-body text-xs text-[#f0ead6]/40">No recent activity.</p>
          ) : alerts.map((item, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-2.5">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                item.type === "error" ? "bg-red-500" : item.type === "success" ? "bg-emerald-500" : "bg-[#c8a961]"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs text-[#f0ead6]/90 truncate">{item.message}</p>
                <p className="font-body text-[11px] text-[#f0ead6]/45 mt-0.5">{item.engine} · {timeAgo(item.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
