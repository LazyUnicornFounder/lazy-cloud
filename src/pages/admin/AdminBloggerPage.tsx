import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Zap, Pause, Play, Search, Brain } from "lucide-react";
import EngineStatusBar from "./components/EngineStatusBar";
import ContentTable from "./components/ContentTable";
import ErrorLog from "./components/ErrorLog";

const db = supabase as any;

const PRODUCT_LABELS: Record<string, string> = {
  "lazy-blogger": "Blogger", "lazy-seo": "SEO", "lazy-geo": "GEO",
  "lazy-stream": "Stream", "lazy-voice": "Voice", "lazy-store": "Store",
  "lazy-github": "GitHub", "lazy-sms": "SMS", "lazy-pay": "Pay",
  "lazy-alert": "Alert", "lazy-gitlab": "GitLab", "lazy-supabase": "Supabase",
  "lazy-telegram": "Telegram", "lazy-linear": "Linear", "lazy-contentful": "Contentful",
  "lazy-perplexity": "Perplexity", "lazy-security": "Security", "lazy-mail": "Mail",
  "lazy-design": "Design", "lazy-drop": "Drop", "lazy-print": "Print",
  "lazy-auth": "Auth", "lazy-crawl": "Crawl", "lazy-run": "Run",
  "lazy-admin": "Admin", "lazy-youtube": "YouTube",
};

