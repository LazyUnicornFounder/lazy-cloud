import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap, Search, Brain } from "./components/QuickActions";
import ContentTable from "./components/ContentTable";
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

  const { data: queue = [] } = useQuery({
    queryKey: ["admin-seo-queue"],
    queryFn: async () => { const { data } = await db.from("seo_keywords").select("*").order("current_position", { ascending: true }); return data || []; },
  });

  const { data: published = [] } = useQuery({
    queryKey: ["admin-seo-published"],
    queryFn: async () => { const { data } = await db.from("seo_posts").select("*").order("published_at", { ascending: false }).limit(50); return data || []; },
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
        queryKeys={["admin-seo-published", "admin-seo-queue", "admin-seo-today", "admin-seo-total"]}
      />

      <ContentTable
        title="Keyword Queue"
        data={queue}
        columns={[
          { key: "keyword", label: "Keyword" },
          { key: "current_position", label: "Position", render: (r) => r.current_position ?? "—" },
          { key: "page_url", label: "Page", render: (r) => r.page_url ? <a href={r.page_url} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline">View</a> : "—" },
          { key: "last_checked", label: "Checked", render: (r) => r.last_checked ? new Date(r.last_checked).toLocaleDateString() : "—" },
        ]}
        emptyMessage="No keywords tracked yet — click Analyse Keywords to discover opportunities."
      />

      <ContentTable
        title="Published Content"
        data={published}
        columns={[
          { key: "title", label: "Title" },
          { key: "target_keyword", label: "Keyword" },
          { key: "published_at", label: "Published", render: (r) => new Date(r.published_at).toLocaleDateString() },
          { key: "slug", label: "", render: (r) => <a href={`/seo-blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline text-[10px] uppercase tracking-wider">View</a> },
        ]}
        searchKey="target_keyword"
      />

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
