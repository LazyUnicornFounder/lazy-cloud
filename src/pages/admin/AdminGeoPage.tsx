import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap, Search, Brain } from "./components/QuickActions";
import ContentTable from "./components/ContentTable";
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

  const { data: queue = [] } = useQuery({
    queryKey: ["admin-geo-queue"],
    queryFn: async () => { const { data } = await db.from("geo_queries").select("*").eq("has_content", false).order("priority", { ascending: false }); return data || []; },
  });

  const { data: published = [] } = useQuery({
    queryKey: ["admin-geo-published"],
    queryFn: async () => { const { data } = await db.from("geo_posts").select("*").order("published_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: lastPost } = useQuery({
    queryKey: ["admin-geo-last"],
    queryFn: async () => { const { data } = await db.from("geo_posts").select("published_at").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const { data: citations = [] } = useQuery({
    queryKey: ["admin-geo-citations"],
    queryFn: async () => { const { data } = await db.from("geo_citations").select("*").order("tested_at", { ascending: false }).limit(10); return data || []; },
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
        queryKeys={["admin-geo-published", "admin-geo-queue", "admin-geo-today", "admin-geo-total", "admin-geo-citations"]}
      />

      <ContentTable
        title="Query Queue"
        data={queue}
        columns={[
          { key: "query", label: "Query" },
          { key: "query_type", label: "Type", render: (r) => r.query_type ? <span className={`text-[10px] px-2 py-0.5 border ${typeColors[r.query_type] || "text-[#f0ead6]/30 border-[#f0ead6]/10"} uppercase tracking-wider`}>{r.query_type}</span> : "—" },
          { key: "priority", label: "Priority" },
          { key: "created_at", label: "Discovered", render: (r) => new Date(r.created_at).toLocaleDateString() },
        ]}
        emptyMessage="Queue is empty — click Discover More to find new queries."
      />

      <ContentTable
        title="Published Content"
        data={published}
        columns={[
          { key: "title", label: "Title" },
          { key: "target_query", label: "Query" },
          { key: "published_at", label: "Published", render: (r) => new Date(r.published_at).toLocaleDateString() },
          { key: "slug", label: "", render: (r) => <a href={`/geo-blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline text-[10px] uppercase tracking-wider">View</a> },
        ]}
        searchKey="target_query"
      />

      {/* Citation Rate Panel */}
      <div className="mt-8">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">Citation Rate</p>
        <div className="border border-[#f0ead6]/8 p-5 flex items-center gap-6">
          <div>
            <p className="font-display text-3xl font-bold text-[#c8a961]">{citationRate}%</p>
            <p className="font-body text-[10px] text-[#f0ead6]/25 mt-1">of queries cite your brand</p>
          </div>
          <button
            onClick={runCitationTest}
            disabled={testingCitation}
            className="inline-flex items-center gap-2 border border-[#f0ead6]/10 px-4 py-2 font-body text-xs text-[#f0ead6]/50 hover:text-[#f0ead6] transition-colors disabled:opacity-40"
          >
            {testingCitation ? <Loader2 size={12} className="animate-spin" /> : <Brain size={12} />}
            Run Citation Test
          </button>
        </div>
        <ContentTable
          title="Recent Citation Tests"
          data={citations}
          columns={[
            { key: "query", label: "Query" },
            { key: "brand_mentioned", label: "Cited", render: (r) => r.brand_mentioned ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400/50">No</span> },
            { key: "confidence", label: "Confidence" },
            { key: "tested_at", label: "Tested", render: (r) => new Date(r.tested_at).toLocaleDateString() },
          ]}
        />
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
