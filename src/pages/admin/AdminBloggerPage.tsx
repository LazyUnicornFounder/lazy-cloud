import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap } from "./components/QuickActions";
import ContentTable from "./components/ContentTable";
import ErrorLog from "./components/ErrorLog";
import SettingsPanel from "./components/SettingsPanel";

const db = supabase as any;

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

  // Prompt
  const { data: prompt } = useQuery({
    queryKey: ["admin-blog-prompt"],
    queryFn: async () => { const { data } = await db.from("prompt_versions").select("*").eq("product", "lazy-blogger").eq("is_current", true).limit(1).single(); return data; },
  });

  const [toggling, setToggling] = useState(false);
  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("blog_settings").update({ is_publishing: !settings.is_publishing }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-blog-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-engine-status"] });
    setToggling(false);
  };

  return (
    <div>
      <EngineStatusBar
        name="Lazy Blogger"
        running={settings?.is_publishing ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={postsToday}
        publishedTotal={postsTotal}
        lastRun={lastPost}
      />

      <QuickActions
        actions={[
          { label: "Publish One Now", fnName: "auto-publish-blog", icon: Zap },
        ]}
        queryKeys={["admin-blog-published", "admin-blog-drafts", "admin-blog-today", "admin-blog-total"]}
      />

      <ContentTable
        title="Draft Queue"
        data={drafts}
        columns={[
          { key: "title", label: "Title" },
          { key: "created_at", label: "Created", render: (r) => new Date(r.created_at).toLocaleDateString() },
        ]}
        emptyMessage="No drafts in queue. SEO and GEO engines produce drafts for the Blogger to publish."
      />

      <ContentTable
        title="Published Posts"
        data={published}
        columns={[
          { key: "title", label: "Title" },
          { key: "published_at", label: "Published", render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString() : "—" },
          { key: "read_time", label: "Read Time" },
          { key: "slug", label: "", render: (r) => <a href={`/blog/${r.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline text-[10px] uppercase tracking-wider">View</a> },
        ]}
        searchKey="title"
      />

      {/* System Prompt */}
      {prompt && (
        <div className="mt-8">
          <p className="font-body text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/30 mb-3">Current System Prompt</p>
          <div className="border border-[#f0ead6]/8 p-4">
            <p className="font-body text-xs text-[#f0ead6]/40 leading-relaxed whitespace-pre-wrap">{prompt.prompt_text?.substring(0, 500)}…</p>
            <p className="font-body text-[10px] text-[#f0ead6]/15 mt-2">v{prompt.version} · Edit in Settings → Prompts</p>
          </div>
        </div>
      )}

      <ErrorLog errors={errors} />

      {settings && (
        <SettingsPanel
          fields={[
            { key: "posts_per_day", label: "Posts per day", type: "number" },
            { key: "frequency_minutes", label: "Frequency (minutes)", type: "number" },
          ]}
          values={settings}
          onSave={async (vals) => { await db.from("blog_settings").update(vals).eq("id", settings.id); queryClient.invalidateQueries({ queryKey: ["admin-blog-settings"] }); }}
        />
      )}
    </div>
  );
}
