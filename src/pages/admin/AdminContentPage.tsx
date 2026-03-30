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
      try {
        const { data } = await (supabase as any).from("blog_posts").select("id, title, slug, status, created_at").order("created_at", { ascending: false }).limit(100);
        if (data) rows.push(...data.map((r: any) => ({ id: r.id, title: r.title, type: "Blog" as ContentType, published_at: r.created_at, slug: r.slug, status: r.status })));
      } catch {}
      try {
        const { data } = await (supabase as any).from("seo_posts").select("id, title, slug, status, published_at").order("published_at", { ascending: false }).limit(100);
        if (data) rows.push(...data.map((r: any) => ({ id: r.id, title: r.title, type: "SEO" as ContentType, published_at: r.published_at, slug: r.slug, status: r.status })));
      } catch {}
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

  const typeBadge: Record<string, { bg: string; text: string }> = {
    Blog: { bg: "var(--admin-accent-muted)", text: "var(--admin-accent)" },
    SEO: { bg: "rgba(139,92,246,0.1)", text: "#8b5cf6" },
    GEO: { bg: "rgba(34,197,94,0.1)", text: "var(--admin-success)" },
  };

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  const thisWeek = (content || []).filter((r) => new Date(r.published_at) >= weekAgo).length;
  const thisMonth = (content || []).filter((r) => new Date(r.published_at) >= monthAgo).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "var(--admin-text)" }}>Content</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-tertiary)" }}>Unified content feed across all engines.</p>

      <div className="flex gap-3 mb-6">
        {[
          { label: "This week", value: thisWeek },
          { label: "This month", value: thisMonth },
          { label: "Total", value: (content || []).length },
        ].map((s, i) => (
          <div key={i} className="px-4 py-3 rounded-lg" style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--admin-text-tertiary)" }}>{s.label}</div>
            <div className="text-xl font-semibold tabular-nums" style={{ color: "var(--admin-text)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(["All", "Blog", "SEO", "GEO"] as ContentType[]).map((t) => (
          <button key={t} onClick={() => setFilter(t)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
            style={{ background: filter === t ? "var(--admin-bg-hover)" : "transparent", color: filter === t ? "var(--admin-text)" : "var(--admin-text-secondary)" }}>
            {t}
          </button>
        ))}
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..."
          className="ml-auto px-3 py-1.5 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/40"
          style={{ background: "var(--admin-bg-elevated)", border: "1px solid var(--admin-border)", color: "var(--admin-text)", width: 200 }} />
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--admin-border)" }}>
        <div className="grid grid-cols-[80px_1fr_100px_120px] py-2.5 px-4 text-[11px] font-medium uppercase tracking-wider" style={{ borderBottom: "1px solid var(--admin-border-strong)", color: "var(--admin-text-tertiary)" }}>
          <div>Type</div><div>Title</div><div>Status</div><div>Published</div>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--admin-text-tertiary)" }}>No content found.</div>
        ) : (
          filtered.slice(0, 100).map((r) => {
            const badge = typeBadge[r.type] || typeBadge.Blog;
            return (
              <div key={r.id} className="grid grid-cols-[80px_1fr_100px_120px] items-center py-2.5 px-4 text-sm" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <div><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: badge.bg, color: badge.text }}>{r.type}</span></div>
                <div className="truncate pr-4" style={{ color: "var(--admin-text)" }}>{r.title}</div>
                <div><span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: r.status === "published" ? "var(--admin-success-muted)" : "var(--admin-bg-hover)", color: r.status === "published" ? "var(--admin-success)" : "var(--admin-text-tertiary)" }}>{r.status}</span></div>
                <div style={{ color: "var(--admin-text-tertiary)" }}>{format(new Date(r.published_at), "MMM d, yyyy")}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
