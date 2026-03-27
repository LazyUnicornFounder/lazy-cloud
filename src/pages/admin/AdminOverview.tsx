import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Check, Zap } from "lucide-react";

const db = supabase as any;

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-[#f0ead6]/8 p-4">
      <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/75">{label}</p>
      <p className="font-display text-2xl font-bold text-[#f0ead6] mt-1">{value}</p>
    </div>
  );
}

export default function AdminOverview() {
  const queryClient = useQueryClient();
  const [runningAction, setRunningAction] = useState<string | null>(null);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const { data: stats } = useQuery({
    queryKey: ["admin-overview-stats"],
    queryFn: async () => {
      const [blogToday, blogWeek, seoToday, seoWeek, geoToday, geoWeek, blogErrors, seoErrors, geoErrors, voiceErrors, streamErrors, blogSettings, seoSettings, geoSettings] = await Promise.all([
        db.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", todayStart.toISOString()),
        db.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", weekStart.toISOString()),
        db.from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayStart.toISOString()),
        db.from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekStart.toISOString()),
        db.from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayStart.toISOString()),
        db.from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", weekStart.toISOString()),
        db.from("blog_errors").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
        db.from("seo_errors").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
        db.from("geo_errors").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
        db.from("voice_errors").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
        db.from("stream_errors").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 86400000).toISOString()),
        db.from("blog_settings").select("is_publishing").limit(1).single(),
        db.from("seo_settings").select("is_running").limit(1).single(),
        db.from("geo_settings").select("is_running").limit(1).single(),
      ]);

      const postsToday = (blogToday.count ?? 0) + (seoToday.count ?? 0) + (geoToday.count ?? 0);
      const postsWeek = (blogWeek.count ?? 0) + (seoWeek.count ?? 0) + (geoWeek.count ?? 0);
      const errors24h = (blogErrors.count ?? 0) + (seoErrors.count ?? 0) + (geoErrors.count ?? 0) + (voiceErrors.count ?? 0) + (streamErrors.count ?? 0);
      const activeEngines = [blogSettings.data?.is_publishing, seoSettings.data?.is_running, geoSettings.data?.is_running].filter(Boolean).length;

      return { postsToday, postsWeek, errors24h, activeEngines };
    },
    refetchInterval: 30000,
  });

  // Activity feed
  const { data: activity = [] } = useQuery({
    queryKey: ["admin-activity-feed"],
    queryFn: async () => {
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const [blogPosts, seoPosts, geoPosts, blogErrs, seoErrs, geoErrs] = await Promise.all([
        db.from("blog_posts").select("title, published_at, status").eq("status", "published").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(20),
        db.from("seo_posts").select("title, published_at").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(20),
        db.from("geo_posts").select("title, published_at").gte("published_at", weekAgo).order("published_at", { ascending: false }).limit(20),
        db.from("blog_errors").select("error_message, created_at").gte("created_at", weekAgo).order("created_at", { ascending: false }).limit(10),
        db.from("seo_errors").select("error_message, created_at").gte("created_at", weekAgo).order("created_at", { ascending: false }).limit(10),
        db.from("geo_errors").select("error_message, created_at").gte("created_at", weekAgo).order("created_at", { ascending: false }).limit(10),
      ]);

      const items: { engine: string; action: string; time: string; type: "success" | "error" | "optimise" }[] = [];
      (blogPosts.data || []).forEach((p: any) => items.push({ engine: "Blogger", action: `Published: ${p.title}`, time: p.published_at, type: "success" }));
      (seoPosts.data || []).forEach((p: any) => items.push({ engine: "SEO", action: `Published: ${p.title}`, time: p.published_at, type: "success" }));
      (geoPosts.data || []).forEach((p: any) => items.push({ engine: "GEO", action: `Published: ${p.title}`, time: p.published_at, type: "success" }));
      (blogErrs.data || []).forEach((e: any) => items.push({ engine: "Blogger", action: e.error_message, time: e.created_at, type: "error" }));
      (seoErrs.data || []).forEach((e: any) => items.push({ engine: "SEO", action: e.error_message, time: e.created_at, type: "error" }));
      (geoErrs.data || []).forEach((e: any) => items.push({ engine: "GEO", action: e.error_message, time: e.created_at, type: "error" }));

      items.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      return items.slice(0, 30);
    },
    refetchInterval: 30000,
  });

  const quickActions = [
    { label: "Blogger", fn: "auto-publish-blog", key: "blogger" },
    { label: "SEO", fn: "lazy-seo-publish", key: "seo" },
    { label: "GEO", fn: "lazy-geo-publish", key: "geo" },
  ];

  const triggerAction = async (fnName: string, key: string) => {
    setRunningAction(key);
    try {
      const { error } = await supabase.functions.invoke(fnName);
      if (error) throw error;
      toast.success(`${key} publish triggered`);
      queryClient.invalidateQueries({ queryKey: ["admin-overview-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-activity-feed"] });
    } catch {
      toast.error(`Failed to trigger ${key}`);
    }
    setRunningAction(null);
  };

  const dotColor = { success: "bg-emerald-500", error: "bg-red-500", optimise: "bg-[#c8a961]" };

  return (
    <div>
      <h1 className="font-display text-xl font-bold tracking-tight mb-6">Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#f0ead6]/5">
        <StatCard label="Published today" value={stats?.postsToday ?? "—"} />
        <StatCard label="Published this week" value={stats?.postsWeek ?? "—"} />
        <StatCard label="Active engines" value={stats?.activeEngines ?? "—"} />
        <StatCard label="Errors (24h)" value={stats?.errors24h ?? "—"} />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/75 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <button
              key={a.key}
              onClick={() => triggerAction(a.fn, a.key)}
              disabled={!!runningAction}
              className="inline-flex items-center gap-2 border border-[#f0ead6]/10 px-4 py-2 font-body text-xs text-[#f0ead6]/92 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors disabled:opacity-40"
            >
              {runningAction === a.key ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
              {a.label} — Publish Now
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mt-8">
        <p className="font-body text-[13px] tracking-[0.15em] uppercase text-[#f0ead6]/75 mb-3">Activity Feed — Last 7 Days</p>
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5 max-h-[500px] overflow-y-auto">
          {activity.length === 0 ? (
            <p className="p-4 font-body text-xs text-[#f0ead6]/68">No activity yet.</p>
          ) : (
            activity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-[#f0ead6]/95 truncate">{item.action}</p>
                  <p className="font-body text-[13px] text-[#f0ead6]/72 mt-0.5">{item.engine} · {new Date(item.time).toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
