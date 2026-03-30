import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type QueueTab = "seo" | "geo";

export default function AdminQueuePage() {
  const [tab, setTab] = useState<QueueTab>("seo");

  const { data: seoQueue } = useQuery({
    queryKey: ["admin-seo-queue"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("seo_keywords").select("*").order("current_position", { ascending: true }).limit(50);
        return data || [];
      } catch { return []; }
    },
  });

  const { data: geoQueue } = useQuery({
    queryKey: ["admin-geo-queue"],
    queryFn: async () => {
      try {
        const { data } = await supabase.from("geo_queries").select("*").eq("has_content", false).order("priority", { ascending: false }).limit(50);
        return data || [];
      } catch { return []; }
    },
  });

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Queue</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Content queued for publishing.</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(["seo", "geo"] as QueueTab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded text-[12px] font-bold uppercase tracking-[0.06em]"
            style={{ background: tab === t ? "rgba(201,168,76,0.15)" : "rgba(240,234,214,0.04)", color: tab === t ? "#c9a84c" : "rgba(240,234,214,0.5)" }}>
            {t === "seo" ? `SEO Queue (${seoQueue?.length || 0})` : `GEO Queue (${geoQueue?.length || 0})`}
          </button>
        ))}
      </div>

      {tab === "seo" && (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
          <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
            <div style={{ flex: 3 }}>Keyword</div>
            <div style={{ flex: 1 }}>Position</div>
            <div style={{ flex: 1 }}>Product</div>
          </div>
          {(seoQueue || []).length === 0 ? (
            <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No SEO keywords in queue.</div>
          ) : (
            (seoQueue || []).map((k: any) => (
              <div key={k.id} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
                <div style={{ flex: 3, color: "#f0ead6" }}>{k.keyword}</div>
                <div style={{ flex: 1, color: "rgba(240,234,214,0.5)" }}>{k.current_position || "—"}</div>
                <div style={{ flex: 1, color: "rgba(240,234,214,0.4)" }}>{k.product || "general"}</div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "geo" && (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
          <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
            <div style={{ flex: 3 }}>Query</div>
            <div style={{ flex: 1 }}>Priority</div>
            <div style={{ flex: 1 }}>Cited</div>
          </div>
          {(geoQueue || []).length === 0 ? (
            <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No GEO queries in queue.</div>
          ) : (
            (geoQueue || []).map((q: any) => (
              <div key={q.id} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
                <div style={{ flex: 3, color: "#f0ead6" }}>{q.query}</div>
                <div style={{ flex: 1, color: "#c9a84c" }}>{q.priority}</div>
                <div style={{ flex: 1, color: q.brand_cited ? "#4ade80" : "rgba(240,234,214,0.3)" }}>{q.brand_cited ? "Yes" : "No"}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
