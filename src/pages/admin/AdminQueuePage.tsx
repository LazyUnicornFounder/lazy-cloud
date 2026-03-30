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
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Queue</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Content queued for publishing.</p>

      <div className="flex gap-1 mb-6 p-1 rounded-lg w-fit" style={{ background: "var(--admin-bg-elevated)" }}>
        {(["seo", "geo"] as QueueTab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-md text-xs font-medium transition-colors"
            style={{ background: tab === t ? "var(--admin-bg-hover)" : "transparent", color: tab === t ? "var(--admin-text)" : "var(--admin-text-secondary)" }}>
            {t === "seo" ? `SEO (${seoQueue?.length || 0})` : `GEO (${geoQueue?.length || 0})`}
          </button>
        ))}
      </div>

      {tab === "seo" && (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
          <div className="grid grid-cols-[1fr_100px_100px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
            <div>Keyword</div><div>Position</div><div>Product</div>
          </div>
          {(seoQueue || []).length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No SEO keywords in queue.</div>
          ) : (seoQueue || []).map((k: any) => (
            <div key={k.id} className="grid grid-cols-[1fr_100px_100px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
              <div style={{ color: "var(--admin-text)" }}>{k.keyword}</div>
              <div style={{ color: "var(--admin-text-secondary)" }}>{k.current_position || "—"}</div>
              <div style={{ color: "var(--admin-text-tertiary)" }}>{k.product || "general"}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "geo" && (
        <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
          <div className="grid grid-cols-[1fr_100px_80px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
            <div>Query</div><div>Priority</div><div>Cited</div>
          </div>
          {(geoQueue || []).length === 0 ? (
            <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No GEO queries in queue.</div>
          ) : (geoQueue || []).map((q: any) => (
            <div key={q.id} className="grid grid-cols-[1fr_100px_80px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
              <div style={{ color: "var(--admin-text)" }}>{q.query}</div>
              <div style={{ color: "var(--admin-accent)" }}>{q.priority}</div>
              <div style={{ color: q.brand_cited ? "var(--admin-success)" : "var(--admin-text-tertiary)" }}>{q.brand_cited ? "Yes" : "No"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
