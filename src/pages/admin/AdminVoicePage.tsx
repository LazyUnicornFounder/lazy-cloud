import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import EngineStatusBar from "./components/EngineStatusBar";
import ContentTable from "./components/ContentTable";
import ErrorLog from "./components/ErrorLog";
import SettingsPanel from "./components/SettingsPanel";

const db = supabase as any;

export default function AdminVoicePage() {
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["admin-voice-settings"],
    queryFn: async () => { const { data } = await db.from("voice_settings").select("*").limit(1).single(); return data; },
  });

  const { data: episodesTotal = 0 } = useQuery({
    queryKey: ["admin-voice-total"],
    queryFn: async () => { const { count } = await db.from("voice_episodes").select("id", { count: "exact", head: true }).eq("status", "published"); return count ?? 0; },
  });

  const { data: episodes = [] } = useQuery({
    queryKey: ["admin-voice-episodes"],
    queryFn: async () => { const { data } = await db.from("voice_episodes").select("*").order("created_at", { ascending: false }).limit(50); return data || []; },
  });

  const { data: lastEp } = useQuery({
    queryKey: ["admin-voice-last"],
    queryFn: async () => { const { data } = await db.from("voice_episodes").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).single(); return data?.published_at ?? null; },
  });

  const { data: errors = [] } = useQuery({
    queryKey: ["admin-voice-errors"],
    queryFn: async () => { const { data } = await db.from("voice_errors").select("*").order("created_at", { ascending: false }).limit(10); return data || []; },
  });

  const [toggling, setToggling] = useState(false);
  const toggleRunning = async () => {
    if (!settings) return;
    setToggling(true);
    await db.from("voice_settings").update({ is_running: !settings.is_running }).eq("id", settings.id);
    queryClient.invalidateQueries({ queryKey: ["admin-voice-settings"] });
    queryClient.invalidateQueries({ queryKey: ["admin-engine-status"] });
    setToggling(false);
  };

  return (
    <div>
      <EngineStatusBar
        name="Lazy Voice"
        running={settings?.is_running ?? false}
        onToggle={toggleRunning}
        toggling={toggling}
        publishedToday={0}
        publishedTotal={episodesTotal}
        lastRun={lastEp}
      />

      <ContentTable
        title="Episodes"
        data={episodes}
        columns={[
          { key: "post_title", label: "Title" },
          { key: "status", label: "Status", render: (r) => <span className={r.status === "published" ? "text-emerald-400" : "text-[#f0ead6]/30"}>{r.status}</span> },
          { key: "duration_seconds", label: "Duration", render: (r) => r.duration_seconds ? `${Math.round(r.duration_seconds / 60)}m` : "—" },
          { key: "published_at", label: "Published", render: (r) => r.published_at ? new Date(r.published_at).toLocaleDateString() : "—" },
        ]}
        searchKey="post_title"
      />

      <ErrorLog errors={errors} />

      {settings && (
        <SettingsPanel
          fields={[
            { key: "elevenlabs_api_key", label: "ElevenLabs API Key", type: "password" },
            { key: "voice_id", label: "Voice ID" },
            { key: "podcast_title", label: "Podcast Title" },
            { key: "podcast_description", label: "Podcast Description", type: "textarea" },
            { key: "podcast_author", label: "Author" },
            { key: "site_url", label: "Site URL" },
          ]}
          values={settings}
          onSave={async (vals) => { await db.from("voice_settings").update(vals).eq("id", settings.id); queryClient.invalidateQueries({ queryKey: ["admin-voice-settings"] }); }}
        />
      )}
    </div>
  );
}
