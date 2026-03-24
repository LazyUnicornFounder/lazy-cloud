import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, FileText, Clock, TrendingUp, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap, Brain } from "./components/QuickActions";
import ErrorLog from "./components/ErrorLog";
import SettingsPanel from "./components/SettingsPanel";

const db = supabase as any;

export default function AdminSeoPage() {
  const queryClient = useQueryClient();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

  const { data: settings } = useQuery({
    queryKey: ["admin-seo-settings"],
    queryFn: async () => { const { data } = await db.from("seo_settings").select("*").limit(1).single(); return data; },
  });

  const { data: postsToday = 0 } = useQuery({
    queryKey: ["admin-seo-today"],
    queryFn: async () => { const { count } = await db.from("seo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayStart.toISOString()); return count ?? 0; },
  });

  const { data: postsTotal = 0 } = useQuery({
    queryKey: ["admin-seo-total"],
    queryFn: async () => { const { count } = await db.from("seo_posts").select("id", { count: "exact", head: true }); return count ?? 0; },
  });

  const { data: keywords = [] } = useQuery({
    queryKey: ["admin-seo-keywords"],
    queryFn: async () => { const { data } = await db.from("seo_keywords").select("*").order("current_position", { ascending: true }); return data || []; },
  });

  const { data: published = [] } = useQuery({
    queryKey: ["admin-seo-published"],
    queryFn: async () => { const { data } = await db.from("seo_posts").select("*").order("published_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: queuedDrafts = [] } = useQuery({
    queryKey: ["admin-seo-drafts"],
    queryFn: async () => {
      const { data } = await db
        .from("blog_posts")
        .select("*")
        .eq("status", "draft")
        .like("slug", "seo-%")
        .order("created_at", { ascending: true })
        .limit(20);
      return data || [];
    },
  });

  const { data: lastPost } = useQuery({
    queryKey: ["admin-seo-last"],
    queryFn: async () => { const { data } = await db.from("seo_posts").select("published_at").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-seo-errors"],
    queryFn: async () => { const { data } = await db.from("seo_errors").select("*").order("created_at", { ascending: false }).limit(10); return data || []; },
  });

  const [toggling, setToggling] = useState(false);
  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("seo_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-seo-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-engine-status"] });
    setToggling(false);
  };

  const [kwSearch, setKwSearch] = useState("");
  const filteredKeywords = kwSearch
    ? keywords.filter((k: any) => k.keyword?.toLowerCase().includes(kwSearch.toLowerCase()))
    : keywords;

  const positionDelta = (kw: any) => {
    if (kw.previous_position == null || kw.current_position == null) return null;
    return kw.previous_position - kw.current_position;
  };

  return (
    <div>
      <EngineStatusBar
        name="Lazy SEO"
        running={settings?.is_running ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={postsToday}
        publishedTotal={postsTotal}
        lastRun={lastPost}
      />

      <QuickActions
        actions={[
          { label: "Publish One Now", fnName: "lazy-seo-publish", icon: Zap },
          { label: "Analyse Keywords", fnName: "lazy-seo-analyse", icon: Search },
        ]}
        queryKeys={["admin-seo-published", "admin-seo-keywords", "admin-seo-today", "admin-seo-total", "admin-seo-drafts"]}
      />

      {/* Three-column overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#f0ead6]/5 mt-8">
        {/* Keywords */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} className="text-[#c8a961]" />
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Keywords</p>
            </div>
            <span className="font-body text-[10px] text-[#f0ead6]/20">{keywords.length} tracked</span>
          </div>
          <input
            type="text"
            value={kwSearch}
            onChange={(e) => setKwSearch(e.target.value)}
            placeholder="Filter keywords…"
            className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-1.5 font-body text-xs focus:outline-none focus:border-[#f0ead6]/20 mb-3"
          />
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {filteredKeywords.length === 0 ? (
              <p className="font-body text-xs text-[#f0ead6]/15 py-4 text-center">No keywords yet — click Analyse Keywords</p>
            ) : (
              filteredKeywords.map((kw: any) => {
                const delta = positionDelta(kw);
                return (
                  <div key={kw.id} className="flex items-center justify-between py-2 px-2 border-b border-[#f0ead6]/5 hover:bg-[#f0ead6]/3 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-[#f0ead6]/70 truncate">{kw.keyword}</p>
                      {kw.page_url && (
                        <a href={kw.page_url} target="_blank" rel="noopener noreferrer" className="font-body text-[10px] text-[#c8a961]/50 hover:text-[#c8a961] truncate block">
                          {kw.page_url.replace(/^https?:\/\//, '').slice(0, 40)}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {kw.current_position != null && (
                        <span className="font-display text-sm font-bold text-[#f0ead6]/80">#{kw.current_position}</span>
                      )}
                      {delta != null && delta !== 0 && (
                        <span className={`font-body text-[10px] font-bold ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {delta > 0 ? `↑${delta}` : `↓${Math.abs(delta)}`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Published SEO posts */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-blue-400/60" />
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Published SEO Posts</p>
            <span className="ml-auto font-body text-[10px] text-[#f0ead6]/20">{published.length}</span>
          </div>
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {published.length === 0 ? (
              <p className="font-body text-xs text-[#f0ead6]/15 py-4 text-center">No posts published yet</p>
            ) : (
              published.map((post: any) => (
                <div key={post.id} className="flex items-start justify-between py-2.5 px-2 border-b border-[#f0ead6]/5 hover:bg-[#f0ead6]/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-[#f0ead6]/60 truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {post.target_keyword && (
                        <span className="font-body text-[10px] px-1.5 py-0.5 border border-blue-400/20 text-blue-400/60">{post.target_keyword}</span>
                      )}
                      <span className="font-body text-[10px] text-[#f0ead6]/15">{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-2 text-[#c8a961]/50 hover:text-[#c8a961]">
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blog queue (SEO drafts) */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-amber-400/60" />
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Queued Blog Drafts</p>
            <span className="ml-auto font-body text-[10px] text-[#f0ead6]/20">{queuedDrafts.length} in queue</span>
          </div>
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {queuedDrafts.length === 0 ? (
              <p className="font-body text-xs text-[#f0ead6]/15 py-4 text-center">No SEO drafts in the blog queue</p>
            ) : (
              queuedDrafts.map((draft: any, i: number) => (
                <div key={draft.id} className="flex items-start gap-3 py-2.5 px-2 border-b border-[#f0ead6]/5 hover:bg-[#f0ead6]/3 transition-colors">
                  <span className="font-display text-[10px] font-bold text-[#f0ead6]/20 mt-0.5 shrink-0 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-[#f0ead6]/60 truncate">{draft.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[10px] px-1.5 py-0.5 border border-blue-400/20 text-blue-400/50">SEO</span>
                      <span className="font-body text-[10px] text-[#f0ead6]/15">{new Date(draft.created_at).toLocaleDateString()}</span>
                      <span className="font-body text-[10px] text-amber-400/40">{draft.read_time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ErrorLog errors={errors} />

      {settings && (
        <SettingsPanel
          fields={[
            { key: "site_url", label: "Site URL" },
            { key: "business_description", label: "Business Description", type: "textarea" },
            { key: "target_keywords", label: "Target Keywords", type: "textarea", hint: "Comma separated" },
            { key: "competitors", label: "Competitors", type: "textarea", hint: "Comma separated URLs" },
            { key: "publishing_frequency", label: "Posts per day", type: "number" },
          ]}
          values={settings}
          onSave={async (vals) => { await db.from("seo_settings").update(vals).eq("id", settings.id); queryClient.invalidateQueries({ queryKey: ["admin-seo-settings"] }); }}
        />
      )}
    </div>
  );
}
