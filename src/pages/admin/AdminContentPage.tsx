import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type ContentType = "All" | "Blog" | "SEO" | "GEO";

interface ContentRow {
  id: string;
  title: string;
  type: ContentType;
  published_at: string;
  slug: string;
  status: string;
}

export default function AdminContentPage() {
  const [filter, setFilter] = useState<ContentType>("All");
  const [search, setSearch] = useState("");

  const { data: content, isLoading } = useQuery({
    queryKey: ["admin-content-feed"],
    queryFn: async () => {
      const rows: ContentRow[] = [];

      // Blog posts
      try {
        const { data } = await (supabase as any).from("blog_posts").select("id, title, slug, status, created_at").order("created_at", { ascending: false }).limit(100);
        if (data) rows.push(...data.map((r: any) => ({ id: r.id, title: r.title, type: "Blog" as ContentType, published_at: r.created_at, slug: r.slug, status: r.status })));
      } catch {}

      // SEO posts
      try {
        const { data } = await (supabase as any).from("seo_posts").select("id, title, slug, status, published_at").order("published_at", { ascending: false }).limit(100);
        if (data) rows.push(...data.map((r: any) => ({ id: r.id, title: r.title, type: "SEO" as ContentType, published_at: r.published_at, slug: r.slug, status: r.status })));
      } catch {}

      // GEO posts
      try {
        const { data } = await (supabase as any).from("geo_posts").select("id, title, slug, status, published_at").order("published_at", { ascending: false }).limit(100);
        if (data) rows.push(...data.map((r: any) => ({ id: r.id, title: r.title, type: "GEO" as ContentType, published_at: r.published_at, slug: r.slug, status: r.status })));
      } catch {}

      rows.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
      return rows;
    },
  });

  const filtered = (content || []).filter((r) => {
    if (filter !== "All" && r.type !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const typeBadgeColor: Record<string, string> = { Blog: "#c9a84c", SEO: "#60a5fa", GEO: "#2dd4bf" };

  // Stats
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  const thisWeek = (content || []).filter((r) => new Date(r.published_at) >= weekAgo).length;
  const thisMonth = (content || []).filter((r) => new Date(r.published_at) >= monthAgo).length;

  return (
    <div>
      <h1 className="text-[28px] font-bold mb-2" style={{ color: "#f0ead6" }}>Content</h1>
      <p className="mb-6" style={{ fontSize: 13, color: "rgba(240,234,214,0.4)" }}>Unified content feed across all engines.</p>

      {/* Stats */}
      <div className="flex gap-4 mb-6">
        <div className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>This Week</div>
          <div className="text-[20px] font-bold" style={{ color: "#c9a84c" }}>{thisWeek}</div>
        </div>
        <div className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>This Month</div>
          <div className="text-[20px] font-bold" style={{ color: "#f0ead6" }}>{thisMonth}</div>
        </div>
        <div className="px-4 py-3 rounded-lg" style={{ border: "1px solid rgba(240,234,214,0.08)", background: "rgba(240,234,214,0.02)" }}>
          <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(240,234,214,0.4)" }}>Total</div>
          <div className="text-[20px] font-bold" style={{ color: "#f0ead6" }}>{(content || []).length}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        {(["All", "Blog", "SEO", "GEO"] as ContentType[]).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-[0.06em] transition-colors"
            style={{ background: filter === t ? "rgba(201,168,76,0.15)" : "rgba(240,234,214,0.04)", color: filter === t ? "#c9a84c" : "rgba(240,234,214,0.5)" }}>
            {t}
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title..."
          className="ml-auto px-3 py-1.5 rounded text-[13px] font-display"
          style={{ background: "rgba(240,234,214,0.05)", border: "1px solid rgba(240,234,214,0.1)", color: "#f0ead6", width: 220 }} />
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid rgba(240,234,214,0.08)" }}>
        <div className="flex py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.1)", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(240,234,214,0.3)" }}>
          <div style={{ flex: 0.6 }}>Type</div>
          <div style={{ flex: 3 }}>Title</div>
          <div style={{ flex: 0.8 }}>Status</div>
          <div style={{ flex: 1 }}>Published</div>
        </div>

        {isLoading ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.4)", fontSize: 13 }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center" style={{ color: "rgba(240,234,214,0.35)", fontSize: 13 }}>No content found.</div>
        ) : (
          filtered.slice(0, 100).map((r) => (
            <div key={r.id} className="flex items-center py-2.5 px-4" style={{ borderBottom: "1px solid rgba(240,234,214,0.04)", fontSize: 13 }}>
              <div style={{ flex: 0.6 }}>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: `${typeBadgeColor[r.type] || "#c9a84c"}20`, color: typeBadgeColor[r.type] || "#c9a84c" }}>{r.type}</span>
              </div>
              <div style={{ flex: 3, color: "#f0ead6", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title.slice(0, 80)}</div>
              <div style={{ flex: 0.8 }}>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{
                  background: r.status === "published" ? "rgba(74,222,128,0.1)" : "rgba(240,234,214,0.05)",
                  color: r.status === "published" ? "#4ade80" : "rgba(240,234,214,0.4)",
                }}>{r.status}</span>
              </div>
              <div style={{ flex: 1, color: "rgba(240,234,214,0.4)" }}>{format(new Date(r.published_at), "MMM d, yyyy")}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