export default function AdminBloggerPage() {
  const queryClient = useQueryClient();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

  const { data: settings } = useQuery({
    queryKey: ["admin-blog-settings"],
    queryFn: async () => { const { data } = await db.from("blog_settings").select("*").limit(1).single(); return data; },
  });

  const { data: postsToday = 0 } = useQuery({
    queryKey: ["admin-blog-today"],
    queryFn: async () => { const { count } = await db.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published").gte("published_at", todayStart.toISOString()); return count ?? 0; },
  });

  const { data: postsTotal = 0 } = useQuery({
    queryKey: ["admin-blog-total"],
    queryFn: async () => { const { count } = await db.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"); return count ?? 0; },
  });

  const { data: productSettings = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin-product-publish-settings"],
    queryFn: async () => {
      const { data } = await db.from("product_publish_settings").select("*").order("product");
      return data || [];
    },
  });

  const { data: drafts = [] } = useQuery({
    queryKey: ["admin-blog-drafts"],
    queryFn: async () => { const { data } = await db.from("blog_posts").select("*").eq("status", "draft").order("created_at", { ascending: false }).limit(20); return data || []; },
  });

  const { data: published = [] } = useQuery({
    queryKey: ["admin-blog-published"],
    queryFn: async () => { const { data } = await db.from("blog_posts").select("*").eq("status", "published").order("published_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: lastPost } = useQuery({
    queryKey: ["admin-blog-last"],
    queryFn: async () => { const { data } = await db.from("blog_posts").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-blog-errors"],
    queryFn: async () => { const { data } = await db.from("blog_errors").select("*").order("created_at", { ascending: false }).limit(10); return data || []; },
  });

  const [toggling, setToggling] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [savingProduct, setSavingProduct] = useState<string | null>(null);
  const [globalPostsPerDay, setGlobalPostsPerDay] = useState<number | null>(null);
  const [globalFrequency, setGlobalFrequency] = useState<number | null>(null);

  const currentPostsPerDay = globalPostsPerDay ?? settings?.posts_per_day ?? 48;
  const currentFrequency = globalFrequency ?? settings?.frequency_minutes ?? 30;

  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("blog_settings").update({ is_publishing: !settings.is_publishing }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-blog-settings"] });
    setToggling(false);
  };

  const saveGlobalSettings = async () => {
    if (!settings) return;
    setSavingGlobal(true);
    await db.from("blog_settings").update({
      posts_per_day: currentPostsPerDay,
      frequency_minutes: currentFrequency,
    }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-blog-settings"] });
    toast.success("Global settings saved");
    setSavingGlobal(false);
  };

  const updateProductSetting = async (id: string, product: string, field: string, value: number | boolean) => {
    setSavingProduct(product);
    await db.from("product_publish_settings").update({ [field]: value }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-product-publish-settings"] });
    setSavingProduct(null);
  };

  const totalSeoTarget = productSettings.filter((p: any) => p.enabled).reduce((s: number, p: any) => s + (p.seo_posts_per_day || 0), 0);
  const totalGeoTarget = productSettings.filter((p: any) => p.enabled).reduce((s: number, p: any) => s + (p.geo_posts_per_day || 0), 0);
  const totalTarget = totalSeoTarget + totalGeoTarget;

  const triggerPublish = async () => {
    try {
      await supabase.functions.invoke("auto-publish-blog");
      toast.success("Published");
      queryClient.invalidateQueries({ queryKey: ["admin-blog-published", "admin-blog-drafts", "admin-blog-today"] });
    } catch { toast.error("Publish failed"); }
  };

  return (
    <div className="space-y-8">
      <EngineStatusBar
        name="Lazy Blogger"
        running={settings?.is_publishing ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={postsToday}
        publishedTotal={postsTotal}
        lastRun={lastPost}
      />

      {/* Quick action */}
      <button onClick={triggerPublish} className="inline-flex items-center gap-2 border border-[#c8a961]/30 text-[#c8a961] px-4 py-2 font-body text-xs hover:bg-[#c8a961]/10 transition-colors">
        <Zap size={12} /> Publish One Now
      </button>

      {/* ── Global Settings ── */}
      <div className="border border-[#f0ead6]/8 p-5">
        <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/55 mb-4">Global Publishing Limits</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="font-body text-xs text-[#f0ead6]/60 block mb-1">Max posts per day</label>
            <input
              type="number" min={1} max={200}
              value={currentPostsPerDay}
              onChange={(e) => setGlobalPostsPerDay(parseInt(e.target.value) || 1)}
              className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-3 py-2 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30"
            />
          </div>
          <div>
            <label className="font-body text-xs text-[#f0ead6]/60 block mb-1">Frequency (minutes)</label>
            <input
              type="number" min={5} max={1440}
              value={currentFrequency}
              onChange={(e) => setGlobalFrequency(parseInt(e.target.value) || 30)}
              className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-3 py-2 font-body text-sm focus:outline-none focus:border-[#f0ead6]/30"
            />
          </div>
          <button onClick={saveGlobalSettings} disabled={savingGlobal}
            className="inline-flex items-center justify-center gap-2 border border-[#f0ead6]/20 text-[#f0ead6]/80 px-4 py-2 font-body text-xs hover:bg-[#f0ead6]/5 transition-colors disabled:opacity-40">
            {savingGlobal ? <Loader2 size={12} className="animate-spin" /> : null} Save
          </button>
        </div>
        <p className="font-body text-[11px] text-[#f0ead6]/40 mt-3">
          Per-product targets total: <span className="text-blue-400">{totalSeoTarget} SEO</span> + <span className="text-teal-400">{totalGeoTarget} GEO</span> = <span className="text-[#f0ead6]/70">{totalTarget} posts/day</span> · Global limit: {currentPostsPerDay}
        </p>
      </div>

      {/* ── Per-Product SEO/GEO Controls ── */}
      <div>
        <p className="font-body text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/55 mb-3">Per-Product Daily Targets</p>
        {loadingProducts ? (
          <div className="flex items-center gap-2 text-[#f0ead6]/40 font-body text-xs py-8 justify-center">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="border border-[#f0ead6]/8">
            {/* Header */}
            <div className="grid grid-cols-[1fr_80px_80px_60px] gap-0 border-b border-[#f0ead6]/8 px-4 py-2">
              <span className="font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Product</span>
              <span className="font-body text-[11px] tracking-[0.15em] uppercase text-blue-400/60 text-center flex items-center justify-center gap-1"><Search size={10} /> SEO</span>
              <span className="font-body text-[11px] tracking-[0.15em] uppercase text-teal-400/60 text-center flex items-center justify-center gap-1"><Brain size={10} /> GEO</span>
              <span className="font-body text-[11px] tracking-[0.15em] uppercase text-[#f0ead6]/40 text-center">On</span>
            </div>

            {/* Rows */}
            {productSettings.map((ps: any) => {
              const isSaving = savingProduct === ps.product;
              return (
                <div key={ps.id} className={`grid grid-cols-[1fr_80px_80px_60px] gap-0 border-b border-[#f0ead6]/5 px-4 py-2 items-center ${!ps.enabled ? "opacity-40" : ""}`}>
                  <span className="font-body text-sm text-[#f0ead6]/85">
                    {PRODUCT_LABELS[ps.product] || ps.product}
                    {isSaving && <Loader2 size={10} className="animate-spin inline ml-2" />}
                  </span>

                  <div className="flex justify-center">
                    <input
                      type="number" min={0} max={10}
                      value={ps.seo_posts_per_day}
                      onChange={(e) => updateProductSetting(ps.id, ps.product, "seo_posts_per_day", parseInt(e.target.value) || 0)}
                      className="w-14 bg-transparent border border-blue-400/20 text-blue-400 text-center px-1 py-1 font-body text-xs focus:outline-none focus:border-blue-400/50"
                      disabled={!ps.enabled}
                    />
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="number" min={0} max={10}
                      value={ps.geo_posts_per_day}
                      onChange={(e) => updateProductSetting(ps.id, ps.product, "geo_posts_per_day", parseInt(e.target.value) || 0)}
                      className="w-14 bg-transparent border border-teal-400/20 text-teal-400 text-center px-1 py-1 font-body text-xs focus:outline-none focus:border-teal-400/50"
                      disabled={!ps.enabled}
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => updateProductSetting(ps.id, ps.product, "enabled", !ps.enabled)}
                      className={`w-8 h-5 flex items-center transition-colors ${ps.enabled ? "bg-emerald-500/30 justify-end" : "bg-[#f0ead6]/10 justify-start"}`}
                    >
                      <span className={`w-4 h-4 block ${ps.enabled ? "bg-emerald-500" : "bg-[#f0ead6]/30"}`} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Summary row */}
            <div className="grid grid-cols-[1fr_80px_80px_60px] gap-0 px-4 py-3 items-center bg-[#f0ead6]/3">
              <span className="font-body text-xs text-[#f0ead6]/50 font-semibold uppercase tracking-wider">Total / day</span>
              <span className="font-body text-xs text-blue-400 text-center font-bold">{totalSeoTarget}</span>
              <span className="font-body text-xs text-teal-400 text-center font-bold">{totalGeoTarget}</span>
              <span className="font-body text-xs text-[#f0ead6]/60 text-center font-bold">{productSettings.filter((p: any) => p.enabled).length}</span>
            </div>
          </div>
        )}
      </div>

      <ContentTable
        title="Draft Queue"
        data={drafts}
        columns={[
          { key: "title", label: "Title" },
          { key: "slug", label: "Source", render: (r: any) => {
            if (r.slug?.startsWith("seo-")) return <span className="text-blue-400 text-[11px] uppercase tracking-wider font-bold">SEO</span>;
            if (r.slug?.startsWith("geo-")) return <span className="text-teal-400 text-[11px] uppercase tracking-wider font-bold">GEO</span>;
            return <span className="text-[#f0ead6]/40 text-[11px] uppercase tracking-wider">Blog</span>;
          }},
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        emptyMessage="No drafts in queue. SEO and GEO agent produce drafts for the Blogger to publish."
      />

      <ContentTable
        title="Published Posts"
        data={published}
        columns={[
          { key: "title", label: "Title" },
          { key: "published_at", label: "Published", render: (r: any) => r.published_at ? new Date(r.published_at).toLocaleDateString() : "—" },
          { key: "slug", label: "", render: (r: any) => <a href={`/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline text-[13px] uppercase tracking-wider">View</a> },
        ]}
        searchKey="title"
      />

      <ErrorLog errors={errors} />
    </div>
  );
}
