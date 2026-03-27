import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import EngineStatusBar from "./components/EngineStatusBar";
import QuickActions, { Zap } from "./components/QuickActions";
import ContentTable from "./components/ContentTable";
import ErrorLog from "./components/ErrorLog";
import SettingsPanel from "./components/SettingsPanel";

const db = supabase as any;

export default function AdminStreamPage() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["admin-stream-settings"],
    queryFn: async () => { const { data } = await db.from("stream_settings").select("*").limit(1).single(); return data; },
  });

  const { data: contentTotal = 0 } = useQuery({
    queryKey: ["admin-stream-content-total"],
    queryFn: async () => { const { count } = await db.from("stream_content").select("id", { count: "exact", head: true }); return count ?? 0; },
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["admin-stream-sessions"],
    queryFn: async () => { const { data } = await db.from("stream_sessions").select("*").order("created_at", { ascending: false }).limit(20); return data || []; },
  });

  const { data: content = [] } = useQuery({
    queryKey: ["admin-stream-content"],
    queryFn: async () => { const { data } = await db.from("stream_content").select("*").order("published_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: clips = [] } = useQuery({
    queryKey: ["admin-stream-clips"],
    queryFn: async () => { const { data } = await db.from("stream_clips").select("*").order("view_count", { ascending: false }).limit(20); return data || []; },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-stream-errors"],
    queryFn: async () => { const { data } = await db.from("stream_errors").select("*").order("created_at", { ascending: false }).limit(10); return data || []; },
  });

  const { data: lastContent } = useQuery({
    queryKey: ["admin-stream-last"],
    queryFn: async () => { const { data } = await db.from("stream_content").select("published_at").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const [toggling, setToggling] = useState(false);
  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("stream_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-stream-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-engine-status"] });
    setToggling(false);
  };

  return (
    <div>
      <EngineStatusBar
        name="Lazy Stream"
        running={settings?.is_running ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={0}
        publishedTotal={contentTotal}
        lastRun={lastContent}
      />

      <QuickActions
        actions={[
          { label: "Process Last Stream", fnName: "stream-process", icon: Zap, body: { session_id: sessions.find((s: any) => s.status === "ended" || s.status === "processed")?.id } },
          { label: "Optimise Content", fnName: "stream-optimise", icon: Zap },
        ]}
        queryKeys={["admin-stream-content", "admin-stream-sessions"]}
      />

      <ContentTable
        title="Stream Sessions"
        data={sessions}
        columns={[
          { key: "title", label: "Title" },
          { key: "game_name", label: "Game" },
          { key: "started_at", label: "Date", render: (r) => r.started_at ? new Date(r.started_at).toLocaleDateString() : "—" },
          { key: "duration_minutes", label: "Duration", render: (r) => r.duration_minutes ? `${r.duration_minutes}m` : "—" },
          { key: "status", label: "Status", render: (r) => <span className={r.status === "live" ? "text-emerald-400" : r.status === "processed" ? "text-[#c8a961]" : "text-[#f0ead6]/75"}>{r.status}</span> },
        ]}
      />

      <ContentTable
        title="Published Content"
        data={content}
        columns={[
          { key: "title", label: "Title" },
          { key: "content_type", label: "Type" },
          { key: "published_at", label: "Published", render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString() : "—" },
          { key: "views", label: "Views" },
        ]}
        searchKey="title"
      />

      <ContentTable
        title="Clips"
        data={clips}
        columns={[
          { key: "title", label: "Title" },
          { key: "view_count", label: "Views" },
          { key: "clip_url", label: "", render: (r) => r.clip_url ? <a href={r.clip_url} target="_blank" rel="noopener noreferrer" className="text-[#c8a961] hover:underline text-[13px] uppercase tracking-wider">Watch</a> : "—" },
        ]}
      />

      <ErrorLog errors={errors} />

      {settings && (
        <SettingsPanel
          fields={[
            { key: "twitch_client_id", label: "Twitch Client ID" },
            { key: "twitch_client_secret", label: "Twitch Client Secret", type: "password" },
            { key: "twitch_username", label: "Twitch Username" },
            { key: "site_url", label: "Site URL" },
            { key: "business_name", label: "Business Name" },
            { key: "content_niche", label: "Content Niche" },
          ]}
          values={settings}
          onSave={async (vals) => { await db.from("stream_settings").update(vals).eq("id", settings.id); queryClient.invalidateQueries({ queryKey: ["admin-stream-settings"] }); }}
        />
      )}
    </div>
  );
}
