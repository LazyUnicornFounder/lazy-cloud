import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Globe, FileText, Clock, Target, ArrowUpRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap, Search, Brain } from "./components/QuickActions";
import ErrorLog from "./components/ErrorLog";
import SettingsPanel from "./components/SettingsPanel";

const db = supabase as any;

export default function AdminGeoPage() {
  const queryClient = useQueryClient();
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

  const { data: settings } = useQuery({
    queryKey: ["admin-geo-settings"],
    queryFn: async () => { const { data } = await db.from("geo_settings").select("*").limit(1).single(); return data; },
  });

  const { data: postsToday = 0 } = useQuery({
    queryKey: ["admin-geo-today"],
    queryFn: async () => { const { count } = await db.from("geo_posts").select("id", { count: "exact", head: true }).gte("published_at", todayStart.toISOString()); return count ?? 0; },
  });

  const { data: postsTotal = 0 } = useQuery({
    queryKey: ["admin-geo-total"],
    queryFn: async () => { const { count } = await db.from("geo_posts").select("id", { count: "exact", head: true }); return count ?? 0; },
  });

  const { data: queries = [] } = useQuery({
    queryKey: ["admin-geo-queries"],
    queryFn: async () => { const { data } = await db.from("geo_queries").select("*").order("priority", { ascending: false }); return data || []; },
  });

  const { data: published = [] } = useQuery({
    queryKey: ["admin-geo-published"],
    queryFn: async () => { const { data } = await db.from("geo_posts").select("*").order("published_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: queuedDrafts = [] } = useQuery({
    queryKey: ["admin-geo-drafts"],
    queryFn: async () => {
      const { data } = await db
        .from("blog_posts")
        .select("*")
        .eq("status", "draft")
        .like("slug", "geo-%")
        .order("created_at", { ascending: true })
        .limit(20);
      return data || [];
    },
  });

  const { data: lastPost } = useQuery({
    queryKey: ["admin-geo-last"],
    queryFn: async () => { const { data } = await db.from("geo_posts").select("published_at").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const { data: citations = [] } = useQuery({
    queryKey: ["admin-geo-citations"],
    queryFn: async () => { const { data } = await db.from("geo_citations").select("*").order("tested_at", { ascending: false }).limit(20); return data || []; },
  });

  const { data: citationRate = 0 } = useQuery({
    queryKey: ["admin-geo-citation-rate"],
    queryFn: async () => {
      const { count: total } = await db.from("geo_citations").select("id", { count: "exact", head: true });
      const { count: cited } = await db.from("geo_citations").select("id", { count: "exact", head: true }).eq("brand_mentioned", true);
      if (!total) return 0;
      return Math.round(((cited ?? 0) / total) * 100);
    },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-geo-errors"],
    queryFn: async () => { const { data } = await db.from("geo_errors").select("*").order("created_at", { ascending: false }).limit(10); return data || []; },
  });

  const [toggling, setToggling] = useState(false);
  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("geo_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-geo-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-engine-status"] });
    setToggling(false);
  };

  const [testingCitation, setTestingCitation] = useState(false);
  const runCitationTest = async () => {
    setTestingCitation(true);
    try {
      await supabase.functions.invoke("lazy-geo-test");
      toast.success("Citation test triggered");
      queryClient.invalidateQueries({ queryKey: ["admin-geo-citations"] });
      queryClient.invalidateQueries({ queryKey: ["admin-geo-citation-rate"] });
    } catch { toast.error("Citation test failed"); }
    setTestingCitation(false);
  };

  const [qSearch, setQSearch] = useState("");
  const filteredQueries = qSearch
    ? queries.filter((q: any) => q.query?.toLowerCase().includes(qSearch.toLowerCase()))
    : queries;

  const pendingQueries = queries.filter((q: any) => !q.has_content);
  const coveredQueries = queries.filter((q: any) => q.has_content);

  const typeColors: Record<string, string> = {
    informational: "text-blue-400 border-blue-400/20",
    commercial: "text-emerald-400 border-emerald-400/20",
    navigational: "text-[#c8a961] border-[#c8a961]/20",
  };

  return (
    <div>
      <EngineStatusBar
        name="Lazy GEO"
        running={settings?.is_running ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={postsToday}
        publishedTotal={postsTotal}
        lastRun={lastPost}
      />

      <QuickActions
        actions={[
          { label: "Publish One Now", fnName: "lazy-geo-publish", icon: Zap },
          { label: "Discover Queries", fnName: "lazy-geo-discover", icon: Search },
          { label: "Run Citation Test", fnName: "lazy-geo-test", icon: Brain },
        ]}
        queryKeys={["admin-geo-published", "admin-geo-queries", "admin-geo-today", "admin-geo-total", "admin-geo-drafts", "admin-geo-citations"]}
      />

      {/* Citation rate banner */}
      <div className="mt-8 border border-[#f0ead6]/8 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Target size={18} className="text-[#c8a961]" />
          <div>
            <p className="font-display text-2xl font-bold text-[#c8a961]">{citationRate}%</p>
            <p className="font-body text-[10px] text-[#f0ead6]/25">citation rate across {citations.length} tests</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-body text-[10px] text-[#f0ead6]/20">{pendingQueries.length} uncovered queries</p>
            <p className="font-body text-[10px] text-[#f0ead6]/20">{coveredQueries.length} with content</p>
          </div>
          <button
            onClick={runCitationTest}
            disabled={testingCitation}
            className="inline-flex items-center gap-2 border border-[#f0ead6]/10 px-4 py-2 font-body text-xs text-[#f0ead6]/50 hover:text-[#f0ead6] transition-colors disabled:opacity-40"
          >
            {testingCitation ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
            Test Now
          </button>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#f0ead6]/5 mt-6">
        {/* Queries */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-emerald-400/60" />
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Target Queries</p>
            </div>
            <span className="font-body text-[10px] text-[#f0ead6]/20">{queries.length} total</span>
          </div>
          <input
            type="text"
            value={qSearch}
            onChange={(e) => setQSearch(e.target.value)}
            placeholder="Filter queries…"
            className="w-full bg-transparent border border-[#f0ead6]/8 text-[#f0ead6] px-3 py-1.5 font-body text-xs focus:outline-none focus:border-[#f0ead6]/20 mb-3"
          />
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {filteredQueries.length === 0 ? (
              <p className="font-body text-xs text-[#f0ead6]/15 py-4 text-center">No queries — click Discover Queries</p>
            ) : (
              filteredQueries.map((q: any) => (
                <div key={q.id} className="flex items-center justify-between py-2 px-2 border-b border-[#f0ead6]/5 hover:bg-[#f0ead6]/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-[#f0ead6]/70 truncate">{q.query}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {q.product && q.product !== 'general' && (
                        <span className="font-body text-[9px] px-1.5 py-0.5 border border-[#c8a961]/20 text-[#c8a961]/60 uppercase tracking-wider">{q.product}</span>
                      )}
                      {q.query_type && (
                        <span className={`font-body text-[9px] px-1.5 py-0.5 border ${typeColors[q.query_type] || "text-[#f0ead6]/30 border-[#f0ead6]/10"} uppercase tracking-wider`}>{q.query_type}</span>
                      )}
                      <span className="font-body text-[10px] text-[#f0ead6]/15">P{q.priority}</span>
                    </div>
                  </div>
                  <div className="shrink-0 ml-2">
                    {q.has_content ? (
                      <span className="font-body text-[9px] text-emerald-400/50 border border-emerald-400/20 px-1.5 py-0.5">covered</span>
                    ) : q.brand_cited ? (
                      <span className="font-body text-[9px] text-[#c8a961]/50 border border-[#c8a961]/20 px-1.5 py-0.5">cited</span>
                    ) : (
                      <span className="font-body text-[9px] text-red-400/30 border border-red-400/10 px-1.5 py-0.5">pending</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Published GEO posts */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={14} className="text-emerald-400/60" />
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Published GEO Posts</p>
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
                      {post.target_query && (
                        <span className="font-body text-[10px] px-1.5 py-0.5 border border-emerald-400/20 text-emerald-400/50 truncate max-w-[120px]">{post.target_query}</span>
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

        {/* Blog queue (GEO drafts) */}
        <div className="bg-[#0f0f0d] p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-amber-400/60" />
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40">Queued Blog Drafts</p>
            <span className="ml-auto font-body text-[10px] text-[#f0ead6]/20">{queuedDrafts.length} in queue</span>
          </div>
          <div className="space-y-0 max-h-[400px] overflow-y-auto">
            {queuedDrafts.length === 0 ? (
              <p className="font-body text-xs text-[#f0ead6]/15 py-4 text-center">No GEO drafts in the blog queue</p>
            ) : (
              queuedDrafts.map((draft: any, i: number) => (
                <div key={draft.id} className="flex items-start gap-3 py-2.5 px-2 border-b border-[#f0ead6]/5 hover:bg-[#f0ead6]/3 transition-colors">
                  <span className="font-display text-[10px] font-bold text-[#f0ead6]/20 mt-0.5 shrink-0 w-4 text-right">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-xs text-[#f0ead6]/60 truncate">{draft.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[10px] px-1.5 py-0.5 border border-emerald-400/20 text-emerald-400/50">GEO</span>
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

      {/* Recent citation tests */}
      <div className="mt-8">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">Recent Citation Tests</p>
        <div className="border border-[#f0ead6]/8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0ead6]/8">
                <th className="text-left px-4 py-2.5 font-body text-[10px] tracking-[0.12em] uppercase text-[#f0ead6]/25 font-normal">Query</th>
                <th className="text-left px-4 py-2.5 font-body text-[10px] tracking-[0.12em] uppercase text-[#f0ead6]/25 font-normal">Cited</th>
                <th className="text-left px-4 py-2.5 font-body text-[10px] tracking-[0.12em] uppercase text-[#f0ead6]/25 font-normal">Confidence</th>
                <th className="text-left px-4 py-2.5 font-body text-[10px] tracking-[0.12em] uppercase text-[#f0ead6]/25 font-normal">Tested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ead6]/5">
              {citations.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-6 text-center font-body text-xs text-[#f0ead6]/20">No citation tests yet</td></tr>
              ) : (
                citations.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#f0ead6]/3 transition-colors">
                    <td className="px-4 py-2.5 font-body text-xs text-[#f0ead6]/60">{c.query}</td>
                    <td className="px-4 py-2.5 font-body text-xs">
                      {c.brand_mentioned ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400/50">No</span>}
                    </td>
                    <td className="px-4 py-2.5 font-body text-xs text-[#f0ead6]/40">{c.confidence ?? "—"}</td>
                    <td className="px-4 py-2.5 font-body text-xs text-[#f0ead6]/30">{new Date(c.tested_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ErrorLog errors={errors} />

      {settings && (
        <SettingsPanel
          fields={[
            { key: "site_url", label: "Site URL" },
            { key: "brand_name", label: "Brand Name" },
            { key: "business_description", label: "Business Description", type: "textarea" },
            { key: "target_audience", label: "Target Audience", type: "textarea" },
            { key: "niche_topics", label: "Niche Topics", type: "textarea" },
            { key: "competitors", label: "Competitors", type: "textarea" },
            { key: "posts_per_day", label: "Posts per day", type: "number" },
          ]}
          values={settings}
          onSave={async (vals) => { await db.from("geo_settings").update(vals).eq("id", settings.id); queryClient.invalidateQueries({ queryKey: ["admin-geo-settings"] }); }}
        />
      )}
    </div>
  );
}
